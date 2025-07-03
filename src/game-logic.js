import grid from "./grid-mod";
export default {calculateNotesFromValues, noteClick, valueClick}

function noteClick (i, j) {
    const clickedCell = this.cells[i];
    switch (this.setupMode) {
        case true:
            if (clickedCell.hasNote(j)) {
                clickedCell.setValue(j);
                this.calculateNotesFromValues();
            }
            break;
        case false:
            if (clickedCell.hasNote(j)) {
                if (clickedCell.noteCount === 1) {
                    clickedCell.setValue(j);
                } else {
                    clickedCell.removeNote(j);
                }
            } else {
                clickedCell.addNote(j);
            }
    }
    this.display();
};

function valueClick (i) {
    this.cells[i].reset();
    if (this.setupMode) {
        this.calculateNotesFromValues();
    }
    this.display();
};


function calculateNotesFromValues () {
    console.time("calc notes");
    grid.allCells.forEach((i) => {
        if (!this.cells[i].value) {
            this.cells[i].reset();
        }
    });
    grid.allCells.forEach((i) => {
        if (this.cells[i].value) {
            grid.neighbours[i].forEach((j) => {
                this.cells[j].removeNote(this.cells[i].value);
            });
        }
    });
    console.timeEnd("calc notes");
    this.display();
};
