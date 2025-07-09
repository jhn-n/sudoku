import squares from "./squares-mod.js";

export default { saveStart, loadStart, saveGame, loadGame };

const MaxNumberSavedGames = 100;
const startPosition = [];
const gamePositions = [];

function saveStart() {
    startPosition.length = 0;
    squares.all.forEach((sq) => {
        const cloneCell = this.cells[sq].clone();
        startPosition.push(cloneCell);
    });
}

function loadStart() {
    if (startPosition.length !== 81) {
        return;
    }
    this.cells.length = 0;
    startPosition.forEach((cell) => {
        const cloneCell = cell.clone();
        this.cells.push(cloneCell);
    });
}

function saveGame() {
    while (gamePositions.length >= MaxNumberSavedGames) {
        gamePositions.shift();
    }
    const cellsClone = [];
    squares.all.forEach((sq) => {
        const cloneCell = this.cells[sq].clone();
        cellsClone.push(cloneCell);
    });
    gamePositions.push(cellsClone);
}

function loadGame() {
    if (gamePositions.length === 0) {
        return;
    }
    const cellsToLoad = gamePositions.pop();
    if (cellsToLoad.length !== 81) {
        return;
    }
    this.cells.length = 0;
    cellsToLoad.forEach((cell) => {
        const cloneCell = cell.clone();
        this.cells.push(cloneCell);
    });
}
