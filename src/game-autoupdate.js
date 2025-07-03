import grid from "./grid-mod.js";
export default {
    recalculateNotesFromValues,
    updateNotesForNewValue,
    testValidGame,
    undoValue,
};

function recalculateNotesFromValues() {
    console.time("calc notes");
    grid.allSquares.forEach((i) => {
        if (!this.cells[i].value) {
            this.cells[i].reset();
        }
    });
    grid.allSquares.forEach((i) => {
        if (this.cells[i].value) {
            grid.neighbours[i].forEach((j) => {
                this.cells[j].removeNote(this.cells[i].value);
            });
        }
    });
    console.timeEnd("calc notes");
}

function updateNotesForNewValue(i) {
    grid.neighbours[i].forEach((j) => this.cells[j].removeNote(this.cells[i].value));
}

function testValidGame() {
    this.validGame = true;
    for (const i of grid.allSquares) {
        if (this.cells[i].value === null && this.cells[i].noteCount === 0) {
            this.validGame = false;
            break;
        }
    }
    return this.validGame;
}

function undoValue(i) {
    const clickedCell = this.cells[i];
    const valueToUndo = clickedCell.value;
    clickedCell.reset();
    grid.neighbours[i].forEach((j) => {
        const neighbour = this.cells[j];
        if (neighbour.value) {
            clickedCell.removeNote(neighbour.value);
        } else {
            neighbour.addNote(valueToUndo);
            for (const k of grid.neighbours[j]) {
                if (this.cells[k].value === valueToUndo) {
                    neighbour.removeNote(valueToUndo);
                    break;
                } 
            }
        }
    });
}
