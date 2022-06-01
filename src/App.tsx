import { Canvas, useThree } from "@react-three/fiber";
import {
  Environment,
  Mask,
  OrbitControls,
  Text3D,
  useGLTF,
  useMask,
} from "@react-three/drei";
import { Suspense, useEffect, useRef } from "react";
import { Depth, Fresnel, LayerMaterial } from "lamina";
import { BufferGeometry, Material, Mesh } from "three";
import * as THREE from "three";

/**
 * glow shader?
 */

function SkullMat() {
  return (
    <LayerMaterial
      transmission={1}
      roughness={0.7}
      thickness={2}
      lighting={"physical"}
      clearcoat={0.4}
      clearcoatRoughness={0}
      ior={1.01}
      envMapIntensity={0.5}
      side={THREE.FrontSide}
      depthTest
      depthWrite
      emissive="blue"
      emissiveIntensity={0.01}
    >
      <Depth
        near={3.92}
        far={0.5}
        origin={[0, 0, 0]}
        colorA={"#fe0000"}
        colorB={"#000000"}
      />

      <Depth
        near={0.9}
        far={0.639}
        origin={[0, 0, 0]}
        colorA={"#fe0000"}
        colorB={"#000000"}
        alpha={0.12}
        mode={"add"}
      />

      <Fresnel
        color={"#00ccfe"}
        alpha={0.14}
        bias={0.05000000000000079}
        intensity={0.2}
        power={5}
        factor={1.5299999999999996}
        mode={"add"}
      />
    </LayerMaterial>
  );
}

function Skull({ ...props }) {
  const group = useRef(null);
  const { nodes } = useGLTF("/skull-v3-transformed.glb") as any;
  return (
    <>
      <Mask id={1}>
        {/* @ts-ignore */}
        <primitive object={nodes.defaultMaterial.geometry} />
      </Mask>
      <group ref={group} {...props} dispose={null}>
        <group rotation={[-Math.PI / 1.42, 0, Math.PI]}>
          <group rotation={[Math.PI / 2, 0, 0]}>
            <mesh geometry={nodes.defaultMaterial.geometry}>
              <SkullMat />
            </mesh>
            <mesh geometry={nodes.defaultMaterial003.geometry}>
              <SkullMat />
            </mesh>
            <group rotation={[-0.4, 0, 0]} position={[0, 0, -0.2]}>
              <mesh geometry={nodes.defaultMaterial001.geometry}>
                <SkullMat />
              </mesh>
              <mesh geometry={nodes.defaultMaterial002.geometry}>
                <SkullMat />
              </mesh>
            </group>
          </group>
        </group>
      </group>
    </>
  );
}

function Memento() {
  const stencil = useMask(1);
  const textRef = useRef<Mesh<BufferGeometry, Material | Material[]>>(null);

  useEffect(() => {
    const size = new THREE.Vector3();
    if (textRef.current) {
      textRef.current.geometry.computeBoundingBox();
      textRef.current.geometry.boundingBox!.getSize(size);
      textRef.current.position.x = -size.x / 2;
    }
  }, [textRef.current]);

  return (
    <Text3D
      ref={textRef}
      position={[0, -0.5, -4]}
      height={0.1}
      size={1.4}
      font="/Pirata One_Regular.json"
    >
      {/* <LayerMaterial {...stencil}></LayerMaterial> */}
      <LayerMaterial
        color={"#fff"}
        lighting={"physical"}
        envMapIntensity={0.3}
        // transmission={0.9}
        {...stencil}
      ></LayerMaterial>
      {`memento mori`}
    </Text3D>
  );
}

export default function App() {
  return (
    <Canvas orthographic camera={{ zoom: 200 }}>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} color="blue" />
      <pointLight position={[10, 10, 10]} />
      <pointLight position={[0, 10, 10]} color="blue" />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Skull />
        <Memento />
      </Suspense>
    </Canvas>
  );
}
