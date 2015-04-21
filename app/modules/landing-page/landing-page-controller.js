angular.module('webApp').controller('landingPageCtrl',
  function($scope, $q, $sce, blogStub, accountSettingsRepositoryFactory, blogRepositoryFactory, channelRepositoryFactory, initializer, $stateParams, $state, states, errorFacade) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var blogRepository = blogRepositoryFactory.forCurrentUser();
    var channelRepository = channelRepositoryFactory.forCurrentUser();

    $scope.model = {
      // These need to appear in a JS file, as the Grunt task for swapping file names that appear within JS will only
      // inspect *.js files.
      defaultHeaderImageUrl: '/static/images/header-default.jpg',
      defaultProfileImageUrl: '/static/images/avatar-default.jpg',
      tracking: {
        title: 'Subscribed',
        category: 'Timeline'
      },
      subscribed: false,
      isLoaded: false
    };

    var internal = this.internal = {};

    internal.loadFromApi = function(username){
      return blogStub.getLandingPage(username)
        .then(function(response){
          _.merge($scope.model, response.data);
        })
        .catch(function(error){
          if(error instanceof ApiError && error.response.status === 404){
            $state.go(states.notFound.name);
            return $q.when(true);
          }
          else{
            return $q.reject(error);
          }
        });
    };

    internal.loadFromLocal = function(){
      return blogRepository.getBlog()
        .then(function(blog) {
          $scope.model.blog = blog;
        })
        .then(function() {
          return channelRepository.getChannels();
        })
        .then(function(channels) {
          $scope.model.channels = channels;
        });
    };

    internal.postProcessResults = function(){
      if ($scope.model.blog.video) {
        $scope.model.videoUrl = $sce.trustAsResourceUrl($scope.model.blog.video.replace('http://', '//').replace('https://', '//'));
      }

      $scope.model.channels = _.chain($scope.model.channels)
        .filter({isVisibleToNonSubscribers: true})
        .map(function(channel) {
          return {
            id: channel.channelId,
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
      $scope.model.subscribed = true;
    };

    $scope.unsubscribe = function() {
      $scope.model.subscribed = false;
    };
  }
);
