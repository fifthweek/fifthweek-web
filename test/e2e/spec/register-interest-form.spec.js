(function() {
  'use strict';

  var _ = require('lodash');
  var HomePage = require('../pages/home.page.js');
  var FeaturesPage = require('../pages/features.page.js');
  var PricingPage = require('../pages/pricing.page.js');
  var HeaderInformationPage = require('../pages/header-information.page.js');
  var CurrentPage = require('../pages/register-interest-workflow.page.js');

  describe("register interest form", function () {
    'use strict';

    var homePage = new HomePage();
    var featuresPage = new FeaturesPage();
    var pricingPage = new PricingPage();
    var headerInformationPage = new HeaderInformationPage();
    var page = new CurrentPage();

    var instances = [
      {
        navigate: function () {
          headerInformationPage.createFreeAccountLink.click();
        }
      },
      {
        navigate: function () {
          homePage.getStartedLink.click();
        }
      },
      {
        navigate: function () {
          headerInformationPage.featuresLink.click();
          featuresPage.getStartedTopLink.click();
        }
      },
      {
        navigate: function () {
          headerInformationPage.featuresLink.click();
          featuresPage.getStartedBottomLink.click();
        }
      },
      {
        navigate: function () {
          headerInformationPage.pricingLink.click();
          pricingPage.letUsTalkLink.click();
        }
      }
    ];

    _.forEach(instances, function (instance) {
      page.runTests(instance.navigate);
    });
  });
})();
