import { useState, useLayoutEffect } from  'react';
import { useThree, useFrame } from '@react-three/fiber';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
// import { CSS2DRenderer } from 'package/3d/renderers/CSS2DRenderer'; // TODO: 待处理，renderObject异常

const useCSS2DRenderer = () => {
  const { scene, camera, size, gl } = useThree();
  const [ css2drender ] = useState(() => (new CSS2DRenderer() as unknown) as THREE.WebGLRenderer)
  const css2dElement = css2drender.domElement;
  css2dElement.className = "label-container";
  css2dElement.style.position = "absolute";
  css2dElement.style.width = "100%";
  css2dElement.style.top = "0px";
  css2dElement.style.pointerEvents = 'none';

  useLayoutEffect(() => {
      if(gl && gl.domElement.parentNode) {
        if (gl.domElement.parentNode.parentNode) {
          gl.domElement.parentNode.parentNode.prepend(css2dElement);
        }
      }
  }, [gl, css2dElement]);

  useFrame(() => {
    if (css2drender) {
      css2drender.setSize(size.width, size.height);
      css2drender.render(scene, camera);
    }
  });

  return null;
};

export default useCSS2DRenderer;