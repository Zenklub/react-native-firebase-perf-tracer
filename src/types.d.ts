type StopLoadingCallback = () => void;

export interface PerformanceMeasureSessionType {
	startTraceSession(): Promise<void>;
	completeTraceSession(): void;
	startLoading(loadingName: string): StopLoadingCallback;
	putAttribute(attributeName: string, value: string): void;
	incrementMetric(metricName: string, incrementBy: number): void;
	traceCodeSection<T>(
		target: () => Promise<T>,
		sectionName: string
	): Promise<T>;
}

export type TraceMethodType = <TFunction extends (...args: any) => any>(
	method: TFunction,
	traceName: string
) => TFunction;

export interface PerformanceMeasureHookType {
	startTraceSession(name: string): Promise<PerformanceMeasureSession>;
	completeTraceSession(name: string): void;
	failTraceSession(name: string): void;
	traceMethod: TraceMethodType;
}

export interface PerformanceMeasureHOCTypeProps {
	performance: PerformanceMeasureHookType;
	profileTracerReady: () => void;
	profileTracerFail: () => void;
	profileTracerSession: PerformanceMeasureSessionType;
}
