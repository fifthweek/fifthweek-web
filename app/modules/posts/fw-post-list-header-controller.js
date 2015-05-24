angular.module('webApp').controller('fwPostListHeaderCtrl',
  function($scope, $q, fwPostListConstants, subscriptionRepositoryFactory, aggregateUserStateConstants) {
    'use strict';

    var subscriptionRepository = subscriptionRepositoryFactory.forCurrentUser();

    var internal = this.internal = {};

    var model = $scope.model = {
      channelName: undefined,
      collectionName: undefined,
      errorMessage: undefined
    };

    internal.loadFromBlogs = function(creatorId, channelId, collectionId, blogs){
      model.channelName = undefined;
      model.collectionName = undefined;

      if(!creatorId){
        return;
      }

      if(!channelId && !collectionId){
        return;
      }

      var blog = _.find(blogs, { creatorId: creatorId });

      var channel;
      var collection;
      if(channelId){
        channel = _.find(blog.channels, { channelId: channelId });

        if(collectionId){
          collection = _.find(channel.collections, { collectionId: collectionId });
        }
      }
      else{
        _.forEach(blog.channels, function(ch){
          collection = _.find(ch.collections, { collectionId: collectionId });
          if(collection){
            channel = ch;
            return false;
          }
        });
      }

      if(channel){
        model.channelName = channel.name;
        if(collection){
          model.collectionName = collection.name;
        }
      }
    };

    internal.load = function(){
      return subscriptionRepository.tryGetBlogs()
        .then(function(blogs){
          internal.loadFromBlogs($scope.userId, $scope.channelId, $scope.collectionId, blogs);
        });
    };

    this.initialize = function(){
      $scope.$on(aggregateUserStateConstants.updatedEvent, internal.load);
    };
  });
