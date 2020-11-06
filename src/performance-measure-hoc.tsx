import React from 'react';

import {
	ProfilerPerformanceAttributesKeys,
	ProfilerPerformanceMetricsKeys,
} from './constants';
import { PerformanceHelper } from './helpers';
import {
	MockedPerformanceMeasureHookType,
	MockedPerformanceMeasureSession,
} from './mockers';
import { usePerformanceMeasure } from './performance-measure-hook';
import { PerformanceMeasureSession } from './performance-measure-session';
import {
	PerformanceMeasureHOCTypeProps,
	PerformanceMeasureSessionType,
} from './types.d';

const mocked = {
	performance: MockedPerformanceMeasureHookType,
	profileTracerSession: new MockedPerformanceMeasureSession(),
	profileTracerReady: () => {},
	profileTracerFail: () => {},
};

enum ReactProfilerPhases {
	Mount = 'mount',
	Update = 'update',
}

export const withPerformanceMeasure = <P extends Record<string, any>>(
	WrappedComponent:
		| React.ComponentType<P & PerformanceMeasureHOCTypeProps>
		| React.ComponentClass<P & PerformanceMeasureHOCTypeProps, any>,
	identifier: string
): React.FC<P> =>
	function withPerformanceMeasure(props) {
		const performance = usePerformanceMeasure(identifier);

		const profileTracerSession = React.useRef<PerformanceMeasureSession>();
		const traceStarted = React.useRef<boolean>(false);
		const isTracingFinished = React.useRef<boolean>(false);
		const initialMount = React.useRef<number>(0);
		const initialUpdates = React.useRef<number>(0);

		const [isEnabled, setEnabled] = React.useState<boolean>(false);

		const onRenderHandler = async (
			id: string,
			phase: 'mount' | 'update',
			actualDuration: number
		): Promise<void> => {
			if (isTracingFinished.current) {
				return;
			}

			if (phase === ReactProfilerPhases.Mount) {
				if (traceStarted.current) {
					profileTracerSession.current?.putAttribute(
						ProfilerPerformanceAttributesKeys.MountTime,
						`${actualDuration}`
					);
				} else {
					initialMount.current = actualDuration;
				}
			} else if (phase === ReactProfilerPhases.Update) {
				if (traceStarted.current) {
					profileTracerSession.current?.incrementMetric(
						ProfilerPerformanceMetricsKeys.Updates,
						1
					);
				} else {
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
			profileTracerSession.current = await performance.startTraceSession(
				'profiler'
			);
			traceStarted.current = true;

			// put cached values after trace started
			profileTracerSession.current?.putAttribute(
				ProfilerPerformanceAttributesKeys.MountTime,
				`${initialMount.current}`
			);

			if (initialUpdates) {
				profileTracerSession.current?.incrementMetric(
					ProfilerPerformanceMetricsKeys.Updates,
					initialUpdates.current
				);
			}
		};

		React.useEffect(() => {
			if (PerformanceHelper.isGlobalEnabled()) {
				setEnabled(true);
				startProfilerTracing();
			} else {
				setEnabled(false);
			}
			return () => stopTraceSession();
		}, []);

		return isEnabled ? (
			<React.Profiler id={identifier} onRender={onRenderHandler}>
				<WrappedComponent
					{...(props as P)}
					performance={performance}
					profileTracerReady={stopTraceSession}
					profileTracerFail={profileTracerFailHandler}
					profileTracerSession={
						profileTracerSession.current as PerformanceMeasureSessionType
					}
				/>
			</React.Profiler>
		) : (
			<WrappedComponent
				{...(props as P)}
				performance={mocked.performance}
				profileTracerReady={mocked.profileTracerReady}
				profileTracerFail={mocked.profileTracerFail}
				profileTracerSession={mocked.profileTracerSession}
			/>
		);
	};
