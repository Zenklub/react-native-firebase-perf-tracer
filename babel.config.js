module.exports = function (api) {
	api.cache(true);

	const isProduction =
		process.env.NODE_ENV === 'production' ||
		process.env.BABEL_ENV === 'production';

	const isTest = process.env.NODE_ENV === 'test';

	let presets = ['module:metro-react-native-babel-preset'];
	let plugins = [];

	if (isProduction || isTest) {
		plugins.push('transform-remove-console');
	}

	return {
		presets,
		plugins,
	};
};
