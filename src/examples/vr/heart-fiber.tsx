import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { BufferGeometry, Vector3, AxesHelper, Color } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { SingleLabelLoader, MultiLabelLoader } from 'package/3d/loaders/LabelLoader';

extend({ TrackballControls });

const MultiGeometry = ({ geometry }: { geometry: any }) => {
  const ref = useRef<BufferGeometry>(null!);
  useEffect(() => {
    if(geometry && ref && ref.current) {
      ref.current.copy(geometry);
    }
  }, [geometry]);

  return(
    <bufferGeometry ref={ref} attach="geometry"/>
  );
};

const Scene = ({ children }: { children: React.ReactNode }) => {
  const { camera, scene, gl } = useThree();
  const control = useRef<any>();

  useEffect(() => {
    const axesHelper = new AxesHelper( 500 );
    scene.add( axesHelper );
    if(control.current) {
      control.current.up0.set(0, 0, 1);
      control.current.position0.set(0, -300, 0);
      control.current.zoom0 = 2;
      control.current.reset();
    }
  }, []);

  useFrame(() => control.current && control.current.update());

  return(
    <>
      <trackballControls args={[camera, gl.domElement]} ref={control}/>
      {children}
    </>
  );
};

const HeartView = () => {
  const ref = useRef<BufferGeometry>(null!);
  const [geo, setGeo] = useState<BufferGeometry>(null!);
  const [center, setCenter] = useState<number[]>([]);

  // multiple geometry
  const [multiGeo, setMultiGeo] = useState<BufferGeometry[]>([]);

  useEffect(() => {
    const fetchData = async() => {
      const geometry = await SingleLabelLoader('http://192.168.1.7:8080/heart/heart.vtp.gz');
      geometry.computeBoundingSphere();
      const center = geometry.boundingSphere!.center;
      setCenter([-center.x, -center.y, -center.z]);
      setGeo(geometry);
      const multiGeometry = await MultiLabelLoader('http://192.168.1.7:8080/heart/coronary.vtp.gz');
      let a = [];
      for await (const v of multiGeometry) {
        a.push(v);
      }
      setMultiGeo(a);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if(geo && ref.current) {
      ref.current.copy(geo);
    }
  }, [geo]);

  const data = useMemo(() => {
    return multiGeo && Array.from(multiGeo);
  }, [multiGeo]);

  return(
    <Canvas>
      <Scene>
        <ambientLight intensity={0.2} color={0xffffff} />
        <hemisphereLight intensity={0.4} />
        <group position={useMemo(() => (new Vector3(...center)), [center])}>
          <mesh>
            <bufferGeometry ref={ref} attach="geometry"/>
            <meshPhongMaterial color={'#dd4a39'} transparent={true}/>
          </mesh>
          {
            data && data.map((geometry: any) => (
              <mesh key={geometry.userData.id} userData={geometry.userData.id}>
                <MultiGeometry geometry={geometry}/>
                <meshPhongMaterial color={new Color(Math.random() * 0xffffff)} transparent={true}/>
              </mesh>
            ))
          }
        </group>
      </Scene>
    </Canvas>
  );
};

export default HeartView;
