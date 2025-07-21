const allNotes = (1 << 9) - 1;
const positions = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const notePositions = [1, 2, 3, 4, 5, 6, 7, 8, 9];

function nth(bit) {
    return 1 << (bit - 1);
}

function has(num, bit) {
    return (num & (1 << (bit - 1))) !== 0;
}

function add(num, bit) {
    return num | (1 << (bit - 1));
}

function remove(num, bit) {
    return num & ~(1 << (bit - 1));
}

function count(num) {
    let count = 0;
    while (num) {
        count++;
        num &= num - 1;
    }
    return count;
}

function not(num) {
    return allNotes ^ num;
}

function union(numbers) {
    return numbers.reduce((acc, curr) => acc | curr, 0);
}

function intersection(numbers) {
    return numbers.reduce((acc, curr) => acc & curr, not(0));
}

function onePositionsFromZero(n) {
    return positions.filter((e) => ((1 << e) & n) !== 0);
}

function onePositionsNotes(n) {
    return notePositions.filter((e) => ((1 << (e - 1)) & n) !== 0);
}

export const bit = {
    allNotes,
    nth,
    has,
    add,
    remove,
    count,
    not,
    union,
    intersection,
    onePositionsFromZero,
    onePositionsNotes,
};
