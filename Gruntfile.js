// Generated on 2014-11-19 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/**/*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: 'dist'
  };

  var developerName;

  function assignDeveloperName(err, stdout, stderr, cb) {
    if(stdout && stdout !== ''){
      var trimmed = stdout.trim();
      console.log('Developer Name: ' + trimmed);
      developerName = trimmed;
    }
    cb();
  }

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep']
      },
      html: {
        files: ['<%= yeoman.app %>/**/*.html'],
        tasks: ['copy:viewsToTmp', 'ngtemplates']
      },
      js: {
        files: ['<%= yeoman.app %>/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      jsTest: {
        files: ['test/spec/**/*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      sass: {
        files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
        tasks: ['sass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/**/*.html',
          '.tmp/styles/**/*.css',
          '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          port: 9001,
          middleware: function (connect) {
            return [
              connect.static('.tmp'),
              connect.static('test'),
              connect().use(
                '/bower_components',
                connect.static('./bower_components')
              ),
              connect.static(appConfig.app)
            ];
          }
        }
      },
      testdist: {
        options: {
          port: 9001,
          base: '<%= yeoman.dist %>'
        }
      },
      dist: {
        options: {
          open: true,
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: {
        src: [
          'Gruntfile.js',
          '<%= yeoman.app %>/**/*.js'
        ]
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/**/*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%= yeoman.dist %>/**/*',
            '!<%= yeoman.dist %>/.git**/*'
          ]
        }]
      },
      reports: 'reports',
      tmp: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '**/*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath:  /\.\.\//,
        exclude: [
          'bower_components/bootstrap/dist/css/bootstrap.css',
          'bower_components/fontawesome/css/font-awesome.css',
          'bower_components/bootstrap-sass-official/assets/javascripts/*'
        ]
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        includePaths: [
          '<%= yeoman.app %>/styles',
          'bower_components'
        ],
        imagePath: '/images',
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/styles',
          src: ['*.scss'],
          dest: '.tmp/styles',
          ext: '.css'
        }]
      }
    },

    'ddescribe-iit': {
      files: [ 'test/**/*.js' ]
    },

    // Renames files for browser caching purposes
    filerev: {
      assets: {
        src: [
          '<%= yeoman.dist %>/**/*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      },
      css: {
        src: [
          '<%= yeoman.dist %>/styles/**/*.css',
        ]
      },
      scripts: {
        src: [
          '<%= yeoman.dist %>/**/*.js'
        ]
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on filerev and the useminPrepare configuration
    usemin: {
      html: ['.tmp/views/**/*.html', '<%= yeoman.dist %>/**/*.html'],
      css: ['<%= yeoman.dist %>/styles/**/*.css'],
      js: ['<%= yeoman.dist %>/scripts/**/*.js'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>','<%= yeoman.dist %>/images'],
        patterns: {
          // https://github.com/yeoman/grunt-usemin/issues/235#issuecomment-33316221
          js: [
            [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    ngtemplates: {
      app: {
        cwd: '.tmp/views',
        src: '**/*.html',
        dest: '<%= yeoman.app %>/scripts/generated/inline-views.js',
        options: {
          module: 'webApp'
        }
      }
    },

    htmlmin: {
      options: {
        conservativeCollapse:           true,
        collapseBooleanAttributes:      true,
        collapseWhitespace:             true,
        removeAttributeQuotes:          true,
        removeComments:                 true, // Only if you don't use comment directives!
        removeEmptyAttributes:          true,
        removeRedundantAttributes:      true,
        removeScriptTypeAttributes:     true,
        removeStyleLinkTypeAttributes:  true,
        removeCommentsFromCDATA:        true,
        removeOptionalTags:             true
      },
      views: {
        files: [{
          expand: true,
          cwd: '.tmp/views',
          src: '**/*.html',
          dest: '.tmp/views'
        }]
      },
      nonViews: {
        options: {
          removeAttributeQuotes:          false // For CDN conversion compatibility
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: '**/*.html',
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    cssmin: {
       dist: {
         files: {
           '<%= yeoman.dist %>/styles/main.css': [
             '.tmp/styles/**/*.css'
           ]
         }
       }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '**/*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    cdn: {
      options: {
        cdn: '//az743635.vo.msecnd.net/',
        flatten: true
      },
      dist: {
        cwd: '<%= yeoman.dist %>',
        dest: '<%= yeoman.dist %>',
        src: ['index.html', 'styles/*.css']
      }
    },

    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/index.html']
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!oldieshim.js'],
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      nonConcatenatedFilesToDist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html', // Root HTML files only. Views are in-lined into a JS file, so shouldn't be distributed.
            'images/**/*',
            'images/**/*.{webp}',
            'fonts/**/*.*',
            '**/Web.config'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: 'generated/*'
        }, {
          expand: true,
          cwd: '.',
          src: [
            'bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*',
            'bower_components/fontawesome/fonts/*'
          ],
          dest: '<%= yeoman.dist %>'
        },
        { src: '<%= yeoman.app %>/Caching.config', dest: '<%= yeoman.dist %>/fonts/Web.config' },
        { src: '<%= yeoman.app %>/Caching.config', dest: '<%= yeoman.dist %>/images/Web.config' },
        { src: '<%= yeoman.app %>/Caching.config', dest: '<%= yeoman.dist %>/scripts/Web.config' },
        { src: '<%= yeoman.app %>/Caching.config', dest: '<%= yeoman.dist %>/styles/Web.config' }
        ]
      },
      plainCssToTmp: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '**/*.css'
      },
      viewsToTmp: {
        expand: true,
        cwd: '<%= yeoman.app %>',
        src: '*/**/*.html', // Skip root files. Views only.
        dest: '.tmp/views/'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:viewsToTmp',
        'copy:plainCssToTmp',
        'sass:server'
      ],
      test: [
        'copy:viewsToTmp',
        'copy:plainCssToTmp',
        'sass'
      ],
      buildPhase1: [
        'copy:viewsToTmp',
        'copy:plainCssToTmp',
        'sass:dist',
        'imagemin',
        'svgmin'
      ],
      buildPhase2: [
        'autoprefixer', // Apply cross-browser vendor prefixes to all CSS in `.tmp`.
        'copy:nonConcatenatedFilesToDist', // Copy everything generated so far into dist.
      ],
      buildPhase3: [
        'ngAnnotate', // Ensure JS minimisation does not break Angular DI.
        'cssmin' // Minimise CSS. Creates file in `dist`.
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'test/karma.conf.js',
        singleRun: true,
        browsers: [
          'ChromeNoSandbox'
        ]
      }
    },

    protractor: {
      options: {
        configFile: 'test/protractor.conf.js',
        keepAlive: false, // If false, the grunt process stops when the test fails.
        noColor: false,
        debug: false
      },
      local: {
        args: {
          chromeDriver: 'node_modules/protractor/selenium/chromedriver'
        }
      },
      browserstack:{
        options:{
          configFile: 'test/protractor-browserstack.conf.js'
        }
      },
      debug:{
        options:{
          configFile: 'test/protractor-debug.conf.js'
        }
      },
      prepush:{
        options:{
          configFile: 'test/protractor-prepush.conf.js'
        }
      }
    },

    browserstackTunnel: {
      options: {
          accessKey: process.env.BROWSER_STACK_ACCESS_KEY
      },
      development: {
          options: {
              hostname: 'localhost',
              port: 9001
          }
      }
    },

    replace: {
      newRelic: {
        src: ['dist/index.html'],
        overwrite: true,
        replacements: [{
          from: '<!-- NEW_RELIC -->',
          to: '<script type="text/javascript">\nwindow.NREUM||(NREUM={}),__nr_require=function(t,e,n){function r(n){if(!e[n]){var o=e[n]={exports:{}};t[n][0].call(o.exports,function(e){var o=t[n][1][e];return r(o?o:e)},o,o.exports)}return e[n].exports}if("function"==typeof __nr_require)return __nr_require;for(var o=0;o<n.length;o++)r(n[o]);return r}({QJf3ax:[function(t,e){function n(t){function e(e,n,a){t&&t(e,n,a),a||(a={});for(var c=s(e),f=c.length,u=i(a,o,r),d=0;f>d;d++)c[d].apply(u,n);return u}function a(t,e){f[t]=s(t).concat(e)}function s(t){return f[t]||[]}function c(){return n(e)}var f={};return{on:a,emit:e,create:c,listeners:s,_events:f}}function r(){return{}}var o="nr@context",i=t("gos");e.exports=n()},{gos:"7eSDFh"}],ee:[function(t,e){e.exports=t("QJf3ax")},{}],3:[function(t){function e(t,e,n,i,s){try{c?c-=1:r("err",[s||new UncaughtException(t,e,n)])}catch(f){try{r("ierr",[f,(new Date).getTime(),!0])}catch(u){}}return"function"==typeof a?a.apply(this,o(arguments)):!1}function UncaughtException(t,e,n){this.message=t||"Uncaught error with no additional information",this.sourceURL=e,this.line=n}function n(t){r("err",[t,(new Date).getTime()])}var r=t("handle"),o=t(5),i=t("ee"),a=window.onerror,s=!1,c=0;t("loader").features.err=!0,window.onerror=e,NREUM.noticeError=n;try{throw new Error}catch(f){"stack"in f&&(t(1),t(4),"addEventListener"in window&&t(2),window.XMLHttpRequest&&XMLHttpRequest.prototype&&XMLHttpRequest.prototype.addEventListener&&t(3),s=!0)}i.on("fn-start",function(){s&&(c+=1)}),i.on("fn-err",function(t,e,r){s&&(this.thrown=!0,n(r))}),i.on("fn-end",function(){s&&!this.thrown&&c>0&&(c-=1)}),i.on("internal-error",function(t){r("ierr",[t,(new Date).getTime(),!0])})},{1:8,2:5,3:9,4:7,5:20,ee:"QJf3ax",handle:"D5DuLP",loader:"G9z0Bl"}],4:[function(t){function e(){}if(window.performance&&window.performance.timing&&window.performance.getEntriesByType){var n=t("ee"),r=t("handle"),o=t(2);t("loader").features.stn=!0,t(1),n.on("fn-start",function(t){var e=t[0];e instanceof Event&&(this.bstStart=Date.now())}),n.on("fn-end",function(t,e){var n=t[0];n instanceof Event&&r("bst",[n,e,this.bstStart,Date.now()])}),o.on("fn-start",function(t,e,n){this.bstStart=Date.now(),this.bstType=n}),o.on("fn-end",function(t,e){r("bstTimer",[e,this.bstStart,Date.now(),this.bstType])}),n.on("pushState-start",function(){this.time=Date.now(),this.startPath=location.pathname+location.hash}),n.on("pushState-end",function(){r("bstHist",[location.pathname+location.hash,this.startPath,this.time])}),"addEventListener"in window.performance&&(window.performance.addEventListener("webkitresourcetimingbufferfull",function(){r("bstResource",[window.performance.getEntriesByType("resource")]),window.performance.webkitClearResourceTimings()},!1),window.performance.addEventListener("resourcetimingbufferfull",function(){r("bstResource",[window.performance.getEntriesByType("resource")]),window.performance.clearResourceTimings()},!1)),document.addEventListener("scroll",e,!1),document.addEventListener("keypress",e,!1),document.addEventListener("click",e,!1)}},{1:6,2:8,ee:"QJf3ax",handle:"D5DuLP",loader:"G9z0Bl"}],5:[function(t,e){function n(t){i.inPlace(t,["addEventListener","removeEventListener"],"-",r)}function r(t){return t[1]}var o=(t(1),t("ee").create()),i=t(2)(o),a=t("gos");if(e.exports=o,n(window),"getPrototypeOf"in Object){for(var s=document;s&&!s.hasOwnProperty("addEventListener");)s=Object.getPrototypeOf(s);s&&n(s);for(var c=XMLHttpRequest.prototype;c&&!c.hasOwnProperty("addEventListener");)c=Object.getPrototypeOf(c);c&&n(c)}else XMLHttpRequest.prototype.hasOwnProperty("addEventListener")&&n(XMLHttpRequest.prototype);o.on("addEventListener-start",function(t){if(t[1]){var e=t[1];"function"==typeof e?this.wrapped=t[1]=a(e,"nr@wrapped",function(){return i(e,"fn-",null,e.name||"anonymous")}):"function"==typeof e.handleEvent&&i.inPlace(e,["handleEvent"],"fn-")}}),o.on("removeEventListener-start",function(t){var e=this.wrapped;e&&(t[1]=e)})},{1:20,2:21,ee:"QJf3ax",gos:"7eSDFh"}],6:[function(t,e){var n=(t(2),t("ee").create()),r=t(1)(n);e.exports=n,r.inPlace(window.history,["pushState"],"-")},{1:21,2:20,ee:"QJf3ax"}],7:[function(t,e){var n=(t(2),t("ee").create()),r=t(1)(n);e.exports=n,r.inPlace(window,["requestAnimationFrame","mozRequestAnimationFrame","webkitRequestAnimationFrame","msRequestAnimationFrame"],"raf-"),n.on("raf-start",function(t){t[0]=r(t[0],"fn-")})},{1:21,2:20,ee:"QJf3ax"}],8:[function(t,e){function n(t,e,n){var r=t[0];"string"==typeof r&&(r=new Function(r)),t[0]=o(r,"fn-",null,n)}var r=(t(2),t("ee").create()),o=t(1)(r);e.exports=r,o.inPlace(window,["setTimeout","setInterval","setImmediate"],"setTimer-"),r.on("setTimer-start",n)},{1:21,2:20,ee:"QJf3ax"}],9:[function(t,e){function n(){c.inPlace(this,d,"fn-")}function r(t,e){c.inPlace(e,["onreadystatechange"],"fn-")}function o(t,e){return e}var i=t("ee").create(),a=t(1),s=t(2),c=s(i),f=s(a),u=window.XMLHttpRequest,d=["onload","onerror","onabort","onloadstart","onloadend","onprogress","ontimeout"];e.exports=i,window.XMLHttpRequest=function(t){var e=new u(t);try{i.emit("new-xhr",[],e),f.inPlace(e,["addEventListener","removeEventListener"],"-",function(t,e){return e}),e.addEventListener("readystatechange",n,!1)}catch(r){try{i.emit("internal-error",[r])}catch(o){}}return e},window.XMLHttpRequest.prototype=u.prototype,c.inPlace(XMLHttpRequest.prototype,["open","send"],"-xhr-",o),i.on("send-xhr-start",r),i.on("open-xhr-start",r)},{1:5,2:21,ee:"QJf3ax"}],10:[function(t){function e(t){if("string"==typeof t&&t.length)return t.length;if("object"!=typeof t)return void 0;if("undefined"!=typeof ArrayBuffer&&t instanceof ArrayBuffer&&t.byteLength)return t.byteLength;if("undefined"!=typeof Blob&&t instanceof Blob&&t.size)return t.size;if("undefined"!=typeof FormData&&t instanceof FormData)return void 0;try{return JSON.stringify(t).length}catch(e){return void 0}}function n(t){var n=this.params,r=this.metrics;if(!this.ended){this.ended=!0;for(var i=0;c>i;i++)t.removeEventListener(s[i],this.listener,!1);if(!n.aborted){if(r.duration=(new Date).getTime()-this.startTime,4===t.readyState){n.status=t.status;var a=t.responseType,f="arraybuffer"===a||"blob"===a||"json"===a?t.response:t.responseText,u=e(f);if(u&&(r.rxSize=u),this.sameOrigin){var d=t.getResponseHeader("X-NewRelic-App-Data");d&&(n.cat=d.split(", ").pop())}}else n.status=0;r.cbTime=this.cbTime,o("xhr",[n,r,this.startTime])}}}function r(t,e){var n=i(e),r=t.params;r.host=n.hostname+":"+n.port,r.pathname=n.pathname,t.sameOrigin=n.sameOrigin}if(window.XMLHttpRequest&&XMLHttpRequest.prototype&&XMLHttpRequest.prototype.addEventListener&&!/CriOS/.test(navigator.userAgent)){t("loader").features.xhr=!0;var o=t("handle"),i=t(2),a=t("ee"),s=["load","error","abort","timeout"],c=s.length,f=t(1);t(4),t(3),a.on("new-xhr",function(){this.totalCbs=0,this.called=0,this.cbTime=0,this.end=n,this.ended=!1,this.xhrGuids={}}),a.on("open-xhr-start",function(t){this.params={method:t[0]},r(this,t[1]),this.metrics={}}),a.on("open-xhr-end",function(t,e){"loader_config"in NREUM&&"xpid"in NREUM.loader_config&&this.sameOrigin&&e.setRequestHeader("X-NewRelic-ID",NREUM.loader_config.xpid)}),a.on("send-xhr-start",function(t,n){var r=this.metrics,o=t[0],i=this;if(r&&o){var f=e(o);f&&(r.txSize=f)}this.startTime=(new Date).getTime(),this.listener=function(t){try{"abort"===t.type&&(i.params.aborted=!0),("load"!==t.type||i.called===i.totalCbs&&(i.onloadCalled||"function"!=typeof n.onload))&&i.end(n)}catch(e){try{a.emit("internal-error",[e])}catch(r){}}};for(var u=0;c>u;u++)n.addEventListener(s[u],this.listener,!1)}),a.on("xhr-cb-time",function(t,e,n){this.cbTime+=t,e?this.onloadCalled=!0:this.called+=1,this.called!==this.totalCbs||!this.onloadCalled&&"function"==typeof n.onload||this.end(n)}),a.on("xhr-load-added",function(t,e){var n=""+f(t)+!!e;this.xhrGuids&&!this.xhrGuids[n]&&(this.xhrGuids[n]=!0,this.totalCbs+=1)}),a.on("xhr-load-removed",function(t,e){var n=""+f(t)+!!e;this.xhrGuids&&this.xhrGuids[n]&&(delete this.xhrGuids[n],this.totalCbs-=1)}),a.on("addEventListener-end",function(t,e){e instanceof XMLHttpRequest&&"load"===t[0]&&a.emit("xhr-load-added",[t[1],t[2]],e)}),a.on("removeEventListener-end",function(t,e){e instanceof XMLHttpRequest&&"load"===t[0]&&a.emit("xhr-load-removed",[t[1],t[2]],e)}),a.on("fn-start",function(t,e,n){e instanceof XMLHttpRequest&&("onload"===n&&(this.onload=!0),("load"===(t[0]&&t[0].type)||this.onload)&&(this.xhrCbStart=(new Date).getTime()))}),a.on("fn-end",function(t,e){this.xhrCbStart&&a.emit("xhr-cb-time",[(new Date).getTime()-this.xhrCbStart,this.onload,e],e)})}},{1:"XL7HBI",2:11,3:9,4:5,ee:"QJf3ax",handle:"D5DuLP",loader:"G9z0Bl"}],11:[function(t,e){e.exports=function(t){var e=document.createElement("a"),n=window.location,r={};e.href=t,r.port=e.port;var o=e.href.split("://");return!r.port&&o[1]&&(r.port=o[1].split("/")[0].split(":")[1]),r.port&&"0"!==r.port||(r.port="https"===o[0]?"443":"80"),r.hostname=e.hostname||n.hostname,r.pathname=e.pathname,"/"!==r.pathname.charAt(0)&&(r.pathname="/"+r.pathname),r.sameOrigin=!e.hostname||e.hostname===document.domain&&e.port===n.port&&e.protocol===n.protocol,r}},{}],gos:[function(t,e){e.exports=t("7eSDFh")},{}],"7eSDFh":[function(t,e){function n(t,e,n){if(r.call(t,e))return t[e];var o=n();if(Object.defineProperty&&Object.keys)try{return Object.defineProperty(t,e,{value:o,writable:!0,enumerable:!1}),o}catch(i){}return t[e]=o,o}var r=Object.prototype.hasOwnProperty;e.exports=n},{}],D5DuLP:[function(t,e){function n(t,e,n){return r.listeners(t).length?r.emit(t,e,n):(o[t]||(o[t]=[]),void o[t].push(e))}var r=t("ee").create(),o={};e.exports=n,n.ee=r,r.q=o},{ee:"QJf3ax"}],handle:[function(t,e){e.exports=t("D5DuLP")},{}],XL7HBI:[function(t,e){function n(t){var e=typeof t;return!t||"object"!==e&&"function"!==e?-1:t===window?0:i(t,o,function(){return r++})}var r=1,o="nr@id",i=t("gos");e.exports=n},{gos:"7eSDFh"}],id:[function(t,e){e.exports=t("XL7HBI")},{}],loader:[function(t,e){e.exports=t("G9z0Bl")},{}],G9z0Bl:[function(t,e){function n(){var t=p.info=NREUM.info;if(t&&t.agent&&t.licenseKey&&t.applicationID&&c&&c.body){p.proto="https"===d.split(":")[0]||t.sslForHttp?"https://":"http://",a("mark",["onload",i()]);var e=c.createElement("script");e.src=p.proto+t.agent,c.body.appendChild(e)}}function r(){"complete"===c.readyState&&o()}function o(){a("mark",["domContent",i()])}function i(){return(new Date).getTime()}var a=t("handle"),s=window,c=s.document,f="addEventListener",u="attachEvent",d=(""+location).split("?")[0],p=e.exports={offset:i(),origin:d,features:{}};c[f]?(c[f]("DOMContentLoaded",o,!1),s[f]("load",n,!1)):(c[u]("onreadystatechange",r),s[u]("onload",n)),a("mark",["firstbyte",i()])},{handle:"D5DuLP"}],20:[function(t,e){function n(t,e,n){e||(e=0),"undefined"==typeof n&&(n=t?t.length:0);for(var r=-1,o=n-e||0,i=Array(0>o?0:o);++r<o;)i[r]=t[e+r];return i}e.exports=n},{}],21:[function(t,e){function n(t){return!(t&&"function"==typeof t&&t.apply&&!t[i])}var r=t("ee"),o=t(1),i="nr@wrapper",a=Object.prototype.hasOwnProperty;e.exports=function(t){function e(t,e,r,a){function nrWrapper(){var n,i,s,f;try{i=this,n=o(arguments),s=r&&r(n,i)||{}}catch(d){u([d,"",[n,i,a],s])}c(e+"start",[n,i,a],s);try{return f=t.apply(i,n)}catch(p){throw c(e+"err",[n,i,p],s),p}finally{c(e+"end",[n,i,f],s)}}return n(t)?t:(e||(e=""),nrWrapper[i]=!0,f(t,nrWrapper),nrWrapper)}function s(t,r,o,i){o||(o="");var a,s,c,f="-"===o.charAt(0);for(c=0;c<r.length;c++)s=r[c],a=t[s],n(a)||(t[s]=e(a,f?s+o:o,i,s,t))}function c(e,n,r){try{t.emit(e,n,r)}catch(o){u([o,e,n,r])}}function f(t,e){if(Object.defineProperty&&Object.keys)try{var n=Object.keys(t);return n.forEach(function(n){Object.defineProperty(e,n,{get:function(){return t[n]},set:function(e){return t[n]=e,e}})}),e}catch(r){u([r])}for(var o in t)a.call(t,o)&&(e[o]=t[o]);return e}function u(e){try{t.emit("internal-error",e)}catch(n){}}return t||(t=r),e.inPlace=s,e.flag=i,e}},{1:20,ee:"QJf3ax"}]},{},["G9z0Bl",3,10,4]);\n  ;NREUM.info={beacon:"bam.nr-data.net",errorBeacon:"bam.nr-data.net",licenseKey:"42f24aef23",applicationID:"7265492",sa:1,agent:"js-agent.newrelic.com/nr-476.min.js"}\n  </script>'
        }]
      }
    },

    'file-creator': {
      local: {
        'app/scripts/generated/api.js': function(fs, fd, done) {
          fs.writeSync(fd, 'window.configuredApiBaseUri = \'https://10.211.55.3:44301/\';');
          done();
        }
      },
      live: {
        'app/scripts/generated/api.js': function(fs, fd, done) {
          fs.writeSync(fd, 'window.configuredApiBaseUri = \'https://api.fifthweek.com/\';');
          done();
        }
      },
      app: {
        'app/scripts/generated/developer.js': function(fs, fd, done) {
          if(developerName){
            fs.writeSync(fd, 'window.developerName = \'' + developerName +  '\';');
          }
          else{
            fs.writeSync(fd, '');
          }
          done();
        }
      },
      dist:{
        'app/scripts/generated/developer.js': function(fs, fd, done) {
          fs.writeSync(fd, '');
          done();
        }
      }
    },

    shell: {
      getDeveloperName: {
        command: 'git config user.name',
        options: {
          callback: assignDeveloperName,
          stdout: false
        }
      }
    }
  });

  function isLocal(targetApi){
    return targetApi === 'local';
  }

  function isLive(targetApi){
    return targetApi === 'live';
  }

  function isApp(targetBase){
    return targetBase === 'app';
  }

  function isDist(targetBase) {
    return targetBase === 'dist';
  }

  function isTravisSuccess(targetBase) {
    return targetBase === 'travisSuccess';
  }

  function getDeveloperName() {
    grunt.task.run(['shell:getDeveloperName']);
  }

  function runUpdate(scenario) {
    grunt.task.run(['update:' + scenario]);
  }

  function runTests(targetApi, targetBase, browserLocation, protractorOnly) {

    if(targetApi === undefined) {
      return;
    }

    if(targetBase === undefined) {
      targetBase = 'app';
    }

    if(browserLocation === undefined){
      browserLocation = 'local';
    }

    getDeveloperName();

    runUpdate(targetApi);
    runUpdate(targetBase);

    var tasks = [ 'clean:reports' ];

    if (!protractorOnly){
      tasks.push(
        'jshint');
    }

    if (isDist(targetBase)) {
      tasks.push(
        'build',
        'connect:testdist');
    }
    else if(isApp(targetBase))
    {
      tasks.push(
        'clean:tmp',
        'concurrent:test',
        'ngtemplates',
        'autoprefixer',
        'connect:test');
    }

    if (!protractorOnly){
      tasks.push(
        'karma');
    }

    if(browserLocation === 'browserstack'){
      tasks.push(
        'browserstackTunnel');
    }

    tasks.push(
      'protractor:' + browserLocation);

    grunt.task.run(tasks);
  }

  grunt.registerTask('build', [
    'clean:tmp',
    'clean:dist',

    // Process the `index.html`.
    'wiredep',
    'useminPrepare',

    // Run unrelated build steps concurrently.
    'concurrent:buildPhase1',
    'concurrent:buildPhase2',

    // Convert some bower component links to google CDN links.
    'cdnify',

    // Append hash to non-script file-names, and update references in views only.
    // Other HTML files in `dist` will be updated with a later call to `usemin`,
    // as will the CSS in `dist`. The final CSS does not exist at this point, thus
    // making the full `usemin` which includes `usemin:css` redundant.
    'filerev:assets',
    'usemin:html',
    'htmlmin:views',

    // Inline all views in `.tmp` and output to file in `app`.
    'ngtemplates',

    // Combine all scripts and styles into single files. These files are
    // taken from the `index.html`, which was processed with `useminPrepare`.
    // Files remain in `.tmp` at this point.
    'concat',

    // Run unrelated build steps concurrently.
    'concurrent:buildPhase3',

    // Minimise JS. Creates files in `dist`.
    'uglify',

    // Append hash to script file-names, and update references.
    'filerev:css',
    'filerev:scripts',
    'usemin',
    'htmlmin:nonViews',
  ]);

  grunt.registerTask('serve', '', function (targetApi, targetBase) {

    if(targetApi === undefined) {
      return;
    }

    if(targetBase === undefined) {
      targetBase = 'app';
    }

    getDeveloperName();

    runUpdate(targetApi);
    runUpdate(targetBase);

    if (isDist(targetBase)) {
      grunt.task.run([
        'build',
        'connect:dist:keepalive'
      ]);
    }
    else if(isApp(targetBase))
    {
      grunt.task.run([
        'clean:tmp',
        'wiredep',
        'concurrent:server',
        'ngtemplates',
        'autoprefixer',
        'connect:livereload',
        'watch'
      ]);
    }
  });

  grunt.registerTask('test', '', function(targetApi, targetBase, browserLocation) {
    runTests(targetApi, targetBase, browserLocation, false);
  });

  grunt.registerTask('ptest', 'protractor tests', function(targetApi, targetBase, browserLocation){
    runTests(targetApi, targetBase, browserLocation, true);
  });

  grunt.registerTask('pdebug', 'protractor tests', function(targetApi, targetBase){
    runTests(targetApi, targetBase, 'debug', true);
  });

  grunt.registerTask('update', 'updates source files for different scenarios', function(scenario){

    if(scenario === undefined)
    {
      return;
    }

    if(isLocal(scenario)){
      grunt.task.run([
        'file-creator:local'
      ]);
    }
    else if(isLive(scenario)){
      grunt.task.run([
        'file-creator:live'
      ]);
    }
    else if(isApp(scenario)){
      grunt.task.run([
        'file-creator:app'
      ]);
    }
    else if(isDist(scenario)){
      grunt.task.run([
        'file-creator:dist'
      ]);
    }
    else if(isTravisSuccess(scenario)){
      grunt.task.run([
        'replace:newRelic',
        'cdn:dist'
      ]);
    }
  });

  grunt.registerTask('default', [
    'test:live:app',
    'build'
  ]);

  grunt.registerTask('ci-checks', [
    'ddescribe-iit',
    'test:live:dist'
  ]);

  grunt.registerTask('prepush', [
    'ddescribe-iit',
    'test:live:app:prepush'
  ]);

  grunt.registerTask('prepush:local', [
    'ddescribe-iit',
    'test:local:app:prepush'
  ]);
};
