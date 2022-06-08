import React, { useEffect } from "react";

const Demo1 = () => {

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#glcanvas');
    if (!canvas) return;
    // Initialize the GL context
    const gl = canvas.getContext('webgl');
    // If we don't have a GL context, give up now
    // Only continue if WebGL is available and working

    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }
    // Set clear color to black, fully opaque
    gl.clearColor(0.4, 0, 0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
  }, []);
  
  return(
    <div className="demo1">
      <div>Getting started with WebGL</div>
      <canvas id="glcanvas" width={640} height={480}></canvas>
    </div>
  );
};

export default Demo1;