function Find(target, array) {
  let i = array.length - 1; // y坐标
  let j = 0; // x坐标
  return compare(target, array, i, j);
}

function compare(target, array, i, j) {
  if (array[i] === undefined || array[i][j] === undefined) {
    return false;
  }
  const temp = array[i][j];
  if (target === temp) {
    return true;
  }
  else if (target > temp) {
    return compare(target, array, i, j+1);
  }
  else if (target < temp) {
    return compare(target, array, i-1, j);
  }
}