angular.module('webApp').controller('backlogPostListCtrl',
  function($scope, postInteractions, authenticationService, channelRepositoryFactory, accountSettingsRepositoryFactory, fetchAggregateUserState, postsStub, errorFacade) {
    'use strict';

    var model = {
      posts: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    var processPosts = function(channelRepository, posts){
      channelRepository.getChannelMap()
        .then(function(channelMap){
          _.forEach(posts, function(post){
            post.channel = channelMap[post.channelId];

            if(post.collectionId){
              post.collection = post.channel.collections[post.collectionId];
            }

            var m = moment(post.liveDate);
            post.liveIn = m.fromNow();
          });

          model.posts = posts;
        });
    };

    var loadForm = function(){
      model.errorMessage = undefined;
      model.isLoading = true;

      var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      var channelRepository = channelRepositoryFactory.forCurrentUser();

      var userId = authenticationService.currentUser.userId;
      var getCreatorBacklog = function() { return postsStub.getCreatorBacklog(userId); };

      accountSettingsRepository.getAccountSettings()
        .then(function(accountSettings){
          model.accountSettings = accountSettings;
          return fetchAggregateUserState.updateInParallel(userId, getCreatorBacklog);
        })
        .then(function(result){
          processPosts(channelRepository, result.data);
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

    loadForm();


    $scope.viewImage = function (post) {
      postInteractions.viewImage(post.imagePath, true);
    };

    $scope.edit = function(postId) {
      postInteractions.edit(postId, true);
    };

    $scope.delete = function(postId) {
      postInteractions.delete(postId, true);
    };
  }
);
