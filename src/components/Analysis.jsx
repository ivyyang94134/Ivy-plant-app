import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { plantData } from '../data/plants';
import { analyzePlantWithGemini } from '../services/gemini';

const Analysis = ({ image, onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [statusText, setStatusText] = useState("正在分析植物特徵...");

    useEffect(() => {
        let isMounted = true;

        // Progress animation
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 90) return 90; // Hold at 90 until real result comes
                return prev + 1;
            });
        }, 50);

        const performAnalysis = async () => {
            try {
                // Check if API key exists
                if (import.meta.env.VITE_GEMINI_API_KEY) {
                    setStatusText("Gemini AI 雲端運算中...");
                    const result = await analyzePlantWithGemini(image);
                    if (isMounted) {
                        setProgress(100);
                        setTimeout(() => onComplete(result), 500);
                    }
                } else {
                    // Fallback to mock
                    console.warn("No Gemini API Key found, using mock data.");
                    await new Promise(r => setTimeout(r, 2500)); // Simulate delay
                    const result = plantData[Math.floor(Math.random() * plantData.length)];
                    if (isMounted) {
                        setProgress(100);
                        onComplete(result);
                    }
                }
            } catch (err) {
                console.error("Analysis Failed", err);
                // Fallback on error
                const result = plantData[Math.floor(Math.random() * plantData.length)];
                if (isMounted) {
                    // Show actual error for debugging
                    setStatusText(`連線失敗: ${err.message || "未知錯誤"}`);

                    // Delay longer so user can read the error before switching
                    setTimeout(() => {
                        onComplete(result);
                    }, 3000);
                }
            }
        };

        performAnalysis();

        return () => {
            isMounted = false;
            clearInterval(interval);
        };
    }, [image, onComplete]);

    return (
        <div style={{ position: 'relative', height: '100%', backgroundColor: 'black', overflow: 'hidden' }}>
            <img src={image} alt="Analyzing" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, filter: 'grayscale(50%)' }} />

            {/* Scanning beam */}
            <motion.div
                initial={{ top: '0%' }}
                animate={{ top: '100%' }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: '#10b981',
                    boxShadow: '0 0 40px 10px rgba(16, 185, 129, 0.5)',
                    zIndex: 10
                }}
            />

            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '40px 24px',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9), transparent)',
                textAlign: 'center'
            }}>
                {statusText.includes("失敗") ? (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.9)',
                        padding: '20px',
                        borderRadius: '16px',
                        marginBottom: '20px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <h2 style={{ margin: 0, fontSize: '1.1rem', lineHeight: '1.5', color: 'white', fontWeight: 'bold' }}>
                            {statusText}
                        </h2>
                    </div>
                ) : (
                    <h2 style={{ marginBottom: '16px', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontSize: '1.5rem' }}>{statusText}</h2>
                )}

                <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.2)', borderRadius: '3px', overflow: 'hidden' }}>
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        style={{ height: '100%', background: '#10b981', borderRadius: '3px' }}
                    />
                </div>
                <p style={{ marginTop: '12px', fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>AI 識別運算中 {progress}%</p>
            </div>
        </div>
    );
};

export default Analysis;
