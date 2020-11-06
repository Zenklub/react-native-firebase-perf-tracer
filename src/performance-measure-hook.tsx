import React from 'react';

import { PerformanceMeasureSession } from './performance-measure-session';
import {
	PerformanceMeasureHookType,
	PerformanceMeasureSessionType,
} from './types';

export const usePerformanceMeasure = (
	identifier: string
): PerformanceMeasureHookType => {
	const sessions = React.useRef<{
		[key: string]: PerformanceMeasureSession;
	}>({});

	const startTraceSession = async <T extends PerformanceMeasureSessionType>(
		name: string
	): Promise<T> => {
		const sessionName = `${identifier}::${name}`;
		const session = new PerformanceMeasureSession(sessionName);
		sessions.current[sessionName] = session;
		await session.startTraceSession();
		return (session as unknown) as T;
	};

	const completeTraceSession = (name: string) => {
		const sessionName = `${identifier}::${name}`;
		const { [sessionName]: session } = sessions.current;
		if (session) {
			session.completeTraceSession();
			delete sessions.current[sessionName];
		}
	};

	const failTraceSession = (name: string) => {
		const sessionName = `${identifier}::${name}`;
		const { [sessionName]: session } = sessions.current;
		if (session) {
			session.putAttribute('failed', 'true');
			session.completeTraceSession();
			delete sessions.current[sessionName];
		}
	};

	const traceMethod = <TFunction extends (...args: any) => any>(
		method: TFunction,
		traceName: string
	): TFunction =>
		((async (...args: any[]) => {
			await startTraceSession(traceName);
			const methodResults = await method(...args);
			completeTraceSession(traceName);
			return methodResults;
		}) as any) as TFunction;

	return {
		startTraceSession,
		completeTraceSession,
		failTraceSession,
		traceMethod,
	};
};
