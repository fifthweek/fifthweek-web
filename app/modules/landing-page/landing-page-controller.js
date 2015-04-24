angular.module('webApp').controller('landingPageCtrl',
  function($scope, $q, $sce, blogStub, subscriptionStub, accountSettingsRepositoryFactory, blogRepositoryFactory, subscriptionRepositoryFactory, initializer, $stateParams, $state, states, errorFacade) {
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

    internal.checkSubscriptions = function(username){
      return subscriptionRepository.tryGetBlogs()
        .then(function(blogs){
          var isSubscribed = false;
          var hasFreeAccess = false;
          if(blogs){
            var blog = _.find(blogs, { username: username });
            if(blog){
              hasFreeAccess = blog.freeAccess;
              isSubscribed = blog.channels && blog.channels.length;
            }
          }
          $scope.model.hasFreeAccess = !!hasFreeAccess;
          $scope.model.isSubscribed = !!isSubscribed;
        });
    };

    internal.loadFromApi = function(username){
      $scope.model.isOwner = false;
      return blogStub.getLandingPage(username)
        .then(function(response){
          _.merge($scope.model, response.data);
          return internal.checkSubscriptions(username);
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
      if($scope.model.isOwner){
        $scope.model.isSubscribed = true;
      }
      else if($scope.model.hasFreeAccess){
        var subscriptions = _($scope.model.channels)
          .filter({checked: true})
          .map(function(v){ return { channelId: v.channelId, acceptedPrice: 0 }; })
          .value();

        return subscriptionStub.putBlogSubscriptions($scope.model.blog.blogId, { subscriptions: subscriptions })
          .then(function(){
            $scope.model.isSubscribed = true;
          });
      }
      else{
        return $q.reject(new DisplayableError('Currently only users on the guest list can subscribe.'));
      }
    };

    $scope.unsubscribe = function() {
      if($scope.model.isOwner){
        $scope.model.isSubscribed = false;
      }
      else{
        return subscriptionStub.putBlogSubscriptions($scope.model.blog.blogId, { subscriptions: [] })
          .then(function(){
            $scope.model.isSubscribed = false;
          });
      }
    };
  }
);
