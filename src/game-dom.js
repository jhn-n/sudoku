import grid from "./grid-mod";

export default { display, setupButtonListeners };

const gridNode = document.querySelector(".grid");
const buttonNodes = [
    document.querySelector("#button1"),
    document.querySelector("#button2"),
    document.querySelector("#button3"),
    document.querySelector("#button4"),
];
const message = document.querySelector("#message");
const description = document.querySelector("#description");

function display() {
    gridNode.innerHTML = "";
    grid.allSquares.forEach((i) => {
        const newCell = document.createElement("div");
        newCell.classList.add("cell");
        newCell.classList.add(`row${grid.rowOf(i)}`);
        newCell.classList.add(`col${grid.columnOf(i)}`);

        if (this.cells[i].value) {
            newCell.classList.add("value");
            newCell.innerText = this.cells[i].value;
            newCell.addEventListener("click", () => this.valueClick(i));
            newCell.addEventListener("contextmenu", (e) => {
                e.preventDefault();
                this.rightValueClick(i);
            })
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
                    this.rightNoteClick(i,j);
                })
                newCell.appendChild(newNote);
            }
        }
        gridNode.appendChild(newCell);

        for (let i = 0; i < buttonNodes.length; i++) {
            buttonNodes[i].innerText = this.buttonText[i];
        }
        if (this.testValidGame()) {
            message.innerText = this.message;
            description.innerText = this.description;
        } else {
            message.innerText = "Invalid grid!";
            description.innerText = "Restart or correct";
        }
    });
}

function setupButtonListeners() {
    for (let i = 0; i < buttonNodes.length; i++) {
        buttonNodes[i].addEventListener("click", () => this.buttonClick(i));
    }
}
