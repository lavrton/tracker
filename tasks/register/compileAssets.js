module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
		'jst:dev',
        'browserify:dev',
		'less:dev',
		'copy:dev',
		'coffee:dev'
	]);
};
