export class Cell {
    constructor() {
        this.value = null;
        this.notes = Array(9).fill(true);
    }

    setValue(n) {
        console.assert(n >= 1 && n <= 9, "Error - trying to set cell value out of range");
        this.value = n;
        this.notes.fill(false);
    }

    hasNote(n) {
        return this.notes[n - 1];
    }

    removeNote(n) {
        this.notes[n - 1] = false;
    }

    addNote(n) {
        this.notes[n - 1] = true;
    }

    reset() {
        this.value = null;
        this.notes.fill(true);
    }

    get noteCount() {
        return this.notes.reduce((n, note) => (note ? n + 1 : n), 0);
    }
}

export class Board {
    constructor() {
        this.cells = [];
        for (let i = 0; i < 81; i++) {
            this.cells.push(new Cell());
        }
    }

    displaySetup() {
        this.displayWithActionArguments(
            this.valueClickActionDuringSetup.bind(this),
            this.noteClickActionDuringSetup.bind(this),
        );
    }

    display() {
        this.displayWithActionArguments(
            this.valueClickActionDuringGame.bind(this),
            this.noteClickActionDuringGame.bind(this),
        );
    }

    displayWithActionArguments(valueClickAction, noteClickAction) {
        const grid = document.querySelector(".grid");
        grid.innerHTML = "";
        for (let i = 0; i < 81; i++) {
            const newCell = document.createElement("div");
            newCell.classList.add("cell");
            newCell.classList.add(`row${Math.floor(i / 9)}`);
            newCell.classList.add(`col${i % 9}`);
            if (this.cells[i].value) {
                newCell.classList.add("value");
                newCell.innerText = this.cells[i].value;
                newCell.addEventListener("click", () => valueClickAction(i));
            } else {
                newCell.classList.add("notes");
                for (let j = 1; j < 10; j++) {
                    const newNote = document.createElement("div");
                    newNote.classList.add("note");
                    newNote.innerText = j;
                    const indicator = this.cells[i].hasNote(j) ? "yes" : "no";
                    newNote.classList.add(indicator);
                    newNote.addEventListener("click", () => noteClickAction(i, j));
                    newCell.appendChild(newNote);
                }
            }
            grid.appendChild(newCell);
        }
    }

    calculateNotesGivenValues() {
        for (let i = 0; i < 81; i++) {
            if (!this.cells[i].value) {
                this.cells[i].reset();
            }
        }
        for (let i = 0; i < 81; i++) {
            if (this.cells[i].value) {
                for (let j = 0; j < 81; j++) {
                    if (sameLine(i, j)) {
                        this.cells[j].removeNote(this.cells[i].value);
                    }
                }
            }
        }
        this.displaySetup();
    }

    valueClickActionDuringSetup(i) {
        this.cells[i].reset();
        this.calculateNotesGivenValues();
        this.displaySetup();
    }

    noteClickActionDuringSetup(i, j) {
        if (this.cells[i].hasNote(j)) {
            this.cells[i].setValue(j);
            this.calculateNotesGivenValues();
            this.displaySetup();
        }
    }

    valueClickActionDuringGame(i) {
        this.cells[i].reset();
        this.display();
    }

    noteClickActionDuringGame(i, j) {
        const clickCell = this.cells[i];
        if (clickCell.hasNote(j)) {
            if (clickCell.noteCount === 1) {
                clickCell.setValue(j);
            } else {
                clickCell.removeNote(j);
            }
        } else {
            clickCell.addNote(j);
        }
        this.display();
    }
}

function sameRow(c1, c2) {
    return Math.floor(c1 / 9) === Math.floor(c2 / 9) ? true : false;
}

function sameCol(c1, c2) {
    return c1 % 9 === c2 % 9 ? true : false;
}

function sameBlock(c1, c2) {
    if (
        Math.floor(Math.floor(c1 / 9) / 3) === Math.floor(Math.floor(c2 / 9) / 3) &&
        Math.floor((c1 % 9) / 3) === Math.floor((c2 % 9) / 3)
    ) {
        return true;
    }
    return false;
}

function sameLine(c1, c2) {
    if (sameRow(c1, c2) || sameCol(c1, c2) || sameBlock(c1, c2)) {
        return true;
    }
    return false;
}
