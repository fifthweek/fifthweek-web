angular.module('webApp').controller('guestListCtrl',
  function($scope, initializer, blogAccessStub, blogService, errorFacade) {
    'use strict';

    var model = {
      isLoading: false,
      isEditing: false,
      errorMessage: undefined,
      freeAccessUsers: undefined,
      invalidEmails: undefined,
      registeredCount: 0,
      subscribedCount: 0,
      input: {
        emailsText: ''
      }
    };

    $scope.model = model;

    var internal = this.internal = {};

    internal.loadForm = function(){
      if(!blogService.blogId){
        model.errorMessage = 'You must create a blog before managing the guest list.';
      }
      else{
        internal.refresh();
      }
    };

    internal.refresh = function(){
      model.errorMessage = undefined;
      model.isLoading = true;
      return blogAccessStub.getFreeAccessList(blogService.blogId)
        .then(function(result) {
          internal.processResult(result.data.freeAccessUsers);
        })
        .catch(function(error) {
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        })
        .finally(function(){
          model.isLoading = false;
        });
    };

    internal.processResult = function(freeAccessUsers){
      if(freeAccessUsers && freeAccessUsers.length){
        model.freeAccessUsers = freeAccessUsers;
        model.input.emailsText = _.map(freeAccessUsers, 'email').join('\n');
        model.registeredCount = _.filter(freeAccessUsers, function(v) { return v.username; }).length;

        var subscribedCount = 0;
        _.forEach(freeAccessUsers, function(item){
          if(item.channelIds && item.channelIds.length){
            ++subscribedCount;
            item.isSubscribed = true;
          }
          else{
            item.isSubscribed = false;
          }
        });
        model.subscribedCount = subscribedCount;
      }
      else{
        model.freeAccessUsers = undefined;
        model.registeredCount = 0;
        model.subscribedCount = 0;
        model.input.emailsText = '';
      }
    };

    $scope.save = function(){
      var data = {
        emails: model.input.emailsText.split('\n')
      };

      return blogAccessStub.putFreeAccessList(blogService.blogId, data)
        .then(function(result){
          if(result.data && result.data.invalidEmailAddresses){
            model.invalidEmails = result.data.invalidEmailAddresses;
          }
          else{
            model.invalidEmails = undefined;
          }

          model.isEditing = false;
          return internal.refresh();
        });
    };

    $scope.editList = function(){
      model.errorMessage = undefined;
      model.isEditing = true;
    };

    $scope.viewList = function(){
      model.errorMessage = undefined;
      model.isEditing = false;
    };

    initializer.initialize(internal.loadForm);
  }
);
