
// <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2015/09/09/16/05/forest-931706_1280.jpg" alt=""/>,
// <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2014/08/01/00/08/pier-407252_1280.jpg" alt=""/>,
// <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2014/12/15/17/16/pier-569314_1280.jpg" alt=""/>,
// <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2010/12/13/10/09/abstract-2384_1280.jpg" alt=""/>,
// <img src="loading.gif" data-src="https://cdn.pixabay.com/photo/2015/10/24/11/09/drop-of-water-1004250_1280.jpg"/>,
let n = 0;
let img = document.getElementsByTagName("img");

const lazyLoad = () => {
  const clientHeight = window.innerHeight;
  const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
  for(let i = 0; i < images.length; i++) {
    if(images[i].offsetTop < clientHeight + scrollTop) {
      if (img[i].getAttribute("src") === "loading.gif") {
        img[i].src = img[i].getAttribute("data-src");
      }
    }
    n = n+1;
  }
}

window.addEventListener('scroll', lazyLoad);