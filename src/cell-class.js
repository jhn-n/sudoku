export class Cell {
    constructor() {
        this.value = null;
        this.notes = 511;
    }

    setValue(n) {
        console.assert(n >= 1 && n <= 9, "Error - trying to set cell value out of range");
        this.value = n;
        this.notes = 0;
    }

    hasNote(n) {
        return this.notes & (1 << (n - 1));
    }

    removeNote(n) {
        this.notes &= ~(1 << (n - 1));
    }

    addNote(n) {
        this.notes |= 1 << (n - 1);
    }

    reset() {
        this.value = null;
        this.notes = 511;
    }

    get noteCount() {
        let count = 0;
        let x = this.notes;
        while (x) {
            count++;
            x &= x - 1;
        }
        return count;
    }
}

