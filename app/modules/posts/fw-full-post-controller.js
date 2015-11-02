angular.module('webApp')
  .controller('fwFullPostCtrl',
  function($scope, $q, errorFacade, initializer, postStub,
           postUtilities, postInteractions, blogRepositoryFactory, accountSettingsRepositoryFactory,
           subscriptionRepositoryFactory) {
    'use strict';

    var blogRepository = blogRepositoryFactory.forCurrentUser();
    var accountSettingsRepository = accountSettingsRepositoryFactory.forCurrentUser();
    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var internal = this.internal = {};
    var model = $scope.model = {};

    internal.showComments = function(post, isCommenting){
      var newUpdateCommentsCount = function(totalComments){
        post.commentsCount = totalComments;
        if($scope.updateCommentsCount){
          $scope.updateCommentsCount({ totalComments: totalComments });
        }
      };
      return postInteractions.showComments(post.postId, isCommenting, newUpdateCommentsCount);
    };

    $scope.commentOnPost = function(post){
      return internal.showComments(post, true);
    };

    $scope.viewComments = function(post){
      return internal.showComments(post, false);
    };

    $scope.viewImage = function (image, imageSource) {
      postInteractions.viewImage(image, imageSource);
    };

    $scope.openFile = function (file) {
      return postInteractions.openFile(file);
    };

    $scope.toggleLikePost = function(post){
      return postInteractions.toggleLikePost(post)
        .then(function(){
          if($scope.updateLikeStatus){
            $scope.updateLikeStatus({ likesCount: post.likesCount, hasLiked: post.hasLiked });
          }
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    internal.getFullPost = function(postId){
      var post;
      return postStub.getPost(postId)
        .then(function(result) {
          post = result.data.post;
          post.files = result.data.files;
          return postUtilities.processPostForRendering(post, accountSettingsRepository, blogRepository, subscriptionRepository);
        })
        .then(function(){
          return post;
        });
    };

    internal.replaceHiddenCharacters = function(post){
      if(!post.readAccess){
        var newCharacter = '●';

        _.forEach(post.blocks, function(block){
          if(block.type === 'text'){
            block.data.text = block.data.text.replace(/⁂/g, newCharacter);
          }
        });
      }
    };

    this.initialize = function(){
      model.isLoading = true;
      model.showContent = false;

      var getFullPostFunction;
      if($scope.post && $scope.post.content){
        getFullPostFunction = function(){ return $q.when($scope.post); };
      }
      else{
        getFullPostFunction = function(){ return internal.getFullPost($scope.postId || $scope.post.postId); };
      }

      return getFullPostFunction()
        .then(function(post){
          internal.replaceHiddenCharacters(post);
          $scope.post = post;
          model.showContent = true;
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    initializer.initialize(this.initialize);
  });
