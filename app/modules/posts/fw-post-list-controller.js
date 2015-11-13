angular.module('webApp')
  .controller('fwPostListCtrl',
  function($scope, $rootScope, $q, $state, states, landingPageConstants, fwPostListConstants,
           postInteractions, authenticationService, blogRepositoryFactory, accountSettingsRepositoryFactory,
           subscriptionRepositoryFactory, fetchAggregateUserState, postStub, errorFacade, postUtilities,
           fwSubscriptionInformationConstants) {
    'use strict';

    var model = {
      posts: undefined,
      isLoading: false,
      errorMessage: undefined
    };

    $scope.model = model;

    var internal = this.internal = {};

    internal.loadNext = function(){ return $q.reject(new DisplayableError('Unknown fw-post-list source.')); };

    internal.loadPosts = function(){
      var getNextPosts = function() { return internal.loadNext(0, 24); };

      var posts;
      return fetchAggregateUserState.updateInParallel(internal.currentUserId, getNextPosts)
        .then(function(result) {
          posts = result.posts;
          return postUtilities.processPostsForRendering(posts, internal.accountSettingsRepository, internal.blogRepository, internal.subscriptionRepository);
        })
        .then(function(){
          model.posts = posts;
        });
    };

    $scope.editPost = function(post) {
      var modalResult = postInteractions.editPost(post);

      modalResult.result.then(function(newPost){
        if(newPost){
          var isBacklog = $scope.source === fwPostListConstants.sources.creatorBacklog;
          postUtilities.replacePostAndReorderIfRequired(isBacklog, model.posts, post.moment, newPost);
        }
      });
    };

    $scope.viewPost = function(post) {
      return postInteractions.viewPost(post, true);
    };

    $scope.deletePost = function(postId) {
      return postInteractions.deletePost(postId)
        .then(function(){
          postUtilities.removePost(model.posts, postId);
        });
    };

    $scope.viewImage = function (image, imageSource) {
      postInteractions.viewImage(image, imageSource);
    };

    internal.attachToReloadEvents = function(){
      $scope.$on(fwPostListConstants.reloadEvent, internal.reload);
      $rootScope.$on(fwSubscriptionInformationConstants.subscriptionStatusChangedEvent, internal.reload);
    };

    internal.loadSettings = function(){

      internal.accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
      internal.blogRepository = blogRepositoryFactory.forCurrentUser();
      internal.subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

      internal.currentUserId = authenticationService.currentUser.userId;
      internal.timelineUserId = undefined;

      if($scope.source === fwPostListConstants.sources.creatorBacklog){
        internal.timelineUserId = internal.currentUserId;
        internal.loadNext = function() {
          return postStub.getCreatorBacklog(internal.timelineUserId)
            .then(function(response){
              var posts = response.data;
              _.forEach(posts, function(post){
                post.creatorId = internal.currentUserId;
              });
              return $q.when({
                posts: posts
              });
            });
        };
      }
      else{
        var fetchNewsfeedDelegate;
        if($scope.source === fwPostListConstants.sources.preview){
          fetchNewsfeedDelegate = postStub.getPreviewNewsfeed;
        }
        else{
          fetchNewsfeedDelegate = postStub.getNewsfeed;
        }

        if($scope.source === fwPostListConstants.sources.creatorTimeline) {
          internal.timelineUserId = internal.currentUserId;
        }
        else{
          internal.timelineUserId = $scope.userId;
        }

        var channelId = $scope.channelId;

        internal.loadNext = function(startIndex, count) {
          return fetchNewsfeedDelegate({
            creatorId: internal.timelineUserId,
            startIndex: startIndex,
            channelId: channelId,
            count: count
          })
            .then(function(response){
              return $q.when(response.data);
            });
        };
      }

      return $q.when();
    };

    internal.reload = function(){
      if(model.isLoading){
        return $q.when();
      }

      model.errorMessage = undefined;
      model.isLoading = true;
      model.posts = undefined;

      return internal.loadSettings()
        .then(function(){
          return internal.loadPosts();
        })
        .finally(function(){
          model.isLoading = false;
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    this.initialize = function(){
      internal.attachToReloadEvents();
      return internal.reload();
    };
  }
);
