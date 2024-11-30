/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/*!*******************!*\
  !*** ./script.ts ***!
  \*******************/


var _a, _b;
var msg = "Hello!";
alert(msg);
// Definiowanie słownika dostępnych stylów
var styles = {
  "style1": "css/style1.css",
  "style2": "css/style2.css"
};
// Funkcja zmieniająca styl na wybrany
function changeStyle(style) {
  var linkElement = document.getElementById('style-link');
  if (styles[style]) {
    linkElement.href = styles[style]; // Zmienia ścieżkę do stylu
  }
}
// Event listeners dla przycisków
(_a = document.getElementById('style1-button')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', function () {
  return changeStyle("style1");
});
(_b = document.getElementById('style2-button')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', function () {
  return changeStyle("style2");
});
/******/ })()
;