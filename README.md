# Fifthweek Web

## Development setup

1.  Install Fifefox. Required for Travis CI.

2.  Standard NPM/Bower/Grunt stack:
     
        npm install
        bower install
        sudo gem update --system
        sudo gem install compass
        grunt build

## Running tests

-   Karma tests and Protractor on local webdriver server:

        grunt ftest

-   Karma tests with a fast refresh:

        cd test
        ../node_modules/karma/bin/karma start

-   Protractor on 5 BrowserStack VMs:

        grunt test

-   Protractor on 1 BrowserStack VM:

        grunt ptest

-   Protractor on local webdriver server:

        grunt pltest

## Check-in procedure

The following must succeed locally before any changes are pushed:

    grunt ftest
    
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

There is no procedure for when you *absolutely must* implement a breaking change. Just remember there's 15 minutes 
between builds on Travis CI!

## Credits

Tested on [BrowserStack](http://www.browserstack.com).


[full-ci-issue]: https://github.com/fifthweek/fifthweek-web/issues/40 "Issue #40: Full Continuous Integration"
