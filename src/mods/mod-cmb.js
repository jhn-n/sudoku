console.time("Cmb setup");


function bipartitions(set, k) {
    const ans = [];
    for (const comb of bipartitionsNN[set.length][k]) {
        const subset = comb[0].map((e) => set[e]);
        const subsetComp = comb[1].map((e) => set[e]);
        ans.push([subset, subsetComp]);
    }
    return ans;
}

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

export const cmb = { bipartitions };

console.timeEnd("Cmb setup");
