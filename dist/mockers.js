"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockedPerformanceMeasureHookType = exports.MockedPerformanceMeasureSession = void 0;
const performance_measure_session_1 = require("./performance-measure-session");
class MockedPerformanceMeasureSession extends performance_measure_session_1.PerformanceMeasureSession {
    constructor() {
        super('');
        this.putAttribute = () => { };
        this.incrementMetric = () => { };
        this.startTraceSession = async () => { };
        this.completeTraceSession = () => { };
        this.onFinishLoading = () => { };
        this.startLoading = () => () => { };
        this.traceCodeSection = async (target, sectionName) => {
            const result = await target();
            return result;
        };
    }
}
exports.MockedPerformanceMeasureSession = MockedPerformanceMeasureSession;
exports.MockedPerformanceMeasureHookType = {
    startTraceSession: () => Promise.resolve(new MockedPerformanceMeasureSession()),
    completeTraceSession: () => { },
    failTraceSession: () => { },
    traceMethod: (method) => method,
};
//# sourceMappingURL=mockers.js.map