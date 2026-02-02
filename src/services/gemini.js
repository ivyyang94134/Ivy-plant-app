import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
// User needs to provide VITE_GEMINI_API_KEY in .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzePlantWithGemini = async (imageBase64) => {
    if (!API_KEY) {
        throw new Error("Missing Gemini API Key in .env");
    }

    // Trim key to prevent copy-paste whitespace issues
    const cleanKey = API_KEY.trim();

    // Debug log to confirm key update (partial)
    console.log("Current API Key loaded:", cleanKey.substring(0, 10) + "...");

    const genAI = new GoogleGenerativeAI(cleanKey);
    // Clean base64 string (remove data:image/jpeg;base64, prefix if present)
    const base64Data = imageBase64.split(',')[1];

    // Define prompt outside loop
    const prompt = `
  你是一位專業的植物學家與風水專家。請分析這張植物圖片，並回傳以下 JSON 格式的資訊 (繁體中文)：
  
  {
    "id": "generated_id",
    "name": "植物名稱 (學名)",
    "confidence": 95,
    "description": "2-3句話的植物介紹。",
    "safety": "請說明是否有毒 (例如：⚠️ 有毒... 或 ✅ 安全... )",
    "fengShui": "請說明風水寓意 (例如：🌟 風水分析... )，若不確定則回傳 null",
    "health": {
      "status": "healthy" 或 "sick",
      "title": "健康狀態標題",
      "summary": "健康狀況簡述",
      "tips": "1-2 點護理建議"
    }
  }

  請確保回傳的是純 JSON 字串，不要有 markdown code block 標記。
  `;

    // List of models to try in order
    // Prioritize fast, high-limit models. Removed legacy/strict-limit models.
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite", // Try lite version too
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b",
        "gemini-1.5-flash-latest"
    ];

    let significantError = null; // Store the most meaningful error (e.g. 429, 503) instead of just the last 404
    let lastError = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Attempting to use model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: "image/jpeg",
                    },
                },
            ]);

            const response = await result.response;
            const text = response.text();

            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);

        } catch (error) {
            console.warn(`Model ${modelName} failed:`, error.message);
            lastError = error;

            // If we hit a Rate Limit (429) or Overloaded (503), keep this error as it's the "real" reason
            // why we might fail, rather than a subsequent 404.
            if (error.message.includes("429") || error.message.includes("503")) {
                significantError = error;
            }

            // If the key is invalid, stop immediately
            if (error.message.includes("API key not valid")) {
                throw error;
            }
        }
    }

    // If we get here, all models failed
    const finalError = significantError || lastError;
    console.error("All Gemini models failed.", finalError);

    const keyDebug = cleanKey ? `(Key前10碼: ${cleanKey.substring(0, 10)}...)` : "(Key為空)";

    // Customize error message based on the type of error
    let userMessage = "無法連線至 AI 伺服器";

    if (finalError?.message?.includes("429")) {
        userMessage = "使用流量過大 (429)，請稍等幾秒後再試。";
    } else if (finalError?.message?.includes("503")) {
        userMessage = "Google AI 伺服器忙碌中 (503)，請重試。";
    } else if (finalError?.message?.includes("404")) {
        userMessage = "找不到支援的模型 (404)，請檢查 Key 權限。";
    }

    throw new Error(`${userMessage} ${keyDebug}`);
};
