
function App() {
    const conf = {
        el: 'canvas',
        fov: 100,
        cameraZ: 100,
    };

    let renderer, scene, camera, cameraCtrl;
    let width, height, cx, cy, wWidth, wHeight;

    let ripple;
    let gridWWidth, gridWHeight;
    let gridWidth, gridHeight;

    const mouse = new THREE.Vector2();
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mousePosition = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    let mouseOver = false;

    init();

    function init() {

        renderer = new THREE.WebGLRenderer({ canvas: document.getElementById(conf.el), antialias: true });
        camera = new THREE.PerspectiveCamera(conf.fov);
        camera.position.z = conf.cameraZ;

        updateSize();
        window.addEventListener('resize', updateSize, false);

        gridWHeight = wHeight;
        gridWWidth = wWidth;
        gridWidth = gridWWidth * width / wWidth;
        gridHeight = gridWHeight * height / wHeight;

        ripple = new RippleEffect(renderer, width, height);

        const getGridMP = function (e) {
            const v = new THREE.Vector3();
            camera.getWorldDirection(v);
            v.normalize();
            mouse.x = ((e.clientX / width) * 2 - 1);
            mouse.y = (-(e.clientY / height) * 2 + 1);
            raycaster.setFromCamera(mouse, camera);
            raycaster.ray.intersectPlane(mousePlane, mousePosition);
            return { x: 2 * mousePosition.x / gridWWidth, y: 2 * mousePosition.y / gridWHeight };
        };

        renderer.domElement.addEventListener('mousemove', e => {
            if (camera.position.z > 30) {
                mouseOver = true;
                const gp = getGridMP(e);
                ripple.addDrop(gp.x, gp.y, 0.1, 0.1);
            }
        });
        renderer.domElement.addEventListener('mouseleave', e => { mouseOver = false; });

        initScene();
        animate();
    }

    function initScene() {
        scene = new THREE.Scene();

        let pointLight1 = new THREE.PointLight("#fff");
        pointLight1.position.set(-wWidth / 2, wHeight / 2, 50);
        scene.add(pointLight1);

        let pointLight2 = new THREE.PointLight("#fff");
        pointLight2.position.set(wWidth / 2, wHeight / 2, 50);
        scene.add(pointLight2);

        let pointLight3 = new THREE.PointLight("#fff");
        pointLight3.position.set(-wWidth / 2, -wHeight / 2, 50);
        scene.add(pointLight3);

        let pointLight4 = new THREE.PointLight("#fff");
        pointLight4.position.set(wWidth / 2, -wHeight / 2, 50);
        scene.add(pointLight4);

        const colors = ["#fff", "#0a4020", "#531212", "#0e2136"];
        let color_id = 0;

        renderer.domElement.addEventListener('dblclick', e => {
            (color_id < colors.length - 1) ? color_id++ : color_id = 0;
            pointLight1.color = new THREE.Color(colors[color_id]);
            pointLight2.color = new THREE.Color(colors[color_id]);
            pointLight3.color = new THREE.Color(colors[color_id]);
            pointLight4.color = new THREE.Color(colors[color_id]);
        });

        const material = new THREE.MeshStandardMaterial({
            color: "#fff", side: THREE.DoubleSide, metalness: 0.5, roughness: 0.5, onBeforeCompile: shader => {
                shader.uniforms.hmap = { value: ripple.hMap.texture };
                shader.vertexShader = "uniform sampler2D hmap;\n" + shader.vertexShader;
                const token = '#include <begin_vertex>';
                const customTransform = `
    vec3 transformed = vec3(position);
    vec4 info = texture2D(hmap, uv);
    vNormal = vec3(info.b, sqrt(1.0 - dot(info.ba, info.ba)), info.a).xzy;
    transformed.z = 20. * info.r;
    `;
                shader.vertexShader = shader.vertexShader.replace(token, customTransform);
            }
        });

        let nx = Math.round(gridWidth / 2), ny = Math.round(gridHeight / 30);
        let dx = gridWWidth / nx, dy = gridWHeight / ny;
        for (let j = 0; j <= ny; j++) {
            const geometry = new THREE.BufferGeometry();
            const positions = [], uvs = [];
            const y = - gridWHeight / 2 + j * dy;
            for (let i = 0; i <= nx; i++) {
                positions.push(- gridWWidth / 2 + i * dx, y, 0);
                uvs.push(i / nx, j / ny);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.computeBoundingSphere();
            scene.add(new THREE.Line(geometry, material));
        }

        nx = Math.round(gridWidth / 30); ny = Math.round(gridHeight / 2);
        dx = gridWWidth / nx; dy = gridWHeight / ny;
        for (let i = 0; i <= nx; i++) {
            const geometry = new THREE.BufferGeometry();
            const positions = [], uvs = [];
            const x = - gridWWidth / 2 + i * dx;
            for (let j = 0; j <= ny; j++) {
                positions.push(x, - gridWHeight / 2 + j * dy, 0);
                uvs.push(i / nx, j / ny);
            }
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            geometry.computeBoundingSphere();
            scene.add(new THREE.Line(geometry, material));
        }
        camera.position.set(0, -gridWHeight / 8, 8);
        camera.lookAt(new THREE.Vector3(0, -gridWHeight / 6, 0));

        cameraCtrl = new THREE.OrbitControls(camera, renderer.domElement);
        cameraCtrl.enableDamping = true;
        cameraCtrl.enableZoom = true;
        cameraCtrl.dampingFactor = 0.1;
        cameraCtrl.rotateSpeed = 0.5;
    }

    function animate() {
        if (Math.floor(camera.position.z) > 50) {
            cameraCtrl.enableZoom = false;
        }
        if (!mouseOver) {
            const time = Date.now() * 0.001;
            const x = Math.cos(time) * 0.2;
            const y = Math.sin(time) * 0.2;
        }

        ripple.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }

    function updateSize() {
        width = window.innerWidth; cx = width / 2;
        height = window.innerHeight; cy = height / 2;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        const wsize = getRendererSize();
        wWidth = wsize[0]; wHeight = wsize[1];
    }

    function getRendererSize() {
        const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
        const vFOV = (cam.fov * Math.PI) / 180;
        const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
        const width = height * cam.aspect;
        return [width, height];
    }
}

const RippleEffect = (function () {
    function RippleEffect(renderer, width, height) {
        this.renderer = renderer;
        this.width = 512;
        this.height = 512;
        // this.delta = new THREE.Vector2(this.width / Math.pow(width, 2), this.height / Math.pow(height, 2));
        this.delta = new THREE.Vector2(1 / this.width, 1 / this.height);

        this.hMap = new THREE.WebGLRenderTarget(this.width, this.height, { type: THREE.FloatType, depthBuffer: false, stencilBuffer: false });
        this.hMap1 = new THREE.WebGLRenderTarget(this.width, this.height, { type: THREE.FloatType, depthBuffer: false, stencilBuffer: false });
        this.fsQuad = new FullScreenQuad();

        this.initShaders();
    }

    RippleEffect.prototype.initShaders = function () {
        // default vertex shader
        const defaultVertexShader = `
    varying vec2 vUv;
    void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `;

        this.copyMat = new THREE.ShaderMaterial({
            uniforms: { 'tDiffuse': { value: null } },
            vertexShader: defaultVertexShader,
            fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    void main() {
      gl_FragColor = texture2D(tDiffuse, vUv);
    }
    `,
        });

        this.updateMat = new THREE.ShaderMaterial({
            uniforms: {
                'tDiffuse': { value: null },
                'delta': new THREE.Uniform(this.delta),
            },
            vertexShader: defaultVertexShader,
            fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 delta;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
    
      vec2 dx = vec2(delta.x, 0.0);
      vec2 dy = vec2(0.0, delta.y);
      float average = (
        texture2D(tDiffuse, vUv - dx).r +
        texture2D(tDiffuse, vUv - dy).r +
        texture2D(tDiffuse, vUv + dx).r +
        texture2D(tDiffuse, vUv + dy).r
      ) * 0.25;
      texel.g += (average - texel.r) * 2.0;
      texel.g *= 0.995;
      texel.r += texel.g;
    
      gl_FragColor = texel;
    }
    `,
        });

        this.normalsMat = new THREE.ShaderMaterial({
            uniforms: {
                'tDiffuse': { value: null },
                'delta': new THREE.Uniform(this.delta),
            },
            vertexShader: defaultVertexShader,
            fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 delta;
    varying vec2 vUv;
    void main() {
    vec4 texel = texture2D(tDiffuse, vUv);
    vec3 dx = vec3(delta.x, texture2D(tDiffuse, vec2(vUv.x + delta.x, vUv.y)).r - texel.r, 0.0);
    vec3 dy = vec3(0.0, texture2D(tDiffuse, vec2(vUv.x, vUv.y + delta.y)).r - texel.r, delta.y);
    texel.ba = normalize(cross(dy, dx)).xz;
    gl_FragColor = texel;
    }
    `,
        });

        this.dropMat = new THREE.ShaderMaterial({
            uniforms: {
                'tDiffuse': { value: null },
                'center': new THREE.Uniform(new THREE.Vector2()),
                'radius': { value: 0.05 },
                'strength': { value: 0.5 },
            },
            vertexShader: defaultVertexShader,
            fragmentShader: `
    const float PI = 3.1415926535897932384626433832795;
    uniform sampler2D tDiffuse;
    uniform vec2 center;
    uniform float radius;
    uniform float strength;
    varying vec2 vUv;
    void main() {
      vec4 texel = texture2D(tDiffuse, vUv);
      float drop = max(0.0, 1.0 - length(center * 0.5 + 0.5 - vUv) / radius);
      drop = 0.5 - cos(drop * PI) * 0.5;
      texel.r += drop * strength;
      // texel.r = clamp(texel.r, -2.0, 2.0);
      gl_FragColor = texel;
    }
    `,
        });
    };

    RippleEffect.prototype.update = function () {
        this.updateHMap();
        this.updateHMapNormals();
    };

    RippleEffect.prototype.updateHMap = function () {
        this.updateMat.uniforms.tDiffuse.value = this.hMap.texture;
        this.renderShaderMat(this.updateMat, this.hMap1);
        this.swapBuffers();
    };

    RippleEffect.prototype.updateHMapNormals = function () {
        this.normalsMat.uniforms.tDiffuse.value = this.hMap.texture;
        this.renderShaderMat(this.normalsMat, this.hMap1);
        this.swapBuffers();
    };

    RippleEffect.prototype.addDrop = function (x, y, radius, strength) {
        this.dropMat.uniforms.tDiffuse.value = this.hMap.texture;
        this.dropMat.uniforms.center.value.set(x, y);
        this.dropMat.uniforms.radius.value = radius;
        this.dropMat.uniforms.strength.value = strength;
        this.renderShaderMat(this.dropMat, this.hMap1);
        this.swapBuffers();
    };

    RippleEffect.prototype.renderBuffer = function (buffer, target) {
        target = target ? target : null;
        this.copyMat.uniforms.tDiffuse.value = buffer.texture;
        this.renderShaderMat(this.copyMat, target);
    };

    RippleEffect.prototype.renderShaderMat = function (mat, target) {
        this.fsQuad.material = mat;
        const oldTarget = this.renderer.getRenderTarget();
        this.renderer.setRenderTarget(target);
        this.fsQuad.render(this.renderer);
        this.renderer.setRenderTarget(oldTarget);
    };

    RippleEffect.prototype.swapBuffers = function () {
        const temp = this.hMap;
        this.hMap = this.hMap1;
        this.hMap1 = temp;
    };

    const FullScreenQuad = (function () {
        const camera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
        const geometry = new THREE.PlaneBufferGeometry(2, 2);

        const FullScreenQuad = function (material) {
            this._mesh = new THREE.Mesh(geometry, material);
        };

        Object.defineProperty(FullScreenQuad.prototype, 'material', {
            get: function () { return this._mesh.material; },
            set: function (value) { this._mesh.material = value; }
        });

        Object.assign(FullScreenQuad.prototype, {
            render: function (renderer) {
                renderer.render(this._mesh, camera);
            }
        });

        return FullScreenQuad;
    })();

    return RippleEffect;
})();

App();






window.onload = function () {
    var canvas = document.getElementById("fractol_tree");
    var context = canvas.getContext("2d")
    var width = canvas.width = document.documentElement.clientWidth;
    var height = canvas.height = document.documentElement.clientHeight;


    var p0 = {
        x: width / 2,
        y: height - 50
    },
        p1 = {
            x: width / 2,
            y: 50
        },
        branchAngleA,
        branchAngleB,
        trunkRatio = 0.35,
        tA = Math.PI,
        tAS = 0.01,
        tB = 0,
        tBS = 0.01437;


    draw();

    function draw() {
        context.clearRect(0, 0, width, height);
        branchAngleA = Math.cos(tA += tAS) * Math.PI / 2;
        branchAngleB = Math.cos(tB += tBS) * Math.PI / 2;

        tree(p0, p1, 8);
        requestAnimationFrame(draw);
    }

    function tree(p0, p1, limit) {
        var dx = p1.x - p0.x,
            dy = p1.y - p0.y,
            dist = Math.sqrt(dx * dx + dy * dy),
            angle = Math.atan2(dy, dx),
            branchLength = dist * (1 - trunkRatio),
            pA = {
                x: p0.x + dx * trunkRatio,
                y: p0.y + dy * trunkRatio
            },
            pB = {
                x: pA.x + Math.cos(angle + branchAngleA) * branchLength,
                y: pA.y + Math.sin(angle + branchAngleA) * branchLength,
            },
            pC = {
                x: pA.x + Math.cos(angle + branchAngleB) * branchLength,
                y: pA.y + Math.sin(angle + branchAngleB) * branchLength,
            };

        context.beginPath();
        context.moveTo(p0.x, p0.y);
        context.lineTo(pA.x, pA.y);

        context.strokeStyle = "#504dac";
        context.stroke();



        if (limit > 0) {
            tree(pA, pC, limit - 1);
            tree(pA, pB, limit - 1);
        }
        else {
            context.beginPath();
            context.moveTo(pB.x, pB.y);
            context.lineTo(pA.x, pA.y);
            context.lineTo(pC.x, pC.y);
            context.stroke();
        }
    }
};








const canvas = document.querySelector('#tree_canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx = canvas.getContext('2d');
let curve = 10;
let curve2 = 0;

function drawTree(startX, startY, len, angle, branchWidth, color1, color2) {
    ctx.beginPath();
    ctx.save();
    ctx.strokeStyle = color1;
    ctx.fillStyle = color2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = 'black';
    ctx.lineWidth = branchWidth;
    ctx.translate(startX, startY);
    ctx.rotate(angle * Math.PI / 180);
    ctx.moveTo(0, 0);

    if (angle > 0) {
        ctx.bezierCurveTo(curve2, -len / 2, curve2, -len / 2, 0, -len);
    } else {
        ctx.bezierCurveTo(curve2, -len / 2, -curve2, -len / 2, 0, -len);
    }

    ctx.stroke();

    if (len < 5) {
        ctx.beginPath();
        ctx.arc(0, -len, (Math.random() * 20) + 10, 0, Math.PI / 2);
        ctx.fill();
        ctx.restore();
        return;
    }

    drawTree(0, -len, len * 0.7, angle + curve, branchWidth * 0.6);
    drawTree(0, -len, len * 0.7, angle - curve, branchWidth * 0.6);

    ctx.restore();
}
generateRandomTree()

function generateRandomTree() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let centerPointX = canvas.width / 2;
    let len = Math.floor((Math.random() * 20) + 100);
    let angle = 0;
    let branchWidth = (Math.random() * 70) + 1;
    let color1 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';
    let color2 = 'rgb(' + Math.random() * 255 + ',' + Math.random() * 255 + ',' + Math.random() * 255 + ')';

    curve = (Math.random() * 25) + 3;
    curve2 = Math.random() * 10;
    drawTree(centerPointX, canvas.height, len, angle, branchWidth, color1, color2);

}

window.addEventListener('resize', function () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateRandomTree()
})
document.querySelector('.logo').addEventListener('click', function () {
    generateRandomTree();
})