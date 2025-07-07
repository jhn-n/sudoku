import squares from "./squares-mod";
export default { noteClick, rightNoteClick, valueClick, rightValueClick, buttonClick };

function noteClick(i, j) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            if (clickedCell.hasNote(j) && this.validGame) {
                clickedCell.setValue(j);
                this.recalculateNotesFromValues();
                this.display();
            }
            break;
        case false:
            if (clickedCell.hasNote(j) && this.validGame) {
                clickedCell.setValue(j);
                this.updateNotesForNewValue(i);
                this.display();
            } else {
                if (squares.neighbours[i].every((i) => this.cells[i].value !== j)) {
                    clickedCell.addNote(j);
                    this.display();
                }
            }
    }
}

function rightNoteClick(i, j) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            break;
        case false:
            if (clickedCell.hasNote(j)) {
                if (clickedCell.noteCount > 1) {
                    clickedCell.removeNote(j);
                    this.display();
                }
            } else {
                if (squares.neighbours[i].every((i) => this.cells[i].value !== j)) {
                    clickedCell.addNote(j);
                    this.display();
                }
            }
    }
}

function valueClick(i) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            clickedCell.reset();
            this.recalculateNotesFromValues();
            this.display();
            break;
        case false:
            this.undoValue(i);
            this.display();
    }
}

function rightValueClick(i) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            clickedCell.reset();
            this.recalculateNotesFromValues();
            this.display();
            break;
        case false:
            this.undoValue(i);
            this.display();
    }
}

function buttonClick(button) {
    console.log("Button", button, "pressed");
    switch (button) {
        case "reset":
            this.reset();
            break;
        case "done":
            this.finishedSetup();
            break;
    }
}
