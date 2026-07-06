import { Suspense, useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'

/**
 * Five nodes orbiting a lime ring — a literal read of "five-stage process,"
 * placed behind the hero copy as the page's signature 3D moment.
 */

function RotatingGroup({ children }) {
  const group = useRef()
  useFrame((state, delta) => {
    if (!group.current) return
    group.current.rotation.y += delta * 0.18
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.1
  })
  return <group ref={group}>{children}</group>
}

function Nodes() {
  const count = 5
  const radius = 2.7

  const positions = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (i / count) * Math.PI * 2
        return [Math.cos(angle) * radius, Math.sin(angle) * radius * 0.42, Math.sin(angle) * radius * 0.65]
      }),
    []
  )

  return (
    <>
      {positions.map((pos, i) => (
        <Float key={i} speed={1.2} rotationIntensity={0.6} floatIntensity={1.5}>
          <mesh position={pos}>
            <sphereGeometry args={[i === 0 ? 0.32 : 0.2, 32, 32]} />
            <meshStandardMaterial
              color={i === 0 ? '#AEEE2D' : '#d8d8d2'}
              roughness={0.3}
              metalness={0.15}
            />
          </mesh>
        </Float>
      ))}
    </>
  )
}

export default function ProcessOrbit() {
  const reduce = useReducedMotion()

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0.6, 8], fov: 45 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 5]} intensity={2} />
      <pointLight position={[-5, -2, 2]} intensity={2} color="#AEEE2D" />

      <Suspense fallback={null}>
        {reduce ? (
          <mesh rotation={[Math.PI / 2.4, 0, 0]}>
            <torusGeometry args={[2.6, 0.02, 16, 100]} />
            <meshStandardMaterial color="#AEEE2D" />
          </mesh>
        ) : (
          <RotatingGroup>
            <mesh rotation={[Math.PI / 2.4, 0, 0]}>
              <torusGeometry args={[2.7, 0.012, 16, 120]} />
              <meshStandardMaterial color="#AEEE2D" transparent opacity={0.35} />
            </mesh>
            <Nodes />
          </RotatingGroup>
        )}
      </Suspense>
    </Canvas>
  )
}
