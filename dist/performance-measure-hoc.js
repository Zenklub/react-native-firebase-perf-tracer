"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withPerformanceMeasure = void 0;
const react_1 = __importDefault(require("react"));
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
const mockers_1 = require("./mockers");
const performance_measure_hook_1 = require("./performance-measure-hook");
const mocked = {
    performance: mockers_1.MockedPerformanceMeasureHookType,
    profileTracerSession: new mockers_1.MockedPerformanceMeasureSession(),
    profileTracerReady: () => { },
    profileTracerFail: () => { },
};
var ReactProfilerPhases;
(function (ReactProfilerPhases) {
    ReactProfilerPhases["Mount"] = "mount";
    ReactProfilerPhases["Update"] = "update";
})(ReactProfilerPhases || (ReactProfilerPhases = {}));
exports.withPerformanceMeasure = (WrappedComponent, identifier) => (props) => {
    const performance = performance_measure_hook_1.usePerformanceMeasure(identifier);
    const profileTracerSession = react_1.default.useRef();
    const traceStarted = react_1.default.useRef(false);
    const isTracingFinished = react_1.default.useRef(false);
    const initialMount = react_1.default.useRef(0);
    const initialUpdates = react_1.default.useRef(0);
    const [isEnabled, setEnabled] = react_1.default.useState(false);
    const onRenderHandler = async (id, phase, actualDuration, baseDuration) => {
        if (isTracingFinished.current) {
            return;
        }
        if (phase === ReactProfilerPhases.Mount) {
            if (traceStarted.current) {
                profileTracerSession.current?.putAttribute(constants_1.ProfilerPerformanceAttributesKeys.MountTime, `${actualDuration}`);
            }
            else {
                initialMount.current = actualDuration;
            }
        }
        else if (phase === ReactProfilerPhases.Update) {
            if (traceStarted.current) {
                profileTracerSession.current?.incrementMetric(constants_1.ProfilerPerformanceMetricsKeys.Updates, 1);
            }
            else {
                initialUpdates.current = initialUpdates.current + 1;
            }
        }
    };
    const stopTraceSession = () => {
        isTracingFinished.current = true;
        performance.completeTraceSession('profiler');
    };
    const profileTracerFailHandler = () => {
        isTracingFinished.current = true;
        performance.failTraceSession('profiler');
    };
    const startProfilerTracing = async () => {
        profileTracerSession.current = await performance.startTraceSession('profiler');
        traceStarted.current = true;
        // put cached values after trace started
        profileTracerSession.current?.putAttribute(constants_1.ProfilerPerformanceAttributesKeys.MountTime, `${initialMount.current}`);
        if (initialUpdates) {
            profileTracerSession.current?.incrementMetric(constants_1.ProfilerPerformanceMetricsKeys.Updates, initialUpdates.current);
        }
    };
    react_1.default.useEffect(() => {
        if (helpers_1.PerformanceHelper.isGlobalEnabled()) {
            setEnabled(true);
            startProfilerTracing();
        }
        else {
            setEnabled(false);
        }
        return () => stopTraceSession();
    }, []);
    return isEnabled ? (react_1.default.createElement(react_1.default.Profiler, { id: identifier, onRender: onRenderHandler },
        react_1.default.createElement(WrappedComponent, Object.assign({}, props, { performance: performance, profileTracerReady: stopTraceSession, profileTracerFail: profileTracerFailHandler, profileTracerSession: profileTracerSession.current })))) : (react_1.default.createElement(WrappedComponent, Object.assign({}, props, { performance: mocked.performance, profileTracerReady: mocked.profileTracerReady, profileTracerFail: mocked.profileTracerFail, profileTracerSession: mocked.profileTracerSession })));
};
//# sourceMappingURL=performance-measure-hoc.js.map