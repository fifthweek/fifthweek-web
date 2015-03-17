angular.module('webApp').controller('timelineCtrl',
  function($scope, $sce, authenticationService, accountSettingsRepositoryFactory, channelRepositoryFactory, subscriptionRepositoryFactory, postInteractions, fetchAggregateUserState, postsStub, postUtilities, errorFacade) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var channelRepository = channelRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var model = {
      subscribed: false,
      profileImageUrl: '',
      headerImageUrl: '',
      fullDescription: 'Hello there!',
      posts: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    var loadPosts = function(){
      model.errorMessage = undefined;
      model.isLoading = true;

      var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      var channelRepository = channelRepositoryFactory.forCurrentUser();

      var userId = authenticationService.currentUser.userId;
      var getCreatorNewsfeed = function() { return postsStub.getCreatorNewsfeed(userId, 0, 1000); };

      var posts;
      fetchAggregateUserState.updateInParallel(userId, getCreatorNewsfeed)
        .then(function(result) {
          posts = result.data;
          return postUtilities.populateCurrentCreatorInformation(posts, accountSettingsRepository, channelRepository);
        })
        .then(function(){
          return postUtilities.processPostsForRendering(posts);
        })
        .then(function(){
          model.posts = posts;
        })
        .catch(function(error){
          model.posts = undefined;
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    $scope.model = model;

    accountSettingsRepository.getAccountSettings().then(function(accountSettings){
      $scope.model.accountSettings = accountSettings;
    });

    channelRepository.getChannels().then(function(channels) {
      $scope.model.channels = _.chain(channels)
        .map(function (channel) {
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
    });

    subscriptionRepository.getSubscription().then(function(data) {
      $scope.model.subscription = data;
      $scope.model.videoUrl = $sce.trustAsResourceUrl(data.video.replace('http://', '//').replace('https://', '//'));
    });

    $scope.viewImage = function (image, imageSource) {
      postInteractions.viewImage(image, imageSource);
    };

    $scope.openFile = function (file) {
      return postInteractions.openFile(file);
    };

    $scope.edit = function(postId) {
      postInteractions.edit(postId, true);
    };

    $scope.delete = function(postId) {
      postInteractions.delete(postId, true);
    };

    $scope.subscribe = function() {
      loadPosts();
      $scope.model.subscribed = true;
    };

    $scope.$watch('model.channels', function() {

      $scope.model.totalPrice = _($scope.model.channels)
        .filter(function(channel) {
          return channel.checked === true;
        })
        .reduce(function(sum, channel) {
          return sum + parseFloat(channel.price); },
        0)
        .toFixed(2);

    }, true);
  }
);
