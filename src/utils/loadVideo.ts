const loadVideo = async (url: string, copyVideo: boolean) => {
  const video = document.createElement('video');

  let playing = false;
  let timeupdate = false;

  video.autoplay = true;
  video.muted = true;
  video.loop = true;

  video.addEventListener('playing', function() {
    playing = true;
    checkReady();
  }, true);

  video.addEventListener('timeupdate', function() {
    timeupdate = true;
    checkReady();
  }, true);


 video.src = url;
 video.play();

 function checkReady() {
   if (playing && timeupdate) {
     copyVideo = true;
   }
 }
 return video;
};

const loadVideoAsync = (url: string, copyVideo: boolean) => new Promise((resolve, reject) => {
  let video = document.createElement('video');
  video.autoplay = true;
  video.muted = true;
  video.loop = true;
  video.playsInline = true;
  video.src = url;
  video.controls = true;
  video.load();
  

  video.addEventListener('canplaythrough', function(){
    resolve(video);
    copyVideo = true;
  });

  video.addEventListener('error', function(){
    reject(video);
  });
});

export default loadVideo;