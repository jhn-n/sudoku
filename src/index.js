import "./style.css";

import domMethods from "./game-dom";
import userEventMethods from "./game-clicks";
import autoupdateMethods from "./game-autoupdate";
import controlMethods from "./game-control";
import comb from "./comb-mod";

const sudoku = {
    cells: Array(81),
    setupMode: true,
    validGame: true,
    buttonText: [],
    message: "",
    description: "",
    saved: [],
};

Object.assign(sudoku, domMethods, userEventMethods, autoupdateMethods, controlMethods);

sudoku.start();
