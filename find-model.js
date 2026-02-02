import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBSBSQ73wQZWbr8Gk_eMojBW9DkNrychIA";

async function findWorkingModel() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (!data.models) {
            console.log("No models found in response");
            return;
        }

        const generateModels = data.models.filter(m =>
            m.supportedGenerationMethods.includes("generateContent") &&
            !m.name.includes("preview") && // Prefer stable
            !m.name.includes("embedding")
        );

        console.log("Supported Models:");
        generateModels.forEach(m => console.log(m.name));

        // Also print preview ones if stable list is empty
        if (generateModels.length === 0) {
            console.log("\nOnly preview/experimental models found:");
            data.models.filter(m => m.supportedGenerationMethods.includes("generateContent")).forEach(m => console.log(m.name));
        }

    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

findWorkingModel();
