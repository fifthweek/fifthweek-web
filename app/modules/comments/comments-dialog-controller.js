angular.module('webApp')
  .controller('commentsDialogCtrl',
  function($scope, postId, isCommenting, updateCommentsCount, postStub, initializer, errorFacade) {
    'use strict';

    var model = {
      errorMessage: undefined,
      isLoading: false,
      isCommenting: isCommenting,
      comments: [],
      input: {
        comment: ''
      }
    };

    $scope.model = model;

    var internal = this.internal = {};

    this.initialize = function() {
      return internal.loadForm();
    };

    internal.processComments = function(comments){
      var commentNumber = 1;
      _.forEach(comments, function(comment){
        comment.moment = moment(comment.creationDate);
        comment.liveSince = comment.moment.fromNow();
        comment.number = commentNumber++;
      });

      comments.reverse();
    };

    internal.loadForm = function(){
      model.errorMessage = undefined;
      model.isLoading = true;
      return postStub.getComments(postId)
        .then(function(result){
          var comments = result.data.comments;
          internal.processComments(comments);
          model.comments = comments;
          updateCommentsCount(model.comments.length);
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

    $scope.saveComment = function(){
      model.errorMessage = undefined;
      return postStub.postComment(postId, { content: model.input.comment ? model.input.comment.firstText : '' })
        .then(function(){
          model.input.comment = '';
          $scope.commentOnPostForm.$setPristine();
          return internal.loadForm();
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    initializer.initialize(this.initialize);
  }
);
