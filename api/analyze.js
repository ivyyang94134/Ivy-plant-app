import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
    runtime: 'edge', // Use Edge Runtime for faster cold boots
};

export default async function handler(req) {
    // CORS headers for allowing requests from your Vercel app
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json',
    };

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method not allowed' }), {
            status: 405,
            headers,
        });
    }

    try {
        const { imageBase64 } = await req.json();

        if (!imageBase64) {
            throw new Error('No image data provided');
        }

        const API_KEY = process.env.VITE_GEMINI_API_KEY;
        if (!API_KEY) {
            console.error("Server Key Missing");
            throw new Error('Server configuration error: API Key missing');
        }

        const genAI = new GoogleGenerativeAI(API_KEY);

        // Helper to run a model
        const runModel = async (modelName) => {
            console.log(`[Proxy] Trying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

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
            請確保回傳的是純 JSON 字串，不要有 markdown code block 標記。`;

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: imageBase64,
                        mimeType: "image/jpeg",
                    },
                },
            ]);

            const response = await result.response;
            const text = response.text();
            const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(cleanText);
        };

        // Try models in sequence
        const models = ["gemini-2.0-flash", "gemini-2.0-flash-lite", "gemini-1.5-flash"];
        let lastError = null;

        for (const model of models) {
            try {
                const data = await runModel(model);
                return new Response(JSON.stringify(data), { headers });
            } catch (err) {
                console.warn(`[Proxy] Model ${model} failed:`, err.message);
                lastError = err;
                // If 429/503 we might want to continue, but if Key invalid, stop?
                // For simplicity, just try next.
            }
        }

        throw lastError || new Error("All models failed");

    } catch (error) {
        console.error("[Proxy] Error:", error);
        return new Response(JSON.stringify({
            error: error.message,
            details: error.toString()
        }), {
            status: 500,
            headers,
        });
    }
}
