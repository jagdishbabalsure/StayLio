import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float, Ring, Sparkles } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const ParticleGlobe = (props) => {
    const ref = useRef();
    const [sphere] = useState(() => random.inSphere(new Float32Array(5000), { radius: 1.5 }));

    useFrame((state, delta) => {
        ref.current.rotation.x -= delta / 10;
        ref.current.rotation.y -= delta / 15;
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#a855f7"
                    size={0.02}
                    sizeAttenuation={true}
                    depthWrite={false}
                />
            </Points>
        </group>
    );
};

const RotatingRings = () => {
    const ref = useRef();
    useFrame((state) => {
        ref.current.rotation.z = state.clock.getElapsedTime() * 0.2;
        ref.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    });

    return (
        <group ref={ref}>
            <Ring args={[2.2, 2.22, 64]} renderOrder={-1}>
                <meshBasicMaterial color="#ffffff" opacity={0.2} transparent side={2} />
            </Ring>
            <Ring args={[1.8, 1.81, 64]} rotation={[1, 0, 0]} renderOrder={-1}>
                <meshBasicMaterial color="#8400ff" opacity={0.3} transparent side={2} />
            </Ring>
        </group>
    );
}


const IntroLoader = ({ onComplete }) => {
    const [exit, setExit] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setExit(true);
            setTimeout(onComplete, 1200);
        }, 3500);
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <AnimatePresence>
            {!exit && (
                <motion.div
                    className="fixed inset-0 z-[9999] bg-[#060010] overflow-hidden"
                    initial={{ opacity: 1 }}
                    exit={{
                        opacity: 0,
                        scale: 1.5,
                        filter: 'blur(10px)',
                        transition: { duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }
                    }}
                >
                    {/* Cinematic Vignette */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#060010_100%)] z-20 pointer-events-none" />

                    {/* 3D Scene */}
                    <div className="absolute inset-0 z-10">
                        <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                            <fog attach="fog" args={['#060010', 5, 15]} />
                            <ambientLight intensity={0.5} />

                            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                                <ParticleGlobe />
                                <RotatingRings />
                            </Float>

                            <Sparkles count={100} scale={6} size={2} speed={0.5} opacity={0.4} color="#d8b4fe" />
                        </Canvas>
                    </div>

                    {/* Content Layer */}
                    <div className="absolute inset-0 z-30 flex flex-col items-center justify-center">
                        <div className="text-center">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="mb-6 relative"
                            >
                                <h1 className="text-6xl md:text-8xl font-bold text-white font-heading tracking-tight mix-blend-overlay">
                                    STAYLIO
                                </h1>
                                <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 font-heading tracking-tight absolute top-0 left-0 animate-pulse opacity-50">
                                    STAYLIO
                                </h1>
                            </motion.div>

                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: "200px" }}
                                transition={{ duration: 1.5, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="h-[1px] bg-gradient-to-r from-transparent via-white to-transparent mx-auto mb-6"
                            />

                            <motion.div className="overflow-hidden h-8 flex justify-center">
                                <motion.p
                                    initial={{ y: 40 }}
                                    animate={{ y: 0 }}
                                    transition={{ duration: 1, delay: 1, ease: "circOut" }}
                                    className="text-sm md:text-lg text-purple-200/90 font-light tracking-[0.3em] uppercase"
                                >
                                    The World Awaits
                                </motion.p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default IntroLoader;
