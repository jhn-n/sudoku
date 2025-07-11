import squares from "./mod-squares.js"
export const bipartitions = [];

for (let n = 0; n < 10; n++) {
    bipartitions.push(BipartitionsOfNaturalNumbers(n));
}

function BipartitionsOfNaturalNumbers(n) {
    const partitions = [...Array(10)].map(() => []);
    
    for (let m = 0; m < 1 << n; m++) {
        const subsetA = [];
        const subsetB = [];
        for (let i = 0; i < n; i++) {
            if (m & (1 << i)) {
                subsetA.push(i);
            } else {
                subsetB.push(i);
            }
        }
        partitions[subsetA.length].push([subsetA, subsetB]);
    }
    return partitions;
}

export const pointingTriples = [];

for (let b = 0; b < 9; b++) {
    for (let l = 0; l < 9; l++) {
        const tripleRow = [[], [], []];
        const tripleColumn = [[], [], []];
        for (let sq = 0; sq < 81; sq++) {
            const sqRow = squares.rowOf(sq);
            const sqColumn = squares.columnOf(sq);
            const sqBlock = squares.blockOf(sq);
            if (sqBlock === b && sqRow === l) {
                tripleRow[0].push(sq);
            } else if (sqBlock === b) {
                tripleRow[1].push(sq);
            } else if (sqRow === l) {
                tripleRow[2].push(sq);
            }
            if (sqBlock === b && sqColumn === l) {
                tripleColumn[0].push(sq);
            } else if (sqBlock === b) {
                tripleColumn[1].push(sq);
            } else if (sqColumn === l) {
                tripleColumn[2].push(sq);
            }
        }
        if (tripleRow[0].length > 0) {
            pointingTriples.push(tripleRow);
        }
        if (tripleColumn[0].length > 0) {
            pointingTriples.push(tripleColumn);
        }
    }
}
console.timeEnd("Triples");

