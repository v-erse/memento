import { Canvas } from "@react-three/fiber";
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

function SkullMat() {
  const ref = useRef<any>();

  return (
    <LayerMaterial
      ref={ref}
      transmission={1}
      roughness={0.9}
      thickness={2}
      lighting={"physical"}
      clearcoat={0.2}
      clearcoatRoughness={0.2}
      ior={1.01}
      envMapIntensity={2}
    >
      <Fresnel
        color={"#fe0000"}
        bias={1}
        intensity={0.8}
        power={1}
        mode={"darken"}
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

export default function App() {
  const stencil = useMask(1);

  return (
    <Canvas orthographic camera={{ zoom: 200 }}>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Environment preset="city" />
      <Suspense fallback={null}>
        <Skull />

        <Text3D position={[-4.5, 0, -4]} font="/Inter_Regular.json">
          <DebugLayerMaterial {...stencil}>
            <Depth />
          </DebugLayerMaterial>
          {`Memento Mori`}
        </Text3D>
      </Suspense>
    </Canvas>
  );
}
