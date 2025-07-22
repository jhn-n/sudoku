const MaxNumberSavedGames = 100;
let startPosition;
const gamePositions = [];
// to add forward button!!

function saveStart(board) {
    startPosition = board.clone();
}

function loadStart(board) {
    try {
        board.upload(startPosition);
    } catch (e) {
        console.error(`Could not load start position!\n${e}`);
    }
}

function saveGame(board) {
    console.time("saveGame");
    while (gamePositions.length >= MaxNumberSavedGames) {
        gamePositions.shift();
    }
    gamePositions.push(board.clone());
    console.timeEnd("saveGame");
}

function loadGame(board) {
    if (gamePositions.length === 0) {
        return;
    }
    try {
        board.upload(gamePositions.pop());
    } catch (e) {
        console.error(`Could not load position!\n${e}`);
    }
}

export const file = { saveStart, loadStart, saveGame, loadGame };
