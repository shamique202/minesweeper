//myconstants
let sizeBoarding = {
    's': 9,
    'l': 17
}

let numberMines = {
    's': 11,
    'l': 40,
}

//my app's state variables
let theBoard;
let theSeconds = 0;
let theInterval = null;
let theSize;
let newGames = true;
let finishedGame = false;

//my cached elements
let boardGameEl = document.getElementById('boardGame');
let h3El = document.querySelector('h3');
let minestoLeftEl = document.getElementById('minestoLeft');
let timerEl = document.getElementById('timer');
let easyDifEl = document.getElementById('s');
let hardDifEl = document.getElementById('l');
let myButtonsEl = document.getElementById('mybuttons');

//my eventlisteners
boardGameEl.addEventListener('click', handleClick);
boardGameEl.addEventListener('contextmenu', handler);
easyDifEl.addEventListener('click', init);
hardDifEl.addEventListener('click', init);
document.getElementById('reset').addEventListener('click', resetBtn);

//my functions below
function init(e) {
    size = e.target.id;
    finishedGame = false;

    styleboardGame(size);
    createBoardGameDivs(size);
    createBoardGameArray(size);
}

//Whichever level a player chooses, the game changes from easy to hard / the level changes
function styleboardGame(size) {
    myButtonsEl.style.display = 'none';
    boardGameEl.innerHTML = '';

    boardGameEl.style.backgroundColor = '#FABDD8';
    boardGameEl.style.border = '3px solid black';
    boardGameEl.style.display = 'grid';
    boardGameEl.style.marginTop = '39px';
    boardGameEl.style.textAlign = 'center';
    boardGameEl.style.justifyContent = 'center';
    boardGameEl.style.margin = '31px auto';

    // game board increases here ( easy or hard ) 

    if (size === 's') {
        boardGameEl.style.width = '245px';
        boardGameEl.style.gridTemplateColumns = 'repeat(9, 27px)';
        boardGameEl.style.gridTemplateRows = 'repeat(9, 27px)';
        h3El.innerText = 'good job!';
    }
    if (size === 'l') {
        boardGameEl.style.width = '433px';
        boardGameEl.style.gridTemplateColumns = 'repeat(16, 27px)';
        boardGameEl.style.gridTemplateRows = 'repeat(16, 27px)';
        h3El.innerText = `...you're definitely gonna need it`
    }
    minestoLeftEl.innerText = numberMines[size];
    timerEl.innerText = `00:00`;
}
//make boardelements in the d.o.m.
funtion createBoardGameDivs(size) {
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            let newDiv = document.createElement('div');
            newDiv.id = `c${j}r${i}`;
            newDiv.style.border = '1px pink';
            newDiv.style.borderTopColor = 'white';
            newDiv.style.borderLeftColor = 'white';
            newDiv.style.fontSize = '20px';
            boardGameEl.appendChild(newDiv);
        }
    }
}

//creates the board elements in a 2 D array consisting of objects
function createBoardGameArray(size) {
    board = [];
    for (let i = 0; i < sizeBoarding[size]; i++) {
        board[i] = [];
    }
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            board[i][j] = {
                pos: `c${j}r${i}`,
                isMine: false,
                revealed: false,
                surroundsMines: 0,
                isEmpty: false,
                hasFlag: false
            }
        }
    }
}

function render(c, r) {
    //grabs the square's div 
    let squareEl = document.getElementById(`c${c}r${r}`);

    //render the squares depending on whether or not there are bombs present or not
    if (board[c][r].isMine) {
        if (board[c][r].hasFlag) {
            squareEl.removeChild(document.getElementById(`c${c}r${r}img`));
        }
        finishedGame = true;
        let bombImage = document.createElement('img');

        bombImage.src = 'https://i.imgur.com/rhHig5q.png';
        bombImage.style.width = '14px';
        bombImage.style.height = '14px';

        squareEl.append(bombImage);
    } else {
        board[c][r].revealed = true;

        squareEl.style.backgroundColor = '#F767A6';
        //shows other squares thats close by if the chosen square isempty
        if (board[c][r].isEmpty) {
            revealNearbyEmpties(c, r);
        } else {
            //Styles the numbers and squares after they are revealed
            styleNumbers(squareEl, c, r);
        }
    }
}
//each square is designed according to the number of mines nearby
function styleNumbers(squareEl, c, r) {
    squareEl.style.backgroundColor = '#F767A6';
    squareEl.style.borderRightColor = 'white';
    squareEl.style.borderBottomColor = 'white';

    squareEl.innerText = board[c][r].surroundsMines;

    if (board[c][r].surroundsMines === 1) {
        squareEl.style.color = 'red';
    }
    if (board[c][r].surroundsMines === 2) {
        squareEl.style.color = 'blue';
    }
    if (board[c][r].surroundsMines === 3) {
        squareEl.style.color = 'green';
    }
    if (board[c][r].surroundsMines === 4) {
        squareEl.style.color = 'purple';
    }
    if (board[c][r].surroundsMines === 5) {
        squareEl.style.color = 'orange';
    }
}
//the player wins if the squares that don't have mines are revealed
function checkWinner() {
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            if (!(board[i][j].isMine) && !(board[i][j].revealed)) {
                return;
            }
        }
    }
    finishedGame = true;
    clearInterval(interval);
    // player wins!
    h3El.innerText = 'Congratulations!';
}

function placeMines(e) {
    //put mines anywhere on the board
    let idOfEl = e.target.id;
    //finds the row and column of the div from the elements id
    const ind = (idOfEl).indexOf('r');
    let col = parseInt((idOfEl).substring(1, ind));
    let row = parseInt((idOfEl).substring(ind + 1, (idOfEl).length));
    let mines1to10 = 1;
    let r = 0;
    let c = 0;
    while (mines1to10 <= numberMines[size]) {
        //finds 2 random numbers to place on a random board slot

        r = Math.floor(Math.random() * sizeBoarding[size]);
        c = Math.floor(Math.random() * sizeBoarding[size]);

        //puts a mine on any random spot & calls asignNumbers
        if ((!board[c][r].isMine) && (board[col][row] !== board[c][r])) {
            board[c][r].isMine = true;
            asignNumbers(c, r);
            mines1to10++;
        }
    }
}
//Finds all empty spots on the board & then marks it
function findEmptySpaces() {
    for (let i = 0; i < sizeBoarding[size]; i++) {
        for (let j = 0; j < sizeBoarding[size]; j++) {
            if (board[i][j].surroundsMines === 0) {
                if (board[i][j].isMine === false) {
                    board[i][j].isEmpty = true;
                }
            }
        }
    }
}