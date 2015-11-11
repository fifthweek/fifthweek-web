angular.module('webApp')
  .constant('fwSubscriptionInformationConstants', {
    subscriptionStatusChangedEvent: 'subscriptionStatusChangedEvent'
  })
  .controller('fwSubscriptionInformationCtrl',
  function($scope, $q, $sce, fwSubscriptionInformationConstants, authenticationServiceConstants, fetchAggregateUserState,
           subscribeService, accountSettingsRepositoryFactory, blogRepositoryFactory,
           subscriptionRepositoryFactory, aggregateUserStateConstants,
           errorFacade, landingPageInformationLoader) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var blogRepository = blogRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    $scope.tracking = {
      unsubscribedTitle: 'Unsubscribed',
        updatedTitle: 'Subscription Updated',
        subscribedTitle: 'Subscribed',
        category: 'Timeline'
    };

    $scope.model = {
      errorMessage: undefined,
      isLoading: false,
      landingPage: undefined
    };

    var internal = this.internal = {};

    internal.onAggregateStateUpdated = function(){
      accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      blogRepository = blogRepositoryFactory.forCurrentUser();
      subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

      if(!$scope.model.landingPage){
        return $q.when();
      }

      var newUserId = accountSettingsRepository.getUserId();
      var isOwner = newUserId === $scope.model.userId;

      if(isOwner !== $scope.model.landingPage.isOwner) {
        return internal.reload();
      }

      return internal.reloadFromUserState();
    };

    internal.reloadFromUserState = function(){
      if(!$scope.model.landingPage){
        return $q.when();
      }

      return landingPageInformationLoader.updateSubscribedChannels($scope.model.landingPage, subscriptionRepository)
        .then(function(){
          internal.recalculateChannels($scope.model.landingPage);
          return $q.when();
        });
    };

    internal.recalculateChannels = function(landingPage){
      var returnedChannels = _.chain(landingPage.blog.channels)
        .map(function(channel) {
          var subscriptionInformation = landingPage.subscribedChannels[channel.channelId];
          return {
            isVisibleToNonSubscribers: channel.isVisibleToNonSubscribers,
            channelId: channel.channelId,
            name: channel.name,
            price: channel.price,
            subscriptionInformation: subscriptionInformation
          };
        });

      var hiddenChannels = _.chain(landingPage.hiddenChannels)
        .map(function(channel){
          var subscriptionInformation = landingPage.subscribedChannels[channel.channelId];
          return {
            isVisibleToNonSubscribers: false,
            channelId: channel.channelId,
            name: channel.name,
            price: channel.price,
            subscriptionInformation: subscriptionInformation
          };
        });

      var allChannels = returnedChannels.concat(hiddenChannels.value());

      if($scope.requiredChannelId){
       allChannels = allChannels.filter({ 'channelId': $scope.requiredChannelId });
      }

      landingPage.channels = allChannels
        .filter(function(channel){
          // Return channels that are not visible to non-subscribers if user is a subscriber.
          return channel.isVisibleToNonSubscribers || channel.subscriptionInformation;
        })
        .sortByOrder(['name'], [true])
        .value();

      internal.updateTotalPrice(landingPage);
    };

    internal.postProcessResults = function(landingPage){
      if (landingPage.blog.video) {
        landingPage.videoUrl = $sce.trustAsResourceUrl(landingPage.blog.video.replace('http://', '//').replace('https://', '//'));
      }

      internal.recalculateChannels(landingPage);
    };

    internal.updateTotalPrice = function(landingPage){
      if(!landingPage) {
        return;
      }

      var result = _(landingPage.channels)
        .filter('subscriptionInformation')
        .reduce(
        function(sum, channel) {
          sum.totalPrice = sum.totalPrice + parseFloat(channel.price);
          sum.count++;
          return sum;
        },
        {totalPrice: 0, count: 0});

      landingPage.totalPrice = result.totalPrice;
      landingPage.subscribedChannelCount = result.count;
    };

    internal.reload = function(loadedLandingPageData){
      $scope.model.isLoading = true;
      $scope.model.errorMessage = undefined;
      var username = $scope.username;
      return fetchAggregateUserState.waitForExistingUpdate()
        .then(function(){
          if(loadedLandingPageData){
            return $q.when(_.cloneDeep(loadedLandingPageData));
          }

          return landingPageInformationLoader.loadLandingPageData(username, accountSettingsRepository, blogRepository, subscriptionRepository);
        })
        .then(function(landingPageData){
          internal.postProcessResults(landingPageData);
          $scope.model.landingPage = landingPageData;
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
          });
        })
        .finally(function(){
          $scope.model.isLoading = false;
        });
    };

    this.initialize = function(){
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.onAggregateStateUpdated);

      return internal.reload($scope.landingPageData);
    };

    internal.raiseSubscriptionStatusChangedEvent = function(){
      $scope.$emit(fwSubscriptionInformationConstants.subscriptionStatusChangedEvent);
    };

    $scope.subscribe = function(channel) {
      return subscribeService.subscribe($scope.model.landingPage.blog.blogId, channel.channelId, channel.price)
        .then(function(result){
          if(result){
            internal.raiseSubscriptionStatusChangedEvent();
          }
        });
    };

    $scope.unsubscribe = function(channel) {
      if($scope.model.landingPage.isOwner){
        return;
      }

      return subscribeService.unsubscribe($scope.model.landingPage.blog.blogId, channel.channelId)
        .then(function(){
          internal.raiseSubscriptionStatusChangedEvent();
        });
    };
  });
