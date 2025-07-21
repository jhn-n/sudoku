console.time("Cmb setup");

import { sqs } from "./mod-sqs.js";

const bipartitionsNN = [];
for (let n = 0; n < 10; n++) {
    bipartitionsNN.push(BipartitionsOfNaturalNumbers(n));
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

function bipartitions(set, k) {
    const ans = [];
    for (const comb of bipartitionsNN[set.length][k]) {
        const subset = comb[0].map((e) => set[e]);
        const subsetComp = comb[1].map((e) => set[e]);
        ans.push([subset, subsetComp]);
    }
    return ans;
}

// triple: [block&line], [block only], [line only]
const pointingTriples = [];
for (let b = 0; b < 9; b++) {
    for (let l = 0; l < 9; l++) {
        const tripleRow = [[], [], []];
        const tripleColumn = [[], [], []];
        for (let sq = 0; sq < 81; sq++) {
            const sqRow = sqs.rowOf(sq);
            const sqColumn = sqs.columnOf(sq);
            const sqBlock = sqs.blockOf(sq);
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

export const cmb = { bipartitions, bipartitionsNN, pointingTriples };

console.timeEnd("Cmb setup");
