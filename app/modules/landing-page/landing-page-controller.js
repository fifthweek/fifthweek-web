angular.module('webApp')
  .constant('landingPageConstants', {
    views: {
      timeline: 'timeline',
      post: 'post'
    },
    actions: {
      manage: 'manage',
      channel: 'channel',
      post: 'post'
    },
    timelineTypes: {
      all: 'all',
      subscribed: 'subscribed',
      channel: 'channel'
    }
  })
  .controller('landingPageCtrl',
  function($scope, $q, landingPageConstants, fetchAggregateUserState, fwPostListConstants,
           accountSettingsRepositoryFactory, blogRepositoryFactory, subscriptionRepositoryFactory,
           initializer, $stateParams, $state, states, errorFacade, landingPageInformationLoader, fullPostLoader) {
    'use strict';

    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var blogRepository = blogRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    $scope.model = {
      currentView: undefined,
      returnState: undefined,
      channelId: undefined,
      postId: undefined,
      timelineType: undefined,
      landingPage: undefined,
      post: undefined,
      username: undefined,
      isLoaded: false
    };

    var internal = this.internal = {};

    internal.loadParameters = function(){
      if(!$stateParams.username){
        return false;
      }

      $scope.model.username = $stateParams.username.toLowerCase();
      $scope.model.timelineType = landingPageConstants.timelineTypes.all;
      $scope.model.currentView = landingPageConstants.views.timeline;

      var action = $stateParams.action;
      var key = $stateParams.key;
      if(action){

        switch(action) {
          case landingPageConstants.actions.manage:
            $scope.model.returnState = key;
            break;

          case landingPageConstants.actions.channel:
            if(!key){
              return false;
            }
            $scope.model.channelId = key;
            $scope.model.timelineType = landingPageConstants.timelineTypes.channel;
            break;

          case landingPageConstants.actions.post:
            if(!key){
              return false;
            }
            $scope.model.currentView = landingPageConstants.views.post;
            $scope.model.postId = key;
            break;

          default:
            return false;
        }
      }

      return true;
    };

    internal.loadContent = function(){
      if($scope.model.currentView === landingPageConstants.views.post){
        return internal.loadPost();
      }
      else{
        return internal.loadLandingPage();
      }
    };

    internal.initialize = function(){
      if(!internal.loadParameters()){
        $state.go(states.notFound.name);
        return $q.when();
      }

      $scope.views = landingPageConstants.views;
      $scope.timelineTypes = landingPageConstants.timelineTypes;

      return fetchAggregateUserState.waitForExistingUpdate()
        .then(function(){
          return internal.loadContent();
        })
        .catch(function(error){
          if(error instanceof ApiError && error.response && error.response.status === 404) {
            $state.go(states.notFound.name);
            return $q.when();
          }

          return errorFacade.handleError(error, function(message) {
            $scope.model.errorMessage = message;
          });
        })
        .finally(function(){
          $scope.model.isLoaded = true;
        });

    };

    internal.loadLandingPage = function(){
      return landingPageInformationLoader.loadLandingPageData($scope.model.username, accountSettingsRepository, blogRepository, subscriptionRepository)
        .then(function(landingPage){
          $scope.model.landingPage = landingPage;
        });
    };

    internal.getSummaryFromPost = function(post){
      return {
        username: post.creator.username,
        userId: post.creatorId,
        profileImage: post.creator.profileImage,
        blog: {
          blogId: post.blogId,
          name: post.blog.name,
          introduction: post.blog.introduction,
          headerImage: post.blog.headerImage
        }
      };
    };

    internal.loadPost = function(){
      return fullPostLoader.loadPost($scope.model.postId, accountSettingsRepository, blogRepository, subscriptionRepository)
        .then(function(post){
          $scope.model.post = post;
          $scope.model.landingPage = internal.getSummaryFromPost(post);
        });
    };

    initializer.initialize(internal.initialize);

    $scope.goBack = function(){
      if($scope.model.returnState){
        $state.go($scope.model.returnState);
      }
    };

    $scope.showAllPosts = function(){
      $scope.model.currentView = landingPageConstants.views.timeline;
      $scope.model.timelineType = landingPageConstants.timelineTypes.all;
    };

    $scope.showSubscribedPosts = function(){
      $scope.model.currentView = landingPageConstants.views.timeline;
      $scope.model.timelineType = landingPageConstants.timelineTypes.subscribed;
    };

    $scope.showChannel = function(){
      $scope.model.currentView = landingPageConstants.views.timeline;
      $scope.model.timelineType = landingPageConstants.timelineTypes.channel;
    };

    $scope.showPost = function(){
      $scope.model.currentView = landingPageConstants.views.post;
    };
  }
);
