angular.module('webApp')
  .controller('viewSubscriptionsCtrl',
  function($scope, initializer, aggregateUserStateConstants, subscriptionRepositoryFactory, errorFacade, landingPageConstants, fwPostListConstants, fetchAggregateUserState, accountSettingsRepositoryFactory) {
    'use strict';

    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();
    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();

    $scope.landingPageConstants = landingPageConstants;
    $scope.fwPostListConstants = fwPostListConstants;

    var model = $scope.model = {
      errorMessage: undefined,
      userId: subscriptionRepository.getUserId(),
      blogs: []
    };

    var internal = this.internal = {};

    internal.loadForm = function(){
      return accountSettingsRepository.getAccountSettings()
        .then(function(accountSettings){
          model.accountBalance = accountSettings.accountBalance;
          return subscriptionRepository.getBlogs();
        })
        .then(function(blogs){
          model.blogs = blogs;

          var totalAcceptedPrice = 0;
          var totalChangedPrice = 0;
          _.forEach(model.blogs, function(blog){
            if(!blog.freeAccess){
              _.forEach(blog.channels, function(channel){
                if(channel.acceptedPrice >= channel.priceInUsCentsPerWeek) {
                  totalAcceptedPrice += channel.priceInUsCentsPerWeek;
                }
                else{
                  totalChangedPrice += channel.priceInUsCentsPerWeek;
                }
              });
            }
          });

          model.totalAcceptedPrice = totalAcceptedPrice;
          model.totalChangedPrice = totalChangedPrice;
        })
        .catch(function(error){
          model.blogs = [];
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    internal.refreshUserState = function(){
      return fetchAggregateUserState.updateFromServer(model.userId);
    };

    internal.initialize = function(){
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.loadForm);
      $scope.$on(fwPostListConstants.reloadEvent, internal.refreshUserState);

      return internal.loadForm()
        .then(function(){
          // This is done because when the user manages their subscription from here and then
          // accepts changes, it returns the user to this page but doesn't update the user state - because
          // in most cases accepting changes is followed immediately by loading posts,
          // which updates the user state automatically.  So we do it after loading just in case.
          // This is not ideal, but it's fine for now.
          return internal.refreshUserState();
        });
    };

    initializer.initialize(internal.initialize);
  });
