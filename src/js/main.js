import '../css/main.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import vShader from '../../public/shaders/vShader.glsl'
import fShader from '../../public/shaders/fShader.glsl'

// calls the init function on load
document.addEventListener('DOMContentLoaded', function() {
    init();
}, false);



/*----- DOM Elements -----*/
const player1_TurnToken = document.querySelector(".player1_token")
const player2_TurnToken = document.querySelector(".player2_token")

const startResetBtn = document.querySelector(".start_reset")
const winLoseDrawMsg = document.querySelector('.win_lose_draw')

const column0 = document.getElementsByClassName('column0')
const column1 = document.getElementsByClassName('column1')
const column2 = document.getElementsByClassName('column2')
const column3 = document.getElementsByClassName('column3')
const column4 = document.getElementsByClassName('column4')
const column5 = document.getElementsByClassName('column5')
const column6 = document.getElementsByClassName('column6')

const allColumns = [column0, column1, column2, column3, column4, column5, column6]

/*----- Constants -----*/
let gameBoard = [];

// [
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[0]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[1]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[3]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[4]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[5]
//     [-1,-1,-1,-1,-1,-1,-1] = gameBoard[6]
// ]

let winnerCheckCache = {};

let winner = false;
let draw = false;

let player1_Turn = true;
let player2_Turn = false;
let lastColumnClicked = [];
const rowHeight = 6
const columnLength = 7


/*-----Event Listeners-----*/
startResetBtn.addEventListener('click', init);

for (const column of allColumns) {
    for (const cell of column) {
      cell.addEventListener('click', dropToken);
    }
  }


// Set initial state variables - const
function init(e) {
    startResetBtn.innerText = 'Restart Game?'
    
    
    clearGameBoard()

    // initialize 2D matrix of (-1)s
    for (let i = 0; i < 6; i++) {
        gameBoard.push(new Array(7).fill(-1))
    }
}


//aka handleClick
function dropToken(e) {
    const cellIdx = getCellIdx(e)
    const columnIdxClicked = cellIdx[1]
    let indexToUpdate = getAvailableSlot(columnIdxClicked) // returns Index of available slot
    gameBoard[indexToUpdate[0]][indexToUpdate[1]] = checkPlayerTurn() // returns either 1 or 2 for player move
    // record to gameBoard players move
    lastColumnClicked = [indexToUpdate[0], indexToUpdate[1]]
    render()
}

function render() {
    updateDomGameBoard()

    updateTurn()
   
    winLoseDrawMsg.innerText = displayEndMessage(checkWinner(), checkDraw())
    
    if (winner == true || draw == true) {
        winLoseDrawMsg.classList.remove('endGameMsgDisable')
        startResetBtn.innerText = `Play again?`
    }
}


function updateDomGameBoard() {
    // check to find cells with class List containing appropriate row AND column
    let classNames = [`row${lastColumnClicked[0]}`, `column${lastColumnClicked[1]}`]
    let cellToColor = document.getElementsByClassName(`${classNames[0]} ${classNames[1]}`)
    if (player1_Turn) {
        cellToColor[0].classList.add('red')
    } else {
        cellToColor[0].classList.add('yellow')
    }
}


function displayEndMessage(winner, draw) {
    if (winner) {
        if (winner[0] == 1) {
            highlightWinner(winner)
            return `Player 1 WINS!!`
        } else if (winner[0] == 2) {
            highlightWinner(winner)
            return `Player 2 WINS!!`
        } 
    } else if (draw) {
        return `DRAW! Play again?`
    } 
}


function checkDraw() {
    // check if we have no -1s in gameBoard & no winner
    let checkNums = []

    for (let i = rowHeight - 1; i > -1; i--){
        for (let j = columnLength - 1; j > -1; j--) {
            checkNums.push(gameBoard[i][j])
        }
    }
    if (!checkNums.includes(-1) && winner == false) {
        draw = true
        return true
    } else {
        return false
    }
}


function checkWinner() {
    
    // check horizontallly all rows 
    for (let i = 0; i < rowHeight; i++) {
        for (let j = 0; j < columnLength - 3; j++) {
            if (check4InARow(gameBoard[i][j], gameBoard[i][j + 1], gameBoard[i][j + 2], gameBoard[i][j + 3])) {
                winner = true;
                // returns 1 or 2 for winner, AND an array of coordinates to later highlightWinner()
                return [gameBoard[i][j], `${i}${j}`, `${i}${j+1}`, `${i}${j+2}`, `${i}${j+3}`]
            }
        }
    }

    // check vertical, all columns
    for (let i = 0; i < rowHeight - 3; i++) {
        for (let j = 0; j < columnLength; j++) {
            if (check4InARow(gameBoard[i][j], gameBoard[i + 1][j], gameBoard[i + 2][j], gameBoard[i + 3][j])) {
                winner = true;
                return [gameBoard[i][j], `${i}${j}`, `${i+1}${j}`, `${i+2}${j}`, `${i+3}${j}`]
            }
        }
    }

    // check diagonal, top-left to bottom-right 
    for (let i = 3; i < rowHeight; i++) {
        for (let j = 0; j < columnLength - 2; j++) {
            if (check4InARow(gameBoard[i][j], gameBoard[i - 1][j + 1], gameBoard[i - 2][j + 2], gameBoard[i - 3][j + 3])) {
                winner = true;
                return [gameBoard[i][j], `${i}${j}`, `${i-1}${j+1}`, `${i-2}${j+2}`, `${i-3}${j+3}`]
            }
        }
    }

    // check diagonal, top-right to bottom-left
    for (let i = 0; i < rowHeight - 3; i++) {
        for (let j = 0; j < columnLength - 2; j++) {
            if (check4InARow(gameBoard[i][j], gameBoard[i + 1][j + 1], gameBoard[i + 2][j + 2], gameBoard[i + 3][j + 3])) {
                winner = true;
                return [gameBoard[i][j], `${i}${j}`, `${i+1}${j+1}`, `${i+2}${j+2}`, `${i+3}${j+3}`];
            }
        }
    }

}


    // checkWinner() helper function
function check4InARow (cell1, cell2, cell3, cell4) {
    // Check first cell is not empty, and matching cells
    return ((cell1 != -1) && (cell1 == cell2) && (cell2 == cell3) && (cell3 == cell4))
};
    
function highlightWinner(winningFour) {
    //remove 1st element (winning player num)
    winningFour.shift()
    winningFour.forEach(cell => {
        let winningCellClassNames = [`row${cell[0]}`, `column${cell[1]}`]  
        let cellToHighlight = document.getElementsByClassName(`${winningCellClassNames[0]} ${winningCellClassNames[1]} `)
        cellToHighlight[0].classList.add('winningHighlight')
    })
}


function clearGameBoard() {
    gameBoard = []
    winner = false;
    draw = false;
    lastColumnClicked = [];

    if (!winLoseDrawMsg.classList.contains('endGameMsgDisable')) {
        winLoseDrawMsg.classList.add('endGameMsgDisable')
    }

    startResetBtn.innerText = `Restart Game?`
    

    for (const column of allColumns) {
        for (const cell of column) {
            cell.classList.remove('yellow');
            cell.classList.remove('red');
            cell.classList.remove('winningHighlight')
        }
      }
}


    
// check if avaialable space in column
function getAvailableSlot(columnIdxClicked) {
    for (let i = 5; i > -1; i--){
        if (gameBoard[i][columnIdxClicked] == -1) {
            return [i, columnIdxClicked]
        }
    } 
    alert(`Column full, dummy.`)
}


const getCellIdx = (cell) => {
    const classArray = cell.target.classList
    const rowClass = classArray[1];
    const colClass = classArray[2]; 
    const rowIdx = parseInt(rowClass[3]);
    const colIdx = parseInt(colClass[6]);
    return [rowIdx, colIdx];
  };



function checkPlayerTurn() {
    if (player1_Turn == true) {
        return 1 // red
    } else {
        return 2 // yellow
    }
}



function updateTurn() {
    if (player1_Turn == true) {
        player1_Turn = false;
        player1_TurnToken.classList.remove('red')
        player2_Turn = true;
        player2_TurnToken.classList.add('yellow')
    } else {
        player2_Turn = false;
        player2_TurnToken.classList.remove('yellow')
        player1_Turn = true;
        player1_TurnToken.classList.add('red')
    }
}


/**
 * WebGL / ThreeJS - background
 */

// Some of this is derived from Bruno Simon's 3JS Journey, 
// Source: https://threejs-journey.com/

// Canvas
const canvas = document.querySelector('canvas.webgl')

// // Debugging GUI
const gui = new dat.GUI({ width: 300 })

// Scene
const scene = new THREE.Scene()


// Textures for particles
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load('/textures/particles/2.png')


//Particle parameters
const parameters = {
    count: 66000,
    size: 0.022,
    radius: 5,
    forks: 8,
    curve: 1,
    randomness: 1.2,
    randomPower: 8,
    innerColor: '#00ffb3',
    outerColor: '#f1f514'

}

let geometry = null;
let material = null;
let particles = null;



const generateParticleFormation = () => {

    // Remove particles
    if(particles !== null) {
        geometry.dispose()
        material.dispose()
        scene.remove(particles)
    }

    // Geometry
    geometry = new THREE.BufferGeometry()

    // Array of x,y,z for vertex positions
    const positions = new Float32Array(parameters.count * 3)
    const colors = new Float32Array(parameters.count * 3)
    const randomness = new Float32Array(parameters.count * 3)
    const innerColor = new THREE.Color(parameters.innerColor)
    const outerColor = new THREE.Color(parameters.outerColor)
    const scales = new Float32Array(parameters.count * 1)

 
     for(let i = 0; i < parameters.count; i++)
     {
        //accesses every 3 elements in array
        const i3 = i * 3

        // Particle position calculations
        const radius = Math.random() * parameters.radius
        // every 3rd value, [0, .33, .66 | 0, .33, .66 | 0, .33, .66]...
        // Math.PI * 2 == 1 full circle
        const forkAngle = (i % parameters.forks) / parameters.forks * Math.PI * 2
        // further the particle is from center will increase the curveAngle
        const curveAngle = radius * parameters.curve

         
        //create random (x,y,z) positions, (multiply by -0.5 to get values between -.5 and 0.5)
        const randomX = Math.pow(Math.random(), parameters.randomPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomY = Math.pow(Math.random(), parameters.randomPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius
        const randomZ = Math.pow(Math.random(), parameters.randomPower) * (Math.random() < 0.5 ? 1 : - 1) * parameters.randomness * radius

        positions[i3    ] = Math.cos(forkAngle) * radius // position on x
        positions[i3 + 1] = 0 //position on y
        positions[i3 + 2] = Math.sin(forkAngle) * radius // position on z
    
        randomness[i3    ] = randomX
        randomness[i3 + 1] = randomY
        randomness[i3 + 2] = randomZ
         // Color
         const mixedInnerOuter = innerColor.clone()
         // lerp() gets the delta value from innerColor to outerColor (0 and 1)
         mixedInnerOuter.lerp(outerColor, radius / parameters.radius)

        colors[i3] = mixedInnerOuter.r
        colors[i3 + 1] = mixedInnerOuter.g
        colors[i3 + 2] = mixedInnerOuter.b

        // Scale
         scales[i] = Math.random()
     }
 
    //Create the Three.js BufferAttribute and specify that each peice of information is composed of 3 values
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1))
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3))
    
    
    // Materials
    // material = new THREE.PointsMaterial({
    //     size: parameters.size,
    //     sizeAttenuation: true,
    //     depthWrite: false,
    //     vertexColors: true,
    //     map: particleTexture,
    //     transparent: true,
    //     alphaMap: particleTexture,
    //     //  use blending to add the color of a particle to the color of another
    //     blending: THREE.AdditiveBlending
    //  })

    // Using Shader Material
    material = new THREE.ShaderMaterial({
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexColors: true,
        uniforms:
        {
            uTime: { value: 0 },
            uSize: { value: 25 * renderer.getPixelRatio() }
        },    
        vertexShader: vShader,
        fragmentShader: fShader
    })
    
    particles = new THREE.Points(geometry, material)
    scene.add(particles)

}


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
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true



// Tweaking parameters in GUI for count and size
const particleParameters = gui.addFolder('Particle Parameters')
particleParameters.close();
particleParameters.add(parameters, 'count').min(100).max(100000).step(100).onFinishChange(generateParticleFormation);
particleParameters.add(parameters, 'size').min(0.001).max(1.1).step(0.001).onFinishChange(generateParticleFormation);
particleParameters.add(parameters, 'radius').min(0.01).max(22).step(0.01).onFinishChange(generateParticleFormation);
particleParameters.add(parameters, 'forks').min(2).max(20).step(1).onFinishChange(generateParticleFormation);
particleParameters.add(parameters, 'curve').min(- 5).max(5).step(0.001).onFinishChange(generateParticleFormation);
particleParameters.add(parameters, 'randomness').min(0).max(2).step(0.001).onFinishChange(generateParticleFormation);
particleParameters.add(parameters, 'randomPower').min(1).max(10).step(0.001).onFinishChange(generateParticleFormation);
particleParameters.addColor(parameters, 'innerColor').onFinishChange(generateParticleFormation)
particleParameters.addColor(parameters, 'outerColor').onFinishChange(generateParticleFormation)
const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'x', 0, 10)
cameraFolder.add(camera.position, 'y', 0, 10)
cameraFolder.add(camera.position, 'z', 0, 10)
cameraFolder.close()




// Renderer (WebGl)
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(windowSize.width, windowSize.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))



generateParticleFormation()


// Update every frame
const clock = new THREE.Clock()

const frame = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // // Update camera and canvas
    // controls.update()

    // // Update particles
    // // Wave-like movement of particles using sin()
    // for (let i = 0; i < parameters.count; i++) {
    //  const i3 = i * 3
    //  const x = geometry.attributes.position.array[i3]
    //  geometry.attributes.position.array[i3 + 1] = elapsedTime + x * Math.PI
    
    // }
    // //three.js has to be notified that the geometry changed
    // geometry.attributes.position.needsUpdate = true

    // // Render
    // renderer.render(scene, camera)

    // // Call tick again on the next frame
    // window.requestAnimationFrame(frame)


    const elapsedTime = clock.getElapsedTime()

    // Update material
    material.uniforms.uTime.value = elapsedTime * 0.2

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(frame)


}

    frame()
