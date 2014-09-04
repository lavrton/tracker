module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
		'jst:dev',
        'browserify:dev',
		'less:dev',
		'sync:dev',
		'coffee:dev',
	]);
};
