/* eslint-disable no-unused-vars */
import { Board } from "./class-Board.js";
import { sqs } from "./mods/mod-sqs.js";
import { file } from "./mods/mod-file.js";
import { dom } from "./dom.js";
import { calc } from "./calc/mod-calc.js";

const board = new Board();
let state;
let move;

// let move = calc.findMove(board);

export function getState() {
    return state;
}

export function start() {
    board.resetAll();
    state = new SetupMode();
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

export const buttonAction = {
    reset() {
        if (confirm("Reset back to empty board - are you sure?")) {
            start();
        }
    },
    restart() {
        if (confirm("Return to start position - are you sure?\nAll progress will be lost")) {
            file.loadStart(board);
            state = new SetupMode();
        }
    },
    done() {
        file.saveStart(board);
        state = new GameMode();
    },
    forward() {
        file.forwardGame(board);
        dom.displayBoard(board);
        state = new GameMode(); // better to display DOM?
    },
    back() {
        file.backGame(board);
        dom.displayBoard(board);
        state = new GameMode();
    },
    recalc() {
            board.recalculateAllNotes();
            dom.displayBoard(board);
            file.saveGame(board);
    },
    clue() {
        move = calc.findMove(board);
        if (move) {
            state = new HintMode(false);
        }
    },
    show() {
        state = new HintMode(true);
    },
    hide() {
        dom.removeMove();
        state = new GameMode();
    },
};

const action = {
    removeNote(i, j) {
        board.removeNote(i, j);
        dom.displayRemoveNote(i, j);
        file.saveGame(board);
    },
    reinstateMissingNote(i, j) {
        if (sqs.peers[i].every((sq) => board.getValue(sq) !== j)) {
            board.addNote(i, j);
            dom.displayAddNote(i, j);
            file.saveGame(board);
        }
    },
    setValue(i, j) {
        board.setValue(i, j);
        dom.displayBoard(board);
        file.saveGame(board);
        state = board.isComplete() ? new EndMode() : new GameMode();
    },
    undoValue(i) {
        board.undoValue(i);
        dom.displayBoard(board);
        file.saveGame(board);
        state = new GameMode();
    },
    setValueOrRemoveNote(i, j) {
        if (board.noteCount(i) === 1) {
            this.setValue(i, j);
        } else {
            this.removeNote(i, j);
        }
    },
};

class EndMode {
    constructor(bool) {
        dom.displayButtons(["back", "restart", "reset"]);
        dom.displayMessage("Congratulations!");
        dom.displayDescription("");
    }

    valueClick(i) {
        if (file.getStartPosition()[i]) return;
        action.undoValue(i);
        state = new GameMode();
    }

    valueClickRight(i) {
        this.valueClick(i);
    }
}

class HintMode {
    constructor(bool) {
        if (bool) {
            dom.displayMove(move);
            dom.displayButtons(["hide"]);
            dom.displayMessage(move.type);
            dom.displayDescription(move.description);
        } else {
            if (move.type !== "Naked Single") {
                dom.displayMoveLineSqs(move);
            }
            dom.displayButtons(["show", "hide"]);
            dom.displayDescription(move.hint);
            dom.displayMessage(move.type);
        }
    }

    valueClick(i) {
        if (file.getStartPosition()[i]) return;
        action.undoValue(i);
    }

    valueClickRight(i) {
        this.valueClick(i);
    }

    presentNoteClick(i, j) {
        action.setValue(i, j);
    }

    presentNoteClickRight(i, j) {
        action.setValueOrRemoveNote(i, j);
        if (move.deadNotes.every((e) => !board.hasNote(e.cell, e.note))) {
            dom.removeMove();
            state = new GameMode();
        }
    }

    missingNoteClick(i, j) {
        action.reinstateMissingNote(i, j);
    }

    missingNoteClickRight(i, j) {
        this.missingNoteClick(i, j);
    }
}

class GameMode {
    constructor() {
        dom.displayButtons(["clue", "recalc", "back", "forward", "restart", "reset"]);
        dom.displayMessage("Get solving!");
        dom.displayDescription("Use both mouse buttons to toggle values and notes");
    }

    valueClick(i) {
        if (file.getStartPosition()[i]) return;
        action.undoValue(i);
    }

    valueClickRight(i) {
        this.valueClick(i);
    }

    presentNoteClick(i, j) {
        action.setValue(i, j);
    }

    presentNoteClickRight(i, j) {
        action.setValueOrRemoveNote(i, j);
    }

    missingNoteClick(i, j) {
        action.reinstateMissingNote(i, j);
    }

    missingNoteClickRight(i, j) {
        action.reinstateMissingNote(i, j);
    }
}

class SetupMode {
    constructor() {
        dom.displayBoard(board);
        dom.displayButtons(["done", "reset"]);
        dom.displayMessage("Create start position");
        dom.displayDescription("Click done when ready");
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
                ? "Cell has no notes available - undo or reset"
                : "Highlighted cells have insufficient notes available - undo or reset";
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
