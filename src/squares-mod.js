const all = [...Array(81).keys()];

function rowOf(c) {
    return Math.floor(c / 9);
}

function columnOf(c) {
    return c % 9;
}

function blockOf(c) {
    return 3 * Math.floor(rowOf(c) / 3) + Math.floor(columnOf(c) / 3);
}

function sameRow(c1, c2) {
    return rowOf(c1) === rowOf(c2);
}

function sameColumn(c1, c2) {
    return columnOf(c1) === columnOf(c2);
}

function sameBlock(c1, c2) {
    return blockOf(c1) === blockOf(c2);
}

function sameLine(c1, c2) {
    if (sameRow(c1, c2) || sameColumn(c1, c2) || sameBlock(c1, c2)) {
        return true;
    }
    return false;
}

function indexFromRowColumn(r, c) {
    return 9 * r + c;
}

const rows = [];
for (let r = 0; r < 9; r++) {
    const currentLine = [];
    for (let c = 0; c < 9; c++) {
        currentLine.push(indexFromRowColumn(r, c));
    }
    rows.push(currentLine);
}

const columns = [];
for (let c = 0; c < 9; c++) {
    const currentLine = [];
    for (let r = 0; r < 9; r++) {
        currentLine.push(indexFromRowColumn(r, c));
    }
    columns.push(currentLine);
}

function createBlockArray(startRow, startColumn) {
    const block = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            block.push(indexFromRowColumn(startRow + i, startColumn + j));
        }
    }
    return block;
}

const blocks = [];
for (let r = 0; r < 9; r += 3) {
    for (let c = 0; c < 9; c += 3) {
        blocks.push(createBlockArray(r, c));
    }
}

const neighbours = [];
all.forEach((i) => {
    const currentNeighbours = [];
    all.forEach((j) => {
        if (j !== i && sameLine(i, j)) {
            currentNeighbours.push(j);
        }
    });
    neighbours.push(currentNeighbours);
});

const lines = rows.concat(columns).concat(blocks);

console.time("Triples");
const pointingTriples = [];
for (let b = 0; b < 9; b++) {
    for (let l = 0; l < 9; l++) {
        const tripleRow = [[], [], []];
        const tripleColumn = [[], [], []];
        for (let sq = 0; sq < 81; sq++) {
            const sqRow = rowOf(sq);
            const sqColumn = columnOf(sq);
            const sqBlock = blockOf(sq);
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

console.log(pointingTriples);

export default {
    rowOf,
    columnOf,
    sameLine,
    neighbours,
    rows,
    columns,
    blocks,
    lines,
    all,
    pointingTriples
};
