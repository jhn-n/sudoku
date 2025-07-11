import squares from "./mod-squares";
export default { noteClick, rightNoteClick, valueClick, rightValueClick, buttonClick };

function noteClick(i, j) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            if (clickedCell.hasNote(j)) {
                clickedCell.setValue(j);
                this.recalculateNotesFromValues();
                this.display();
            }
            break;
        case false:
            if (clickedCell.hasNote(j)) {
                if (clickedCell.noteCount > 1) {
                    this.saveGame();
                    clickedCell.removeNote(j);
                    this.displayRemoveNote(i, j);
                } else if (this.validGame) {
                    this.saveGame();
                    clickedCell.setValue(j);
                    this.updateNotesForNewValue(i);
                    this.buttonStatus("normal");
                    this.display();
                }
            } else {
                if (squares.neighbours[i].every((i) => this.cells[i].value !== j)) {
                    this.saveGame();
                    clickedCell.addNote(j);
                    this.displayAddNote(i, j);
                }
            }
    }
}

function rightNoteClick(i, j) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            if (clickedCell.hasNote(j)) {
                clickedCell.setValue(j);
                this.recalculateNotesFromValues();
                this.display();
            }
            break;
        case false:
            if (clickedCell.hasNote(j)) {
                this.saveGame();
                clickedCell.setValue(j);
                this.updateNotesForNewValue(i);
                this.buttonStatus("normal");
                this.display();
            } else if (squares.neighbours[i].every((i) => this.cells[i].value !== j)) {
                this.saveGame();
                clickedCell.addNote(j);
                this.display();
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
            this.buttonStatus("setup");
            break;
        case false:
            this.saveGame();
            this.undoValue(i);
            this.display();
            this.buttonStatus("normal");
    }
}

function rightValueClick(i) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            clickedCell.reset();
            this.recalculateNotesFromValues();
            this.display();
            this.buttonStatus("setup");
            break;
        case false:
            this.saveGame();
            this.undoValue(i);
            this.display();
            this.buttonStatus("normal");
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
        case "clue":
            this.clue();
            break;
        case "remove":
            this.removeClue();
            break;
        case "start":
            this.backToStart();
            break;
        case "undo":
            this.undoMove();
    }
}
