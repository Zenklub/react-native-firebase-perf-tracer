import { PerformanceMeasureConstants } from './constants';

class Helper {
	enabled = true;

	toSnakeCase = (str: string): string => {
		const string = str
			.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
			.replace(/^_/, '');
		if (string.match(/__/g)) {
			return string
				.split('__')
				.map((it) => it.replace(/_/g, ''))
				.join('_');
		}
		return string;
	};
	sanitizeName = (name: string, limit: PerformanceMeasureConstants): string => {
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
