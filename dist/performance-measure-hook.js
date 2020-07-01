"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePerformanceMeasure = void 0;
const react_1 = __importDefault(require("react"));
const performance_measure_session_1 = require("./performance-measure-session");
exports.usePerformanceMeasure = (identifier) => {
    const sessions = react_1.default.useRef({});
    const startTraceSession = async (name) => {
        const sessionName = `${identifier}::${name}`;
        const session = new performance_measure_session_1.PerformanceMeasureSession(sessionName);
        sessions.current[sessionName] = session;
        await session.startTraceSession();
        return session;
    };
    const completeTraceSession = (name) => {
        const sessionName = `${identifier}::${name}`;
        const { [sessionName]: session } = sessions.current;
        if (session) {
            session.completeTraceSession();
            delete sessions.current[sessionName];
        }
    };
    const failTraceSession = (name) => {
        const sessionName = `${identifier}::${name}`;
        const { [sessionName]: session } = sessions.current;
        if (session) {
            session.putAttribute('failed', 'true');
            session.completeTraceSession();
            delete sessions.current[sessionName];
        }
    };
    const traceMethod = (method, traceName) => (async (...args) => {
        await startTraceSession(traceName);
        const methodResults = await method(...args);
        completeTraceSession(traceName);
        return methodResults;
    });
    return {
        startTraceSession,
        completeTraceSession,
        failTraceSession,
        traceMethod,
    };
};
//# sourceMappingURL=performance-measure-hook.js.map