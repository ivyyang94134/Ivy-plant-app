import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = "AIzaSyBSBSQ73wQZWbr8Gk_eMojBW9DkNrychIA";

async function listAvailableModels() {
    // We can't list models directly with the high-level SDK easily without a ModelManager, 
    // but let's try a direct fetch to the API endpoint to see what the server says about this key.

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Status:", response.status);
        console.log("Body:", JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Fetch Error:", error);
    }
}

listAvailableModels();
