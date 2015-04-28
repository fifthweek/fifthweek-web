angular.module('webApp').controller('landingPageCtrl',
  function($scope, $q, $sce, blogStub, subscribeService, accountSettingsRepositoryFactory, blogRepositoryFactory, subscriptionRepositoryFactory, fetchAggregateUserState, initializer, $stateParams, $state, states, errorFacade) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var blogRepository = blogRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    $scope.model = {
      // These need to appear in a JS file, as the Grunt task for swapping file names that appear within JS will only
      // inspect *.js files.
      defaultHeaderImageUrl: '/static/images/header-default.jpg',
      defaultProfileImageUrl: '/static/images/avatar-default.jpg',
      tracking: {
        title: 'Subscribed',
        category: 'Timeline'
      },
      isSubscribed: false,
      isLoaded: false,
      isOwner: false,
      hasFreeAccess: false
    };

    var internal = this.internal = {};

    internal.populateSubscriptionStatus = function(blogId){
      return subscribeService.getSubscriptionStatus(subscriptionRepository, blogId)
        .then(function(subscriptionStatus){
          $scope.model.hasFreeAccess = subscriptionStatus.hasFreeAccess;
          $scope.model.isSubscribed = subscriptionStatus.isSubscribed;
        });
    };

    internal.loadFromApi = function(username){
      $scope.model.isOwner = false;
      return blogStub.getLandingPage(username)
        .then(function(response){
          _.merge($scope.model, response.data);
          return internal.populateSubscriptionStatus($scope.model.blog.blogId);
        })
        .catch(function(error){
          if(error instanceof ApiError && error.response && error.response.status === 404){
            $state.go(states.notFound.name);
            return $q.when(true);
          }
          else{
            return $q.reject(error);
          }
        });
    };

    internal.loadFromLocal = function(){
      $scope.model.userId = blogRepository.getUserId();
      $scope.model.isOwner = true;
      $scope.model.hasFreeAccess = false;
      $scope.model.isSubscribed = false;
      return blogRepository.getBlog()
        .then(function(blog) {
          $scope.model.blog = blog;
        });
    };

    internal.postProcessResults = function(){
      if ($scope.model.blog.video) {
        $scope.model.videoUrl = $sce.trustAsResourceUrl($scope.model.blog.video.replace('http://', '//').replace('https://', '//'));
      }

      $scope.model.channels = _.chain($scope.model.blog.channels)
        .filter({isVisibleToNonSubscribers: true})
        .map(function(channel) {
          return {
            channelId: channel.channelId,
            name: channel.name,
            price: (channel.priceInUsCentsPerWeek / 100).toFixed(2),
            priceInUsCentsPerWeek: channel.priceInUsCentsPerWeek,
            description: channel.description.split('\n'),
            isDefault: channel.isDefault,
            checked: channel.isDefault
          };
        })
        .sortByOrder(['isDefault', 'name'], [false, true])
        .value();
    };

    internal.populateLandingPageData = function(){
      return accountSettingsRepository.getAccountSettings()
        .then(function(accountSettings) {
          var username = $stateParams.username.toLowerCase();
          return accountSettings && accountSettings.username === username ?
            internal.loadFromLocal(username) :
            internal.loadFromApi(username);
        })
        .then(function(stopProcessing){
          if(stopProcessing){
            return $q.when();
          }

          internal.postProcessResults();
          $scope.$watch('model.channels', internal.updateTotalPrice, true);
        });
    };

    internal.loadLandingPage = function(){
      if(!$stateParams.username){
        $state.go(states.notFound.name);
        return;
      }

      return internal.populateLandingPageData()
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
          });
        })
        .finally(function(){
          $scope.model.isLoaded = true;
        });
    };

    internal.updateTotalPrice = function(){
      $scope.model.totalPrice = _($scope.model.channels)
        .filter({checked: true})
        .reduce(
        function(sum, channel) {
          return sum + parseFloat(channel.price);
        },
        0)
        .toFixed(2);
    };

    initializer.initialize(internal.loadLandingPage);

    $scope.subscribe = function() {
      var hasFreeAccess = $scope.model.hasFreeAccess;

      var subscriptions = _($scope.model.channels)
        .filter({checked: true})
        .map(function(v){
          return {
            channelId: v.channelId,
            acceptedPrice: hasFreeAccess ? 0 : v.priceInUsCentsPerWeek
          };
        })
        .value();

      return subscribeService.subscribe($scope.model.blog.blogId, subscriptions)
        .then(function(result){
          if(result){
            $scope.model.isSubscribed = true;
          }
        });
    };

    $scope.unsubscribe = function() {
      return subscribeService.unsubscribe($scope.model.blog.blogId)
        .then(function(){
          $scope.model.isSubscribed = false;
        });
    };
  }
);
