"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PerformanceMeasureSession = void 0;
const perf_1 = __importDefault(require("@react-native-firebase/perf"));
const constants_1 = require("./constants");
const helpers_1 = require("./helpers");
class PerformanceMeasureSession {
    constructor(identifier) {
        this.log = (message) => console.log(`%cPerformance Measure:%c ${this.identifier}`, 'background: #5500FF; color: #FFF; padding: 2px', 'color: #bada55', message);
        this.putAttribute = (attributeName, value) => {
            const name = helpers_1.sanitizeName(attributeName, constants_1.PerformanceMeasureConstants.MaxAttributeKeyLength);
            const trimmedValue = value.substring(0, constants_1.PerformanceMeasureConstants.MaxAttributeValueLength);
            this.trace?.putAttribute(name, trimmedValue);
            this.log(`Put Attribute: ${name} = ${trimmedValue}`);
        };
        this.incrementMetric = (metricName, incrementBy) => {
            const name = helpers_1.sanitizeName(metricName, constants_1.PerformanceMeasureConstants.MaxAttributeKeyLength);
            this.trace?.incrementMetric(name, incrementBy);
            const metricNow = this.trace?.getMetric(metricName);
            const was = (metricNow || 0) - incrementBy;
            this.log(`Increment Metric: ${name} from ${was} to ${metricNow}`);
        };
        this.startTraceSession = async () => {
            this.trace = perf_1.default().newTrace(this.identifier);
            this.traceStartedAt = new Date();
            await this.trace.start();
        };
        this.completeTraceSession = () => {
            if (this.traceStartedAt) {
                const time = new Date().getTime() - this.traceStartedAt?.getTime();
                this.log(`Session Finished within ${time}`);
            }
            this.trace?.stop();
        };
        this.onFinishLoading = (loadingName, start) => {
            const time = new Date().getTime() - start.getTime();
            this.putAttribute(loadingName, `${time}`);
            this.log(`Finished Loading "${loadingName}" within ${time}ms`);
        };
        this.startLoading = (loadingName) => {
            const start = new Date();
            return () => {
                this.onFinishLoading(loadingName, start);
            };
        };
        this.traceCodeSection = async (target, sectionName) => {
            const stopLoading = this.startLoading(sectionName);
            const result = await target();
            stopLoading();
            return result;
        };
        this.identifier = helpers_1.sanitizeName(identifier, constants_1.PerformanceMeasureConstants.MaxTraceNameLength);
    }
}
exports.PerformanceMeasureSession = PerformanceMeasureSession;
PerformanceMeasureSession.mockAllSessions = (mocked) => {
    if (mocked) {
        helpers_1.setGlobalDisabled();
    }
    else {
        helpers_1.setGlobalEnabled();
    }
};
//# sourceMappingURL=performance-measure-session.js.map