// import glslify from 'glslify'
import React, { useEffect, useCallback } from "react";
import loadImage from "utils/loadImage";

import vertexShader from '../shaders/demo7.vert.glsl';
import fragShader from '../shaders/demo7.frag.glsl';

interface IProgramInfo {
  program: WebGLProgram;
  attribLocations: {
      vertexPosition: number;
      textureCoord: number;
  };
  uniformLocations: {
    resolutionLocation: WebGLUniformLocation | null;
  }
}

interface IBuffers {
  position: WebGLBuffer | null,
  textureCoord: WebGLBuffer | null,
}

const Demo7 = () => {
  const loadShader = (gl: WebGLRenderingContext, type: number, source: string) => {
    const shader = gl.createShader(type);

    if(!shader) return;
    // Send the source to the shader object
  
    gl.shaderSource(shader, source);
  
    // Compile the shader program
  
    gl.compileShader(shader);
  
    // See if it compiled successfully
  
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  const initShaderProgram = useCallback((gl: WebGLRenderingContext, vsSource: string, fsSource: string) => {
    const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
    const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
    // Create the shader program
    const shaderProgram = gl.createProgram();
    if(!shaderProgram || !vertexShader || !fragmentShader) return;
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
      // If creating the shader program failed, alert
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
      return null;
    }
    return shaderProgram;
    }, []);

  const initBuffers = useCallback((gl: WebGLRenderingContext, image: HTMLImageElement) => {
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, image.width, image.height);

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      0.0,  0.0,
      1.0,  0.0,
      0.0,  1.0,
      0.0,  1.0,
      1.0,  0.0,
      1.0,  1.0,
    ]), gl.STATIC_DRAW);

    return {
      position: positionBuffer,
      textureCoord: texcoordBuffer,
    }
  }, []);

  useEffect(() => {
    const fetchImage = async() => {
      const image: any = await loadImage('/assets/images/texture2.png');

      const canvas: HTMLCanvasElement | null = document.querySelector('#glcanvas');

      if(!canvas) return;
      const gl = canvas.getContext('webgl');
      if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
      }
  
      const shaderProgram = initShaderProgram(gl, vertexShader, fragShader);
      
      if(!shaderProgram) return;
  
      const programInfo = {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl.getAttribLocation(shaderProgram, "a_position"),
          textureCoord: gl.getAttribLocation(shaderProgram, "a_texCoord"),
        },
        uniformLocations: {
          resolutionLocation: gl.getUniformLocation(shaderProgram, "u_resolution"),
        }
      };
  
      const buffers = initBuffers(gl, image);
  
      const texture = loadTexture(gl, image);
  
      drawScene(gl, programInfo, buffers, texture);
    };

    fetchImage();

  }, [initBuffers, initShaderProgram]);

  const drawScene = (gl: WebGLRenderingContext, programInfo: IProgramInfo, buffers: IBuffers, texture: WebGLTexture | null) => {
    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
     // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(programInfo.program);

    {
      // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
      let size = 2;          // 2 components per iteration
      let type = gl.FLOAT;   // the data is 32bit floats
      let normalize = false; // don't normalize the data
      let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      let offset = 0;        // start at the beginning of the buffer
      // Bind the position buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, size, type, normalize, stride, offset);
      // Turn on the position attribute
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    {
      // Tell the texcoord attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
      let size = 2;          // 2 components per iteration
      let type = gl.FLOAT;   // the data is 32bit floats
      let normalize = false; // don't normalize the data
      let stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
      let offset = 0;        // start at the beginning of the buffer
      // bind the texcoord buffer.
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, size, type, normalize, stride, offset);
      // Turn on the texcoord attribute
      gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    // Tell WebGL we want to affect texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    
    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);

     // set the resolution
    gl.uniform2f(programInfo.uniformLocations.resolutionLocation, gl.canvas.width, gl.canvas.height);

    // Draw the rectangle.
    let primitiveType = gl.TRIANGLES;
    let offset = 0;
    let count = 6;
    gl.drawArrays(primitiveType, offset, count);
  };

  const setRectangle = (gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) => {
    let x1 = x;
    let x2 = x + width;
    let y1 = y;
    let y2 = y + height;
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
       x1, y1,
       x2, y1,
       x1, y2,
       x1, y2,
       x2, y1,
       x2, y2,
    ]), gl.STATIC_DRAW);
  }

  const loadTexture = (gl: WebGLRenderingContext, image: HTMLImageElement) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Set the parameters so we can render any size image.
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Upload the image into the texture.
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    return texture;
  }

  return(
    <div className="demo7">
      <div>webgl image texture</div>
      <canvas id="glcanvas" width="640" height="480" style={{backgroundColor: '#000', border: '2px solid yellow'}}/>
    </div>
  );
}

export default Demo7;

