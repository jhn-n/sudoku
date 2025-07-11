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

export default {
    rowOf,
    columnOf,
    blockOf,
    sameLine,
    neighbours,
    rows,
    columns,
    blocks,
    lines,
    all,
};
