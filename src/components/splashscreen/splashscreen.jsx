import React, { useEffect, useState } from 'react';
import echoLogo from '../../assets/ECHO_LOGO.png';

const SplashScreen = ({ onFinish }) => {
    const [step, setStep] = useState(0);
    useEffect(() => {
        const timer1 = setTimeout(() => setStep(1), 100);
        const timer2 = setTimeout(() => setStep(2), 800);
        const timer3 = setTimeout(() => setStep(3), 2500);
        const timer4 = setTimeout(() => setStep(4), 3000);
        const timer5 = setTimeout(() => {
            onFinish();
        }, 3000);
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(timer4);
        };
    }, [onFinish])
    return (
        <div
            className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center transition-opacity duration-700 select-none ${step === 3 ? 'opacity-0' : 'opacity-100'}`}>
            <SplashScreenStyles />
            <div className={`relative flex flex-row items-center transform transition-all duration-1000 ${step >= 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                {/* Logo with Glow Effect */}
                <div className="relative">
                    <img
                        src={echoLogo}
                        alt="Echo Logo"
                        className="w-32 h-32 md:w-48 md:h-48 object-contain relative z-10 animate-blue-glow" />
                </div>
                <div className={`overflow-hidden transition-all duration-1000 ease-out ${step >= 2 ? 'max-w-[500px] opacity-100 ml-6' : 'max-w-0 opacity-0 ml-0'}`}>
                    <h1 className={`text-4xl md:text-6xl font-bold tracking-[0.2em] text-white animate-blue-glow whitespace-nowrap`}
                        style={{ fontFamily: "'Arial Black', sans-serif" }}>
                        ECHO
                    </h1>
                </div>
            </div>
        </div>
    )
}
export default SplashScreen;
const SplashScreenStyles = () => (
    <style>{`
        @keyframes blueGlow{
            0%,100%{
                filter: drop-shadow(0 0 20px rgba(59, 130, 246, 0.4));
            }
            50%{
                filter: drop-shadow(0 0 60px rgba(59, 130, 246, 0.8));
            }
        }
        .animate-blue-glow{
            animation: blueGlow 2s ease-in-out infinite;
        }
    `}</style>
)