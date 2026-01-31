import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";

export default function HotelModel(props) {
  const { scene } = useGLTF("/models/hotel2.glb");

  useEffect(() => {
    if (scene) {
      console.log("Hotel2 model loaded successfully:", scene);
      // Traverse the scene to ensure all materials are visible
      scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          // Fix for NaN bounding sphere error
          // Fix for NaN bounding sphere error
          if (child.geometry) {
            try {
              // Validate position attribute
              const positions = child.geometry.attributes.position;
              if (positions && positions.array && !isNaN(positions.array[0])) {
                child.geometry.computeBoundingSphere();
                child.geometry.computeBoundingBox();
              }
            } catch (err) {
              console.warn("Skipping corrupt geometry:", err);
            }
          }
        }
      });
    }
  }, [scene]);

  return <primitive object={scene} {...props} />;
}

// Preload the model
useGLTF.preload("/models/hotel2.glb");
