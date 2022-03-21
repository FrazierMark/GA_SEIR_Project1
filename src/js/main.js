import '../css/main.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

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
function check4InARow (a, b, c, d) {
    // Check first cell is not empty, and matching cells
    return ((a != -1) && (a == b) && (b == c) && (c == d))
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



// // Debugging GUI
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()


// Textures for particles
 const textureLoader = new THREE.TextureLoader()
 const particleTexture = textureLoader.load('/textures/particles/2.png')

//Particle parameters
const parameters = {}
parameters.count = 1000
parameters.size = 0.02

//
const generateParticleFormation = () => {
    // Geometry
     const geometry = new THREE.BufferGeometry()

    // Array of x,y,z for vertex positions
     const positions = new Float32Array(parameters.count * 3)
 
     for(let i = 0; i < parameters.count; i++)
     {
         //accesses every 3 elements in array
         const i3 = i * 3
 
         positions[i3    ] = (Math.random() - 0.5) * 3
         positions[i3 + 1] = (Math.random() - 0.5) * 3
         positions[i3 + 2] = (Math.random() - 0.5) * 3
     }
 
     geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    // Materials
     const material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
     })
    
     const points = new THREE.Points(geometry, material)
     scene.add(points)

}
generateParticleFormation()


// random color's array
// const colors = new Float32Array(parameters.count * 3)
// for (let i = 0; i < count * 3; i++) { // Multiply by 3 cause, x, y, z
//     positions[i] = (Math.random() - 0.5) * 10 // Math.random() -0.5 creates value between -0.5 and +0.5
//     // create random red, green, blue value for each particle
//     colors[i] = Math.random()
// }

// Create the Three.js BufferAttribute and specify that each peice of information is composed of 3 values
// particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3)) 

// particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// //Material
// const particlesMaterial = new THREE.PointsMaterial({
//     size: 0.1,
//     sizeAttenuation: true
// })
// // activate vertexColors
// particlesMaterial.vertexColors = true;
// particlesMaterial.map = particleTexture
// particlesMaterial.transparent = true;
// particlesMaterial.alphaMap = particleTexture
// particlesMaterial.depthWrite = false
// //  use blending to add the color of that pixel to the color of the pixel already drawn
// particlesMaterial.blending = THREE.AdditiveBlending;



// //Points
// //Creates the particles (in a sphere shape cause of SphereBufferGeometry)
// const particles = new THREE.Points(particlesGeometry, particlesMaterial)
// scene.add(particles)


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
    // for (let i = 0; i < count; i++) {
    //     const i3 = i * 3

    //     const x = particlesGeometry.attributes.position.array[i3]
    //     particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
    //     // The y coordinate can be access in the array at the index i3 + 1:
    //    // particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime)
    // }
    // // The problem is that Three.js has to be notified that the geometry changed
    // particlesGeometry.attributes.position.needsUpdate = true 


    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

    tick()
