import { sqs } from "./mods/mod-sqs.js";
import { getState, buttonAction } from "./control.js";

const gridNode = document.querySelector(".grid");
const buttonsNode = document.querySelector(".buttonContainer");
const messageNode = document.querySelector("#message");
const descriptionNode = document.querySelector("#description");

let invalidDisplayed = null;
let moveDisplayed = null;

function displayBoard(board) {
    gridNode.innerHTML = "";

    for (const i of sqs.all) {
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.classList.add(`row${sqs.rowOf(i)}`);
        newCell.classList.add(`col${sqs.columnOf(i)}`);

        if (board.hasValue(i)) {
            newCell.classList.add("value");
            newCell.innerText = board.getValue(i);
            newCell.addEventListener("click", () => {
                const state = getState();
                state.valueClick(i);
            });
            newCell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                const state = getState();
                state.valueClickRight(i);
            });
        } else {
            newCell.classList.add("notes");
            for (let j = 1; j <= 9; j++) {
                const newNote = document.createElement("div");
                newNote.classList.add("note");
                newNote.innerText = j;
                const indicator = board.hasNote(i, j) ? "yes" : "no";
                newNote.classList.add(indicator);
                newNote.addEventListener("click", () => {
                    const state = getState();
                    if (board.hasNote(i, j)) {
                        state.presentNoteClick(i, j);
                    } else {
                        state.missingNoteClick(i, j);
                    }
                });
                newNote.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    const state = getState();
                    if (board.hasNote(i, j)) {
                        state.presentNoteClickRight(i, j);
                    } else {
                        state.missingNoteClickRight(i, j);
                    }
                });
                newCell.appendChild(newNote);
            }
        }
        gridNode.appendChild(newCell);
    }
}

function displayButtons(buttonTexts) {
    buttonsNode.innerHTML = "";
    for (const button of buttonTexts) {
        const newButton = document.createElement("div");
        const newPopup = document.createElement("div");
        newButton.classList.add(button);
        newButton.classList.add("button");
        newPopup.classList.add("button-popup");
        newPopup.innerText = button;
        newButton.addEventListener("click", () => {
            buttonAction[button]();
        });
        newButton.appendChild(newPopup);
        buttonsNode.appendChild(newButton);
    }
}

function displayMessage(message) {
    messageNode.innerText = message;
}

function displayDescription(description) {
    descriptionNode.innerText = description;
}

function displayMove(move) {
    if (!move) {
        return;
    }
    for (const sq of move.lineSqs) {
        gridNode.children[sq].classList.add("move-line");
    }
    for (const keyNote of move.keyNotes) {
        const cellNode = gridNode.children[keyNote.cell];
        cellNode.children[keyNote.note - 1].classList.add("move-keynote");
    }
    for (const deadNote of move.deadNotes) {
        const cellNode = gridNode.children[deadNote.cell];
        cellNode.children[deadNote.note - 1].classList.add("move-deadnote");
    }
    moveDisplayed = move;
}

function displayMoveLineSqs(move) {
    if (!move) {
        return;
    }
    for (const sq of move.lineSqs) {
        gridNode.children[sq].classList.add("move-line");
    }
    moveDisplayed = move;
}

function removeMove() {
    if (!moveDisplayed) {
        return;
    }
    console.log(moveDisplayed);
    for (const sq of moveDisplayed.lineSqs) {
        gridNode.children[sq].classList.remove("move-line");
    }
    for (const keyNote of moveDisplayed.keyNotes) {
        const cellNode = gridNode.children[keyNote.cell];
        if (cellNode.classList.contains("value")) break;
        console.log(keyNote.cell, cellNode);
        console.log(keyNote.note);
        cellNode.children[keyNote.note - 1].classList.remove("move-keynote");
    }

    for (const deadNote of moveDisplayed.deadNotes) {
        const cellNode = gridNode.children[deadNote.cell];
        if (cellNode.classList.contains("value")) break;
        cellNode.children[deadNote.note - 1].classList.remove("move-deadnote");
    }
    moveDisplayed = null;
}

function displayInvalid(report) {
    if (!report) {
        return;
    }
    for (const cell of report.line) {
        gridNode.children[cell].classList.add("invalid-line");
    }
    for (const cell of report.squares) {
        gridNode.children[cell].classList.add("invalid-square");
    }
    invalidDisplayed = report;
}

function removeInvalid() {
    if (!invalidDisplayed) {
        return;
    }
    for (const cell of invalidDisplayed.line) {
        gridNode.children[cell].classList.remove("invalid-line");
    }
    for (const cell of invalidDisplayed.squares) {
        gridNode.children[cell].classList.remove("invalid-square");
    }
    invalidDisplayed = null;
}

function displayAddNote(i, j) {
    const noteNode = gridNode.children[i].children[j - 1];
    noteNode.classList.remove("no");
    noteNode.classList.add("yes");
}

function displayRemoveNote(i, j) {
    const noteNode = gridNode.children[i].children[j - 1];
    noteNode.classList.remove("yes");
    noteNode.classList.add("no");
}

export const dom = {
    displayBoard,
    displayButtons,
    displayMessage,
    displayDescription,
    displayMove,
    displayMoveLineSqs,
    removeMove,
    displayInvalid,
    removeInvalid,
    displayAddNote,
    displayRemoveNote,
};
