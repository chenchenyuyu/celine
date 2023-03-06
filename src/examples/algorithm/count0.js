const countZero = (n) => {
  let flag = 1;
  let count = 0;

  while(flag) {
    if(flag & n){ // // 把1与n按位与
        count++;
    }
   flag = flag << 1; // 向左移动flag
  }
  return count;
};
