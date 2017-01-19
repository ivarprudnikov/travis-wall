module.exports = function(grunt) {
    'use strict';

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        express: {
            app: {
                options: {
                    script: 'server.js'
                }
            }
        },
        bower: {
            install: {
                options: {
                    targetDir: 'bower_components',
                    copy: false,
                    cleanTargetDir: true
                }
            }
        },
        copy: {
            app: {
                files: [{
                    src: [ 'public/favicon.ico' ],
                    dest: 'dist/favicon.ico'
                }]
            }
        },
        htmlmin: {
            app: {
                options: {
                    useShortDoctype: true,
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeComments: true,
                    removeAttributeQuotes: true,
                    removeRedundantAttributes: true,
                    removeEmptyAttributes: true,
                    removeOptionalTags: true
                },
                files: {
                    'dist/index.html': 'public/index.html',
                    'dist/partials/home.html': 'lib/partials/home.html',
                    'dist/partials/travis-login.html': 'lib/partials/travis-login.html',
                    'dist/partials/wall.html': 'lib/partials/wall.html'
                }
            }
        },
        less: {
            app: {
                files: {
                    'build/app.css': 'less/app.less'
                }
            }
        },
        imageEmbed: {
            app: {
                src: [ 'build/app.css' ],
                dest: 'build/app.css'
            }
        },
        cssmin : {
            options: {
                keepSpecialComments: 0
            },
            app: {
                src: 'build/app.css',
                dest: 'dist/css/app.min.css'
            }
        },
        ngAnnotate: {
            app: {
                src: [ 'lib/**/*.js' ],
                dest: 'build/app.js'
            }
        },
        uglify: {
            options: {
                sourceMap: false,
                mangle: false,
                compress: false,
                beautify: true
            },
            app: {
                files: {
                    'dist/js/dependencies.min.js': [
                        'bower_components/jquery/dist/jquery.js',
                        'bower_components/momentjs/moment.js',
                        'bower_components/angular/angular.js',
                        'bower_components/angular-route/angular-route.js',
                        'bower_components/angular-spinner/angular-spinner.js',
                        'bower_components/angular-masonry/angular-masonry.js',
                        'bower_components/spin.js/spin.js',
                        'bower_components/fizzy-ui-utils/utils.js',
                        'bower_components/get-style-property/get-style-property.js',
                        'bower_components/eventie/eventie.js',
                        'bower_components/doc-ready/doc-ready.js',
                        'bower_components/eventEmitter/EventEmitter.js',
                        'bower_components/matches-selector/matches-selector.js',
                        'bower_components/imagesloaded/imagesloaded.js',
                        'bower_components/outlayer/item.js',
                        'bower_components/outlayer/outlayer.js',
                        'bower_components/get-size/get-size.js',
                        'bower_components/masonry/dist/masonry.pkgd.js'
                    ],
                    'dist/js/app.min.js': [
                        'build/app.js'
                    ]
                }
            }
        },
        clean: {
            dist: [ 'dist' ],
            build: [ 'build' ]
        },
        watch: {
            img: {
                files:  [ 'img/**/*' ],
                tasks:  [ 'build' ]
            },
            less: {
                files:  [ 'less/**/*' ],
                tasks:  [ 'build' ]
            },
            lib: {
                files:  [ 'lib/**/*' ],
                tasks:  [ 'build' ]
            },
            public: {
                files: [ 'public/**/*' ],
                tasks: [ 'build' ]
            }
        },
        jshint: {
            files: [
                'lib/**/*.js',
                'test/**/*.js',
                '*.js'
            ]
        },
        jasmine: {
            app: {
                src: 'dist/js/app.min.js',
                options: {
                    specs: 'test/**/*Spec.js'
                }
            }
        },
        shell: {
            webDriverManagerUpdate: {
                command: 'node_modules/protractor/bin/webdriver-manager update'
            }
        },
        karma: {
            unit: {
                options: {
                    configFile: 'karma.conf.js'
                }
            }
        },
        protractor: {
            e2e: {
                options: {
                    configFile: 'protractor.conf.js'
                }
            }
        }
    });

    grunt.registerTask('install', [ 'bower:install' ]);

    grunt.registerTask('build', [
        'clean:dist',
        'copy',
        'htmlmin',
        'less',
        'imageEmbed',
        'cssmin',
        'ngAnnotate',
        'uglify',
        'clean:build'
    ]);

    grunt.registerTask('dist', [
        'install',
        'build'
    ]);

    grunt.registerTask('serve', [
        'express:app',
        'watch'
    ]);

    grunt.registerTask('test:unit', [
        'jshint',
        'karma:unit'
    ]);

    grunt.registerTask('test:e2e', [
        'shell:webDriverManagerUpdate',
        'express:app',
        'protractor:e2e'
    ]);

    grunt.registerTask('test', [
        'test:unit',
        'test:e2e'
    ]);

    grunt.registerTask('travis', [
        'dist',
        'test'
    ]);
};
