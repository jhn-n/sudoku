import { naked1, naked234 } from "./tnq-nakeds.js";
import { hidden1234 } from "./tnq-hiddens.js";
import { pointing, claiming } from "./tnq-pointing.js";
import { xWing } from "./tnq-xwing.js";

class Strategy {
    constructor(name, difficulty, findMoves) {
        this.name = name;
        this.difficulty = difficulty;
        this.findMoves = findMoves;
    }
}

const strategies = [
    new Strategy("Swordfish", 2, (b) => xWing(b, 3)),
    new Strategy("Naked Single", 0, naked1),
    new Strategy("Hidden Single", 0, (b) => hidden1234.call(this, b, 1)), 
    new Strategy("Naked Double", 1, (b) => naked234(b, 2)),
    new Strategy("Hidden Double", 1, (b) => hidden1234(b, 2)), 
    new Strategy("Naked Triple", 1, (b) => naked234(b, 3)),
    new Strategy("Hidden Triple", 2, (b) => hidden1234(b, 3)),
    new Strategy("Naked Quadruple", 2, (b) => naked234(b, 4)),
    new Strategy("Hidden Quadruple", 2, (b) => hidden1234(b, 4)),
    new Strategy("Pointing", 2, pointing),
    new Strategy("Claiming", 2, claiming),
    new Strategy("X-Wing", 2, (b) => xWing(b, 2)),
    new Strategy("Jellyfish", 3, (b) => xWing(b, 4)),
];


function findMove(board) {
    console.time("findMove");
    let result = null;
    for (const strategy of strategies) {
        console.time(`  ${strategy.name}`)
        const moves = strategy.findMoves(board);
        console.timeEnd(`  ${strategy.name}`)
        if (moves.length > 0) {
            moves.sort((a, b) => {
                return b.deadNotes.length - a.deadNotes.length;
            });
            result = moves[0];
            console.log(result);
            break;
        }
    }
    console.timeEnd("findMove");
    return result;
}

export const calc = { findMove };