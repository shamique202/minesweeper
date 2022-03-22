// myconstants
const sizeBoarding = {
    's': 9,
    'l': 17
}

const numberMines = {
        's': 11,
        'l': 40,
    }
    // app's state variables 
let theBoard;
let theSeconds = 0;
let theInterval = null;
let theSize;
let newGames = true;
let finishedGame = false;