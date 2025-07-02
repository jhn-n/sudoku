export class Cell {
    constructor() {
        this.value = null;
        this.notes = Array(9).fill(true);
    }

    setValue(n) {
        console.assert(n >= 1 && n <= 9, "Error - trying to set cell value out of range");
        this.value = n;
        this.notes.fill(false);
    }

    hasNote(n) {
        return this.notes[n - 1];
    }

    removeNote(n) {
        this.notes[n - 1] = false;
    }

    addNote(n) {
        this.notes[n - 1] = true;
    }

    reset() {
        this.value = null;
        this.notes.fill(true);
    }

    get noteCount() {
        return this.notes.reduce((n, note) => (note ? n + 1 : n), 0);
    }
}
