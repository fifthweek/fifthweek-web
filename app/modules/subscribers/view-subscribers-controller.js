angular.module('webApp')
  .controller('viewSubscribersCtrl',
  function($scope, initializer, aggregateUserStateConstants, blogRepositoryFactory, blogStub, fetchAggregateUserState, landingPageConstants, fwPostListConstants, errorFacade) {
    'use strict';

    var blogRepository = blogRepositoryFactory.forCurrentUser();

    $scope.landingPageConstants = landingPageConstants;
    $scope.fwPostListConstants = fwPostListConstants;

    var model = $scope.model = {
      isLoading: false,
      errorMessage: undefined,
      userId: blogRepository.getUserId(),
      subscribers: [],
      totalRevenue: undefined
    };

    var internal = this.internal = {};

    internal.blog = undefined;

    internal.processSubscribers = function(){
      var estimatedWeeklyRevenue = 0;
      var totalSubscriptions = 0;
      var unacceptablePrices = 0;
      _.forEach(model.subscribers, function(subscriber){
        _.forEach(subscriber.channels, function(channel){
          var channelInfo = internal.blog.channels[channel.channelId];
          if(channelInfo){
            channel.name = channelInfo.name;
            if(channel.acceptedPriceInUsCentsPerWeek >= channelInfo.priceInUsCentsPerWeek){
              estimatedWeeklyRevenue += channelInfo.priceInUsCentsPerWeek;
              channel.isPaying = true;
              ++totalSubscriptions;
            }
            else if(subscriber.freeAccessEmail) {
              channel.isPaying = false;
              ++totalSubscriptions;
            }
            else{
              channel.isPaying = false;
              ++unacceptablePrices;
            }
          }
          else{
            channel.name = 'Unknown Channel';
          }
        });
      });

      model.estimatedWeeklyRevenue = estimatedWeeklyRevenue;
      model.totalSubscriptions = totalSubscriptions;
      model.unacceptablePrices = unacceptablePrices;
    };

    internal.loadForm = function(){
      model.isLoading = true;
      return blogRepository.getChannelMap()
        .then(function(blog){
          internal.blog = blog;
          return blogStub.getSubscriberInformation(internal.blog.blogId);
        })
        .then(function(subscriberInformation){
          model.subscribers = subscriberInformation.data.subscribers;
          model.totalRevenue = subscriberInformation.data.totalRevenue;
          internal.processSubscribers();
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

    internal.initialize = function(){
      return internal.loadForm();
    };

    initializer.initialize(internal.initialize);
  });
