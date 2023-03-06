function binarySearch(data, arr, start, end) {
  if (start > end) {
      return -1;
  }
  var mid = Math.floor((end + start) / 2);
  if (data == arr[mid]) {
      return mid;
  } else if (data < arr[mid]) {
      return binarySearch(data, arr, start, mid - 1);
  } else {
      return binarySearch(data, arr, mid + 1, end);
  }
}