angular.module('webApp')
  .constant('analyticsEventConstants',{
    abstract: {
      category: '*', // Cannot be 'null' for the wildcard, as some methods require this is set.
      titleSiteVisited: 'Site Visited'
    },
    interestRegistration: {
      category: 'Interest Registration',
      titleAny: 'Any',
      titleFauxRegistered: 'Faux Registered',
      titlePricingRequested: 'Pricing Requested'
    },
    registration: {
      category: 'Registration',
      title: 'Registered'
    }
  });
