import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { BufferGeometry, Vector3, AxesHelper, CameraHelper, DoubleSide } from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';

import { SingleLabelLoader, MultiLabelLoader } from 'package/3d/loaders/LabelLoader';
import Html from 'package/3d/Html';

import { coronaryMap } from './MAP';

extend({ TrackballControls });

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

const styleItem = (clicked: boolean) => ({
  width: '200px',
  height: '30px',
  lineHeight: '30px',
  textAlgin: 'center',
  color: '#fff',
  background: clicked ? '#0164fe' : '#222a42',
  marginBottom: '4px',
  borderRadius: '4px',
  cursor: 'pointer',
  borderBottom: '1px solid #000',
});

interface IButton {
  id: number,
  focusId: number,
  setFocusId:(id: number) => void,
  children: React.ReactNode,
}

const Button = ({ id, focusId, setFocusId, children }: IButton) => {
  return(
    <div style={style(id === focusId)} onClick={() => setFocusId(id)}>{children}</div>
  );
}

const Item = ({ id, focusId, setFocusId, children }: IButton) => {
  return(
    <div style={styleItem(id === focusId)} onClick={() => setFocusId(id)}>{children}</div>
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

interface IMarker {
  position: Vector3,
  center: Vector3,
  type?: string,
  radius: number,
}

const Marker = ({ position, center, type = 'torus', radius }: IMarker) => {
 const mesh = useRef<any>();
  const { camera, scene } = useThree();

  useEffect(() => {
    if(mesh.current){
      // lookAt position - center position
      mesh.current.lookAt(position.x-center.x, position.y-center.y, position.z-center.z);
      mesh.current.rotateX(-Math.PI / 2);
      const helper = new CameraHelper(camera);
      scene.add( helper );
    }
  }, [center, mesh, camera, scene, position]);

  return(
    <mesh position={position} ref={mesh} renderOrder={2}>
      {
        type === 'torus' &&
        <torusGeometry args={[5, 0.5, 10, 100]}/>
      }
      {
        type === 'sphere' &&
        <sphereGeometry args={[radius, 20, 20]}/>
      }
      {
        type === 'plane' &&
        <planeGeometry args={[30, 30]}/>
      }
      <meshBasicMaterial color={0xffff00} side={DoubleSide}/>
    </mesh>
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
  const [focusId, setFocusId] = useState<number>(-1);
  const [markerPosition, setMarkerPosition] = useState<Vector3>();


  useEffect(() => {
    // TODO: 待处理heart加载异常问题
    const fetchData = async() => {
      const geometry = await SingleLabelLoader('http://127.0.0.1:8080/heart/heart.vtp.gz');
      geometry.computeBoundingSphere();
      const center = geometry.boundingSphere!.center;
      setCenter([-center.x, -center.y, -center.z]);
      setGeo(geometry);
      const multiGeometry = await MultiLabelLoader('http://127.0.0.1:8080/heart/coronary.vtp.gz');
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

  const focusedPosition = useMemo(() => {
    if(data && data.length > 0) {
      const geometry = data.find(({ userData }) => userData.id === focusId);
      const center = geometry && geometry!.boundingSphere!.center;
      const radius = geometry && geometry!.boundingSphere!.radius;
      // setMarkerPosition(center);
      return { center, radius };
    }
  }, [data, focusId]);

  const centerVector = useMemo(() => (new Vector3(...center)), [center]);

  const clickedPoint = (e: any) => {
    const point = e.point.clone();
    setMarkerPosition(point.sub(centerVector.clone()));
    e.stopPropagation();
  }

  return(
    <div style={{position: 'relative', top: '0px', right: '0px', bottom: '0px', height: '100%'}}>
      <div style={{position: 'absolute', left: '10px', top: '10px', width: '80px', height: '100%', zIndex: '2'}}>
      {
        data.map(({ userData: { id } }) => (
          <Button id={id} focusId={focusId} setFocusId={setFocusId}>{coronaryMap[`${id}`]['en']}</Button>
        ))
      }
      </div>
      <div style={{position: 'absolute', right: '10px', top: '10px', width: '200px', height: '100%', zIndex: '2'}}>
        {
           data.map(({ userData: { id } }) => (
            <Item id={id} focusId={focusId} setFocusId={setFocusId}>{coronaryMap[`${id}`]['zh']}</Item>
          ))
        }
      </div>
       <Canvas style={{position: 'absolute', top: '0px', right: '0px', bottom: '0px'}}>
        <Scene>
          <ambientLight intensity={0.2} color={0xffffff} />
          <hemisphereLight intensity={0.4} />
          <group position={centerVector}>
            <mesh renderOrder={-1}>
              <bufferGeometry ref={ref} attach="geometry"/>
              <meshPhongMaterial color={'#dd4a39'} transparent={true} opacity={0.9} shininess={60}/>
            </mesh>
            {
              data && data.map((geometry: any) => {
                const id = geometry.userData.id;
                const focused = focusId === Number(id);
                return(
                  <>
                    <mesh 
                      key={id}
                      userData={id}
                      onClick={(e) => {
                        if(id !== focusId) {
                          setFocusId(id);
                        }
                        clickedPoint(e);}}
                      >
                      <MultiGeometry geometry={geometry}/>
                      {/* new Color(Math.random() * 0xffffff) */}
                      <meshPhongMaterial color={focused ? '#00FF00' : '#D3D3D3'} transparent={false}/>
                    </mesh>
                    <group position={geometry.boundingSphere!.center}>
                      <Html center>
                        <div 
                          onClick={() => setFocusId(id)}
                          style={{
                            width: '100px',
                            fontSize: focused ? '26px': '16px',
                            // background: focused ? 'rgba(0, 0, 0, 0.6)': 'transparent'
                          }}
                          >
                          {coronaryMap[`${id}`]['en']}
                        </div>
                      </Html>
                    </group>
                  </>
                )
              })
            }
            {
              focusedPosition && markerPosition && focusedPosition.radius &&
              <Marker 
                type='torus'
                position={markerPosition}
                center={centerVector}
                radius={focusedPosition.radius}
              />
            }
          </group>
        </Scene>
      </Canvas>
    </div>
  );
};

export default HeartView;
