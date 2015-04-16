angular.module('webApp').controller('guestListCtrl',
  function($scope, $q, blogAccessStub, blogService, errorFacade) {
    'use strict';

    var model = {
      isLoading: false,
      freeAccessUsers: undefined,
      registeredCount: 0,
      subscribedCount: 0,
      invalidEmails: undefined,
      isEditing: false,
      errorMessage: undefined,
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
          model.freeAccessUsers = result.data.freeAccessUsers;

          if(model.freeAccessUsers){
            model.input.emailsText = _.map(model.freeAccessUsers, 'email').join('\n');
            model.registeredCount = _.filter(model.freeAccessUsers, function(v) { return v.username; }).length;

            var subscribedCount = 0;
            _.forEach(model.freeAccessUsers, function(item){
              if(item.channelIds && item.channelIds.length){
                ++subscribedCount;
                item.isSubscribed = true;
              }
            });
            model.subscribedCount = subscribedCount;
          }
          else{
            model.registeredCount = 0;
            model.subscribedCount = 0;
            model.input.emailsText = '';
          }
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

    $scope.save = function(){
      model.errorMessage = undefined;

      var emails = model.input.emailsText.split('\n');

      var data = {
        emails: emails
      };

      return blogAccessStub.putFreeAccessList(blogService.blogId, data)
        .then(function(result){
          if(result.data && result.data.invalidEmailAddresses){
            model.invalidEmails = result.data.invalidEmailAddresses;
          }

          model.isEditing = false;
          internal.refresh();
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

    internal.loadForm();
  }
);
