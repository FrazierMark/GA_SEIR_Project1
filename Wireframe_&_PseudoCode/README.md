# Connect 4
GA - SERI - Project 1

Pseudo Code

HTML / CSS

Game Layout - Start Screen
    - Center of screen is a 6 X 7 (blue) grid game board
    - Top of screen displays text title
    - Left of screen is Player 1 (text)
    - Right of screen is Player 2 (text)
    - If it's a Player's turn, a color (yellow or red) token will indicate their turn
    - Button at bottom that starts/restarts the game

    Layout - Game Play
    - As players take turns clicking the columns, the lowest available cell changes to their color (red or yellow)
    - If 4 cells in a row, (diagonal, vertical, horizontal) are same color, path is highlighted (player's color)

    Layout - Game end
    - If 4 cells of same color in a row, banner is displayed showing the winner
    - If all cells are full with no winner, banner displays "Tie Game"





JAVASCRIPT

1. Constants 
    - GameBoard/Grid - 6 X 7 2D-matirx to keep track of empty, yellow, or red cells
        - (negative->)-1 will represent empty cells, 0 will represent red, 1 will be yellow

        [
            [-1,-1,-1,-1,-1,-1,-1]
            [-1,-1,-1,-1,-1,-1,-1]
            [-1,-1,-1,-1,-1,-1,-1]
            [-1,-1,-1,-1,-1,-1,-1]
            [-1,-1,-1,-1,-1,-1,-1]
            [-1,-1,-1,-1,-1,-1,-1]
        ]

        - Hard part will be keeping track and aligning DOM grid with DATA grid
        - Need to organize DOM grid cell elements in order to apply color later

2. Variables
    -Variables within constant 2D array will be updated
    - Player's turn variable
        Player1_turn = true
        Player2_turn = false
    - Win/Lose variable
    - Keep track/cache values as the players fill grid?


3. Functions
    - init Function sets initial state of all variables
    - handleClick on columns (dropToken function?), will change empty cell to either yellow or red
        -if coulumn full, will disable click for column or alert user if column is full 
    - Check for winner(), will need to traverse a 2D matrix in multiple directions to find 4 continguous cels
        -BFS algo?
        -if winner found, trigger
    - gameOver function that display winning/draw message(),
    - render function(), take state varibales to represent on the DOM
        -updates grid cell colors based on const gameBoard

4. Event Listeners
    - cell/grid/colummn event listener, onClick triggers dropToken function
    - play/replay button event listener, onClick triggers init function
