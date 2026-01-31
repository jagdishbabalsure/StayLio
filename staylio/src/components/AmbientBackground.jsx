import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Sparkles, Float, Cloud } from '@react-three/drei';
import * as THREE from 'three';

const ParticleField = () => {
    return (
        <group>
            {/* Layer 1: Deep Background Dust (Subtle, large count) */}
            <Sparkles
                count={800}
                scale={20}
                size={1}
                speed={0.2}
                opacity={0.3}
                color="#4c1d95" // Dark Purple
            />

            {/* Layer 2: Mid-range drifting 'stars' (Brighter, main therme) */}
            <Sparkles
                count={200}
                scale={15}
                size={3}
                speed={0.4}
                opacity={0.6}
                color="#a855f7" // StayLio Purple
            />

            {/* Layer 3: Foreground Floating Glows (Large, bokeh-like) */}
            <Sparkles
                count={50}
                scale={10}
                size={8}
                speed={0.3}
                opacity={0.3}
                color="#d8b4fe" // Light Lavender
                noise={1} // Adds some organic movement
            />

            {/* Layer 4: Occasional Gold/Accent Glints for "Luxury" feel */}
            <Sparkles
                count={30}
                scale={12}
                size={2}
                speed={0.8}
                opacity={0.7}
                color="#facc15" // Subtle Gold
            />
        </group>
    );
};

const AtmosphericScene = () => {
    // Rotating the cloud layer slowly
    const cloudRef = useRef();
    useFrame((state) => {
        if (cloudRef.current) {
            cloudRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
        }
    });

    return (
        <>
            <fog attach="fog" args={['#060010', 5, 25]} />
            <ambientLight intensity={0.4} />

            {/* Deep static background stars */}
            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

            {/* The main particle effect */}
            <ParticleField />

            {/* Subtle Foggy Clouds for depth */}
            <group ref={cloudRef} position={[0, -8, -10]}>
                <Cloud opacity={0.1} speed={0.2} width={20} depth={2} segments={20} color="#1a0b2e" />
            </group>
        </>
    );
};

const AmbientBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-[#060010]">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 60 }}
                gl={{ antialias: true, alpha: true }}
            >
                <AtmosphericScene />
            </Canvas>

            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#060010_100%)] opacity-80" />

            {/* Bottom fade for smooth content transition */}
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#060010] to-transparent" />
        </div>
    );
};

export default AmbientBackground;
