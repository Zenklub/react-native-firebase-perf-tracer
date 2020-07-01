"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
var performance_measure_hoc_1 = require("./performance-measure-hoc");
Object.defineProperty(exports, "withPerformanceMeasure", { enumerable: true, get: function () { return performance_measure_hoc_1.withPerformanceMeasure; } });
var performance_measure_hook_1 = require("./performance-measure-hook");
Object.defineProperty(exports, "usePerformanceMeasure", { enumerable: true, get: function () { return performance_measure_hook_1.usePerformanceMeasure; } });
var performance_measure_session_1 = require("./performance-measure-session");
Object.defineProperty(exports, "PerformanceMeasureSession", { enumerable: true, get: function () { return performance_measure_session_1.PerformanceMeasureSession; } });
const _Contants = __importStar(require("./constants"));
exports.Constants = _Contants;
//# sourceMappingURL=index.js.map