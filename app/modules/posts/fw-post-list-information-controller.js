angular.module('webApp').controller('fwPostListInformationCtrl',
  function($scope, $q, fwPostListConstants, subscriptionRepositoryFactory, fetchAggregateUserState, aggregateUserStateConstants, subscriptionStub, $state, states, errorFacade) {
    'use strict';

    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var internal = this.internal = {};

    var model = $scope.model = {
      hasFreeAccess: false,
      updatedPrices: [],
      errorMessage: undefined
    };

    internal.loadSubscribedBlogInformation = function(creatorId, blogs){
      model.hasFreeAccess = false;
      model.updatedPrices = [];

      if(!blogs) {
        return;
      }

      if(creatorId){
        var blog = _.find(blogs, { creatorId: creatorId });
        blogs = [];
        if(blog){
          blogs.push(blog);
          model.hasFreeAccess = blog.freeAccess;
        }
      }

      _.forEach(blogs, function(blog){
        _.forEach(blog.channels, function(channel){
          var currentPrice = blog.freeAccess ? 0 : channel.priceInUsCentsPerWeek;
          if(channel.acceptedPrice !== currentPrice){
            var extraChannels = [];
            if(channel.isDefault){
              extraChannels = _.find(blog.channels, function(c){ return c.channelId !== channel.channelId; });
            }
            model.updatedPrices.push({
              currentPrice: currentPrice,
              isIncrease: channel.acceptedPrice < currentPrice,
              blog: blog,
              channel: channel,
              extraChannels: extraChannels
            });
          }
        });
      });
    };

    internal.load = function(){
      if($scope.source === fwPostListConstants.sources.timeline) {
        internal.loadForCreator($scope.userId);
      }
    };

    internal.loadForCreator = function(creatorId){
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.reloadFromUserState);

      return subscriptionRepository.tryGetBlogs()
        .then(function(blogs){
          internal.loadSubscribedBlogInformation(creatorId, blogs);
        });
    };

    $scope.acceptPrice = function(updatedPrice){
      return subscriptionStub.putChannelSubscription(
        updatedPrice.channel.channelId,
        {
          acceptedPrice: updatedPrice.currentPrice
        })
        .then(function(){
          _.remove(model.updatedPrices, updatedPrice);

          if(updatedPrice.isIncrease){
            $scope.$emit(fwPostListConstants.reloadEvent);
          }
        })
        .catch(function(error){
          return errorFacade.handleError(error, function(message) {
            model.errorMessage = message;
          });
        });
    };

    $scope.manageSubscription = function(updatedPrice){
      var returnState = $state.current.name === states.landingPage.name ? undefined : $state.current.name;
      $state.go(states.landingPage.name, { username: updatedPrice.blog.username, action: 'manage', key: returnState });
    };

    this.initialize = function(){
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.load);
    };
  });
