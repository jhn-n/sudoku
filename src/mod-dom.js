import { sqs } from "./mod-sqs.js";
import { tri } from "./method-click-triage.js";

const gridNode = document.querySelector(".grid");
const buttonsNode = document.querySelector(".buttonContainer");
const message = document.querySelector("#message");
const description = document.querySelector("#description");

let invalidDisplayed = null;
let moveDisplayed = null;

function displayGrid(board) {
    gridNode.innerHTML = "";

    for (const i of sqs.all) {
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.classList.add(`row${sqs.rowOf(i)}`);
        newCell.classList.add(`col${sqs.columnOf(i)}`);

        if (board.hasValue(i)) {
            newCell.classList.add("value");
            newCell.innerText = board.getValue(i);
            newCell.addEventListener("click", () => tri.valueClick(i));
            newCell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                tri.rightValueClick(i);
            });
        } else {
            newCell.classList.add("notes");
            for (let j = 1; j <= 9; j++) {
                const newNote = document.createElement("div");
                newNote.classList.add("note");
                newNote.innerText = j;
                const indicator = board.hasNote(i, j) ? "yes" : "no";
                newNote.classList.add(indicator);
                newNote.addEventListener("click", () => tri.noteClick(i, j));
                newNote.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    tri.rightNoteClick(i, j);
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
        newButton.classList.add("button");
        newButton.innerText = button;
        newButton.addEventListener("click", () => this.buttonClick(button));
        buttonsNode.appendChild(newButton);
    }
}

function displayMessage() {
    message.innerText = this.message;
}

function displayDescription() {
    description.innerText = this.description;
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

function removeMove() {
    if (!moveDisplayed) {
        return;
    }
    for (const sq of moveDisplayed.lineSqs) {
        gridNode.children[sq].classList.remove("move-line");
    }
    for (const keyNote of moveDisplayed.keyNotes) {
        const cellNode = gridNode.children[keyNote.cell];
        cellNode.children[keyNote.note - 1].classList.remove("move-keynote");
    }

    for (const deadNote of moveDisplayed.deadNotes) {
        const cellNode = gridNode.children[deadNote.cell];
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
    displayGrid,
    displayButtons,
    displayMessage,
    displayDescription,
    displayMove,
    removeMove,
    displayInvalid,
    removeInvalid,
    displayAddNote,
    displayRemoveNote,
};
