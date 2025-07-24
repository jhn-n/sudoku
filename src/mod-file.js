const MaxNumberSavedGames = 100;
let startPosition;
let gamePositionPtr;
const gamePositions = [];

function getStartPosition() {
    return startPosition;
}

function saveStart(board) {
    startPosition = board.cloneValues();
    gamePositions.length = 0;
    gamePositionPtr = -1;
    saveGame(board);
}

function loadStart(board) {
    try {
        board.uploadValues(startPosition);
    } catch (e) {
        console.error(`Could not load start position!\n${e}`);
    }
}

function saveGame(board) {
    while (gamePositions.length >= MaxNumberSavedGames) {
        gamePositions.shift();
        gamePositionPtr -= 1;
    }
    gamePositions.length = gamePositionPtr + 1;
    gamePositions.push(board.cloneAll());
    gamePositionPtr += 1;
}

function backGame(board) {
    if (gamePositionPtr === 0) return;
    gamePositionPtr -= 1;
    try {
        board.uploadAll(gamePositions[gamePositionPtr]);
    } catch (e) {
        console.error(`Could not load position in backGame!\n${e}`);
    }
}

function forwardGame(board) {
    if (gamePositions.length === gamePositionPtr + 1) return;
    gamePositionPtr += 1;
    try {
        board.uploadAll(gamePositions[gamePositionPtr]);
    } catch (e) {
        console.error(`Could not load position in forwardGame!\n${e}`);
    }
}

export const file = {
    getStartPosition,
    saveStart,
    loadStart,
    saveGame,
    backGame,
    forwardGame,
};
