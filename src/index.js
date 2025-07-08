import "./style.css";

import domMethods from "./game-dom";
import userEventMethods from "./game-clicks";
import autoupdateMethods from "./game-calcs.js";
import controlMethods from "./game-control";
import analysisMethods from "./game-analysis.js";

const sudoku = {
    cells: Array(81),
    setupMode: true,
    validGame: true,
    buttonText: [],
    message: "",
    description: "",
    move: null,
    saved: null,
};

Object.assign(
    sudoku,
    domMethods,
    userEventMethods,
    autoupdateMethods,
    controlMethods,
    analysisMethods,
);

sudoku.start();
