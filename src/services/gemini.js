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
    // Updated based on available models for this key (2.0/2.5 versions)
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-001",
        "gemini-2.5-flash",
        "gemini-1.5-flash",
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro",
        "gemini-pro-vision"
    ];

    let lastError = null;
    let lastTriedModel = "";

    for (const modelName of modelsToTry) {
        lastTriedModel = modelName;
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

            if (error.message.includes("API key not valid")) {
                throw error;
            }
        }
    }

    // If we get here, all models failed
    console.error("All Gemini models failed.", lastError);

    const keyDebug = cleanKey ? `(Key前10碼: ${cleanKey.substring(0, 10)}...)` : "(Key為空)";

    if (lastError?.message?.includes("404") || lastError?.message?.includes("not found")) {
        throw new Error(`無法找到模型 (404)。${keyDebug} 請確認您的 Key 是否支援 '${lastTriedModel}'。`);
    }

    throw new Error(`識別失敗: ${lastError?.message || "無法連線至 AI 伺服器"} ${keyDebug}`);
};
