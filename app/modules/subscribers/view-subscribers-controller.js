angular.module('webApp')
  .controller('viewSubscribersCtrl',
  function($scope, initializer, blogRepositoryFactory, blogStub, errorFacade) {
    'use strict';

    var blogRepository = blogRepositoryFactory.forCurrentUser();

    var model = $scope.model = {
      isLoading: false,
      errorMessage: undefined,
      userId: blogRepository.getUserId(),
      subscribers: [],
      unreleasedRevenue: undefined,
      releasedRevenue: undefined,
      releasableRevenue: undefined
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
            if(channel.acceptedPrice >= channelInfo.price){
              estimatedWeeklyRevenue += channelInfo.price;
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
          model.unreleasedRevenue = subscriberInformation.data.unreleasedRevenue;
          model.releasedRevenue = subscriberInformation.data.releasedRevenue;
          model.releasableRevenue = subscriberInformation.data.releasableRevenue;
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