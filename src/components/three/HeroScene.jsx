import { Suspense, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial, Icosahedron, TorusKnot } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'

/**
 * The signature 3D hero object: a slowly rotating, distorted core
 * orbited by floating shards. The whole rig leans toward the pointer,
 * giving the customer something living to react to on arrival.
 */

function Rig({ children }) {
  const group = useRef()
  useFrame((state) => {
    if (!group.current) return
    // Ease the group toward the pointer position for a parallax feel
    const targetX = state.pointer.x * 0.4
    const targetY = state.pointer.y * 0.3
    group.current.rotation.y += (targetX - group.current.rotation.y) * 0.04
    group.current.rotation.x += (-targetY - group.current.rotation.x) * 0.04
  })
  return <group ref={group}>{children}</group>
}

function Core() {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.z += delta * 0.12
  })
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
      <Icosahedron ref={mesh} args={[1.35, 4]}>
        <MeshDistortMaterial
          color="#AEEE2D"
          emissive="#3C4714"
          emissiveIntensity={0.4}
          roughness={0.25}
          metalness={0.15}
          distort={0.38}
          speed={1.8}
        />
      </Icosahedron>
    </Float>
  )
}

function Shard({ position, scale, color }) {
  return (
    <Float speed={2} rotationIntensity={1.4} floatIntensity={1.6}>
      <mesh position={position} scale={scale}>
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial
          color={color}
          roughness={0.4}
          metalness={0.2}
          flatShading
        />
      </mesh>
    </Float>
  )
}

function Ring() {
  const mesh = useRef()
  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.x += delta * 0.15
      mesh.current.rotation.y += delta * 0.1
    }
  })
  return (
    <TorusKnot ref={mesh} args={[2.4, 0.05, 160, 16]} scale={0.9}>
      <meshStandardMaterial
        color="#515E1B"
        roughness={0.6}
        metalness={0.3}
        wireframe
      />
    </TorusKnot>
  )
}

export default function HeroScene() {
  const reduce = useReducedMotion()

  return (
    <Canvas
      dpr={[1, 1.8]}
      camera={{ position: [0, 0, 6], fov: 42 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 6, 4]} intensity={2.2} color="#ffffff" />
      <pointLight position={[-6, -3, -4]} intensity={2.4} color="#AEEE2D" />
      <pointLight position={[4, -4, 3]} intensity={1.2} color="#515E1B" />

      <Suspense fallback={null}>
        {reduce ? (
          <Core />
        ) : (
          <Rig>
            <Core />
            <Ring />
            <Shard position={[2.6, 1.3, -1]} scale={0.9} color="#AEEE2D" />
            <Shard position={[-2.8, -1, -0.5]} scale={1.1} color="#F4F4F0" />
            <Shard position={[2.2, -1.8, 0.5]} scale={0.7} color="#515E1B" />
            <Shard position={[-2.2, 1.7, -1.5]} scale={0.6} color="#AEEE2D" />
          </Rig>
        )}
      </Suspense>
    </Canvas>
  )
}
