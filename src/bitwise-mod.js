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
