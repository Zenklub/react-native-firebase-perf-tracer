import { PerformanceMeasureSession } from './performance-measure-session';
import { PerformanceMeasureHookType } from './types.d';
export declare class MockedPerformanceMeasureSession extends PerformanceMeasureSession {
    constructor();
    putAttribute: () => void;
    incrementMetric: () => void;
    startTraceSession: () => Promise<void>;
    completeTraceSession: () => void;
    onFinishLoading: () => void;
    startLoading: () => () => void;
    traceCodeSection: <T>(target: () => Promise<T>, sectionName: string) => Promise<T>;
}
export declare const MockedPerformanceMeasureHookType: PerformanceMeasureHookType;
