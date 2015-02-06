# Fifthweek Web

## Development setup

1.  Install Fifefox. Required for Travis CI.

2.  Standard NPM/Bower/Grunt stack:
     
        npm install
        bower install
        sudo gem update --system
        sudo gem install compass
        grunt build

3.  If you receive an `npm install` error relating to `pty.js`, do the following:

        mkdir /tmp/pty.js
        git clone https://github.com/chjj/pty.js.git /tmp/pty.js
        <open in editor /tmp/pty.js/src/unix/pty.cc>
        <replace failing line with `#include "/usr/include/util.h"`>
        npm install -g /tmp/pty.js

-   Serve site against local API:

        grunt serve:local
       
-   Serve site against live API:

        grunt serve:live
    
-   Serve site against local API and dist folder:

        grunt serve:local:dist
        
-   Serve site against live API and dist folder:

        grunt serve:live:dist

## Running tests

The general format with the test command (and the serve command above) is:

    grunt test:[targetApi]:[targetBase]:[browserLocation]

The `targetBase` parameter defaults to `app` and the `browserLocation` parameter defaults to `local`.

-   JSHint, Karma tests and Protractor tests against local API:

        grunt test:local

-   JSHint, Karma tests and Protractor tests against live API:

        grunt test:live

-   JSHint, Karma tests and Protractor tests against local API and dist folder:

        grunt test:local:dist

-   JSHint, Karma tests and Protractor tests against live API and dist folder:

        grunt test:live:dist

-   JSHint, Karma tests and Protractor tests against live API and BrowserStack:

        grunt test:live:app:browserstack

-   Karma tests with a fast refresh:

        cd test
        ../node_modules/karma/bin/karma start --reporters dots

-   Protractor tests against local API:

        grunt ptest:local

-   Protractor tests against live API:

        grunt ptest:live

## Check-in procedure

The following must succeed locally before any changes are pushed:

    grunt prepush
    
### Cross-repository changes

*Extra care must be taken until we have [full continuous integration][full-ci-issue].*

Components must be deployed in their dependency order. You must wait until a dependency has passed through CI / been 
deployed before pushing any dependent components to master. Example:
 
> `fifthweek-web` depends on `fifthweek-api`, 

> Let's assume changes are made to API that are required by Web.

> `fifthweek-api` must be pushed *and become live* before pushing `fifthweek-web` to `master`.

#### Breaking changes

Dependencies must not introduce breaking changes. This means older versions of `fifthweek-web` must work with newer 
versions of `fifthweek-api`. 

This is achieved by introducing changes as additions, whereby existing functionality becomes deprecated instead of being 
removed or overwritten with incompatible modifications. The deprecated functionality can be removed when no live 
components depend on it.

There is no procedure for when you *absolutely must* implement a breaking change. Just remember there's 15 minutes 
between builds on Travis CI!

## Credits

Tested on [BrowserStack](http://www.browserstack.com).


[full-ci-issue]: https://github.com/fifthweek/fifthweek-web/issues/40 "Issue #40: Full Continuous Integration"
