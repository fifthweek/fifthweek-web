angular.module('webApp').factory('subscribeService',
  function($q, subscriptionStub, fetchAggregateUserState, subscriptionRepositoryFactory, blogRepositoryFactory, $modal) {
    'use strict';

    var service = {};
    var internal = service.internal = {};

    internal.getUserInformation = function(blogId){
      var blogRepository = blogRepositoryFactory.forCurrentUser();
      var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

      var result;
      return service.getSubscriptionStatus(subscriptionRepository, blogId)
        .then(function(subscriptionStatus){
          result = subscriptionStatus;
          return blogRepository.tryGetBlog();
        })
        .then(function(blog) {
          if(blog){
            result.currentUserBlogId = blog.blogId;
            result.isOwner = blogId === blog.blogId;
          }
          else{
            result.currentUserBlogId = undefined;
            result.isOwner = false;
          }

          return $q.when(result);
        });
    };

    internal.handleDialogError = function(error){
      if(error instanceof Error){
        return $q.reject(error);
      }

      return $q.when();
    };

    internal.beginSignInWorkflow = function(){
      return $modal
        .open({
          controller: 'signInWorkflowDialogCtrl',
          templateUrl: 'modules/landing-page/sign-in-workflow-dialog.html',
          size: 'sm'
        }).result
        .catch(function(error){
          return internal.handleDialogError(error);
        });
    };

    internal.showGuestListOnlyDialog = function(){
      return $modal
        .open({
          templateUrl: 'modules/landing-page/guest-list-only-dialog.html',
          size: 'sm'
        }).result
        .catch(function(error){
          return internal.handleDialogError(error);
        });
    };

    internal.ensureSignedIn = function(blogId){
      return internal.getUserInformation(blogId)
        .then(function(userInformation) {
          if (userInformation.userId) {
            return $q.when(true);
          }
          return internal.beginSignInWorkflow();
        });
    };

    internal.getSignedInUserInformation = function(blogId){
      return internal.ensureSignedIn(blogId)
        .then(function(result){
          if(!result){
            return $q.when(false);
          }

          return fetchAggregateUserState.waitForExistingUpdate()
            .then(function(){
              return internal.getUserInformation(blogId);
            });
        });
    };

    internal.isGuestListOnly = function(){
      return false;
    };

    service.getSubscriptionStatus = function(subscriptionRepository, blogId){
      var userId = subscriptionRepository.getUserId();
      return fetchAggregateUserState.updateIfStale(userId)
        .then(function(){
          return subscriptionRepository.tryGetBlogs();
        })
        .then(function(blogs){
          var isSubscribed = false;
          var hasFreeAccess = false;
          var subscribedChannels = {};
          var hiddenChannels = [];
          if(blogs){
            var blog = _.find(blogs, { blogId: blogId });
            if(blog){
              hasFreeAccess = blog.freeAccess;
              isSubscribed = blog.channels && blog.channels.length;

              _.forEach(blog.channels, function(channel){
                var currentPrice = blog.freeAccess ? 0 : channel.priceInUsCentsPerWeek;
                var channelInfo = {
                  acceptedPrice: channel.acceptedPrice,
                  currentPrice: currentPrice,
                  isIncrease: channel.acceptedPrice < currentPrice,
                  isDecrease: channel.acceptedPrice > currentPrice,
                  channel: channel
                };

                subscribedChannels[channel.channelId] = channelInfo;

                if(!channel.isVisibleToNonSubscribers){
                  hiddenChannels.push(channel);
                }
              });
            }
          }

          return {
            userId: userId,
            hasFreeAccess: !!hasFreeAccess,
            isSubscribed: !!isSubscribed,
            subscribedChannels: subscribedChannels,
            hiddenChannels: hiddenChannels
          };
        });
    };

    service.subscribe = function(blogId, channelsAndPrices){
      return internal.getSignedInUserInformation(blogId)
        .then(function(userInformation){
          if(!userInformation) {
            return $q.when(false);
          }

          if(userInformation.isOwner){
            return $q.when(true);
          }

          if(userInformation.hasFreeAccess){
            channelsAndPrices = _(channelsAndPrices)
              .map(function(v){
                return {
                  channelId: v.channelId,
                  acceptedPrice: 0
                };
              })
              .value();
          }
          else if(internal.isGuestListOnly()){
            return internal.showGuestListOnlyDialog()
              .then(function(){
                return $q.when(false);
              });
          }
          else{
            // TODO: Payment
          }

          return subscriptionStub.putBlogSubscriptions(blogId, { subscriptions: channelsAndPrices })
            .then(function(){
              return $q.when(true);
            });
        });
    };

    service.unsubscribe = function(blogId){
      return internal.getUserInformation(blogId)
        .then(function(userInformation){
          if(userInformation.isOwner){
            return $q.when();
          }

          return subscriptionStub.putBlogSubscriptions(blogId, { subscriptions: [] })
            .then(function() {
              return fetchAggregateUserState.updateFromServer(userInformation.userId);
            });
        });
    };

    return service;
  });
