const images = ["./images/img1.jpg", "./images/img2.jpg", "./images/img3.jpg"];

if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) { 

    rgbKineticSlider = new rgbKineticSlider({
        slideImages: images,
    
        backgroundDisplacementSprite:
            "./images/map-9.jpg",
        cursorDisplacementSprite:
            "./images/displace-circle.png",
        cursorScaleIntensity: 0.4,
        cursorMomentum: 0.14,
    
        swipe: true,
        swipeDistance: window.innerWidth * 0.2,
        swipeScaleIntensity: 2,
    
        slideTransitionDuration: 0.5,
        transitionScaleIntensity: 20,
        transitionScaleAmplitude: 200,
    
    
        imagesRgbEffect: false,
    
        textsDisplay: false
    });
    
}



const content = document.querySelector(".distort_content");
let currentPos = window.pageYOffset;

const callDistort = function () {
    const newPos = window.pageYOffset;
    const diff = newPos - currentPos;
    const speed = diff * 0.35;

    content.style.transform = "skewY(" + speed + "deg)";
    currentPos = newPos;
    requestAnimationFrame(callDistort);
};

callDistort()