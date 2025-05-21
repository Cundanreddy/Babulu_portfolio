import { useRef } from 'react'
import { useFrame, Canvas } from '@react-three/fiber'
import { OrbitControls, ScrollControls, useScroll, PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import frontViewTexture from '../assets/frontview1_cropped.jpeg'

function Building({ position, size, color, texture }) {
  const textureLoader = new THREE.TextureLoader()
  const buildingTexture = texture ? textureLoader.load(texture) : null

  return (
    <mesh position={position}>
      <planeGeometry args={size} />
      <meshStandardMaterial 
        color={color} 
        map={buildingTexture}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

function Scene() {
  const scroll = useScroll()
  const cameraRef = useRef()
  const groupRef = useRef()

  useFrame((state, delta) => {
    // Camera movement based on scroll
    const scrollOffset = scroll.offset
    cameraRef.current.position.z = 20 - scrollOffset * 15 // Zoom in as we scroll
    // cameraRef.current.position.y = 5 - scrollOffset * 10 // Move down as we scroll
    cameraRef.current.lookAt(5, 5, 5)
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        position={[5, 5, 2]}
        fov={75}
      />
      <ambientLight intensity={0.9} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <group ref={groupRef}>
        {/* Main building with texture */}
        <Building
          position={[10, 5, 0]}  
          size={[4, 8, 4]} 
          color="#ffffff" 
          texture={frontViewTexture}
        />
        
        {/* Windows */}
        {/* {[...Array(4)].map((_, i) => (
          <Building
            key={i}
            position={[0, -2 + i * 2, 2.01]}
            size={[1, 0.5, 0.1]}
            color="#88ccff"
          />
        ))} */}
        
        {/* Roof */}
        {/* <Building position={[0, 4.5, 0]} size={[5, 1, 5]} color="#2a2a2a" /> */}
        
        {/* Side buildings */}
        {/* <Building position={[-6, -1, 0]} size={[3, 6, 3]} color="#3a3a3a" />
        <Building position={[6, -1, 0]} size={[3, 6, 3]} color="#3a3a3a" /> */}
        
        {/* Ground */}
        {/* <Building position={[10, -5, 0]} size={[20, 0.5, 20]} color="#2a2a2a" /> */}
      </group>
    </>
  )
}

export default function  BuildingScene() {
  return (
    <div style={{ width: '100%', height: '300vh' }}>
      <Canvas style={{ position: 'fixed', top: 0, left: 0 }}>
        <ScrollControls pages={3} damping={0.1}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </div>
  )
} 