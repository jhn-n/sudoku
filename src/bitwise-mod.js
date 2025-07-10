const allNotes = [1,2,3,4,5,6,7,8,9];

export function nBit(bit) {
    return 1 << (bit - 1);
}

export function hasBit(num, bit) {
    return num & (1 << (bit - 1));
}

export function removeBit(num, bit) {
    return num & ~(1 << (bit - 1));
}

export function addBit(num, bit) {
    return num | (1 << (bit - 1));
}

export function countBits(num) {
    let count = 0;
    while (num) {
        count++;
        num &= num - 1;
    }
    return count;
}

export function not(num) {
    return 511^num;
}

export function union(notes) {
    return notes.reduce((acc, curr) => acc | curr);
}

export function intersection(notes) {
    return notes.reduce((acc, curr) => acc & curr);
}

export function onePositions(n) {
    return allNotes.filter((note) => ((1 << (note - 1)) & n) !== 0);
}