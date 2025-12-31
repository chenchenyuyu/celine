async function foo() {
  const a = await Promise.resolve(1); 
  const b = await Promise.resolve(2); 
  return a + b;
}

function* fooGen() {
  const a = yield Promise.resolve(1); 
  const b = yield Promise.resolve(2); 
  return a + b;
}

