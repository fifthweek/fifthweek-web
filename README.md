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

- Karma tests with a fast refresh:

        cd test
        ../node_modules/karma/bin/karma start

- Protractor on 5 BrowserStack VMs:

        grunt test

- Protractor on 1 BrowserStack VM:

        grunt ptest

- Protractor on local webdriver server:

        node node_modules/protractor/bin/webdriver-manager start
        grunt pltest
