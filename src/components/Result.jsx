import { useState } from 'react'; // Add useState
import { CheckCircle, AlertTriangle, RefreshCw, Droplets, Sun, Sparkles, ShieldCheck, Heart, Info, XCircle, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { plantData } from '../data/plants'; // Import data

const Result = ({ image, result: initialResult, onRestart }) => {
    const [result, setResult] = useState(initialResult);
    const [showCorrection, setShowCorrection] = useState(false);

    const isHealthy = result.health.status === 'healthy';
    const isToxic = result.safety && result.safety.includes('有毒');

    const handleCorrect = (plant) => {
        setResult(plant);
        setShowCorrection(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div style={{ height: '100%', overflowY: 'auto', padding: '24px', paddingBottom: '120px', scrollBehavior: 'smooth' }}>
            <AnimatePresence>
                {showCorrection && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                        <div style={{ background: '#1e293b', padding: '24px', borderRadius: '16px', width: '100%', maxHeight: '80vh', overflowY: 'auto' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '16px' }}>請選擇正確的植物：</h3>
                            <div style={{ display: 'grid', gap: '8px' }}>
                                {plantData.map(p => (
                                    <button key={p.id} onClick={() => handleCorrect(p)} style={{ width: '100%', padding: '12px', textAlign: 'left', background: p.id === result.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255,255,255,0.05)', border: 'none', color: 'white', borderRadius: '8px', fontSize: '1rem' }}>
                                        {p.name}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => setShowCorrection(false)} style={{ marginTop: '16px', width: '100%', padding: '12px', background: 'transparent', border: '1px solid #ddd', color: 'white', borderRadius: '8px' }}>取消</button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                key={result.id} // Re-animate on change
            >
                {/* Header Image */}
                <motion.div
                    style={{
                        position: 'relative',
                        height: '280px',
                        borderRadius: '24px',
                        overflow: 'hidden',
                        marginBottom: '24px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5)'
                    }}
                    variants={itemVariants}
                >
                    <img src={image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Plant" />
                    <div style={{
                        position: 'absolute', bottom: '16px', left: '16px',
                        background: isHealthy ? 'rgba(16, 185, 129, 0.95)' : 'rgba(239, 68, 68, 0.95)',
                        backdropFilter: 'blur(8px)',
                        padding: '10px 20px', borderRadius: '20px',
                        color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                    }}>
                        {isHealthy ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                        {isHealthy ? '健康狀況良好' : '需要注意'}
                    </div>
                </motion.div>

                {/* 1. Identity & Intro */}
                <motion.div className="glass-panel" style={{ marginBottom: '20px' }} variants={itemVariants}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                        <div>
                            <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>植物識別</h3>
                            <h2 style={{ fontSize: '1.8rem', marginBottom: '4px', color: 'white', lineHeight: 1.2 }}>{result.name}</h2>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
                                <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }}></div>
                                <span style={{ fontSize: '0.85rem', color: '#10b981' }}>AI 信心指數 {result.confidence}%</span>
                            </div>
                        </div>
                        {isToxic && (
                            <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '8px', borderRadius: '50%', color: '#ef4444' }}>
                                <AlertTriangle size={24} />
                            </div>
                        )}
                    </div>

                    <p style={{ lineHeight: '1.7', fontSize: '1rem', color: 'var(--text-secondary)' }}>
                        {result.description}
                    </p>

                    <button
                        onClick={() => setShowCorrection(true)}
                        style={{
                            marginTop: '12px', background: 'transparent', border: 'none',
                            color: '#38bdf8', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '4px',
                            padding: 0, cursor: 'pointer', textDecoration: 'underline'
                        }}
                    >
                        <HelpCircle size={14} /> 識別錯誤? 選擇正確植物
                    </button>
                </motion.div>

                {/* 2. Health Diagnosis */}
                <motion.div className="glass-panel" style={{ marginBottom: '20px', borderLeft: isHealthy ? '4px solid #10b981' : '4px solid #ef4444' }} variants={itemVariants}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <Heart size={20} color={isHealthy ? '#10b981' : '#ef4444'} />
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{result.health.title}</h3>
                    </div>
                    <p style={{ lineHeight: '1.6', fontSize: '1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '16px' }}>
                        {result.health.summary}
                    </p>

                    {/* Care Tips */}
                    <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '16px' }}>
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Info size={16} /> 護理建議
                        </h4>
                        <p style={{ whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                            {result.health.tips}
                        </p>
                    </div>
                </motion.div>

                {/* 3. Safety & Feng Shui Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px', marginBottom: '20px' }}>
                    {/* Safety */}
                    <motion.div className="glass-panel" variants={itemVariants}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            {result.safety.includes('有毒') ? <XCircle size={20} color="#ef4444" /> : <ShieldCheck size={20} color="#10b981" />}
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>安全性</h3>
                        </div>
                        <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'rgba(255,255,255,0.8)' }}>
                            {result.safety}
                        </p>
                    </motion.div>

                    {/* Feng Shui */}
                    <motion.div className="glass-panel" variants={itemVariants} style={{ background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(30, 41, 59, 0.6) 100%)', borderColor: 'rgba(251, 191, 36, 0.3)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                            <Sparkles size={20} color="#fbbf24" />
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#fbbf24' }}>風水寓意</h3>
                        </div>
                        {result.fengShui ? (
                            <p style={{ lineHeight: '1.6', fontSize: '0.95rem', color: 'rgba(255,255,255,0.9)' }}>
                                {result.fengShui}
                            </p>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '10px 0' }}>
                                <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginBottom: '12px' }}>
                                    此植物暫無記錄風水資訊
                                </p>
                                <button
                                    onClick={(e) => {
                                        e.currentTarget.innerText = "查詢中...";
                                        setTimeout(() => {
                                            e.target.parentNode.innerHTML = '<p style="line-height: 1.6; font-size: 0.95rem; color: rgba(255,255,255,0.9); animation: fadeIn 0.5s;">🌟 風水分析：雖然傳統風水較少提及此植物，但一般認為開花結果的植物(如草莓)象徵「成果豐碩」與「甜蜜戀情」，能增進人際關係與桃花運。</p>';
                                        }, 1000);
                                    }}
                                    className="btn-secondary"
                                    style={{ width: '100%', justifyContent: 'center', fontSize: '0.9rem', padding: '8px' }}
                                >
                                    🤔 是否要查詢風水建議?
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* Bottom Action */}
                <motion.div style={{ marginTop: '32px', textAlign: 'center' }} variants={itemVariants}>
                    <motion.button
                        className="btn-primary"
                        onClick={onRestart}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{ width: '100%', marginBottom: '24px' }}
                    >
                        <RefreshCw size={20} /> 診斷其他植物
                    </motion.button>

                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', opacity: 0.6 }}>
                        APP的作者: 愛V (Ai V)
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Result;
