import grid from "./grid-mod";
export default { display };

const gridDiv = document.querySelector(".grid");

function display() {
    gridDiv.innerHTML = "";

    grid.allCells.forEach((i) => {
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.classList.add(`row${grid.rowOf(i)}`);
        newCell.classList.add(`col${grid.columnOf(i)}`);

        if (this.cells[i].value) {
            newCell.classList.add("value");
            newCell.innerText = this.cells[i].value;
            newCell.addEventListener("click", () => this.valueClick(i));
        } else {
            newCell.classList.add("notes");
            for (let j = 1; j < 10; j++) {
                const newNote = document.createElement("div");
                newNote.classList.add("note");
                newNote.innerText = j;
                const indicator = this.cells[i].hasNote(j) ? "yes" : "no";
                newNote.classList.add(indicator);
                newNote.addEventListener("click", () => this.noteClick(i, j));
                newCell.appendChild(newNote);
            }
        }
        gridDiv.appendChild(newCell);
    });
}
