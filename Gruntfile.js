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
        },
        jsdoc: {
            dist: {
                src: ['src/*.js', 'tests/*.js'],
                dest: 'docs'
            }
        }
    });

    grunt.loadNpmTasks('grunt-simple-mocha');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('default', ['simplemocha', 'uglify', 'jsdoc']);
    grunt.registerTask('tests', ['simplemocha']);
    grunt.registerTask('build', ['uglify']);
    grunt.registerTask('docs', ['jsdoc']);
};