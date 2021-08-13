if (!(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))) {
    new hoverEffect({
        parent: document.querySelector('.distort_img'),
        intensity: 0.2,
        image1: './images/1.jpg',
        image2: './images/2.jpg',
        displacementImage: './images/heightMap.png'
    })
}