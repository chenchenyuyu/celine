import React, { useCallback, useEffect } from "react";
import { mat4 } from 'gl-matrix';


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
const Demo3 = () => {

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

  // draw the scene
  // 着色器+buffers数据
  const drawScene = useCallback((gl: WebGLRenderingContext, programInfo: IProgramInfo, buffers: IBuffers) => {
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
  }, []);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = document.querySelector('#glcanvas');
    if(!canvas) return;

    const gl = canvas.getContext('webgl');

    if (!gl) {
      alert('Unable to initialize WebGL. Your browser or machine may not support it.');
      return;
    }

    // 1. Vertex shader program 顶点着色器
    // 作用：将输入顶点从原始坐标系转换到 WebGL 使用的缩放空间 (clipspace) 坐标系，其中每个轴的坐标范围从-1.0 到 1.0，并且不考虑纵横比，实际尺寸或任何其他因素。
    // const vsSource = `
    //   attribute vec4 aVertexPosition;
    //   uniform mat4 uModelViewMatrix;
    //   uniform mat4 uProjectionMatrix;

    //   void main() {
    //     gl_Position = uModelViewMatrix * uProjectionMatrix * aVertexPosition;
    //   }
    // `;
    // NOTE: demo3新增，修改顶点着色器，使得着色器可以从颜色缓冲区中正确取出颜色
    // 每个顶点都与一个颜色数组中的数值相连接
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

    // 2. Fragment shader program 片段着色器
    // 作用：确定像素的颜色，通过指定应用到像素的纹理元素（也就是图形纹理中的像素），获取纹理元素的颜色，然后将适当的光照应用于颜色。
    // NOTE: demo3新增为使每个像素都得到插值后的颜色，我们只需要在此从 vColor 变量中获取这个颜色的值：
    const fsSource = `
      varying lowp vec4 vColor;
      void main(void) {
        gl_FragColor = vColor;
      }
    `;
    // 3. 初始化着色器
    // Initialize a shader program; this is where all the lighting
    // for the vertices and so forth is established. 
    const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
    
    if(!shaderProgram) return;

    // Collect all the info needed to use the shader program.
    // Look up which attribute our shader program is using
    // for aVertexPosition and look up uniform locations.
    const programInfo = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
      },
    };
    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);

    // Draw the scene
    drawScene(gl, programInfo, buffers);

  }, [drawScene, initShaderProgram]);

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

  // Initialize the buffers we'll need. For this demo, we just
  // have one object -- a simple two-dimensional square.
  const initBuffers = (gl: WebGLRenderingContext) => {
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
  };

  return(
    <canvas id="glcanvas" width="640" height="480" style={{ backgroundColor: '#000', border: '2px solid #000'}} />
  );
};

export default Demo3;
