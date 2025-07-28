/* eslint-disable no-unused-vars */
import { Board } from "./class-Board.js";
import { sqs } from "./mods/mod-sqs.js";
import { file } from "./file.js";
import { dom } from "./dom.js";
import { calc } from "./moves/move-index.js";

const board = new Board();
let state;

export function getState() {
    return state;
}

export function startDefault() {
    board.resetAll();
    const squares = [
        0, 1, 2, 5, 12, 14, 16, 18, 23, 29, 31, 33, 34, 35, 36, 40, 41, 47, 52, 57, 59,
        62, 71, 76, 78, 80,
    ];
    const values = [
        6, 8, 7, 4, 3, 9, 7, 9, 8, 5, 3, 1, 6, 7, 4, 7, 1, 3, 8, 2, 7, 3, 5, 9, 8, 4,
    ];
    squares.forEach((s, i) => board.setValue(s, values[i]));
    state = new SetupMode();
}

export function start() {
    board.resetAll();
    state = new SetupMode();
}

function reset() {
    if (confirm("Reset all values - are you sure?")) {
        start();
    }
}

function restart() {
    if (confirm("Go back to start position - are you sure?")) {
        file.loadStart(board);
        state = new SetupMode();
    }
}

class GameMode {
    constructor() {
        dom.displayBoard(board);
        dom.displayButtons(["clue", "recalc", "back", "forward", "restart", "reset"]);
        dom.displayMessage("Over to you!");
        dom.displayDescription("Use both mouse buttons to toggle values and notes");
    }

    valueClick(i) {
        const startPosition = file.getStartPosition();
        if (startPosition[i]) return;
        board.undoValue(i);
        dom.displayBoard(board);
        file.saveGame(board);
    }

    valueClickRight(i) {
        this.valueClick(i);
    }

    presentNoteClick(i, j) {
        board.setValue(i, j);
        dom.displayBoard(board);
        file.saveGame(board);
    }

    presentNoteClickRight(i, j) {
        if (board.noteCount(i) === 1) {
            this.presentNoteClick(i, j);
        } else {
            board.removeNote(i, j);
            dom.displayRemoveNote(i, j);
            file.saveGame(board);
        }
    }

    missingNoteClick(i, j) {
        if (sqs.peers[i].every((sq) => board.getValue(sq) !== j)) {
            board.addNote(i, j);
            dom.displayAddNote(i, j);
            file.saveGame(board);
        }
    }

    missingNoteClickRight(i, j) {
        this.missingNoteClick(i, j);
    }

    buttonClick(type) {
        switch (type) {
            case "recalc":
                file.saveGame(board);
                board.recalculateAllNotes();
                dom.displayBoard(board);
                break;
            case "back":
                file.backGame(board);
                state = new GameMode();
                break;
            case "forward":
                file.forwardGame(board);
                state = new GameMode();
                break;
            case "restart":
                restart();
                break;
            case "reset":
                reset();
                break;
        }
    }
}

class SetupMode {
    constructor() {
        dom.displayBoard(board);
        dom.displayButtons(["done", "reset"]);
        dom.displayMessage("Create start position");
        dom.displayDescription("Click done button when complete");
    }

    valueClick(i) {
        board.undoValue(i);
        dom.displayBoard(board);
    }

    valueClickRight(i) {
        this.valueClick(i);
    }

    presentNoteClick(i, j) {
        board.setValue(i, j);
        dom.displayBoard(board);
        this.#checkIfPositionInvalid();
    }

    presentNoteClickRight(i, j) {
        this.presentNoteClick(i, j);
    }

    missingNoteClick(i, j) {
        return;
    }

    missingNoteClickRight(i, j) {
        return;
    }

    buttonClick(type) {
        switch (type) {
            case "done":
                console.log("Done with setup");
                file.saveStart(board);
                state = new GameMode();
                break;
            case "reset":
                reset();
                break;
        }
    }

    #checkIfPositionInvalid() {
        const invalidSubset = board.findInvalidSubset();
        if (invalidSubset) {
            state = new InvalidMode(invalidSubset);
        }
    }
}

class InvalidMode {
    constructor(invalidSubset) {
        const standardDescription =
            invalidSubset.line.length === 0
                ? "Cell has no notes available - undo incorrect values"
                : "Cells have insufficient notes available - undo incorrect values";
        dom.displayInvalid(invalidSubset);
        dom.displayButtons(["reset"]);
        dom.displayMessage("Invalid position");
        dom.displayDescription(standardDescription);
    }

    valueClick(i) {
        board.undoValue(i);
        dom.displayBoard(board);
        this.#checkIfPositionValid();
    }

    valueClickRight(i) {
        this.valueClick(i);
    }

    presentNoteClick(i, j) {
        return;
    }

    presentNoteClickRight(i, j) {
        return;
    }

    missingNoteClick(i, j) {
        return;
    }

    missingNoteClickRight(i, j) {
        return;
    }

    buttonClick(type) {
        switch (type) {
            case "reset":
                reset();
                break;
        }
    }

    #checkIfPositionValid() {
        dom.removeInvalid();
        const invalidSubset = board.findInvalidSubset();
        if (invalidSubset) {
            state = new InvalidMode(invalidSubset);
        } else {
            state = new SetupMode();
        }
    }
}
