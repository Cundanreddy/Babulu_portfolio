'use client'

import React, { useRef, useEffect, useState,Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// import { AboutMe } from '@/app/pages/AboutMe';
import { OrbitControls, Image, useGLTF,Environment } from '@react-three/drei';
import CustomEnvironment from './CustomEnvironment';

// Camera positions presets
const CAMERA_POSITIONS = {
  tvfull:   { position: [-5, 39, 0],  target: [100, 40, 0] },
  front:    { position: [0, 45, 100], target: [0, 40, 0] },
  left:     { position: [-100, 45, 0],target: [0, 40, 0] },
  right:    { position: [100, 39, 0], target: [0, 40, 0] },
  top:      { position: [0, 160, 0],  target: [0, 0, 0] },
  back:     { position: [0, 39, -10],target: [0, 40, 0] },
};

// Loading Overlay Component
const LoadingOverlay = ({ progress }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      zIndex: 1000,
      transition: 'opacity 0.5s ease-in-out',
      opacity: progress === 100 ? 0 : 1,
      pointerEvents: progress === 100 ? 'none' : 'auto'
    }}>
      <div style={{
        width: '200px',
        height: '4px',
        background: '#333',
        borderRadius: '2px',
        overflow: 'hidden'
      }}>
        <div style={{
          width: `${progress}%`,
          height: '100%',
          background: '#4451a6',
          transition: 'width 0.3s ease-in-out'
        }} />
      </div>
      <div style={{ marginTop: '10px', fontSize: '14px' }}>
        Loading... {Math.round(progress)}%
      </div>
    </div>
  );
};

function Scene({ activeView, setActiveView, setTVTexture, tvTexture }) {
  // const sphereGroup = useRef();
  // const smallSphere = useRef();
  // const prevCameraPos = useRef(new THREE.Vector3());
  // const prevCameraDir = useRef(new THREE.Vector3());
  const [currentTVImageIndex, setCurrentTVImageIndex] = useState(0);
  
  // Room dimensions
  const ROOM_WIDTH = 200;
  const ROOM_HEIGHT = 100;
  const ROOM_DEPTH = 200;
  const ROOM_HALF_WIDTH = ROOM_WIDTH / 2;
  const ROOM_HALF_HEIGHT = ROOM_HEIGHT / 2;
  const ROOM_HALF_DEPTH = ROOM_DEPTH / 2;

  const ceilingColor = 0xCECAC9;
  const ceilingEmissive = 0xCECAC9;
  const wallColor = 0x415262;
  const wallEmissive = 0x415262;
  const floorColor = 0x737373;

  // Add granite texture loader
  const graniteTexture = new THREE.TextureLoader().load('./textures/granite.jpg');
  const granite_roughness= new THREE.TextureLoader().load('./textures/granite_roughness.jpg');
  const granite_metallic= new THREE.TextureLoader().load('./textures/granite_metallic.jpg');
  
  // graniteTexture.wrapS = THREE.RepeatWrapping;
  // graniteTexture.wrapT = THREE.RepeatWrapping;
  // graniteTexture.repeat.set(4, 4);

  // Camera control
  const { camera, gl } = useThree();

  // Load textures
  const textureLoader = new THREE.TextureLoader();
  const images = [
    './images/my_work/TV_wall_wood_1.jpeg',
    './images/my_work/TV_wall_wood_2.jpeg',
    './images/my_work/TV_wall_wood_3.jpeg',
    './images/my_work/TV_wall_wood_4.jpeg',
    './images/my_work/bedroom1.jpeg',
    './images/my_work/front_elevation1.jpeg',
    './images/my_work/front_elevation2.jpeg',
    './images/my_work/front_elevation3.jpeg',
    './images/my_work/hall1_1.jpeg',
    './images/my_work/hall1_2.jpeg',
    './images/my_work/hall2.jpeg',
    './images/my_work/room1_1.jpeg',
    './images/my_work/room1_2.jpeg',
    './images/my_work/room1_3.jpeg',
    './images/my_work/room1_4.jpeg',
    './images/my_work/sofaset.jpeg',
  ];

  const [textures, setTextures] = useState([]);
  const [currentTextureIndex, setCurrentTextureIndex] = useState(0);

  // Load the sofa model
  const { scene: sofa } = useGLTF('/3d_objects/sofa.gltf', undefined, (error) => {
    console.error('Error loading GLTF model:', error);
  });

  // Load the center table model
  const { scene: centerTable } = useGLTF('/3d_objects/center_table.glb', undefined, (error) => {
    console.error('Error loading center table model:', error);
  });

  useEffect(() => {
    const loadedTextures = images.map(path => {
      const texture = textureLoader.load(
        path,
        undefined,
        undefined,
        (error) => {
          console.error(`Error loading texture ${path}:`, error);
        }
      );
      texture.needsUpdate = true;
      return texture;
    });
    setTextures(loadedTextures);
    // Set initial TV texture
    if (loadedTextures.length > 0) {
      setTVTexture(loadedTextures[9]);
    }

    // Cleanup function
    return () => {
      loadedTextures.forEach(texture => {
        if (texture) {
          texture.dispose();
        }
      });
    };
  }, []);

  useEffect(() => {
    if (activeView && CAMERA_POSITIONS[activeView]) {
      console.log('Changing camera position to:', activeView);
      const { position, target } = CAMERA_POSITIONS[activeView];
      const duration = 1000;
      const startPosition = new THREE.Vector3().copy(camera.position);
      const startTarget = new THREE.Vector3(0, 40, 0);
      const endPosition = new THREE.Vector3(...position);
      const endTarget = new THREE.Vector3(...target);
      const startTime = Date.now();
      let animationFrameId;

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;

        camera.position.lerpVectors(startPosition, endPosition, easeProgress);
        const currentTarget = new THREE.Vector3().lerpVectors(startTarget, endTarget, easeProgress);
        camera.lookAt(currentTarget);
        
        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          console.log('Camera animation completed');
        }
      };

      animate();

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }
  }, [activeView, camera]);

  // useFrame(() => {
  //   const timer = Date.now() * 0.01;
  //   if (sphereGroup.current) {
  //     sphereGroup.current.rotation.y -= 0.002;
  //   }
  //   if (smallSphere.current) {
  //     smallSphere.current.position.set(
  //       Math.cos(timer * 0.1) * 30,
  //       Math.abs(Math.cos(timer * 0.2)) * 20 + 5,
  //       Math.sin(timer * 0.1) * 30
  //     );
  //     smallSphere.current.rotation.y = Math.PI / 2 - timer * 0.1;
  //     smallSphere.current.rotation.z = timer * 0.8;
  //   }

  //   // Get current camera position and direction
  //   // const currentPos = camera.position.clone();
  //   // const currentDir = new THREE.Vector3();
  //   // camera.getWorldDirection(currentDir);

  //   // // Check if camera has moved significantly (more than 0.1 units)
  //   // const posChanged = currentPos.distanceTo(prevCameraPos.current) > 0.1;
  //   // const dirChanged = currentDir.distanceTo(prevCameraDir.current) > 0.1;

  //   // if (posChanged || dirChanged) {
  //   //   console.log('Camera Position:', {
  //   //     x: currentPos.x.toFixed(2),
  //   //     y: currentPos.y.toFixed(2),
  //   //     z: currentPos.z.toFixed(2)
  //   //   });
      
  //   //   console.log('Camera Target Direction:', {
  //   //     x: currentDir.x.toFixed(2),
  //   //     y: currentDir.y.toFixed(2),
  //   //     z: currentDir.z.toFixed(2)
  //   //   });

  //   //   // Update previous values
  //   //   prevCameraPos.current.copy(currentPos);
  //   //   prevCameraDir.current.copy(currentDir);
  //   // }
  // });

  // Responsive camera
  useEffect(() => {
    const handleResize = () => {
      camera.position.set(0, 75, 160);
      camera.far = 500;
      camera.near = 1;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      gl.setSize(window.innerWidth, window.innerHeight);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [camera, gl]);

  const handlePhotoFrame = (texture) => {
    setActiveView('tvfull');
    setTVTexture(texture);
  };

  const handleCloseTVImage = () => {
    setActiveView('left');
    setTVTexture(null);
  };
  
  const handleTVScreen = () => {
    setActiveView('tvfull');
  };

  const handlePrevTVImage = () => {
    setCurrentTVImageIndex((prev) => (prev - 1 + textures.length) % textures.length);
    setTVTexture(textures[(currentTVImageIndex - 1 + textures.length) % textures.length]);
  };

  const handleNextTVImage = () => {
    setCurrentTVImageIndex((prev) => (prev + 1) % textures.length);
    setTVTexture(textures[(currentTVImageIndex + 1) % textures.length]);
  };

  return (
    <>
      {/* Replace default Environment with CustomEnvironment */}
      
      {/* <Environment preset='sunset'/> */}
      <Environment
      
        background 
        near={1} 
        far={10000} 
        resolution={512}
        // ground={{height: 15, radius: 60, scale: 0}}
        >
        
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH + 0.01, ROOM_DEPTH + 0.01]} />
        <meshPhongMaterial emissive={ceilingEmissive} specular={100} color={ceilingColor} />
        <pointLight position={[0, 60, 0]} intensity={2.5} distance={250} color={0xffffff} />
      </mesh>
      
    
      {/* Front */}
      
      <mesh position={[0, 0, ROOM_HALF_DEPTH]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_WIDTH + 0.01, ROOM_HEIGHT + 0.01]} />
        <meshPhongMaterial emissive={0xffffff} specular={100} color={wallColor} />  
         {/* Photo Frames Grid */}
         <group position={[15, 0, 0.1]}>
            {/* Row 1 */}
            {/* Frame 1 */}
            <group position={[-55, 30, 0]}>
              {/* Frame Border */}
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}  // Brown color
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              {/* Inner Frame */}
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              {/* Image */}
              <Image
                url="./images/my_work/TV_wall_wood_1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[0])}
              />
            </group>

            {/* Frame 2 */}
            <group position={[-15, 30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/TV_wall_wood_2.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>

            {/* Frame 3 */}
            <group position={[25, 30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/TV_wall_wood_3.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>

            {/* Row 2 */}
            {/* Frame 4 */}
            <group position={[-55, 0, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
              </mesh>
              <Image
                url="./images/my_work/TV_wall_wood_4.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>

            {/* Frame 5 */}
            <group position={[-15, 0, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/bedroom1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>

            {/* Frame 6 */}
            <group position={[25, 0, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/front_elevation1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>

            {/* Row 3 */}
            {/* Frame 7 */}
            <group position={[-55, -30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/front_elevation2.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>

            {/* Frame 8 */}
            <group position={[-15, -30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/front_elevation3.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>

            {/* Frame 9 */}
            <group position={[25, -30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/hall1_1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                
              />
            </group>
          </group>
      </mesh>
      {/* Right */}
      <mesh position={[ROOM_HALF_WIDTH, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH + 0.1, ROOM_HEIGHT + 0.1]} />
        <meshStandardMaterial 
          roughness={0.7}
          metalness={1}
          bumpScale={0.1}
          displacementScale={0.05}
        />
        
        {/* TV Cabinet */}
        <group position={[0, -30, 0]}>
          {/* Cabinet Base */}
          <mesh position={[0, -10, 5]}>
            <boxGeometry args={[ROOM_DEPTH*0.8, 20, 10]} />
            <meshPhongMaterial emissive={0x0000ff} 
              color={0xff66ff}
              specular={100} 
              shininess={100}
              reflectivity={1}
              envMapIntensity={2}
              transparent={true}
              opacity={0.95}
            />
          </mesh>
          {/* TV Screen */}
          <mesh position={[0, 40, 0.5]}>
            <boxGeometry args={[85, 45, 0.5]} />
            <Image 
              url={images[currentTVImageIndex]}
              position={[0, 0, 0.5]}
              scale={[85, 45, 0.5]}
              onClick={handleTVScreen}
            />
            <meshStandardMaterial roughness={0} metalness={1} map={tvTexture}/>
            
          </mesh>
          {/* TV Frame */}
          <mesh position={[0, 40, 0]}>
            <boxGeometry args={[87, 47, 0.5]} />
            <meshStandardMaterial color={0x000000} />
          </mesh> 
          
        </group>
      </mesh>
      {/* Left */}
      <mesh position={[-ROOM_HALF_WIDTH, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH + 0.1, ROOM_HEIGHT + 0.1]} />
        <meshPhongMaterial emissive={0xffffff} specular={100}  color={wallColor} />
      </mesh>
      {/* back */}
      <mesh position={[0, 0, -ROOM_HALF_DEPTH]} rotation={[0, Math.PI * 2, 0]}>
        <planeGeometry args={[ROOM_WIDTH + 0.1, ROOM_HEIGHT + 0.1]} />
        <meshPhongMaterial emissive={0xffffff} specular={100}  color={wallColor} />
      </mesh>
      </Environment>
      {/* Ground Mirror */}
      {/* <Reflector
        args={[40, 40, 64]}
        resolution={1024}
        mirror={1}
        mixBlur={0}
        mixStrength={1}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.5, 0]}
        color="#b5b5b5"
      /> */}
      {/* Vertical Mirror */}
      {/* <Reflector
        args={[100, 100]}
        resolution={1024}
        mirror={1}
        mixBlur={0}
        mixStrength={1}
        rotation={[0, 0, 0]}
        position={[0, 50, -50]}
        color="#c1cbcb"
      /> */}
      {/* Sphere Group */}
      {/* <group ref={sphereGroup}> */}
        {/* Half Sphere with Cap */}
        {/* <mesh
          position={[0, 7.5 + 15 * Math.sin(Math.PI / 180 * 30), 0]}
          rotation={[-Math.PI / 180 * 135, 0, -Math.PI / 180 * 20]}
        >
          <sphereGeometry args={[15, 24, 24, Math.PI / 2, Math.PI * 2, 0, Math.PI / 180 * 120]} />
          <meshPhongMaterial emissive={0x0000ff} color={0xffffff} specular={100}  /> */}
          {/* Cap */}
          {/* <mesh
            position={[0, -15 * Math.sin(Math.PI / 180 * 30) - 0.05, 0]}
            rotation={[-Math.PI, 0, 0]}
          >
            <cylinderGeometry args={[0.1, 15 * Math.cos(Math.PI / 180 * 30), 0.1, 24, 1]} />
            <meshPhongMaterial emissive={0x0000ff} color={0xffffff} specular={100}  />
          </mesh>
        </mesh> */}
      {/* </group> */}
      {/* Small Icosahedron Sphere */}
      {/* <mesh ref={smallSphere}>
        <icosahedronGeometry args={[5, 0]} />
        <meshPhongMaterial emissive={0x0000ff} color={0xff0000} specular={80}  />
      </mesh> */}
      {/* Walls */}
      {/* Top */}
      <mesh position={[0, ROOM_HEIGHT, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH + 0.01, ROOM_DEPTH + 0.01]} />
        <meshPhongMaterial emissive={ceilingEmissive} specular={100} color={ceilingColor} />
        <pointLight position={[0, 60, 0]} intensity={2.5} distance={250} color={0xffffff} />
      </mesh>
      
      {/* Bottom */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM_WIDTH + 0.01, ROOM_DEPTH + 0.01]} />
        <meshStandardMaterial 
          map={graniteTexture}
          roughnessMap={granite_roughness}
          metalnessMap={granite_metallic}
          bumpMap={graniteTexture}
          bumpScale={0.1}
          displacementMap={graniteTexture}
          displacementScale={0.05}
        />
      </mesh>
      {/* Front */}
      
      <mesh position={[0, ROOM_HALF_HEIGHT, ROOM_HALF_DEPTH]} rotation={[0, Math.PI, 0]}>
        <planeGeometry args={[ROOM_WIDTH + 0.01, ROOM_HEIGHT + 0.01]} />
        <meshPhongMaterial emissive={wallEmissive} specular={100} color={wallColor} />  
         {/* Photo Frames Grid */}
         <group position={[15, 0, 0.1]}>
            {/* Row 1 */}
            {/* Frame 1 */}
            <group position={[-55, 30, 0]}>
              {/* Frame Border */}
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}  // Brown color
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              {/* Inner Frame */}
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              {/* Image */}
              <Image
                url="./images/my_work/TV_wall_wood_1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[0])}
              />
            </group>

            {/* Frame 2 */}
            <group position={[-15, 30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/TV_wall_wood_2.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[1])}
              />
            </group>

            {/* Frame 3 */}
            <group position={[25, 30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/TV_wall_wood_3.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[2])}
              />
            </group>

            {/* Row 2 */}
            {/* Frame 4 */}
            <group position={[-55, 0, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
              </mesh>
              <Image
                url="./images/my_work/TV_wall_wood_4.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[2])}
              />
            </group>

            {/* Frame 5 */}
            <group position={[-15, 0, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/bedroom1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[4])}
              />
            </group>

            {/* Frame 6 */}
            <group position={[25, 0, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/front_elevation1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[5])}
              />
            </group>

            {/* Row 3 */}
            {/* Frame 7 */}
            <group position={[-55, -30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/front_elevation2.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[6])}
              />
            </group>

            {/* Frame 8 */}
            <group position={[-15, -30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/front_elevation3.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[7])}
              />
            </group>

            {/* Frame 9 */}
            <group position={[25, -30, 0]}>
              <mesh rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[35, 22, 1]} />
                <meshStandardMaterial 
                  color={0xFFD700}
                  roughness={0}
                  metalness={1}
                />
              </mesh>
              <mesh position={[0, 0, 0.5]} rotation={[0, Math.PI, 0]}>
                <boxGeometry args={[33, 20, 0.1]} />
                <meshStandardMaterial color={0x000000} />
              </mesh>
              <Image
                url="./images/my_work/hall1_1.jpeg"
                position={[0, 0, 0.6]}
                scale={[32, 18, 1]}
                onClick={() => handlePhotoFrame(textures[8])}
              />
            </group>
          </group>
      </mesh>
      {/* Right */}
      <mesh position={[ROOM_HALF_WIDTH, ROOM_HALF_HEIGHT, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH + 0.1, ROOM_HEIGHT + 0.1]} />
        {/* <meshPhongMaterial emissive={wallEmissive} specular={100}  color={wallColor} /> */}
        <meshStandardMaterial 
          // map={graniteTexture}
          roughness={0.7}
          metalness={1}
          // bumpMap={graniteTexture}
          bumpScale={0.1}
          // displacementMap={graniteTexture}
          displacementScale={0.05}
        />
        
        {/* TV Cabinet */}
        <group position={[0, -30, 0]}>
          {/* Cabinet Base */}
          <mesh position={[0, -10, 5]}>
            <boxGeometry args={[ROOM_DEPTH*0.8, 20, 10]} />
            <meshPhongMaterial emissive={0x0000ff} 
              color={0xff66ff}
              specular={100} 
              shininess={100}
              reflectivity={1}
              envMapIntensity={2}
              transparent={true}
              opacity={0.95}
            />
          </mesh>
          {/* TV Screen */}
          <mesh position={[0, 40, 0.5]}>
            <boxGeometry args={[85, 45, 0.5]} />
            <Image 
              url={images[currentTVImageIndex]}
              position={[0, 0, 0.5]}
              scale={[85, 45, 0.5]}
              onClick={handleTVScreen}
            />
            <meshStandardMaterial roughness={0} metalness={1} map={tvTexture}/>
            
          </mesh>
          {/* TV Frame */}
          <mesh position={[0, 40, 0]}>
            <boxGeometry args={[87, 47, 0.5]} />
            <meshStandardMaterial color={0x000000} />
          </mesh> 
          {/* Navigation Arrows */}
          <mesh position={[-40, 40, 1]} onClick={handlePrevTVImage}>
            <boxGeometry args={[2, 4, 0.5]} />
            <meshStandardMaterial color={0x666666} transparent={true} opacity={0.5} />
            <Image
              url="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLWxlZnQiPjxwYXRoIGQ9Im0xNSAxOC02LTYgNi02Ii8+PC9zdmc+"
              position={[0, 0, 0.1]}
              scale={[1.5, 1.5, 1]}
              transparent={false}
            />

          </mesh>
          <mesh position={[40, 40, 1]} onClick={handleNextTVImage}>
            <boxGeometry args={[2, 4, 0.5]} />
            <meshStandardMaterial color={0x666666} transparent={true} opacity={0.5} />
            <Image
              url="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1jaGV2cm9uLXJpZ2h0Ij48cGF0aCBkPSJtOSAxOCA2LTYtNi02Ii8+PC9zdmc+"
              position={[0, 0, 0.1]}
              scale={[1.5, 1.5, 1]}
              transparent={false}
            />
          </mesh>
          <mesh position={[40, 60, 1]} onClick={handleCloseTVImage}>
            <boxGeometry args={[4, 4, 0.5]} />
            <meshStandardMaterial color={0x666666} transparent={true} opacity={0.5} />
            <Image
              url="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJjdXJyZW50Q29sb3IiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS14Ij48cGF0aCBkPSJNMTggNkYxOCA2IDE4IDE4IDYgMTggNiA2Ii8+PC9zdmc+"
              position={[0, 0, 0.1]}
              scale={[1.5, 1.5, 1]}
              transparent={false}
            />
          </mesh>
        </group>
      </mesh>
      {/* Left */}
      <mesh position={[-ROOM_HALF_WIDTH, ROOM_HALF_HEIGHT, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[ROOM_DEPTH + 0.1, ROOM_HEIGHT + 0.1]} />
        <meshPhongMaterial emissive={wallEmissive} specular={100}  color={wallColor} />
        {/* Sofa */}
        <group position={[45, -ROOM_HALF_HEIGHT, 35]} scale={[40, 40, 40]} rotation={[0, 0, 0]}>
          <Suspense fallback={null}>
            {sofa && <primitive object={sofa} />}
          </Suspense>
        </group>
      </mesh>
      {/* back */}
      <mesh position={[0, ROOM_HALF_HEIGHT, -ROOM_HALF_DEPTH]} rotation={[0, Math.PI * 2, 0]}>
        <planeGeometry args={[ROOM_WIDTH + 0.1, ROOM_HEIGHT + 0.1]} />
        <meshPhongMaterial emissive={wallEmissive} specular={100}  color={wallColor} />
      </mesh>
      {/* Center Table */}
      <group position={[0, 19, 0]} scale={ [60, 60, 60]} rotation={[0, Math.PI/2, 0]}>
        <Suspense fallback={null}>
          {centerTable && <primitive object={centerTable} />}
        </Suspense>
      </group>
      {/* Lights */}
      <pointLight position={[0, 60, 0]} intensity={2.5} distance={250} color={0xffffff} />
      <pointLight position={[50, 50, 0]} intensity={0.5} distance={1000} color={0x00ff00} />
      <pointLight position={[-50, 50, 0]} intensity={0.5} distance={1000} color={0xff0000} />
      <pointLight position={[0, 50, 50]} intensity={0.5} distance={1000} color={0xbbbbfe} />
      <ambientLight intensity={0.3} />
      {/* Controls */}
      <OrbitControls 
        target={[0, 40, 0]} 
        maxDistance={100} 
        minDistance={10} 
      />
    </>
  );
}

export default function MainScene({
  activeView,
  setActiveView,
}) {
  const [tvTexture, setTVTexture] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  const handleViewChange = (view) => {
    console.log('Button clicked:', view);
    setActiveView(view);
  };

  // Loading progress effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <LoadingOverlay progress={loadingProgress} />
      
      <Canvas
        shadows
        camera={{ fov: 45, near: 1, far: 500, position: [0, 75, 160] }}
        // style={{ background: 'skyblue' }}
      >
        <Scene 
          activeView={activeView} 
          setActiveView={setActiveView}
          tvTexture={tvTexture}
          setTVTexture={setTVTexture}
        />
      </Canvas>
    </div>
  );
}
