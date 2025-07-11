import squares from "./mod-squares.js";
export default {
    recalculateNotesFromValues,
    updateNotesForNewValue,
    // testValidGame,
    undoValue,
};

function recalculateNotesFromValues() {
    squares.all.forEach((i) => {
        if (!this.cells[i].value) {
            this.cells[i].reset();
        }
    });
    squares.all.forEach((i) => {
        if (this.cells[i].value) {
            squares.neighbours[i].forEach((j) => {
                this.cells[j].removeNote(this.cells[i].value);
            });
        }
    });
}

function updateNotesForNewValue(i) {
    squares.neighbours[i].forEach((j) => this.cells[j].removeNote(this.cells[i].value));
}

function undoValue(i) {
    const clickedCell = this.cells[i];
    const valueToUndo = clickedCell.value;
    clickedCell.reset();
    squares.neighbours[i].forEach((j) => {
        const neighbour = this.cells[j];
        if (neighbour.value) {
            clickedCell.removeNote(neighbour.value);
        } else {
            neighbour.addNote(valueToUndo);
            for (const k of squares.neighbours[j]) {
                if (this.cells[k].value === valueToUndo) {
                    neighbour.removeNote(valueToUndo);
                    break;
                } 
            }
        }
    });
}
