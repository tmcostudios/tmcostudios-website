import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'

/**
 * 3D reinterpretation of the Work page's large circle/semicircle shapes.
 * Three slowly drifting orbs that react to the pointer.
 */

function PointerGroup({ children }) {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    group.current.rotation.y +=
      (state.pointer.x * 0.25 - group.current.rotation.y) * 0.03
    group.current.position.y =
      Math.sin(state.clock.elapsedTime * 0.3) * 0.15
  })
  return <group ref={group}>{children}</group>
}

function Orb({ position, radius, color, distort = 0.25, opacity = 1 }) {
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh position={position}>
        <sphereGeometry args={[radius, 64, 64]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.35}
          metalness={0.1}
          distort={distort}
          speed={1.2}
          transparent={opacity < 1}
          opacity={opacity}
        />
      </mesh>
    </Float>
  )
}

export default function OrbField() {
  const reduce = useReducedMotion()

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 5]} intensity={2} />
      <pointLight position={[-5, -2, 2]} intensity={2} color="#AEEE2D" />

      <Suspense fallback={null}>
        {reduce ? (
          <Orb position={[0, 0, 0]} radius={2.2} color="#d8d8d2" />
        ) : (
          <PointerGroup>
            <Orb position={[-2.4, 0, 0]} radius={2.4} color="#d8d8d2" distort={0.18} />
            <Orb position={[2.2, 0.3, -1]} radius={1.5} color="#AEEE2D" distort={0.3} />
            <Orb position={[3.6, -0.4, -2]} radius={0.9} color="#515E1B" distort={0.3} opacity={0.95} />
          </PointerGroup>
        )}
      </Suspense>
    </Canvas>
  )
}
