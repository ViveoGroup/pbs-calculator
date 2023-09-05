"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.round = void 0;
function round(input) {
    return Math.round((input + Number.EPSILON) * 100) / 100;
}
exports.round = round;
