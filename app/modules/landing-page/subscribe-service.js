angular.module('webApp').factory('subscribeService',
  function($q, subscriptionStub, signInWorkflowService, fetchAggregateUserState, subscriptionRepositoryFactory, blogRepositoryFactory, $modal) {
    'use strict';

    var service = {};
    var internal = service.internal = {};

    internal.getSubscribedChannels = function(blog){
      var subscribedChannels = {};

      _.forEach(blog.channels, function(channel){
        var currentPrice = blog.freeAccess ? 0 : channel.price;
        var channelInfo = {
          acceptedPrice: channel.acceptedPrice,
          currentPrice: currentPrice,
          isIncrease: channel.acceptedPrice < currentPrice,
          isDecrease: channel.acceptedPrice > currentPrice
        };

        subscribedChannels[channel.channelId] = channelInfo;
      });

      return subscribedChannels;
    };

    internal.getHiddenChannels = function(blog){
      var hiddenChannels = [];

      _.forEach(blog.channels, function(channel){
        if(!channel.isVisibleToNonSubscribers){
          hiddenChannels.push(channel);
        }
      });

      return hiddenChannels;
    };

    internal.getUserInformation = function(blogId){
      var blogRepository = blogRepositoryFactory.forCurrentUser();
      var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

      var result;
      return service.getSubscriptionStatus(blogId, subscriptionRepository)
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
          return signInWorkflowService.beginSignInWorkflow();
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

    service.getSubscriptionStatus = function(blogId, subscriptionRepository){
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

              subscribedChannels = internal.getSubscribedChannels(blog);
              hiddenChannels = internal.getHiddenChannels(blog);
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

    service.subscribe = function(blogId, channelId, price){
      return internal.getSignedInUserInformation(blogId)
        .then(function(userInformation){
          if(!userInformation) {
            return $q.when(false);
          }

          if(userInformation.isOwner){
            return $q.when(true);
          }

          if(userInformation.hasFreeAccess){
            price = 0;
          }
          else if(internal.isGuestListOnly()){
            return internal.showGuestListOnlyDialog()
              .then(function(){
                return $q.when(false);
              });
          }

          return subscriptionStub.postChannelSubscription(channelId, { acceptedPrice: price })
            .then(function(){
              return fetchAggregateUserState.updateFromServer(userInformation.userId);
            })
            .then(function(){
              return $q.when(true);
            });
        });
    };

    service.unsubscribe = function(blogId, channelId){
      return internal.getUserInformation(blogId)
        .then(function(userInformation){
          if(userInformation.isOwner){
            return $q.when();
          }

          return subscriptionStub.deleteChannelSubscription(channelId)
            .then(function() {
              return fetchAggregateUserState.updateFromServer(userInformation.userId);
            });
        });
    };

    return service;
  });
