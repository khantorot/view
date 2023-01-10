const nearDist = 1;
const farDist = 1400;
const camera = new THREE.PerspectiveCamera(
    70, // 70
    window.innerWidth / window.innerHeight,
    nearDist,
    farDist
);
const scene = new THREE.Scene();
const renderer = new THREE.WebGLRenderer({ antialias: true });
const canvasWrapper = document.querySelector("#canvas_wrapper");
const clock = new THREE.Clock();
const tau = 2 * Math.PI;
let controls;

const init = () => {
    camera.position.set(0, 300, 500);

    renderer.setClearColor("#000");
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    canvasWrapper.appendChild(renderer.domElement);
};
init();

const updateObjMatrix = (object) => {
    object.updateMatrix();
    object.matrixAutoUpdate = false;
};

// INSTANT FILM
const iWidth = 170;
const iHeight = iWidth * 1.2;
const iDepth = iWidth / 5;
const filmGeometry = new THREE.BoxBufferGeometry(
    iWidth * 1.3,
    iHeight / 1.3,
    iDepth * 3
);
const emissiveLight = "#111";
const materialOptions = {
    emissive: emissiveLight,
    shininess: 80
};
const filmMaterial = new THREE.MeshPhongMaterial(materialOptions);

// Add light for MeshPhongMaterial to be visible in scene
const spotLight = new THREE.SpotLight('#222', 0.8);
spotLight.position.set(100, 400, 100);
scene.add(spotLight);

// INSTANT FILM PRINTS
const pWidth = iWidth / 1.1;
const printGeometry = new THREE.PlaneBufferGeometry(
    pWidth + 65,
    pWidth,
    1
);


const loader = new THREE.TextureLoader();

const printMaterial = new THREE.MeshBasicMaterial({
    map: loader.load('./content/image.png')
});
const printMaterial1 = new THREE.MeshBasicMaterial({
    map: loader.load('./content/image1.png')
});
const printMaterial2 = new THREE.MeshBasicMaterial({
    map: loader.load('./content/image2.png')
});
const printMaterial3 = new THREE.MeshBasicMaterial({
    map: loader.load('./content/image3.png')
});

const Film = function (group) {
    this.group = group;
};

let printMesh;
Film.prototype.create = function (num) {
    const iFilm = new THREE.Mesh(filmGeometry, filmMaterial);
    if (num == 0) {
        printMesh = new THREE.Mesh(printGeometry, printMaterial);
    } else if (num == 1) {
        printMesh = new THREE.Mesh(printGeometry, printMaterial1);
    } else if (num == 2) {
        printMesh = new THREE.Mesh(printGeometry, printMaterial2);
    } else if (num == 3) {
        printMesh = new THREE.Mesh(printGeometry, printMaterial3);
    }

    printMesh.position.x = pWidth / 210;
    printMesh.position.y = pWidth / 210;
    printMesh.position.z = iDepth + 18;

    updateObjMatrix(printMesh);

    this.group.add(iFilm);
    this.group.add(printMesh);
};



const instantGroup = new THREE.Group();

const uniformMulti = { type: "v2", value: new THREE.Vector2(0.52, 0.75) };
const uniformMono = { type: "v2", value: new THREE.Vector2(1.0, 1.0) };
const uniforms = {
    u_gb: uniformMulti,
    u_resolution: { type: "v2", value: new THREE.Vector2(1.0, 1.0) },
    u_time: { type: "f", value: 1.0 },
};
const setShaderMaterial = (fragShader) => new THREE.ShaderMaterial({
    uniforms,
    fragmentShader: fragShader,
    vertexShader,
});


const filmGroup_01 = new THREE.Group();
const film_01 = new Film(filmGroup_01);
film_01.create(0);
instantGroup.add(filmGroup_01);

const filmGroup_02 = new THREE.Group();
const film_02 = new Film(filmGroup_02);
filmGroup_02.position.z = iWidth * 1.5;
filmGroup_02.position.x = iWidth * 1.5;
filmGroup_02.rotation.y = tau / -4;
film_02.create(1);
instantGroup.add(filmGroup_02);

const filmGroup_03 = new THREE.Group();
const film_03 = new Film(filmGroup_03);
filmGroup_03.position.z = iWidth * 1.5;
filmGroup_03.position.x = iWidth * -1.5;
filmGroup_03.rotation.y = tau / 4;
film_03.create(2);
instantGroup.add(filmGroup_03);

const filmGroup_04 = new THREE.Group();
const film_04 = new Film(filmGroup_04);
filmGroup_04.position.z = iWidth * 3;
filmGroup_04.rotation.y = tau / 2;
// updateObjMatrix(filmGroup_04);
film_04.create(3);
instantGroup.add(filmGroup_04);

instantGroup.position.z = iWidth * -1.5;
scene.add(instantGroup);







// WORLD COLOR & ANIMATION TOGGLE

let IS_ANIMATED = true;
const toggle = {
    btnAnim: document.querySelector("#toggle_anim button"),
    checkActiveBtnAnim() {
        this.btnAnim.addEventListener("click", (e) => {
            e.preventDefault();
            const target = e.currentTarget;
            const txtPlay = `play`;
            const txtPause = `pause`;
            const iconPlay = `x`;
            const iconPause = `z`;

            function setBtnData(btn, icon) {
                target.dataset.action = btn;
                target.title = btn;
                target.textContent = icon;
            }

            if (target.dataset.action === 'pause') {
                setBtnData(txtPlay, iconPlay);
                IS_ANIMATED = false;
                controls.enableZoom = true;
            } else {
                setBtnData(txtPause, iconPause);
                IS_ANIMATED = true;
                controls.enableZoom = false;
            }
        });
    }
};
toggle.checkActiveBtnAnim();

// SCREEN RESIZE
const onWindowResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;

    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    renderer.setSize(w, h);

    uniforms.u_resolution.value.x = renderer.domElement.width;
    uniforms.u_resolution.value.y = renderer.domElement.height;
};
window.addEventListener("resize", onWindowResize);

// CONSTROLS INTERACTION

const createControls = () => {
    // Make sure to run controls outside render function 
    controls = new THREE.OrbitControls(camera, renderer.domElement);

    // If controls autoRotate is true, update controls during render
    controls.autoRotateSpeed = 3.0;
    controls.enableDamping = true;
    controls.dampingFactor = 0.15;
    controls.enableZoom = false;
    controls.minDistance = 0;
    controls.maxDistance = 750;
    controls.keyPanSpeed = 30;
};
createControls();


// CREATE ANIMATIONS
const createAnimShaders = () => {
    if (IS_ANIMATED) {
        uniforms.u_time.value = clock.getElapsedTime();
    }
};

// RENDER 3D WORLD
const render = () => {
    createAnimShaders();
    // createAnimConfetti();

    controls.autoRotate = IS_ANIMATED ? true : false;
    controls.update();

    renderer.render(scene, camera);
    requestAnimationFrame(render);
};
render();