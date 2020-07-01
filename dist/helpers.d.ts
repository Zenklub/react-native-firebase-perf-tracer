import { PerformanceMeasureConstants } from './constants';
declare class Helper {
    enabled: boolean;
    toSnakeCase: (str: string) => string;
    sanitizeName: (name: string, limit: PerformanceMeasureConstants) => string;
    setGlobalDisabled: () => void;
    setGlobalEnabled: () => void;
    isGlobalEnabled: () => boolean;
}
export declare const PerformanceHelper: Helper;
export {};
