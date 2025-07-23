import { Board } from "./class-Board";
import { sqs } from "./mod-sqs.js";
import { cmb } from "./mod-cmb.js";
import { bit } from "./mod-bit.js";
import { file } from "./mod-file.js";
import { dom } from "./mod-dom.js";
import { vld } from "./mod-vld.js";

const board = new Board();
let state;
let invalidPosition;

export function getState() {
    return state;
}

export function start() {
    board.resetAll();
    invalidPosition = false;
    state = new SetupMode();
}

class GameMode {
    constructor() {
        this.standardButtons = ["restart", "back", "forward", "reset"];
        this.standardMessage = "Time to get started!";
        this.standardDescription = "Use both mouse buttons to toggle values and notes";
        dom.displayBoard(board);
        dom.displayButtons(this.standardButtons);
        dom.displayMessage(this.standardMessage);
        dom.displayDescription(this.standardDescription);
        checkPositionValidity();
    }

    valueClick(i) {
        file.saveGame(board);
        board.undoValue(i);
        dom.displayBoard(board);
        if (invalidPosition) {
            checkPositionValidity();
        }
    }

    valueClickRight(i) {
        this.valueClick(i);
    }

    presentNoteClick(i, j) {
        if (invalidPosition) return;
        file.saveGame(board);
        board.setValue(i, j);
        dom.displayBoard(board);
        checkPositionValidity();
    }

    presentNoteClickRight(i, j) {
        if (invalidPosition) return;
        file.saveGame(board);
        if (board.noteCount(i) === 1) {
            board.setValue(i, j);
            dom.displayBoard(board);
        } else {
            board.removeNote(i, j);
            dom.displayRemoveNote(i, j);
        }
        checkPositionValidity();
    }
    missingNoteClick(i, j) {
        if (sqs.neighbours[i].every((sq) => board.getValue(sq) !== j)) {
            file.saveGame(board);
            board.addNote(i, j);
            dom.displayAddNote(i, j);
            if (invalidPosition) {
                checkPositionValidity();
            }
        }
    }
    missingNoteClickRight(i, j) {
        this.missingNoteClick(i, j);
    }

    buttonClick(type) {
        switch (type) {
            case "back":
                file.loadGame(board);
                state = new GameMode();
                break;
            case "restart":
                file.loadStart(board);
                state = new GameMode();
                break;
            case "reset":
                start();
                break;
        }
    }
}

class SetupMode {
    constructor() {
        this.standardButtons = ["done", "reset"];
        this.standardMessage = "Create start position";
        this.standardDescription = "Click done button when complete";
        dom.displayBoard(board);
        dom.displayButtons(this.standardButtons);
        dom.displayMessage(this.standardMessage);
        dom.displayDescription(this.standardDescription);
    }

    valueClick(i) {
        board.undoValue(i);
        dom.displayBoard(board);
        if (invalidPosition) {
            checkPositionValidity();
        }
    }
    valueClickRight(i) {
        this.valueClick(i);
    }
    presentNoteClick(i, j) {
        if (invalidPosition) return;
        board.setValue(i, j);
        dom.displayBoard(board);
        checkPositionValidity();
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
                if (this.invalidPosition) return;
                console.log("Done with setup");
                file.saveStart(board);
                state = new GameMode();
                break;
            case "reset":
                start();
                break;
        }
    }
}

function checkPositionValidity() {
    const invalidSubset = vld.findInvalidSubset(board);
    if (invalidSubset) {
        const buttonsSubset = state.standardButtons.filter(
            (b) => b === "restart" || b === "reset",
        );
        const invalidDescription =
            (invalidSubset.line.length === 0
                ? "Highlighted cell has no possible values left"
                : "Not enough unique values available for highlighted cells") +
            "\nClick on values to undo";
        
        dom.displayInvalid(invalidSubset);
        dom.displayButtons(buttonsSubset);
        dom.displayMessage("Invalid position");
        dom.displayDescription(invalidDescription);
        invalidPosition = true;
        return;
    }
    if (invalidPosition === true) {
        dom.removeInvalid(invalidSubset);
        dom.displayButtons(state.standardButtons);
        dom.displayMessage(state.standardMessage);
        dom.displayDescription(state.standardDescription);
        invalidPosition = false;
        return;
    }
}
