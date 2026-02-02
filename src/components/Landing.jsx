import { Leaf, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing = ({ onStart }) => {
    return (
        <div className="flex-center" style={{ flexDirection: 'column', height: '100%', padding: '32px', textAlign: 'center' }}>
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                style={{ marginBottom: '40px' }}
            >
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.4) 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 30px rgba(16, 185, 129, 0.2)'
                }}>
                    <Leaf size={64} color="#10b981" />
                </div>
            </motion.div>

            <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ fontSize: '2.5rem', marginBottom: '8px', fontWeight: 800 }}
            >
                Plant<span className="text-gradient">Doctor</span>
            </motion.h1>

            <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ fontSize: '1.5rem', marginBottom: '16px', fontWeight: 400 }}
            >
                植醫
            </motion.h2>

            <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '60px', lineHeight: 1.6 }}
            >
                AI 智能植物健康診斷<br />
                拍照即可識別病蟲害
            </motion.p>

            <motion.button
                className="btn-primary"
                onClick={onStart}
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                開始診斷 <ArrowRight size={20} />
            </motion.button>
        </div>
    );
};

export default Landing;
