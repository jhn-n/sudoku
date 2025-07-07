import squares from "./squares-mod";

export default { display };

const gridNode = document.querySelector(".grid");
const buttonsNode = document.querySelector(".buttonContainer");

// const buttonNodes = [
//     document.querySelector("#button1"),
//     document.querySelector("#button2"),
//     document.querySelector("#button3"),
//     document.querySelector("#button4"),
// ];
const message = document.querySelector("#message");
const description = document.querySelector("#description");

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

        buttonsNode.innerHTML = "";
        for (const buttonTxt of this.buttonText) {
            const newButton = document.createElement("div");
            newButton.classList.add("button");
            newButton.innerText = buttonTxt;
            newButton.addEventListener("click", () => this.buttonClick(buttonTxt));
            buttonsNode.appendChild(newButton);
        }
        // for (let i = 0; i < buttonNodes.length; i++) {
        //     buttonNodes[i].innerText = this.buttonText[i];
        // }
        if (this.testValidGame()) {
            message.innerText = this.message;
            description.innerText = this.description;
        } else {
            message.innerText = "Invalid squares!";
            description.innerText = "Restart or correct";
        }
    });
}

// function setupButtonListeners() {
//     for (let i = 0; i < buttonNodes.length; i++) {
//         buttonNodes[i].addEventListener("click", () => this.buttonClick(i));
//     }
// }
