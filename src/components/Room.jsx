import { useRef, useState } from 'react'
import { useFrame, Canvas } from '@react-three/fiber'
import { ScrollControls, useScroll, PerspectiveCamera, Text, Html } from '@react-three/drei'
import * as THREE from 'three'


function Room({ position, size, color }) {
  return (
    <mesh position={position}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} side={THREE.BackSide} />
    </mesh>
  )
}

function Furniture({ position, size, color, rotation = [0, 0, 0], onClick, label }) {
  const [hovered, setHovered] = useState(false)
  // const [showLabel, setShowLabel] = useState(false)

  return (
    <group>
      <mesh 
        position={position} 
        rotation={rotation}
        onClick={onClick}
        onPointerOver={() => {
          setHovered(true)
          setShowLabel(true)
        }}
        onPointerOut={() => {
          setHovered(false)
          setShowLabel(false)
        }}
        scale={hovered ? 1.05 : 1}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial 
          color={color}
          metalness= {0.5}
          roughness= {0.5}
        />
      </mesh>
      {/* {showLabel && (
        <Html position={[position[0], position[1] + size[1]/4 + 0.2, position[2]]}>
          <div style={{ 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '4px 8px', 
            borderRadius: '4px',
            fontSize: '12px',
            whiteSpace: 'nowrap'
          }}>
            {label}
          </div>
        </Html>
      )} */}
    </group>
  )
}

function Scene() {
  const scroll = useScroll()
  const cameraRef = useRef()
  const [selectedItem, setSelectedItem] = useState(null)

  useFrame(() => {
    const scrollOffset = scroll.offset
    
    // Circular movement around the room with smooth height variation
    const radius = 8
    const angle = scrollOffset * 15
    // cameraRef.current.position.x = -7
    // cameraRef.current.position.z = -10
    // cameraRef.current.position.y = 5
    cameraRef.current.lookAt(angle, 0, 0)
  })

  return (
    <>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault 
        position={[-5, 5, -15]}
        fov={100}
      />
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, 5, -5]} intensity={0.5} />
      <spotLight position={[0, 5, 0]} angle={0.3} penumbra={1} intensity={0.5} />

      {/* Room structure */}
      <Room position={[0, 4, 0]} size={[15, 8, 15]} color="#f0f0f0" />
      
      {/* Floor with wood texture */}
      <Furniture position={[0, 0, 0]} size={[15, 0.2, 15]} color="#f0f0f0" />
      
      {/* Ceiling */}
      <Furniture position={[0, 8, 0]} size={[15, 0.2, 15]} color="#f0f0f0" />
      
      {/* Furniture */}
      <Furniture 
        position={[-3, 0.5, -3]} 
        size={[2, 1, 1]} 
        color="#4a4a4a"
        label="Comfortable Bed"
        onClick={() => setSelectedItem('bed')}
      />
      <Furniture 
        position={[3, 0.5, -3]} 
        size={[1, 0.8, 1]} 
        color="#8b4513"
        label="Wooden Desk"
        onClick={() => setSelectedItem('desk')}
      />
      <Furniture 
        position={[3, 1.3, -3]} 
        size={[0.8, 0.8, 0.8]} 
        color="#2a2a2a"
        label="Office Chair"
        onClick={() => setSelectedItem('chair')}
      />
      <Furniture 
        position={[0, 0.5, 3]} 
        size={[3, 0.5, 1]} 
        color="#4a4a4a"
        label="Leather Sofa"
        onClick={() => setSelectedItem('sofa')}
      />
      <Furniture 
        position={[-3, 0.5, 3]} 
        size={[1, 1, 1]} 
        color="#8b4513"
        label="Bookshelf"
        onClick={() => setSelectedItem('bookshelf')}
      />
      
      {/* Decorative elements */}
      <Furniture position={[-4, 4, 0]} size={[0.1, 2, 2]} color="#4a4a4a" /> {/* Window frame */}
      <Furniture position={[4, 4, 0]} size={[0.1, 2, 2]} color="#4a4a4a" /> {/* Window frame */}
      <Furniture position={[0, 4, 4]} size={[2, 2, 0.1]} color="#4a4a4a" /> {/* Window frame */}
      <Furniture position={[0, 4, -4]} size={[2, 2, 0.1]} color="#4a4a4a" /> {/* Window frame */}
      
      {/* Additional decorative elements */}
      <Furniture 
        position={[-3, 1.5, 3]} 
        size={[0.8, 0.8, 0.8]} 
        color="#4a4a4a"
        label="Book Collection"
      />
      <Furniture 
        position={[3, 1.3, -3]} 
        size={[0.1, 0.1, 0.1]} 
        color="#ffffff"
        label="Computer"
      />
      <Furniture 
        position={[0, 1, 3]} 
        size={[2, 0.1, 0.8]} 
        color="#4a4a4a"
        label="Coffee Table"
      />

      {/* Selected item info */}
      {/* {selectedItem && (
        <Html position={[0, 5, 0]}>
          <div style={{ 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '16px', 
            borderRadius: '8px',
            maxWidth: '200px',
            textAlign: 'center'
          }}>
            <h3 style={{ margin: '0 0 8px 0' }}>{selectedItem.charAt(0).toUpperCase() + selectedItem.slice(1)}</h3>
            <p style={{ margin: 0 }}>Click anywhere to close</p>
          </div>
        </Html>
      )} */}
    </>
  )
}

export default function RoomScene() {
  return (
    <div style={{ width: '100%', height: '300vh', marginTop: '100vh' }}>
      <Canvas style={{ display:'block', position: 'fixed', top: 0, left: 0 }}>
        <ScrollControls pages={3} damping={0.1}>
          <Scene />
        </ScrollControls>
      </Canvas>
    </div>
  )
}
