import { PerformanceMeasureSession } from '../performance-measure-session';

const mockPutAttribute = jest.fn();
const mockIncrementMetric = jest.fn();
const mockStop = jest.fn();

const mockNewTrace = jest.fn(() => ({
	getAttribute: jest.fn(),
	putAttribute: mockPutAttribute,
	getMetric: jest.fn(),
	getMetrics: jest.fn(),
	putMetric: jest.fn(),
	incrementMetric: mockIncrementMetric,
	removeMetric: jest.fn(),
	start: jest.fn(),
	stop: mockStop,
}));

jest.mock('@react-native-firebase/perf', () => () => ({
	newTrace: mockNewTrace,
}));

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Performance Measure Session', () => {
	it('should instantiate with the correct id', async () => {
		const instance = new PerformanceMeasureSession('ComponentId');
		await instance.startTraceSession();
		expect(mockNewTrace).lastCalledWith('component_id');
	});

	it('TraceCode returns correct value', async () => {
		const instance = new PerformanceMeasureSession('ComponentId');
		await instance.startTraceSession();

		const value = 'value that should returns';

		const returnedValue = await instance.traceCodeSection(async () => {
			await sleep(5);
			return value;
		}, 'TestTraceCodeSection');

		expect(returnedValue).toEqual(value);

		expect(mockPutAttribute).lastCalledWith(
			'test_trace_code_section',
			expect.anything()
		);
	});

	it('onFinishLoading should put attribute correctly', async () => {
		const instance = new PerformanceMeasureSession('ComponentId');
		await instance.startTraceSession();
		const finishLoading = instance.startLoading('Loading Test');
		finishLoading();
		expect(mockPutAttribute).lastCalledWith('loading__test', expect.anything());
	});

	it('Should increment metric correctaly', async () => {
		const instance = new PerformanceMeasureSession('ComponentId');
		await instance.startTraceSession();
		instance.incrementMetric('metric', 5);
		expect(mockIncrementMetric).lastCalledWith('metric', 5);
	});

	it('Should only stop trace when completeTraceSession is called', async () => {
		const instance = new PerformanceMeasureSession('ComponentId');
		await instance.startTraceSession();
		instance.completeTraceSession();
		expect(mockStop).toBeCalledTimes(1);
	});
});
