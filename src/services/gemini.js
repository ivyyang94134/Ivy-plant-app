// Initialize Gemini
// User needs to provide VITE_GEMINI_API_KEY in .env file
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

export const analyzePlantWithGemini = async (imageBase64) => {
    if (!API_KEY) {
        throw new Error("Missing Gemini API Key in .env");
    }

    const cleanKey = API_KEY.trim();
    // Clean base64 string (remove data:image/jpeg;base64, prefix if present)
    const base64Data = imageBase64.split(',')[1];

    const promptText = `
你是一位專業的植物學家與風水專家。請分析這張植物圖片，並回傳以下 JSON 格式的資訊(繁體中文)：

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

    // Prioritize models: 2.0 -> 1.5
    const modelsToTry = [
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite",
        "gemini-1.5-flash",
        "gemini-1.5-flash-8b"
    ];

    let lastError = null;
    let successfulData = null;

    for (const modelName of modelsToTry) {
        try {
            console.log(`Using REST API with model: ${modelName} `);

            const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${cleanKey}`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: promptText },
                            { inline_data: { mime_type: "image/jpeg", data: base64Data } }
                        ]
                    }],
                    generationConfig: {
                        response_mime_type: "application/json"
                    }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                // Throw specific error to catch block
                throw new Error(`${response.status} ${response.statusText} - ${errText}`);
            }

            const data = await response.json();

            // Parse response
            if (data.candidates && data.candidates[0].content && data.candidates[0].content.parts) {
                const text = data.candidates[0].content.parts[0].text;
                const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                successfulData = JSON.parse(cleanText);
                break; // Success! Exit loop.
            } else {
                throw new Error("Empty response from API");
            }

        } catch (error) {
            console.warn(`Model ${modelName} (REST) failed:`, error.message);
            lastError = error;

            // If it's a 429 (Too Many Requests), we might want to store it as a specific error
            // Check for API key invalid
            if (error.message.includes("API_KEY_INVALID") || error.message.includes("400")) {
                // 400 often means key issue or bad request structure
            }
        }
    }

    if (successfulData) {
        return successfulData;
    }

    // If failed
    console.error("All Gemini REST attempts failed.", lastError);
    const keyDebug = cleanKey ? `(Key前10碼: ${cleanKey.substring(0, 10)}...)` : "(Key為空)";

    // Format error message
    let msg = "無法連線至 AI 伺服器";
    if (lastError?.message?.includes("404")) msg = "找不到模型 (404) - 請確認 Key 支援該區域";
    if (lastError?.message?.includes("429")) msg = "伺服器忙碌中 (429) - 請稍後再試";

    throw new Error(`${msg} \n詳細: ${lastError?.message} \n${keyDebug}`);
};
