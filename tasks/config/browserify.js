/**
 * Concatenate files.
 *
 * ---------------------------------------------------------------
 *
 * Concatenates files javascript and css from a defined array. Creates concatenated files in
 * .tmp/public/contact directory
 * [concat](https://github.com/gruntjs/grunt-contrib-concat)
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-concat
 */
module.exports = function(grunt) {

    grunt.config.set('browserify', {
        dev: {
            files : {
                'assets/js/all.js' : ['assets/js/main.js']
            },
            browserifyOptions : {
                debug : true
            }
        }
    });

    grunt.loadNpmTasks('grunt-browserify');
};
