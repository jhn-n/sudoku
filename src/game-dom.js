import squares from "./squares-mod";

export default {
    display,
    displayButtons,
    displayText,
    displayMove,
    displayRemoveMove,
    displayAddNote,
    displayRemoveNote,
    displayInvalid,
    displayRemoveInvalid,
};

const gridNode = document.querySelector(".grid");
const buttonsNode = document.querySelector(".buttonContainer");
const message = document.querySelector("#message");
const description = document.querySelector("#description");

let displayInvalidReport = null;

function display() {
    gridNode.innerHTML = "";
    squares.all.forEach((i) => {
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.classList.add(`row${squares.rowOf(i)}`);
        newCell.classList.add(`col${squares.columnOf(i)}`);

        if (this.cells[i].value) {
            newCell.classList.add("value");
            newCell.innerText = this.cells[i].value;
            newCell.addEventListener("click", () => this.valueClick(i));
            newCell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.rightValueClick(i);
            });
        } else {
            newCell.classList.add("notes");
            for (let j = 1; j < 10; j++) {
                const newNote = document.createElement("div");
                newNote.classList.add("note");
                newNote.innerText = j;
                const indicator = this.cells[i].hasNote(j) ? "yes" : "no";
                newNote.classList.add(indicator);
                newNote.addEventListener("click", () => this.noteClick(i, j));
                newNote.addEventListener("contextmenu", (e) => {
                    e.preventDefault();
                    this.rightNoteClick(i, j);
                });
                newCell.appendChild(newNote);
            }
        }
        gridNode.appendChild(newCell);

        this.displayButtons();
        this.displayText();
    });
}

function displayButtons() {
    buttonsNode.innerHTML = "";
    for (const buttonTxt of this.buttonText) {
        const newButton = document.createElement("div");
        newButton.classList.add("button");
        newButton.innerText = buttonTxt;
        newButton.addEventListener("click", () => this.buttonClick(buttonTxt));
        buttonsNode.appendChild(newButton);
    }
}

function displayText() {
    message.innerText = this.message;
    description.innerText = this.description;
}

function displayMove(move) {
    for (const line of move.lines) {
        for (const cell of line) {
            gridNode.children[cell].classList.add("move-line");
        }
    }
    for (const keyNote of move.keyNotes) {
        const cellNode = gridNode.children[keyNote.cell];
        cellNode.children[keyNote.note - 1].classList.add("move-keynote");
    }

    for (const deadNote of move.deadNotes) {
        const cellNode = gridNode.children[deadNote.cell];
        cellNode.children[deadNote.note - 1].classList.add("move-deadnote");
    }
    this.displayButtons();
    this.displayText();
}

function displayRemoveMove(move) {
    if (move !== null) {
        for (const line of move.lines) {
            for (const cell of line) {
                gridNode.children[cell].classList.remove("move-line");
            }
        }
        for (const keyNote of move.keyNotes) {
            const cellNode = gridNode.children[keyNote.cell];
            cellNode.children[keyNote.note - 1].classList.remove("move-keynote");
        }

        for (const deadNote of move.deadNotes) {
            const cellNode = gridNode.children[deadNote.cell];
            cellNode.children[deadNote.note - 1].classList.remove("move-deadnote");
        }
    }
    this.displayButtons();
    this.displayText();
}

function displayInvalid(report) {
    if (report !== null) {
        for (const cell of report.line) {
            gridNode.children[cell].classList.add("invalid-line");
        }
        for (const cell of report.squares) {
            gridNode.children[cell].classList.add("invalid-square");
        }
        displayInvalidReport = report;
        console.log("Display", report, displayInvalidReport);
    }
}

function displayRemoveInvalid() {
    if (displayInvalidReport !== null) {
        console.log("Remove", displayInvalidReport);
        for (const cell of displayInvalidReport.line) {
            gridNode.children[cell].classList.remove("invalid-line");
        }
        for (const cell of displayInvalidReport.squares) {
            gridNode.children[cell].classList.remove("invalid-square");
        }
        displayInvalidReport = null;
    }
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
