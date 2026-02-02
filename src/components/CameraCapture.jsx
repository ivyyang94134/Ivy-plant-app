import { useRef, useState, useEffect } from 'react';
import { RefreshCw, Image as ImageIcon, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const CameraCapture = ({ onCapture, onBack }) => {
    const videoRef = useRef(null);
    const [stream, setStream] = useState(null);
    const [error, setError] = useState(null);
    const [facingMode, setFacingMode] = useState('environment');

    const startCamera = async () => {
        setError(null);
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }

        try {
            const newStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: facingMode,
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                },
                audio: false
            });
            setStream(newStream);
            if (videoRef.current) {
                videoRef.current.srcObject = newStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            // Fallback for desktop or permission denied
            setError(true);
        }
    };

    useEffect(() => {
        startCamera();
        return () => {
            // Cleanup happens in startCamera or when component unmounts if we had a ref to stream
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [facingMode]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (stream) stream.getTracks().forEach(t => t.stop());
        }
    }, [stream]);


    const capture = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(videoRef.current, 0, 0);
            const dataUrl = canvas.toDataURL('image/jpeg');
            onCapture(dataUrl);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => onCapture(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const switchCamera = () => {
        setFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
    };

    return (
        <div style={{ position: 'relative', height: '100%', backgroundColor: '#000', display: 'flex', flexDirection: 'column' }}>

            {/* Header controls */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20,
                padding: '20px', display: 'flex', justifyContent: 'space-between'
            }}>
                <button
                    onClick={onBack}
                    style={{
                        background: 'rgba(0,0,0,0.3)', border: 'none', borderRadius: '50%',
                        width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', backdropFilter: 'blur(4px)'
                    }}
                >
                    <ArrowLeft size={24} />
                </button>
            </div>

            {error ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', gap: '20px' }}>
                    <p style={{ color: 'white', opacity: 0.8 }}>無法啟動相機 (可能未授權或無此相機)</p>
                    <label className="btn-primary">
                        <ImageIcon size={20} />
                        從相簿上傳
                        <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
                    </label>
                </div>
            ) : (
                <>
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                        <div style={{
                            position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)', color: 'white', zIndex: 10,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            pointerEvents: 'none'
                        }}>
                            PlantDoctor - 植物健康專家 <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>v1.2</span>
                        </div>
                        {/* Guide Overlay */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
                            width: '70vw', height: '70vw', maxWidth: '300px', maxHeight: '300px',
                            border: '1px solid rgba(255,255,255,0.3)', borderRadius: '24px',
                            boxShadow: '0 0 0 4000px rgba(0,0,0,0.6)'
                        }}>
                            <div style={{ position: 'absolute', top: -2, left: -2, width: 30, height: 30, borderTop: '4px solid #10b981', borderLeft: '4px solid #10b981', borderTopLeftRadius: 24 }}></div>
                            <div style={{ position: 'absolute', top: -2, right: -2, width: 30, height: 30, borderTop: '4px solid #10b981', borderRight: '4px solid #10b981', borderTopRightRadius: 24 }}></div>
                            <div style={{ position: 'absolute', bottom: -2, left: -2, width: 30, height: 30, borderBottom: '4px solid #10b981', borderLeft: '4px solid #10b981', borderBottomLeftRadius: 24 }}></div>
                            <div style={{ position: 'absolute', bottom: -2, right: -2, width: 30, height: 30, borderBottom: '4px solid #10b981', borderRight: '4px solid #10b981', borderBottomRightRadius: 24 }}></div>

                            <div style={{ position: 'absolute', bottom: '-40px', left: 0, right: 0, textAlign: 'center', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                                將植物對準框內
                            </div>
                        </div>
                    </div>

                    {/* Footer Controls */}
                    <div style={{
                        height: '140px', background: 'black', display: 'flex',
                        alignItems: 'center', justifyContent: 'space-evenly', paddingBottom: '20px'
                    }}>
                        <label className="icon-button">
                            <ImageIcon size={24} />
                            <input type="file" accept="image/*" hidden onChange={handleFileUpload} />
                        </label>

                        <motion.button
                            onClick={capture}
                            whileTap={{ scale: 0.9 }}
                            style={{
                                width: '84px', height: '84px', borderRadius: '50%',
                                border: '4px solid rgba(255,255,255,0.3)',
                                padding: '4px', background: 'transparent'
                            }}
                        >
                            <div style={{ width: '100%', height: '100%', background: 'white', borderRadius: '50%' }}></div>
                        </motion.button>

                        <button className="icon-button" onClick={switchCamera}>
                            <RefreshCw size={24} />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CameraCapture;
