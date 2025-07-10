import "./style.css";

import domMethods from "./game-dom";
import userEventMethods from "./game-clicks";
import autoupdateMethods from "./game-calcs.js";
import controlMethods from "./game-control";
import clueMethods from "./game-clues.js";
import fileMethods from "./game-file.js";
import validMethods from "./game-valid.js";
import analysisMethods from "./game-analysis-tools.js";

const sudoku = {
    cells: Array(81),
    setupMode: true,
    validGame: true,
    buttonText: [],
    message: "",
    description: "",
};

Object.assign(
    sudoku,
    domMethods,
    userEventMethods,
    autoupdateMethods,
    controlMethods,
    clueMethods,
    fileMethods,
    validMethods,
    analysisMethods,
);

sudoku.start();
