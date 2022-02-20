import { Document as ModelDocument, Extension, WebIO } from '@gltf-transform/core';

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Stats, OrbitControls, Stage, BakeShadows, Backdrop, Bounds, Environment, ContactShadows, PresentationControls, Center} from "@react-three/drei";
import { LoadingManager, Mesh, WebGLRenderer } from "three";
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';
import React from 'react';

function Model(props: {gltf: GLTF}){
  
  return (
    <Bounds fit clip damping={6} margin={1.2}>
      <primitive object={props.gltf.scene} scale={1} />
    </Bounds>
  );
}

export function ConbiniViewer(props: { model : string}) {

  const [gl_local, setGl] = React.useState<WebGLRenderer>();

  const [gltf, setGltf] = React.useState<GLTF>();

  useEffect(() => {
    if(gl_local)
    {
      const temp_loader = new GLTFLoader();

      const loading_manager = new LoadingManager();
      loading_manager.onLoad= () => console.log("loaded");
      loading_manager.onProgress= ( u, l , t) => console.log("loaded : ", u, l, t);
      loading_manager.onError= (url) => console.error("failed : " + url);
      loading_manager.onStart= () => console.log("started");
  
      var ktx2Loader = new KTX2Loader(loading_manager);
      ktx2Loader.setTranscoderPath( 'transcoder/' );
      ktx2Loader.detectSupport( gl_local );
      temp_loader.setKTX2Loader(ktx2Loader);

      temp_loader.load(props.model, (gltf) => {
        setGltf(gltf);
        console.log("GLTF LOADED");
      }, undefined, (error) => console.error(error));
    }
  }, [gl_local, props.model]);

  return (
    <Canvas 
        dpr={[1, 2]} 
        camera={{ fov: 60 }}
        onCreated={(state : { gl : WebGLRenderer }) => {
          setGl(state.gl);
            //gl.setClearColor("#252934");
        }}
        >
          <pointLight position={[100, 100, 100]} intensity={0.8} />
          <hemisphereLight color="#ffffff" groundColor="#b9b9b9" position={[-7, 25, 13]} intensity={0.85} />
        <Suspense fallback={null}>
          {gltf && <Model gltf={gltf} />}
          <Environment preset='warehouse' />
          <ContactShadows rotation-x={Math.PI / 2} position={[0, -35, 0]} opacity={0.25} width={200} height={200} blur={1} far={50} />
          <OrbitControls makeDefault minPolarAngle={0} maxPolarAngle={Math.PI / 1.75} />
        </Suspense>
    </Canvas>
  );
};

/*
 const gltf = useLoader(GLTFLoader, props.model, loader => {
        console.log(loader);
      });
*/