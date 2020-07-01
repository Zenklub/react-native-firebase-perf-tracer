"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGlobalEnabled = exports.setGlobalEnabled = exports.setGlobalDisabled = exports.sanitizeName = void 0;
let disabled = true;
const toSnakeCase = (str) => str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/^_/, '');
exports.sanitizeName = (name, limit) => {
    return toSnakeCase(name)
        .replace(/^\s+|\s+$/g, '')
        .replace(/\s/, '_')
        .substring(0, limit);
};
exports.setGlobalDisabled = () => {
    disabled = true;
};
exports.setGlobalEnabled = () => {
    disabled = false;
};
exports.isGlobalEnabled = () => {
    return disabled;
};
//# sourceMappingURL=helpers.js.map