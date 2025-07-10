import "./style.css";

import domMethods from "./game-dom";
import userEventMethods from "./game-clicks";
import autoupdateMethods from "./game-calcs.js";
import controlMethods from "./game-control";
import analysisMethods from "./game-analysis.js";
import fileMethods from "./game-file.js";
import validMethods from "./game-valid.js";

const sudoku = {
    cells: Array(81),
    setupMode: true,
    validGame: true,
    buttonText: [],
    message: "",
    description: "",
    move: null,
};

Object.assign(
    sudoku,
    domMethods,
    userEventMethods,
    autoupdateMethods,
    controlMethods,
    analysisMethods,
    fileMethods,
    validMethods,
);

sudoku.start();
