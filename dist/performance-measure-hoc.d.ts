import React from 'react';
import { PerformanceMeasureHOCTypeProps } from './types.d';
export declare const withPerformanceMeasure: <P extends object>(WrappedComponent: React.ComponentClass<P & PerformanceMeasureHOCTypeProps, any> | React.FunctionComponent<P & PerformanceMeasureHOCTypeProps> | React.ComponentClass<P & PerformanceMeasureHOCTypeProps, any>, identifier: string) => React.FC<P>;
