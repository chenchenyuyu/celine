import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { BufferGeometry, Vector3, AxesHelper, Color } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { SingleLabelLoader, MultiLabelLoader } from 'package/3d/loaders/LabelLoader';
import Html from 'package/3d/Html';

extend({ TrackballControls });

const vesselNameSortMap = {
  "LM": 1,
  "LAD": 2,
  "D1": 3,
  "D2": 4,
  "LCX": 5,
  "OM1": 6,
  "OM2": 7,
  "RI": 8,
  "RCA": 9,
  "CB": 10,
  "AM1": 11,
  "AM2": 12,
  "R-PDA": 13,
  "R-PLB": 14,
  "L-PDA": 15,
  "L-PLB": 16,
};

const style = (clicked: boolean) => ({
  width: '60px',
  height: '30px',
  lineHeight: '30px',
  textAlgin: 'center',
  color: '#fff',
  background: clicked ? '#0164fe' : '#222a42',
  marginBottom: '10px',
  borderRadius: '4px',
  cursor: 'pointer',
});

const Button = ({ id, setFocusId, children }: { id: number, setFocusId:(id: number) => void, children: React.ReactNode }) => {
  const [clicked, setClicked] = useState(false);
  return(
    <div style={style(clicked)} onClick={() => setFocusId(id)} onPointerOver={() => setClicked(true)} onPointerOut={() => setClicked(false)}>{children}</div>
  );
}

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
  const [focusId, setFocusId] = useState<number>();

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
    <div style={{position: 'relative', top: '0px', right: '0px', bottom: '0px', height: '100%'}}>
      <div style={{position: 'absolute', left: '10px', top: '10px', width: '80px', height: '100%', zIndex: '2'}}>
      {
        Object.entries(vesselNameSortMap).map(([key, value]) => (
          <Button id={value} setFocusId={setFocusId}>{key}</Button>
        ))
      }
      </div>
       <Canvas style={{position: 'absolute', top: '0px', right: '0px', bottom: '0px'}}>
        <Scene>
          <ambientLight intensity={0.2} color={0xffffff} />
          <hemisphereLight intensity={0.4} />
          <group position={useMemo(() => (new Vector3(...center)), [center])}>
            <mesh>
              <bufferGeometry ref={ref} attach="geometry"/>
              <meshPhongMaterial color={'#dd4a39'} transparent={true}/>
            </mesh>
            {
              data && data.map((geometry: any) => {
                const focused = focusId === Number(geometry.userData.id);
                return(
                  <>
                    <mesh key={geometry.userData.id} userData={geometry.userData.id}>
                      <MultiGeometry geometry={geometry}/>
                      <meshPhongMaterial color={new Color(Math.random() * 0xffffff)} transparent={true}/>
                    </mesh>
                    <group position={geometry.boundingSphere!.center}>
                      <Html center>
                        <span style={{ fontSize: focused ? '26px': '16px', background: focused ? '#000': 'transparent'}}>
                          {geometry.userData.id}
                        </span>
                      </Html>
                    </group>
                  </>
                )
              })
            }
          </group>
        </Scene>
      </Canvas>
    </div>
  );
};

export default HeartView;
