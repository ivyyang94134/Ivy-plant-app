import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBSBSQ73wQZWbr8Gk_eMojBW9DkNrychIA";

async function testKey() {
    console.log("Testing API Key:", API_KEY.substring(0, 10) + "...");
    const genAI = new GoogleGenerativeAI(API_KEY);

    const models = ["gemini-1.5-flash", "gemini-pro"];

    for (const modelName of models) {
        console.log(`\nTrying model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const prompt = "Hello, tell me a joke about plants.";
            const result = await model.generateContent(prompt);
            const response = await result.response;
            console.log("SUCCESS! Response:", response.text());
            return;
        } catch (error) {
            console.error(`FAILED (${modelName}):`, error.message);
        }
    }
}

testKey();
