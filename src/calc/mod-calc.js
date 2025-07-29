import { naked1, naked234 } from "./tnq-nakeds.js";
import { hidden1234 } from "./tnq-hiddens.js";
import { pointing, claiming } from "./tnq-pointing.js";

class Strategy {
    constructor(name, difficulty, findMove) {
        this.name = name;
        this.difficulty = difficulty;
        this.findMove = findMove;
    }
}

const strategies = [
    new Strategy("Naked Single", 0, (b) => naked1(b)),
    new Strategy("Hidden Single", 0, (b) => hidden1234(b, 1)),
    new Strategy("Naked Double", 1, (b) => naked234(b, 2)),
    new Strategy("Naked Triple", 1, (b) => naked234(b, 3)),
    new Strategy("Naked Quadruple", 1, (b) => naked234(b, 4)),
    new Strategy("Hidden Double", 2, (b) => hidden1234(b, 2)),
    new Strategy("Hidden Triple", 2, (b) => hidden1234(b, 3)),
    new Strategy("Hidden Quadruple", 2, (b) => hidden1234(b, 4)),
    new Strategy("Pointing", 2, (b) => pointing(b)),
    new Strategy("Claiming", 2, (b) => claiming(b)),
];


function findMove(board) {
    console.time("findMove");
    let result = null;
    for (const strategy of strategies) {
        console.time(`  ${strategy.name}`)
        const moves = strategy.findMove(board);
        console.timeEnd(`  ${strategy.name}`)
        if (moves.length > 0) {
            moves.sort((a, b) => {
                return b.deadNotes.length - a.deadNotes.length;
            });
            result = moves[0];
            break;
        }
    }
    console.timeEnd("findMove");
    return result;
}

export const calc = { findMove };