angular.module('webApp').factory('stripeService',
  function($q) {
    'use strict';

    var service = {};

    service.createToken = function(isStandardUser, creditCardNumber, cvc, expiryMonth, expiryYear, stripeResponseHandler){
      var deferred = $q.defer();

      var internalResponseHandler = function(state, response){
        stripeResponseHandler(state, response)
          .then(function(){
            deferred.resolve();
          })
          .catch(function(error){
            deferred.reject(error);
          });
      };

      try{
        if(isStandardUser){
          Stripe.setPublishableKey(window.liveStripeKey);
        }
        else{
          Stripe.setPublishableKey(window.testStripeKey);
        }

        $q.when(Stripe.card.createToken(
          {
            number: creditCardNumber,
            cvc: cvc,
            exp_month: expiryMonth,
            exp_year: expiryYear
          },
          internalResponseHandler))
          .catch(function(error){
            deferred.reject(error);
          });
      }
      catch(error){
        deferred.reject(error);
      }

      return deferred.promise;
    };

    return service;
  });
