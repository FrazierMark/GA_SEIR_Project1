import '../css/main.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'


/*----- DOM Elements -----*/
const player1_TurnToken = document.querySelector(".player1_token")
const player2_TurnToken = document.querySelector(".player2_token")

//fyi, returns node list <<---
const cells = document.querySelectorAll(".cell")
console.log(cells)
const startResetBtn = document.querySelector(".start_reset")
const winLoseDrawMsg = document.querySelector('.win_lose_draw')



// next step!! iterate through cells from html
// put them in a columns
// because if clicked we drop a token




// for(let i <)
// const column1 = document.querySelectorAll(".column1").addEventListener('click', dropToken)
// const column2 = document.querySelectorAll(".column2")
// const column3 = document.querySelectorAll(".column3")
// const column4 = document.querySelectorAll(".column4")
// const column5 = document.querySelectorAll(".column5")
// const column6 = document.querySelectorAll(".column6")
// const column7 = document.querySelectorAll(".column7")

/*----- Constants -----*/
const gameBoard = []

        // - 1 = null
        // 0 = red
        // 1 = yellow
// [
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[0]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[1]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[3]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[4]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[5]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[6]
// ]




/*-----Event Listeners-----*/
startResetBtn.addEventListener('click', init());

// column1.addEventListener('click', dropToken())
// column2.addEventListener('click', dropToken())
// column3.addEventListener('click', dropToken())
// column4.addEventListener('click', dropToken())
// column5.addEventListener('click', dropToken())
// column6.addEventListener('click', dropToken())
// column7.addEventListener('click', dropToken())


// if Start button clicked change innerHTML to reset




// Set initial state variables - const
function init() { 
    console.log('Init function operating')

    // initialize 2D matrix of (-1)s
    for (let i = 0; i < 6; i++) {
        gameBoard.push(new Array(7).fill(`row?${i}`))
    }
    



   // render()
}





// //anything visually seen
// function render() {




//     //checkWinner()
// }


function dropToken() {
    // check if right player?
    // 
    // 
console.log()
}




/**
 * WebGL / ThreeJS - background
 */



// // Debugging GUI
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameteres = {}

//
const generateParticleFormation = () => {

}
generateParticleFormation()


/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')

/**
 * Test cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)
//scene.add(cube)

/**
    Particles
 **/

// Geometry
const particlesSphereGeometry = new THREE.SphereBufferGeometry(1, 32, 32);

// Creating a custome Geometry
const particlesGeometry = new THREE.BufferGeometry() //<<<<<<---------
const count = 20000

const positions = new Float32Array(count * 3) // x, y, z
const colors = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) { // Multiply by 3 cause, x, y, z
    positions[i] = (Math.random() - 0.5) * 10 // Math.random() -0.5 creates value between -0.5 and +0.5
    // create random red, green, blue value for each particle
    colors[i] = Math.random()
}

// Create the Three.js BufferAttribute and specify that each peice of information is composed of 3 values
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 

particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

//Material
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    sizeAttenuation: true
})
// activate vertexColors
particlesMaterial.vertexColors = true;

// particlesMaterial.color = new THREE.Color('#ff88cc');

particlesMaterial.map = particleTexture
// Making texture transparent inorder to see thrugh it...
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture
// particlesMaterial.alphaTest = 0.001
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
//  use blending to add the color of that pixel to the color of the pixel already drawn
particlesMaterial.blending = THREE.AdditiveBlending;



// Points
// Creates the particles (in a sphere shape cause of SphereBufferGeometry)
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)


// Aspect Window ratio
const windowSize = {
    width: window.innerWidth,
    height: window.innerHeight
}

// Allow window and scene objects to resize on window adjustment
window.addEventListener('resize', () => {
    // Update windowSize
    windowSize.width = window.innerWidth
    windowSize.height = window.innerHeight

    // Update camera aspect-ratio based on window size
    camera.aspect = windowSize.width / windowSize.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(windowSize.width, windowSize.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

//Camera
const camera = new THREE.PerspectiveCamera(75, windowSize.width / windowSize.height, 0.1, 100)
camera.position.x = 3
camera.position.y = 3
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(windowSize.width, windowSize.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    //Update particles
    // particles.rotation.y = elapsedTime * 0.2
    // Wave-like movement of particles
    for (let i = 0; i < count; i++) {
        const i3 = i * 3

        const x = particlesGeometry.attributes.position.array[i3]
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        // The y coordinate can be access in the array at the index i3 + 1:
       // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime)
    }
    // The problem is that Three.js has to be notified that the geometry changed
    particlesGeometry.attributes.position.needsUpdate = true 


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

