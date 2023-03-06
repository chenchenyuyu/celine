import { type } from "os";

// 1. 冒泡排序
// 时间复杂度：O(n2)
// 空间复杂度:O(1)
// 稳定
const bubbleSort = (arr) => {
  for(let i = 0; i < arr.length; i++) {
    for(let j = 0; j < arr.length - 1 - i; j++) {
      if(arr[j] > arr[j+1]) {
        [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
        // let tmp = arr[j+1];
        // arr[j+1] = arr[j];
        // arr[j] = tmp;
      }
    }
  }
  return arr;
};

// 2. 选择排序
// 每次循环选取一个最小的数字放到前面的有序序列中。
// 时间复杂度：O(n2)
// 空间复杂度:O(1)

function selectionSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    [array[minIndex], array[i]] = [array[i], array[minIndex]];
  }
}
// 3. 快速排序
// 时间复杂度：平均O(nlogn)，最坏O(n2)，实际上大多数情况下小于O(nlogn)
// 空间复杂度:O(logn)（递归调用消耗）
// 不稳定
function quickSort(array) {
  if (array.length < 2) {
    return array;
  }
  const target = array[0];
  const left = [];
  const right = [];
  for (let i = 1; i < array.length; i++) {
    if (array[i] < target) {
      left.push(array[i]);
    } else {
      right.push(array[i]);
    }
  }
  return quickSort(left).concat([target], quickSort(right));
}
// 4. 插入排序
// 时间复杂度：O(n2)
// 空间复杂度:O(1)
// 稳定
function insertSort(array) {
  for (let i = 1; i < array.length; i++) {
    let target = i;
    for (let j = i - 1; j >= 0; j--) {
      if (array[target] < array[j]) {
        [array[target], array[j]] = [array[j], array[target]]
        target = j;
      } else {
        break;
      }
    }
  }
  return array;
}