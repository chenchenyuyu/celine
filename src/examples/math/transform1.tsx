import React, { useEffect } from "react";
import { matrixArrayToCssMatrix, multiplyArrayOfMatrices } from './matrix';
import { rotateAroundZAxis, translate, scale } from './transformationMatrix';

import './transform1.css';

// NOTE:  WebGL 和 CSS3 中的矩阵相乘需要和变换发生的顺序相反。例如，缩放对象到 80%，向下移动 200 像素，然后绕原点旋转 90 度在伪代码中应该像下面这样。
// transformation = rotate * translate * scale

const Transform1 = () => {

  useEffect(() => {
    // let x = 150;
    // let y = 100;
    // let z = 0;

    // let translationMatrix = [
    //     1,    0,    0,   0,
    //     0,    1,    0,   0,
    //     0,    0,    1,   0,
    //     x,    y,    z,   1
    // ];

    // Grab the DOM element
    let moveMe = document.getElementById('move-me');
    // Returns a result like: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 100, 200, 0, 1);"
  
    let transformMatrix = multiplyArrayOfMatrices([

      // Uncomment below to reverse the transformation:  // 逆矩阵
      // scale(1.25, 1.25, 1.25),           // Step 6: scale back up
      // translate(0, -200, 0),             // Step 5: move back up
      // rotateAroundZAxis(-Math.PI * 0.5), // Step 4: rotate back
      
      rotateAroundZAxis(Math.PI * 0.5),    // Step 3: rotate around 90 degrees
      translate(0, 200, 0),                // Step 2: move down 100 pixels
      scale(2, 2, 2),                // Step 1: scale down
    ])

    let matrix3dRule = matrixArrayToCssMatrix(transformMatrix);
    // Set the transform
    if(moveMe) {
      moveMe.style.transform = matrix3dRule;
    }
  }, []);

  return (<div className="transform1">
  <div className='transformable ghost'>
    <h2>Move me with a matrix</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
      officia deserunt mollit anim id est laborum.
    </p>
  </div>

  <div id='move-me' className='transformable' style={{backgroundColor: 'pink'}}>
    <h2>Move me with a matrix1111111</h2>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
      exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute
      irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
      pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
      officia deserunt mollit anim id est laborum.
    </p>
  </div>
  </div>);
};

export default Transform1;