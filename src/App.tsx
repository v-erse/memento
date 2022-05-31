import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  Mask,
  OrbitControls,
  Text3D,
  useGLTF,
  useMask,
} from "@react-three/drei";
import { Suspense, useRef } from "react";
import { DebugLayerMaterial, Depth, Fresnel, LayerMaterial } from "lamina";
import { BufferGeometry, Material, Mesh } from "three";
import * as THREE from "three";

function SkullMat() {
  const ref = useRef<any>();

  return (
    <DebugLayerMaterial
      ref={ref}
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
    >
      <Depth
        near={3.92}
        far={0.5}
        origin={[0, 0, 0]}
        colorA={"#fe0000"}
        colorB={"#000000"}
      />
      <Depth
        near={3.92}
        far={0.5}
        origin={[0, 0, 0]}
        colorA={"#fe0000"}
        colorB={"#000000"}
      />
      <Fresnel
        color={"#fed0d0"}
        alpha={0.15000000000000002}
        bias={0.05000000000000079}
        intensity={0.2}
        power={5}
        factor={1.5299999999999996}
        mode={"add"}
      />
    </DebugLayerMaterial>
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

  const t = useThree();

  useFrame(() => {
    if (textRef.current) textRef.current.lookAt(t.camera.position);
  });

  return (
    <Text3D ref={textRef} position={[-4.5, 0, -4]} font="/Inter_Regular.json">
      <LayerMaterial {...stencil}></LayerMaterial>
      {`Memento Mori`}
    </Text3D>
  );
}

export default function App() {
  return (
    <Canvas orthographic camera={{ zoom: 200 }}>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Skull />
        <Memento />
      </Suspense>
    </Canvas>
  );
}
