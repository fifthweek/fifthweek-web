# Fifthweek Web

## Development setup

1.  Install Fifefox. Required for Travis CI.

2.  Standard NPM/Bower/Grunt stack:

        npm install
        bower install
        sudo gem update --system
        sudo gem install compass
        grunt build


## Pro Tips

- To run Karma tests with a fast refresh, from the test directory run:
    ../node_modules/karma/bin/karma start

- To run protractor tests faster:

    grunt test   // Runs karma and protractor tests on 5 BrowserStack VMs.

    grunt ptest  // Runs protractor tests on one BrowserStack VM.

    grunt pltest // Runs protractor tests on a local webdriver server.
                 // You must call "node node_modules/protractor/bin/webdriver-manager start" first
