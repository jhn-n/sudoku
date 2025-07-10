import { union } from "./bitwise-mod";
export default { activeFilter, noteUnion };

function activeFilter(squares) {
    return squares.filter((e) => this.cells[e].value === null);
}

function noteUnion(squares) {
    return union(squares.map((i) => this.cells[i].notes));
}

