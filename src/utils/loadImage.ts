const loadImage = (url: string) => new Promise((resolve, reject) => {
  const img = new Image();
  // img.crossOrigin = "anonymous";
  img.onload = () => resolve(img);
  img.onerror = () => reject(new Error(`load ${url} fail`));
  img.src = url;
});

export default loadImage;