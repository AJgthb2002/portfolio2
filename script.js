let animationTypes = ["idle", "kick", "punch", "block", "forward", "backward"];

let frames = {
  idle: [1, 2, 3, 4, 5, 6, 7, 8],
  kick: [1, 2, 3, 4, 5, 6, 7],
  punch: [1, 2, 3, 4, 5, 6, 7],
  block: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  forward: [1, 2, 3, 4, 5, 6],
  backward: [1, 2, 3, 4, 5, 6],
};

let c = document.getElementById("canvas1");
let ctx = c.getContext("2d");
c.style.background = 'url("images/background.jpg")';
c.style.backgroundSize = "800px 400px";

let loadImage = (src, callback) => {
  let img = document.createElement("img");
  img.onload = () => callback(img);
  img.src = src;
};

let imagePath = (animation, frameNumber) => {
  return `images/${animation}/${frameNumber}.png`;
};

let loadImages = (callback) => {
  let images = {
    idle: [],
    kick: [],
    punch: [],
    block: [],
    forward: [],
    backward: [],
  };

  let imagesToLoad = 0;
  animationTypes.forEach((animation) => {
    let animationFrames = frames[animation];
    imagesToLoad = imagesToLoad + animationFrames.length;

    animationFrames.forEach((frame) => {
      let path = imagePath(animation, frame);
      loadImage(path, (image) => {
        images[animation][frame - 1] = image;
        imagesToLoad = imagesToLoad - 1;
        if (imagesToLoad === 0) {
          callback(images);
        }
      });
    });
  });
};

let hpos = 30;

let animate = (ctx, images, animation, callback) => {
  images[animation].forEach((image, index) => {
    setTimeout(() => {
      ctx.clearRect(0, 0, c.width, c.height);
      ctx.drawImage(image, hpos, 80, 300, 300);
      if (animation === "forward" && hpos < 790) hpos += 8;
      else if (animation === "backward" && hpos > 10) hpos -= 8;
    }, index * 100);
  });
  setTimeout(callback, images[animation].length * 100);
};

loadImages((images) => {
  let queuedAnimations = [];
  let aux = () => {
    let selectedAnimation;
    if (queuedAnimations.length === 0) selectedAnimation = "idle";
    else selectedAnimation = queuedAnimations.shift();
    animate(ctx, images, selectedAnimation, aux);
  };

  aux();

  animationTypes.forEach((anim, i) => {
    if (i !== 0)
      document.getElementById(anim).onclick = () => {
        queuedAnimations.push(anim);
      };
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") queuedAnimations.push("forward");
    else if (e.key === "ArrowLeft") queuedAnimations.push("backward");
    else if (e.key === "a") queuedAnimations.push("kick");
    else if (e.key === "x") queuedAnimations.push("punch");
    else if (e.key === "Enter") queuedAnimations.push("block");
  });
});
