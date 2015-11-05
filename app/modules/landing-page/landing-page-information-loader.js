angular.module('webApp')
  .factory('landingPageInformationLoader',
  function($q, blogStub, subscribeService) {
    'use strict';

    var service = {};
    var internal = service.internal = {};

    internal.populateSubscriptionFromUserState = function(data, subscriptionRepository){
      var blogId = data.blog.blogId;
      return subscribeService.getSubscriptionStatus(blogId, subscriptionRepository)
        .then(function(subscriptionStatus){
          data.hasFreeAccess = subscriptionStatus.hasFreeAccess;
          data.isSubscribed = subscriptionStatus.isSubscribed;
          data.subscribedChannels = subscriptionStatus.subscribedChannels;
          data.hiddenChannels = subscriptionStatus.hiddenChannels;
        });
    };

    internal.loadFromApi = function(username, subscriptionRepository){
      var data;

      return blogStub.getLandingPage(username)
        .then(function(response){
          data = response.data;
          data.isOwner = false;
          return internal.populateSubscriptionFromUserState(data, subscriptionRepository);
        })
        .then(function(){
          return $q.when(data);
        });
    };

    internal.loadFromLocal = function(accountSettings, blogRepository){
      var data = {
        userId: blogRepository.getUserId(),
        isOwner: true,
        hasFreeAccess: false,
        isSubscribed: false,
        profileImage: accountSettings.profileImage,
        subscribedChannels: {},
        hiddenChannels: []
      };

      return blogRepository.getBlog()
        .then(function(blog) {
          data.blog = blog;
          return $q.when(data);
        });
    };

    service.loadLandingPageData = function(username, accountSettingsRepository, blogRepository, subscriptionRepository){
      return accountSettingsRepository.getAccountSettings()
        .then(function(accountSettings) {
          return accountSettings && accountSettings.username === username ?
            internal.loadFromLocal(accountSettings, blogRepository) :
            internal.loadFromApi(username, subscriptionRepository);
        });
    };

    service.updateSubscribedChannels = function(landingPage, subscriptionRepository){
      if(landingPage.isOwner){
        return $q.when();
      }

      return internal.populateSubscriptionFromUserState(landingPage, subscriptionRepository);
    };

    return service;
  });
