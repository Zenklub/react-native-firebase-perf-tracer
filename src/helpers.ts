import { PerformanceMeasureConstants } from './constants';

class Helper {
  enabled: boolean = true;

  toSnakeCase = (str: string): string =>
    str
      .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
      .replace(/^_/, '');
  sanitizeName = (
    name: string,
    limit: PerformanceMeasureConstants,
  ): string => {
    return this.toSnakeCase(name)
      .replace(/^\s+|\s+$/g, '')
      .replace(/\s/, '_')
      .substring(0, limit);
  };

  setGlobalDisabled = () => {
    this.enabled = false;
  };

  setGlobalEnabled = () => {
    this.enabled = true;
  };

  isGlobalEnabled = (): boolean => {
    return this.enabled;
  };
}

export const PerformanceHelper = new Helper();
