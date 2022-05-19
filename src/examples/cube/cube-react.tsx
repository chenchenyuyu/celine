import React, { useEffect, useState } from 'react';

import * as THREE from 'three';
// import requestAnimationFrame from 'raf';

const useCube = () => {
 const [ scene ] = useState(() => new THREE.Scene());
 const [ camera ] = useState(() => new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ));

 const renderer = new THREE.WebGLRenderer();
 renderer.setSize( window.innerWidth, window.innerHeight );

 useEffect(() => {
  if(renderer) {
    // 添加canvas在dom tree里面
   const element = document.querySelector('.App');
   if(element) {
     element.appendChild( renderer.domElement );
   }
  }
 }, [renderer]);

 useEffect(() => {
  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  scene.add( cube );
 
  camera.position.z = 5;
 }, [camera, scene]);

 useEffect(() => {
  renderer.render( scene, camera );
  // cube动画
   // const checkLoop = () => {
   //  if(renderer && cube) {
   //   cube.rotation.x += 0.01;
   //   cube.rotation.y += 0.01;
   //   renderer.render( scene, camera );
   //  }
   //  requestAnimationFrame(checkLoop);
   // }
   // requestAnimationFrame(checkLoop)
 }, [renderer, scene, camera]);

};

const Cube = () => {
 const d = useCube();
 return(
  <div>cube</div>
 );
};

export default Cube;