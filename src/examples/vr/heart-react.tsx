import * as THREE from 'three';
import React, { useState, useEffect, useCallback, useLayoutEffect } from 'react';
import { SingleLabelLoader } from 'package/3d/loaders/LabelLoader';

const VR = () => {
 const [ scene ] = useState(() => new THREE.Scene());
 const [ camera ] = useState(() => new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 ));
 const [ renderer ] = useState(() => new THREE.WebGLRenderer());

 const [geo, setGeo] = useState<THREE.BufferGeometry>();

 useEffect(() => {
   if(renderer) {
     // 添加canvas在dom tree里面
   const element = document.querySelector('.App');
   if(element) {
     element.appendChild( renderer.domElement );
     }
   }
 }, []);

 const fetchResult = useCallback(async() => {
  const geometry = await SingleLabelLoader('http://192.168.1.7:8080/heart/heart.vtp.gz');
  setGeo(geometry);
 }, []);

 useLayoutEffect(() => {
   fetchResult();
 }, []);

 useEffect(() => {
  // axes helper
  const axesHelper = new THREE.AxesHelper( 500 );
  scene.add( axesHelper );

  // light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  const hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.3);
  const p1 = new THREE.PointLight(0xffffff, 0.4);
  const p2 = new THREE.PointLight(0xffffff, 0.4);

  p1.position.set(-1000, -1000, -1000);
  p2.position.set(1000, 1000, 1000);

  scene.add(ambientLight);
  scene.add(hemiLight);
  scene.add(p1);
  scene.add(p2);

  // camera
  camera.zoom = 2;
  camera.up.set(0, 0, 1);
  camera.position.set(0, -300, 0);
  camera.lookAt(0, 0, 0);
 }, []);

 useEffect(() => {
  if (geo) { //geomerty loaded?
   const material = new THREE.MeshBasicMaterial( { color: 0x00ffee } );
   const mesh = new THREE.Mesh( geo, material );
   // center
   const group = new THREE.Group();
   const center = geo.boundingSphere!.center;

   group.position.set(-center.x, -center.y, -center.z);
   group.add(mesh);

   scene.add(group);
  }
 }, [geo]);

 useEffect(() => {
   renderer.setSize( window.innerWidth, window.innerHeight );
   renderer.render( scene, camera );
 }, []);

 return(
  <div>heart vr demo</div>
 );
};

export default VR;