
  let sin = Math.sin;
  let cos = Math.cos;

function rotateAroundXAxis(a: number) {
  
  return [
       1,       0,        0,     0,
       0,  cos(a),  -sin(a),     0,
       0,  sin(a),   cos(a),     0,
       0,       0,        0,     1
  ];
}

function rotateAroundYAxis(a: number) {
  
  return [
     cos(a),   0, sin(a),   0,
          0,   1,      0,   0,
    -sin(a),   0, cos(a),   0,
          0,   0,      0,   1
  ];
}

function rotateAroundZAxis(a: number) {
  
  return [
    cos(a), -sin(a),    0,    0,
    sin(a),  cos(a),    0,    0,
         0,       0,    1,    0,
         0,       0,    0,    1
  ];
}

function translate(x: number, y: number, z: number) {
	return [
	    1,    0,    0,   0,
	    0,    1,    0,   0,
	    0,    0,    1,   0,
	    x,    y,    z,   1
	];
}

function scale(w: number, h: number, d: number) {
	return [
	    w,    0,    0,   0,
	    0,    h,    0,   0,
	    0,    0,    d,   0,
	    0,    0,    0,   1
	];
}

export {
  rotateAroundXAxis,
  rotateAroundYAxis,
  rotateAroundZAxis,
  translate,
  scale,
}