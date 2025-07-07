export const bipartitions = [];

console.time("biparts");
for (let n = 0; n < 10; n++) {
    bipartitions.push(BipartitionsOfNaturalNumbers(n));
}
console.timeEnd("biparts");

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

// function allNNCombsOfn(n) {
//     for (let k = 0; k <= 9; k++) {
//         console.log(bipartitions[n][k].length);
//         console.log(bipartitions[n][k][0]);
//     }
// }
