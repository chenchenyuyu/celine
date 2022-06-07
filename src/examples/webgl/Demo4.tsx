import React, { useCallback, useEffect, useLayoutEffect, useMemo } from "react";
import { mat4 } from 'gl-matrix';

// TODO: 待完善，旋转处理
interface IProgramInfo {
  program: WebGLProgram;
  attribLocations: {
      vertexPosition: number;
      vertexColor: number;
  };
  uniformLocations: {
      projectionMatrix: WebGLUniformLocation | null;
      modelViewMatrix: WebGLUniformLocation | null;
  };
}

interface IBuffers {
  position: WebGLBuffer | null,
  color: WebGLBuffer | null
}


// NOTE: 1. 顶点着色器, 着色器：GLSL编写语言
// NOTE: 2. 片段着色器, 着色器程序 = 顶点着色器+片段着色器
// NOTE: 3. 给顶点着色: 每个顶点有位置和颜色信息, 在默认情况下，所有像素的颜色（以及它所有的属性，包括位置）都由线性插值计算得来，自动形成平滑的渐变
// NOTE: 4. demo3新增：修改initBuffers


const Demo4 = () => {
  let squareRotation = 0;
  const canvas: HTMLCanvasElement | null = document.querySelector('#glcanvas');
  const gl = canvas && canvas.getContext('webgl');
  const vsSource = `
    attribute vec3 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix* uModelViewMatrix * vec4(aVertexPosition, 1.0);
      vColor = aVertexColor;
    }
  `;

  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `;

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

    const shaderProgram = useMemo(() => gl && initShaderProgram(gl, vsSource, fsSource),[initShaderProgram, gl, fsSource, vsSource]) as WebGLProgram;

    const initBuffers = useCallback((gl: WebGLRenderingContext) => {
      // Create a buffer for the square's positions.
      const positionBuffer = gl.createBuffer();
      // Select the positionBuffer as the one to apply buffer
      // operations to from here out.
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      // Now create an array of positions for the square.
      const vertices = [
        1.0,  1.0,
       -1.0,  1.0,
        1.0, -1.0,
       -1.0, -1.0,
      ];
      // Now pass the list of positions into WebGL to build the
      // shape. We do this by creating a Float32Array from the
      // JavaScript array, then use it to fill the current buffer.
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  
      // NOTE: demo3新增color
      const colorBuffer = gl.createBuffer();
      const colors = [
        1.0,  1.0,  1.0,  1.0,    // 白
        1.0,  0.0,  0.0,  1.0,    // 红
        0.0,  1.0,  0.0,  1.0,    // 绿
        0.0,  0.0,  1.0,  1.0,    // 蓝
      ];
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors),gl.STATIC_DRAW);
  
      return {
       position: positionBuffer,
       color: colorBuffer,
      }
    }, []);

    const programInfo = useMemo(() => {
      if(!gl) {
        return;
      }
      return {
        program: shaderProgram,
        attribLocations: {
          vertexPosition: gl!.getAttribLocation(shaderProgram, 'aVertexPosition'),
          vertexColor: gl!.getAttribLocation(shaderProgram, 'aVertexColor'),
        },
        uniformLocations: {
          projectionMatrix: gl!.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
          modelViewMatrix: gl!.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        },
      }
    }, [shaderProgram, gl]);

    const buffers = useMemo(() => gl && initBuffers(gl), [gl, initBuffers]) as IBuffers;
    

  // draw the scene
  // 着色器+buffers数据
  const drawScene = useCallback((gl: WebGLRenderingContext, programInfo: IProgramInfo, buffers: IBuffers, deltaTime: number) => {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear the canvas before we start drawing on it.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Create a perspective matrix, a special matrix that is
    // used to simulate the distortion of perspective in a camera.
    // Our field of view is 45 degrees, with a width/height
    // ratio that matches the display size of the canvas
    // and we only want to see objects between 0.1 units
    // and 100 units away from the camera.

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0;
    const projectionMatrix = mat4.create();
      
    // note: glmatrix.js always has the first argument
    // as the destination to receive the result.
    mat4.perspective(projectionMatrix,
      fieldOfView,
      aspect,
      zNear,
      zFar);
  
      // Set the drawing position to the "identity" point, which is
    // the center of the scene.
    const modelViewMatrix = mat4.create();

    // Now move the drawing position a bit to where we want to
    // start drawing the square.

    mat4.translate(modelViewMatrix,     // destination matrix
      modelViewMatrix,     // matrix to translate
      [-0.0, 0.0, -6.0]);  // amount to translate

    // mat4.rotate(modelViewMatrix,  // destination matrix
    //   modelViewMatrix,  // matrix to rotate
    //   squareRotation,   // amount to rotate in radians
    //   [0, 0, 1]);       // axis to rotate around

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexPosition,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // NOTE: demo3新增
    // Tell WebGL how to pull out the colors from the color buffer
    // into the vertexColor attribute.
    {
      const numComponents = 4;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
      gl.vertexAttribPointer(
          programInfo.attribLocations.vertexColor,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    }

    // Tell WebGL to use our program when drawing
    gl.useProgram(programInfo.program);
    // Set the shader uniforms
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.projectionMatrix,
        false,
        projectionMatrix);
    gl.uniformMatrix4fv(
        programInfo.uniformLocations.modelViewMatrix,
        false,
        modelViewMatrix);
    {
      const offset = 0;
      const vertexCount = 4;
      gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
    }

    // Update the rotation for the next draw
    // squareRotation += deltaTime;

    var then = 0;

    // Draw the scene repeatedly
    function render(now: any) {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;
  
      drawScene(gl, programInfo, buffers, deltaTime);
  
      requestAnimationFrame(render);
    }
  }, []);

  useLayoutEffect(() => {
    if(gl && programInfo) {
      // Draw the scene
      drawScene(gl, programInfo, buffers, 0);
    }
  }, [gl, drawScene, programInfo, buffers, canvas]);

  // creates a shader of the given type, uploads the source and
  // compiles it.  
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

  return(
    <canvas id="glcanvas" width="640" height="480" style={{ backgroundColor: '#000', border: '2px solid #fff'}} />
  );
};

export default Demo4;
