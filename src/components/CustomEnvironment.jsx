import React from 'react';
import { useThree } from '@react-three/fiber';
import { Environment, useHelper } from '@react-three/drei';
import * as THREE from 'three';

export default function CustomEnvironment() {
  const { scene } = useThree();

  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  // Add directional light (sun)
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Add point lights for additional illumination
  const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
  pointLight1.position.set(-5, 3, 0);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  pointLight2.position.set(5, 3, 0);
  scene.add(pointLight2);

  return (
    <>
      {/* Add environment map */}
      <Environment
        background near={1} far={1000} resolution={256}
      >
        
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
      </Environment>
    </>
  );
}
