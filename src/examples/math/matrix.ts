
  // gl-matrix 更少内存开销， 性能更优，速度更快
  const matrixArrayToCssMatrix = (array: number[]) => {
    return "matrix3d(" + array.join(',') + ")";
  }

  const multiplyMatrixAndPoint = (matrix: number[], point: number[]) => {
    // 4X4
    let c0r0 = matrix[0], c1r0 = matrix[1], c2r0 = matrix[2], c3r0 = matrix[3];
    let c0r1 = matrix[4], c1r1 = matrix[5], c2r1 = matrix[6], c3r1 = matrix[7];
    let c0r2 = matrix[8], c1r2 = matrix[9], c2r2 = matrix[10], c3r2 = matrix[11];
    let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];
    
    let x = point[0], y = point[1], z = point[2], w = point[3];

    let resultX = c0r0 * x + c0r1 * y + c0r2 * z + c0r3 * w;
    let resultY = c1r0 * x + c1r1 * y + c1r2 * z + c1r3 * w;
    let resultZ = c2r0 * x + c2r1 * y + c2r2 * z + c2r3 * w;
    let resultW = c3r0 * x + c3r1 * y + c3r2 * z + c3r3 * w;

    return [resultX, resultY, resultZ, resultW];
  }

  const multiplyMatrices = (matrixA: number[], matrixB: number[]) => {
    let row0 = [matrixB[0], matrixB[1], matrixB[2], matrixB[3]];
    let row1 = [matrixB[4], matrixB[5], matrixB[6], matrixB[7]];
    let row2 = [matrixB[8], matrixB[9], matrixB[10], matrixB[11]];
    let row3 = [matrixB[12], matrixB[13], matrixB[14], matrixB[15]];
    
    // Multiply each row by the matrix
    let result0 = multiplyMatrixAndPoint( matrixA, row0 );
    let result1 = multiplyMatrixAndPoint( matrixA, row1 );
    let result2 = multiplyMatrixAndPoint( matrixA, row2 );
    let result3 = multiplyMatrixAndPoint( matrixA, row3 );
    
    // Turn the results back into a single matrix
    return [
      result0[0], result0[1], result0[2], result0[3],
      result1[0], result1[1], result1[2], result1[3],
      result2[0], result2[1], result2[2], result2[3],
      result3[0], result3[1], result3[2], result3[3],
    ];
  }

  const multiplyArrayOfMatrices = (matrices: number[][]) => {
    let inputMatrix = matrices[0];
  
    for(let i = 1; i < matrices.length; i++) {
      inputMatrix = multiplyMatrices(inputMatrix, matrices[i]);
    }
    
    return inputMatrix;
  }

  export {
    matrixArrayToCssMatrix,
    multiplyMatrixAndPoint,
    multiplyMatrices,
    multiplyArrayOfMatrices,
  }
