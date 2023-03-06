let string = '3222344';

const obj = {};

for (let char of string) {
  obj[char] = obj[char] + 1 || 1;
}

const max = Math.max(...Object.values(obj));

console.log(obj);

const findKey = (obj, value) => {
  return Object.keys(obj).find((k) => (obj[k] === value));
};

console.log({ char: findKey(obj, max), count: max });