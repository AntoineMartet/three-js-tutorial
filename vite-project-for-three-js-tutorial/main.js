import * as THREE from 'three'
import "./style.css"
// Pourquoi devoir impoorter ça alors qu'on importe déjà tout au-dessus ?
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap"

//Scene
const scene = new THREE.Scene()

//Create our pshere
const geometry = new THREE.SphereGeometry(3, 64, 64)
const material = new THREE.MeshStandardMaterial({
    color: "#00ff83",
    roughness: 0.5
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

//Size
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
}

//Light
const light = new THREE.PointLight(0xffffff, 200, 100)
light.position.set(0, 10, 10) // droite, haut, vers nous
scene.add(light)

//Camera
const camera = new THREE.PerspectiveCamera(
    45,
    sizes.width/sizes.height,
    0.1,
    100
)
camera.position.z = 20
scene.add(camera)

//Renderer
const canvas = document.querySelector('.webgl')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width,sizes.height)
renderer.setPixelRatio(2)
renderer.render(scene, camera)

//Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enablePan = false // right click to translate the scene
controls.enableZoom = false // wheel to zoom in and out the scene
controls.enableRotate = true // left click to rotate the scene
controls.autoRotate = true
controls.autoRotateSpeed = 2

//Resize
window.addEventListener('resize', () => {
    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    //Update camera + renderer
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
})

//Update canvas regularly
//See alternative way/syntax here : https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene
const loop = () => {
    //Animation example : x translation
    //mesh.position.x += 0.01
    //Continue damping when stop maintaining click
    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(loop)
}
loop()

//gsap timeline, for a series of multiple animations
const tl = gsap.timeline({defaults: { duration: 1}})
tl.fromTo(mesh.scale, {x:0, y:0, z:0}, {x:1.0, y:1, z:1})
tl.fromTo("nav", {y: "-100%"}, {y: "0%"})
tl.fromTo(".title", {opacity:0}, {opacity:1})

//Mouse color animation
let mouseDown = false
let rgb = []
window.addEventListener('mousedown', () => (mouseDown = true))
window.addEventListener('mouseup', () => (mouseDown = false))
window.addEventListener('mousemove', (e) => {
    if(mouseDown){
        rgb = [
            //e.pageX and e.pageY = mouse position
            //255 because r, g and b colors go from 0 to 255
            Math.round((e.pageX / sizes.width) * 255),
            Math.round((e.pageY / sizes.height) * 255),
            150
        ]
        let newColor = new THREE.Color(`rgb($(rgb.join(",")})`)
        gsap.to(mesh.material.color, {
            r: newColor.r,
            g: newColor.g,
            b: newColor.b,
        })
    }
})