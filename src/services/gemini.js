// This service now calls our own Vercel Serverless Function (Backend Proxy)
// This avoids exposing the API Key and solves CORS/Referer issues.

export const analyzePlantWithGemini = async (imageBase64) => {
    // Clean base64 string
    const cleanBase64 = imageBase64.split(',')[1];

    console.log("[Client] Sending image to Backend Proxy (/api/analyze)...");

    try {
        // Call our own API endpoint
        // When running locally, this goes to http://localhost:5173/api/analyze (if configured)
        // On Vercel, this goes to https://your-app.vercel.app/api/analyze
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageBase64: cleanBase64
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorDetails = errorText;
            try {
                // Try to parse JSON error if possible
                const errorJson = JSON.parse(errorText);
                errorDetails = errorJson.error || errorJson.details || errorText;
            } catch (e) { /* ignore json parse error */ }

            throw new Error(`Server Error (${response.status}): ${errorDetails}`);
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error("[Client] Analysis failed:", error);
        throw new Error(error.message || "無法連線至後端伺服器");
    }
};
