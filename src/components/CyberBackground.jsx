import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const ParticleNetwork = ({ count = 100 }) => {
  const pointsRef = useRef();
  const linesRef = useRef();

  // Initialize random particle positions
  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = [];
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25; // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25; // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * 5; // z
      vel.push({
        x: (Math.random() - 0.5) * 0.015,
        y: (Math.random() - 0.5) * 0.015,
        z: (Math.random() - 0.5) * 0.015,
      });
    }
    return [pos, vel];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;
    
    const posAttribute = pointsRef.current.geometry.attributes.position;
    const currentPositions = posAttribute.array;

    // Update positions
    for (let i = 0; i < count; i++) {
      currentPositions[i * 3] += velocities[i].x;
      currentPositions[i * 3 + 1] += velocities[i].y;
      currentPositions[i * 3 + 2] += velocities[i].z;

      // Bounce off invisible walls
      if (Math.abs(currentPositions[i * 3]) > 12.5) velocities[i].x *= -1;
      if (Math.abs(currentPositions[i * 3 + 1]) > 12.5) velocities[i].y *= -1;
      if (Math.abs(currentPositions[i * 3 + 2]) > 2.5) velocities[i].z *= -1;
    }
    posAttribute.needsUpdate = true;

    // Update lines (connections)
    const linePositions = [];
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = currentPositions[i * 3] - currentPositions[j * 3];
        const dy = currentPositions[i * 3 + 1] - currentPositions[j * 3];
        const dz = currentPositions[i * 3 + 2] - currentPositions[j * 3];
        const distSq = dx * dx + dz * dz + dy * dy;

        if (distSq < 6) { // Connection radius
          linePositions.push(
            currentPositions[i * 3], currentPositions[i * 3 + 1], currentPositions[i * 3 + 2],
            currentPositions[j * 3], currentPositions[j * 3 + 1], currentPositions[j * 3 + 2]
          );
        }
      }
    }
    
    linesRef.current.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial color="var(--color-accent, #00ff41)" size={0.06} transparent opacity={0.5} />
      </points>
      <lineSegments ref={linesRef}>
        <bufferGeometry />
        <lineBasicMaterial color="var(--color-accent, #00ff41)" transparent opacity={0.15} />
      </lineSegments>
    </group>
  );
};

const CyberBackground = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-40 transition-opacity duration-1000">
      <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
        <ParticleNetwork count={150} />
      </Canvas>
    </div>
  );
};

export default CyberBackground;
