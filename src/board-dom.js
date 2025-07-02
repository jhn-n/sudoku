import { square } from "./square-mod";

function valueClickActionDuringSetup(i) {
    this.cells[i].reset();
    this.calculateNotesGivenValues();
    this.display();
}

function noteClickActionDuringSetup(i, j) {
    if (this.cells[i].hasNote(j)) {
        this.cells[i].setValue(j);
        this.calculateNotesGivenValues();
        this.display();
    }
}

function valueClickActionDuringGame(i) {
    this.cells[i].reset();
    this.display();
}

function noteClickActionDuringGame(i, j) {
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

export function display() {
    let valueClickAction = valueClickActionDuringGame.bind(this);
    let noteClickAction = noteClickActionDuringGame.bind(this);
    if (this.setup) {
        valueClickAction = valueClickActionDuringSetup.bind(this);
        noteClickAction = noteClickActionDuringSetup.bind(this);
    }

    const grid = document.querySelector(".grid");
    grid.innerHTML = "";
    
    for (let i = 0; i < 81; i++) {
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.classList.add(`row${square.rowOf(i)}`);
        newCell.classList.add(`col${square.columnOf(i)}`);
    
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
