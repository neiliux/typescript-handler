module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        simplemocha: {
            options: {
                ignoreLeaks: false,
                ui: 'bdd',
                reporter: 'tap'
            },
            all: { src: 'tests/*.js' }
        },
        uglify: {
            target: {
                files: {
                    'build/typescript-handler.min.js': ['src/typescript-handler.js']
                },
                options: {
                    sourceMap: true,
                    mangle: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['simplemocha', 'uglify']);
    grunt.registerTask('tests', ['simplemocha']);
    grunt.registerTask('build', ['uglify']);
};