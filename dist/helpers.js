"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceHelper = void 0;
class Helper {
    constructor() {
        this.enabled = true;
        this.toSnakeCase = (str) => str
            .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
            .replace(/^_/, '');
        this.sanitizeName = (name, limit) => {
            return this.toSnakeCase(name)
                .replace(/^\s+|\s+$/g, '')
                .replace(/\s/, '_')
                .substring(0, limit);
        };
        this.setGlobalDisabled = () => {
            this.enabled = false;
        };
        this.setGlobalEnabled = () => {
            this.enabled = true;
        };
        this.isGlobalEnabled = () => {
            return this.enabled;
        };
    }
}
exports.PerformanceHelper = new Helper();
//# sourceMappingURL=helpers.js.map