import { Cell } from "./cell-class";
import squares from "./squares-mod";

export default {
    start,
    reset,
    finishedSetup,
    clue,
    removeClue,
    buttonStatus,
    backToStart,
    undoMove,
};

function start() {
    this.reset();

    const squares = [
        0, 1, 2, 5, 12, 14, 16, 18, 23, 29, 31, 33, 34, 35, 36, 40, 41, 47, 52, 57, 59,
        62, 71, 76, 78, 80,
    ];
    const values = [
        6, 8, 7, 4, 3, 9, 7, 9, 8, 5, 3, 1, 6, 7, 4, 7, 1, 3, 8, 2, 7, 3, 5, 9, 8, 4,
    ];
    for (let i = 0; i < squares.length; i++) {
        this.cells[squares[i]].value = values[i];
        this.cells[squares[i]].notes = 0;
    }
    this.recalculateNotesFromValues();
    this.display();
}

function reset() {
    squares.all.forEach((i) => (this.cells[i] = new Cell()));
    this.setupMode = true;
    this.validGame = true;
    this.message = "Create start position";
    this.description = "Click done button when complete";
    this.display();
    this.buttonStatus("setup");
}

function finishedSetup() {
    this.displayRemoveInvalid();
    this.validGame = this.gameIsValid();
    if (this.validGame) {
        this.saveStart();
        this.setupMode = false;
        this.message = "Get solving!";
        this.description = "";
        this.display();
        this.buttonStatus("normal");
    }
}

function backToStart() {
    this.loadStart();
    this.finishedSetup();
}

function undoMove() {
    this.loadGame();
    this.display();
}

function clue() {
    console.time("clue");
    let moves;
    for (let i = 1; i < 5; i++) {
        moves = this.onlyValues(i);
        if (moves.length > 0) {
            this.displayMove(moves[0]);
            this.move = moves[0];
            this.buttonStatus("clue");
            break;
        }
        moves = this.onlyPlaces(i);
        if (moves.length > 0) {
            this.displayMove(moves[0]);
            this.move = moves[0];
            this.buttonStatus("clue");
            break;
        }
    }
    console.timeEnd("clue");
}

function removeClue() {
    if (this.move) {
        this.displayRemoveMove(this.move);
    }
    this.buttonStatus("normal");
    this.move = null;
}

function buttonStatus(code) {
    switch (code) {
        case "setup":
            this.buttonText = ["done", "reset"];
            break;
        case "normal":
            this.buttonText = ["clue", "start", "reset", "undo"];
            break;
        case "clue":
            this.buttonText = ["remove"];
            break;
    }
    this.displayButtons();
}
