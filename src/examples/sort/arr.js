let arr = [1, [2, [3, 4, [5, 8]]]];
function flatten(arr) {
  console.log('arr tostring', arr.toString())
    return arr.toString().split(',');
}
console.log(flatten(arr)); //  [1, 2, 3, 4，5]
