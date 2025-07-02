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

export const square = { rowOf, columnOf, sameLine };
