angular.module('webApp')
  .constant('analyticsEventConstants',{
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
