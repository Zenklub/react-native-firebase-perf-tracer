import perf, { FirebasePerformanceTypes } from '@react-native-firebase/perf';

import { PerformanceMeasureConstants } from './constants';
import { PerformanceHelper } from './helpers';
import { PerformanceMeasureSessionType } from './types.d';

export class PerformanceMeasureSession
	implements PerformanceMeasureSessionType {
	private identifier: string;
	private trace?: FirebasePerformanceTypes.Trace | null;
	private traceStartedAt?: Date | null;

	static setGlobalEnabled: () => void;
	static setGlobalDisabled: () => void;

	constructor(identifier: string) {
		this.identifier = PerformanceHelper.sanitizeName(
			identifier,
			PerformanceMeasureConstants.MaxTraceNameLength
		);
	}

	private log = (message: any) =>
		console.log(
			`%cPerformance Measure:%c ${this.identifier}`,
			'background: #5500FF; color: #FFF; padding: 2px',
			'color: #bada55',
			message
		);

	putAttribute = (attributeName: string, value: string) => {
		const name = PerformanceHelper.sanitizeName(
			attributeName,
			PerformanceMeasureConstants.MaxAttributeKeyLength
		);

		const trimmedValue = value.substring(
			0,
			PerformanceMeasureConstants.MaxAttributeValueLength
		);

		this.trace?.putAttribute(name, trimmedValue);
		this.log(`Put Attribute: ${name} = ${trimmedValue}`);
	};

	incrementMetric = (metricName: string, incrementBy: number) => {
		const name = PerformanceHelper.sanitizeName(
			metricName,
			PerformanceMeasureConstants.MaxAttributeKeyLength
		);
		this.trace?.incrementMetric(name, incrementBy);
		const metricNow = this.trace?.getMetric(metricName);
		const was = (metricNow || 0) - incrementBy;
		this.log(`Increment Metric: ${name} from ${was} to ${metricNow}`);
	};

	startTraceSession = async () => {
		this.trace = perf().newTrace(this.identifier);
		this.traceStartedAt = new Date();
		await this.trace.start();
	};

	completeTraceSession = () => {
		if (this.traceStartedAt) {
			const time = new Date().getTime() - this.traceStartedAt?.getTime();
			this.log(`Session Finished within ${time}`);
		}
		this.trace?.stop();
	};

	onFinishLoading = (loadingName: string, start: Date) => {
		const time = new Date().getTime() - start.getTime();
		this.putAttribute(loadingName, `${time}`);
		this.log(`Finished Loading "${loadingName}" within ${time}ms`);
	};

	startLoading = (loadingName: string) => {
		const start = new Date();
		return () => {
			this.onFinishLoading(loadingName, start);
		};
	};

	traceCodeSection = async <T>(
		target: () => Promise<T>,
		sectionName: string
	): Promise<T> => {
		const stopLoading = this.startLoading(sectionName);
		const result = await target();
		stopLoading();
		return result;
	};
}

PerformanceMeasureSession.setGlobalEnabled = PerformanceHelper.setGlobalEnabled;
PerformanceMeasureSession.setGlobalDisabled =
	PerformanceHelper.setGlobalDisabled;
