import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useThree, extend, useFrame } from '@react-three/fiber';
import { BufferGeometry, Vector3, AxesHelper, CameraHelper, DoubleSide } from 'three';
import { MeshBVHVisualizer } from 'three-mesh-bvh';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';
// import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { CSS2DObject } from 'package/3d/renderers/CSS2DRenderer';

import { SingleLabelLoader, MultiLabelLoader } from 'package/3d/loaders/LabelLoader';
import Html from 'package/3d/Html';
import useBVH from 'hooks/useBVH';

import { coronaryMap } from './MAP';
import useCSS2DRenderer from 'hooks/useCSS2DRenderer';

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

const styleRadio = (clicked: boolean) => ({
  width: '100px',
  height: '30px',
  lineHeight: '30px',
  textAlgin: 'center',
  display: 'inline-block',
  color: '#fff',
  background: clicked ? '#0164fe' : '#222a42',
  marginRight: '4px',
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

interface IRadio {
  clicked: boolean,
  setClicked: (v: boolean) => void,
  children: React.ReactNode,
}

const Radio = ({ clicked, setClicked, children }: IRadio) => {
  return(
    <div style={styleRadio(clicked)} onClick={() => setClicked(!clicked)}>{children}</div>
  );
};

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

// const Helper = ({ visibleBVH }: { visibleBVH: boolean }) => {
//   const [bvhHelper] = useState(() => new MeshBVHVisualizer());
//   const { scene } = useThree();

//   useEffect(() => {
//     if(visibleBVH) {
//       scene.add(bvhHelper);
//     } else {
//       scene.remove(bvhHelper);
//     }
//     return () => {
//       scene.remove(bvhHelper);
//     }
//   }, [visibleBVH, scene, bvhHelper]);

//   return null;
// };


const CSS2dRender = () => {
  useCSS2DRenderer();
  return null;
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

interface IMesh {
  id: number,
  bvh?: boolean,
  position: Vector3,
  geometry: BufferGeometry,
  focusId: number,
  focused: boolean,
  clicked2dObject: boolean,
  setFocusId: (v: number) => void,
  clickedPoint: (e: any) => void,
}

const Mesh = ({ id, bvh, position, focusId, clicked2dObject, geometry, focused, setFocusId, clickedPoint }: IMesh) => {
  const dummyRef = useRef<any>();
  const ref = useRef<any>();

  useBVH(bvh ? ref : dummyRef, {
    strategy: 'CENTER'
  });

  useEffect(() => {
    if(ref.current && position && clicked2dObject) {
      const div = document.createElement('div');
      div.className = 'label';
      div.textContent = `${id}`;
      div.style.color = '#fff';
      div.style.borderRadius = '4px';
      div.style.pointerEvents = "none";
      div.style.padding = '1px 2px';
      div.style.backgroundColor = 'blue';
      div.style.opacity = '0.8';
      const object = new CSS2DObject(div);
      object.position.copy(position);
      ref.current.add(object);

      return () => {
        ref!.current.remove(object);
      }
    }
  }, [ref, id, position, clicked2dObject]);

  return(
    <mesh
      ref={ref}
      key={id}
      onClick={(e) => {
      if(id !== focusId) {
        setFocusId(id);
      }
      clickedPoint(e);}}
    >
    <MultiGeometry geometry={geometry}/>
    <meshPhongMaterial color={focused ? '#00FF00' : '#D3D3D3'} transparent={false}/>
  </mesh> 
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

  // radio state
  const [clickedHtml, setClickedHtml] = useState(false);
  const [clicked2dObject, setClicked2dObject] = useState(false);
  const [clickedBVH, setClickedBVH] = useState(false);
  const [clickedBVHHelper, setBVHHelper] = useState(false);

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
      <div style={{position: 'absolute', left: '10px', top: '10px', width: '80px', height: '100%', zIndex: 2}}>
      {
        data.map(({ userData: { id } }) => (
          <Button key={id} id={id} focusId={focusId} setFocusId={setFocusId}>{coronaryMap[`${id}`]['en']}</Button>
        ))
      }
      </div>
      <div style={{position: 'absolute', right: '10px', top: '10px', width: '200px', height: '100%', zIndex: 2}}>
        {
           data.map(({ userData: { id } }) => (
            <Item key={id} id={id} focusId={focusId} setFocusId={setFocusId}>{coronaryMap[`${id}`]['zh']}</Item>
          ))
        }
      </div>
      <div style={{position: 'absolute', top: '20px', left: '80px', height: '60px', zIndex: 2}}>
       <Radio clicked={clickedHtml} setClicked={() => { setClickedHtml(!clickedHtml); setClicked2dObject(false); }}>
         {
           !clickedHtml ? '隐藏Label': '显示Label'
         }
       </Radio>
       <Radio clicked={clicked2dObject} setClicked={() => { setClicked2dObject(!clicked2dObject); setClickedHtml(false); }}>
         {
           !clicked2dObject ? '隐藏2dObject': '显示2dObject'
         }
       </Radio>
       <Radio clicked={clickedBVH} setClicked={setClickedBVH}>BVH</Radio>
       <Radio clicked={clickedBVHHelper} setClicked={setBVHHelper}>BVHHelper</Radio>
      </div>
       <Canvas style={{position: 'absolute', top: '0px', right: '0px', bottom: '0px'}}>
        {
          clicked2dObject && data &&
            <CSS2dRender/>
        }
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
                    <Mesh
                      id={id}
                      bvh={clickedBVH}
                      key={id}
                      position={geometry.boundingSphere.center}
                      geometry={geometry}
                      focusId={focusId}
                      clicked2dObject={clicked2dObject}
                      setFocusId={setFocusId}
                      focused={focused}
                      clickedPoint={clickedPoint}
                    />
                    {/* <mesh 
                      key={id}
                      userData={id}
                      onClick={(e) => {
                        if(id !== focusId) {
                          setFocusId(id);
                        }
                        clickedPoint(e);}}
                      >
                      <MultiGeometry geometry={geometry}/>
                      <meshPhongMaterial color={focused ? '#00FF00' : '#D3D3D3'} transparent={false}/>
                    </mesh> */}
                    {
                      clickedHtml &&
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
                    }
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
