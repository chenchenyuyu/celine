import React, { useRef, useEffect } from 'react';
import { Vector3, Raycaster } from 'three';
import { useFrame } from '@react-three/fiber';

// origin mesh 
// hit mesh
// cylinder mesh

const pointDist = 100;
const origVec = new Vector3();
const dirVec = new Vector3();
const raycaster = new Raycaster();

const speed = 2;

const AddRaycaster = ({ containerRay }: { containerRay: any }) => {
  const objMesh = useRef<any>();
  const origMesh = useRef<any>();
  const hitMesh = useRef<any>();
  const cylinderMesh = useRef<any>();

  const xDir = ( Math.random() - 0.5 );
	const yDir = ( Math.random() - 0.5 );
	const zDir = ( Math.random() - 0.5 );

  useEffect(() => {
    if (!objMesh.current || !origMesh.current || !hitMesh.current || !cylinderMesh.current) {
      return
    }
    hitMesh!.current.scale.multiplyScalar( 0.25 );
	  origMesh!.current.scale.multiplyScalar( 0.5 );
    // set transforms
    origMesh.current.position.set(pointDist, 0, 0 );
    objMesh.current.rotation.x = Math.random() * 10;
    objMesh.current.rotation.y = Math.random() * 10;
    objMesh.current.rotation.z = Math.random() * 10;
  }, [hitMesh, origMesh, objMesh]);

  useFrame((_, deltaTime) => {
    const obj = objMesh.current;
    if(!obj || !origMesh.current || !cylinderMesh.current || !hitMesh.current || !containerRay.current) {
      return;
    }

    obj.rotation.x += xDir * 0.0001 * speed * deltaTime;
    obj.rotation.y += yDir * 0.0001 * speed * deltaTime;
    obj.rotation.z += zDir * 0.0001 * speed * deltaTime;

    origMesh.current.updateMatrixWorld();
    origVec.setFromMatrixPosition( origMesh.current.matrixWorld );
    dirVec.copy(origVec).multiplyScalar( - 1 ).normalize();

    raycaster.set( origVec, dirVec );
    raycaster.firstHitOnly = true;
    const res = raycaster.intersectObject(containerRay.current, true );
    const length = res.length ? res[ 0 ].distance : pointDist;

    hitMesh.current.position.set( pointDist - length, 0, 0 );

    cylinderMesh.current.position.set( pointDist - ( length / 2 ), 0, 0 );
    cylinderMesh.current.scale.set( 1, length, 1 );

    cylinderMesh.current.rotation.z = Math.PI / 2;
  });

  return(
    <group ref={objMesh}>
      <mesh ref={origMesh}>
        <sphereGeometry args={[5, 40, 40]}/>
        <meshBasicMaterial color={0xffffff}/>
      </mesh>
      <mesh ref={hitMesh}>
        <sphereGeometry args={[5, 40, 40]}/>
        <meshBasicMaterial color={0xFFFF00}/>
      </mesh>
      <mesh ref={cylinderMesh}>
        <cylinderGeometry args={[0.1, 0.1]}/>
        <meshBasicMaterial color={0xffffff} transparent={true} opacity={0.25}/>
      </mesh>
    </group>
  );
};

export default AddRaycaster;