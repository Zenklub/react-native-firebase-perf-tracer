import { PerformanceMeasureConstants } from './constants';

let disabled = true;

const toSnakeCase = (str: string): string =>
  str
    .replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    .replace(/^_/, '');

export const sanitizeName = (
  name: string,
  limit: PerformanceMeasureConstants,
): string => {
  return toSnakeCase(name)
    .replace(/^\s+|\s+$/g, '')
    .replace(/\s/, '_')
    .substring(0, limit);
};

export const setGlobalDisabled = () => {
  disabled = true;
};

export const setGlobalEnabled = () => {
  disabled = false;
};

export const isGlobalEnabled = (): boolean => {
  return disabled;
};
