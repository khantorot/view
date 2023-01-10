const canvas = document.querySelector('canvas.webgl')

const scene = new THREE.Scene()

const material = new THREE.MeshToonMaterial({ color: '#eeeeee' })

const mesh = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.3, 20, 100),
    material
)


mesh.position.y = 0
mesh.position.x = 0

const sectionMeshes = [mesh]

scene.add(mesh)


const directionalLight = new THREE.DirectionalLight('#eeeeee', 1)
directionalLight.position.set(1, 1, 0)
scene.add(directionalLight)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

let scrollY = window.scrollY
let currentSection = 0

window.addEventListener('scroll', () => {
    scrollY = window.scrollY
    const newSection = Math.round(scrollY / sizes.height)

    if (newSection != currentSection) {

        gsap.to(
            sectionMeshes[0].rotation,
            {
                duration: 2,
                ease: 'power2.inOut',
                x: '+=1',
                y: '+=3'
            }
        )
    }
})


const cursor = {}
cursor.x = 0
cursor.y = 0

window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width - 0.5
    cursor.y = event.clientY / sizes.height - 0.5
})


const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 6
cameraGroup.add(camera)


const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12

    camera.position.y = - scrollY / sizes.height

    const parallaxX = cursor.x * 0.5
    const parallaxY = - cursor.y * 0.5

    cameraGroup.position.x += (parallaxX - cameraGroup.position.x) * 5 * deltaTime
    cameraGroup.position.y += (parallaxY - cameraGroup.position.y) * 5 * deltaTime

    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}

tick()