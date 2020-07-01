import { PerformanceMeasureSessionType } from './types.d';
export declare class PerformanceMeasureSession implements PerformanceMeasureSessionType {
    private identifier;
    private trace?;
    private traceStartedAt?;
    static setGlobalEnabled: () => void;
    static setGlobalDisabled: () => void;
    constructor(identifier: string);
    private log;
    putAttribute: (attributeName: string, value: string) => void;
    incrementMetric: (metricName: string, incrementBy: number) => void;
    startTraceSession: () => Promise<void>;
    completeTraceSession: () => void;
    onFinishLoading: (loadingName: string, start: Date) => void;
    startLoading: (loadingName: string) => () => void;
    traceCodeSection: <T>(target: () => Promise<T>, sectionName: string) => Promise<T>;
}
