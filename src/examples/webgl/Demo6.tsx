import React, { useCallback, useEffect } from "react";
import { mat4 } from 'gl-matrix';

import loadImage from 'utils/loadImage';

interface IProgramInfo {
  program: WebGLProgram;
  attribLocations: {
      vertexPosition: number;
      // vertexColor: number;
      textureCoord: number;
  };
  uniformLocations: {
      projectionMatrix: WebGLUniformLocation | null;
      modelViewMatrix: WebGLUniformLocation | null;
      uSampler: WebGLUniformLocation | null;
  };
}

interface IBuffers {
  position: WebGLBuffer | null,
  // color: WebGLBuffer | null,
  indices: WebGLBuffer | null,
  textureCoord: WebGLBuffer | null,
}

// NOTE: 1. 顶点着色器, 着色器：GLSL编写语言
// NOTE: 2. 片段着色器, 着色器程序 = 顶点着色器+片段着色器
// NOTE: 3. 给顶点着色: 每个顶点有位置和颜色信息, 在默认情况下，所有像素的颜色（以及它所有的属性，包括位置）都由线性插值计算得来，自动形成平滑的渐变
// NOTE: 4. demo3新增：修改initBuffers
const Demo6 = () => {
  let cubeRotation = 0.0;

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
  const drawScene = useCallback((gl: WebGLRenderingContext, programInfo: IProgramInfo, buffers: IBuffers, texture: WebGLTexture | null, deltaTime: number) => {
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
    mat4.rotate(modelViewMatrix,  // destination matrix
      modelViewMatrix,  // matrix to rotate
      cubeRotation,     // amount to rotate in radians
      [0, 0, 1]);       // axis to rotate around (Z)
    mat4.rotate(modelViewMatrix,  // destination matrix
      modelViewMatrix,  // matrix to rotate
      cubeRotation * .7, // amount to rotate in radians
      [0, 1, 0]);       // axis to rotate around (X)

    // Tell WebGL how to pull out the positions from the position
    // buffer into the vertexPosition attribute.
    {
      const numComponents = 3;
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

    // // NOTE: demo3新增
    // // Tell WebGL how to pull out the colors from the color buffer
    // // into the vertexColor attribute.
    // {
    //   const numComponents = 4;
    //   const type = gl.FLOAT;
    //   const normalize = false;
    //   const stride = 0;
    //   const offset = 0;
    //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    //   gl.vertexAttribPointer(
    //       programInfo.attribLocations.vertexColor,
    //       numComponents,
    //       type,
    //       normalize,
    //       stride,
    //       offset);
    //   gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    // }

    // NOTE:demo6新增, 读取纹理
    // Tell WebGL how to pull out the texture coordinates from
    // the texture coordinate buffer into the textureCoord attribute.
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const stride = 0;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
      gl.vertexAttribPointer(
          programInfo.attribLocations.textureCoord,
          numComponents,
          type,
          normalize,
          stride,
          offset);
      gl.enableVertexAttribArray(
          programInfo.attribLocations.textureCoord);
    }

    // Tell WebGL which indices to use to index the vertices
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

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
    // Specify the texture to map onto the faces.

    // Tell WebGL we want to affect texture unit 0
    // GL 最多可同时注册 32 张纹理；gl.TEXTURE0 是第一张
    gl.activeTexture(gl.TEXTURE0);

    // Bind the texture to texture unit 0
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Tell the shader we bound the texture to texture unit 0
  
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    {
      const vertexCount = 36; // 一个面2个三角形=6个顶点=6*6=36个点
      const type = gl.UNSIGNED_SHORT;
      const offset = 0;
      gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // Update the rotation for the next draw
    cubeRotation += deltaTime;

  }, []);

  // NOTE: demo6新增，纹理加载
  // Initialize a texture and load an image.
  // When the image finished loading copy it into the texture.  
  const loadTexture = useCallback(async(gl: WebGLRenderingContext, url: string) => {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // when image loaded update into texture
    const level = 0;
    const internalFormat = gl.RGBA;
    const width = 1;
    const height = 1;
    const border = 0;
    const srcFormat = gl.RGBA;
    const srcType = gl.UNSIGNED_BYTE;
    const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);


    const image: any = await loadImage(url);

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
    // vs non power of 2 images so check if the image is a
    // power of 2 in both dimensions.
    if (isPowerOf2(image.width) && isPowerOf2(image.height)) {
      // Yes, it's a power of 2. Generate mips.
      gl.generateMipmap(gl.TEXTURE_2D);
    } else {
      // No, it's not a power of 2. Turn of mips and set
      // wrapping to clamp to edge
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
      // image.src = url;
      return texture;
  }, []);

  // 判断是否是2的倍数
  const isPowerOf2 = (value: number) => {
    return (value & (value - 1)) === 0;
  }

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
      attribute vec4 aVertexPosition;
      attribute vec2 aTextureCoord;

      uniform mat4 uModelViewMatrix;
      uniform mat4 uProjectionMatrix;

      varying highp vec2 vTextureCoord;

      void main(void) {
        gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
        vTextureCoord = aTextureCoord;
      }
  `;

    // 2. Fragment shader program 片段着色器
    // 作用：确定像素的颜色，通过指定应用到像素的纹理元素（也就是图形纹理中的像素），获取纹理元素的颜色，然后将适当的光照应用于颜色。
    // NOTE: demo3新增为使每个像素都得到插值后的颜色，我们只需要在此从 vColor 变量中获取这个颜色的值：
    const fsSource = `
      varying highp vec2 vTextureCoord;

      uniform sampler2D uSampler;

      void main(void) {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
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
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
        // vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
      },
    };
    // Here's where we call the routine that builds all the
    // objects we'll be drawing.
    const buffers = initBuffers(gl);

    let texture: any;

    const fetchTexture = async() => {
      // load texture
      texture = await loadTexture(gl, '/assets/images/cubetexture1.png');
    }
    fetchTexture();

    // Draw the scene
    let then = 0;

    // Draw the scene repeatedly
    function render(now: any) {
      now *= 0.001;  // convert to seconds
      const deltaTime = now - then;
      then = now;
      if(gl) {
        drawScene(gl, programInfo, buffers, texture, deltaTime);
      }
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

  }, [drawScene, initShaderProgram, loadTexture]);

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
    // const vertices = [
    //   1.0,  1.0,
    //  -1.0,  1.0,
    //   1.0, -1.0,
    //  -1.0, -1.0,
    // ];
    // NOTE: demo5新增，顶点数组
    const vertices = [
      // Front face
      -1.0, -1.0,  1.0,
      1.0, -1.0,  1.0,
      1.0,  1.0,  1.0,
      -1.0,  1.0,  1.0,

      // Back face
      -1.0, -1.0, -1.0,
      -1.0,  1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0, -1.0, -1.0,

      // Top face
      -1.0,  1.0, -1.0,
      -1.0,  1.0,  1.0,
      1.0,  1.0,  1.0,
      1.0,  1.0, -1.0,

      // Bottom face
      -1.0, -1.0, -1.0,
      1.0, -1.0, -1.0,
      1.0, -1.0,  1.0,
     -1.0, -1.0,  1.0,

      // Right face
      1.0, -1.0, -1.0,
      1.0,  1.0, -1.0,
      1.0,  1.0,  1.0,
      1.0, -1.0,  1.0,

     // Left face
      -1.0, -1.0, -1.0,
      -1.0, -1.0,  1.0,
      -1.0,  1.0,  1.0,
      -1.0,  1.0, -1.0
    ];
    // Now pass the list of positions into WebGL to build the
    // shape. We do this by creating a Float32Array from the
    // JavaScript array, then use it to fill the current buffer.
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // NOTE: demo3新增color
    // const colorBuffer = gl.createBuffer();

    // const colors = [
    //   1.0,  1.0,  1.0,  1.0,    // 白
    //   1.0,  0.0,  0.0,  1.0,    // 红
    //   0.0,  1.0,  0.0,  1.0,    // 绿
    //   0.0,  0.0,  1.0,  1.0,    // 蓝
    // ];
    // NOTE: demo5新增color
    // const colors = [
    //   [1.0,  1.0,  1.0,  1.0],    // Front face: white
    //   [1.0,  0.0,  0.0,  1.0],    // Back face: red
    //   [0.0,  1.0,  0.0,  1.0],    // Top face: green
    //   [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
    //   [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
    //   [1.0,  0.0,  1.0,  1.0]     // Left face: purple
    // ];

    // let generatedColors = [] as number[];

    // for (let j = 0; j < 6; j++) {
    //   let c = colors[j];
    
    //   for (let i = 0; i < 4; i++) {
    //     generatedColors = generatedColors.concat(c);
    //   }
    // }

    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);

    // NOTE: demo6新增
    // Now set up the texture coordinates for the faces.
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    const textureCoordinates = [
      // Front
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Back
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Top
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Bottom
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Right
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
      // Left
      0.0,  0.0,
      1.0,  0.0,
      1.0,  1.0,
      0.0,  1.0,
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);

    // NOTE: demo5新增index, 三角形数组
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // This array defines each face as two triangles, using the
    // indices into the vertex array to specify each triangle's
    // position.
    // 一个面使用两个三角形渲染，这个面由2*6=12个三角形组成
    const indices = [
      0,  1,  2,      0,  2,  3,    // front
      4,  5,  6,      4,  6,  7,    // back
      8,  9,  10,     8,  10, 11,   // top
      12, 13, 14,     12, 14, 15,   // bottom
      16, 17, 18,     16, 18, 19,   // right
      20, 21, 22,     20, 22, 23    // left
    ];

    // Now send the element array to GL
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    return {
     position: positionBuffer,
    //  color: colorBuffer,
     indices: indexBuffer,
     textureCoord: textureCoordBuffer,
    }
  };

  return(
    <div className="demo6">
      <div>Using textures in WebGL</div>
      <canvas id="glcanvas" width="640" height="480" style={{ backgroundColor: '#000', border: '2px solid yellow'}} />
    </div>
  );
};

export default Demo6;
