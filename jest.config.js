module.exports = {
	preset: 'react-native',
	coverageDirectory: '<rootDir>/coverage',
	globals: {
		__TEST__: true,
	},
	moduleFileExtensions: ['ts', 'tsx', 'js'],
	testPathIgnorePatterns: [
		'<rootDir>/node_modules',
		'<rootDir>/dist',
		'<rootDir>/docs',
	],
};
