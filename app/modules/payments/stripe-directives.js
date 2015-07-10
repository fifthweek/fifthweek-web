angular.module('webApp')
  .directive('fwStripeCardNumber', function () {
    'use strict';
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
        //For DOM -> model validation
        ngModel.$parsers.unshift(function(value) {
          var valid = Stripe.card.validateCardNumber(value);
          ngModel.$setValidity('stripecardnumber', valid);
          return valid ? value : undefined;
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function(value) {
          var valid = Stripe.card.validateCardNumber(value);
          ngModel.$setValidity('cardnumber', valid);
          return value;
        });
      }
    };
  })
  .directive('fwStripeExpiry', function () {
    'use strict';
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {

        var isValid = function(value){
          if(!value){
            return false;
          }

          var parts = value.split('/');
          return parts.length === 2 && Stripe.card.validateExpiry(parts[0], parts[1]);
        };

        //For DOM -> model validation
        ngModel.$parsers.unshift(function(value) {
          var valid = isValid(value);
          ngModel.$setValidity('expiry', valid);
          return valid ? value : undefined;
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function(value) {
          var valid = isValid(value);
          ngModel.$setValidity('expiry', valid);
          return value;
        });
      }
    };
  })
  .directive('fwStripeCvc', function () {
    'use strict';
    return {
      require: 'ngModel',
      link: function(scope, elem, attr, ngModel) {
        //For DOM -> model validation
        ngModel.$parsers.unshift(function(value) {
          var valid = Stripe.card.validateCVC(value);
          ngModel.$setValidity('cvc', valid);
          return valid ? value : undefined;
        });

        //For model -> DOM validation
        ngModel.$formatters.unshift(function(value) {
          var valid = Stripe.card.validateCVC(value);
          ngModel.$setValidity('cvc', valid);
          return value;
        });
      }
    };
  });
