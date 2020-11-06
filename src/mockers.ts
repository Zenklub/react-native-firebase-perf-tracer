import { PerformanceMeasureSession } from './performance-measure-session';

export class MockedPerformanceMeasureSession extends PerformanceMeasureSession {
	constructor() {
		super('');
	}
	putAttribute = () => {};
	incrementMetric = () => {};

	startTraceSession = async () => {};
	completeTraceSession = () => {};

	onFinishLoading = () => {};
	startLoading = () => () => {};

	traceCodeSection = async <T>(target: () => Promise<T>): Promise<T> => {
		const result = await target();
		return result;
	};
}

export const MockedPerformanceMeasureHookType: PerformanceMeasureHookType = {
	startTraceSession: () =>
		Promise.resolve(new MockedPerformanceMeasureSession()),
	completeTraceSession: () => {},
	failTraceSession: () => {},
	traceMethod: <TFunction extends () => any>(method: TFunction) => method,
};
