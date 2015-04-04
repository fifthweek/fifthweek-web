angular.module('webApp').factory('postUtilities',
  function($q, $state, states, accessSignatures) {
    'use strict';

    var service = {};

    var humanFileSize = function(size) {
      var i = Math.floor( Math.log(size) / Math.log(1024) );
      return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['bytes', 'KB', 'MB', 'GB', 'TB'][i];
    };

    var isViewable = function(contentType){
      return contentType === 'image/jpeg' || contentType === 'image/gif' || contentType === 'image/png';
    };

    var getImageUri = function(image, thumbnail, accessMap){
      var blob = image.fileId;
      if (thumbnail) {
        blob = blob + '/' + thumbnail;
      }

      var accessInformation = accessMap[image.containerName];
      return accessInformation.uri + '/' + blob + accessInformation.signature;
    };

    var updatePostUris = function(post, accessMap){
      if(post.image){
        post.image.resolvedUri = getImageUri(post.image, 'feed', accessMap);
      }

      if(post.creator.profileImage){
        post.creator.profileImage.resolvedUri = getImageUri(post.creator.profileImage, 'footer', accessMap);
      }
    };

    var processPost = function(post, previousPost, accessMap){
      post.moment = moment(post.liveDate);
      post.liveIn = post.moment.fromNow();

      delete post.renderSizeRatio;
      if(post.imageSource){
        post.imageSource.readableSize = humanFileSize(post.imageSource.size);
        post.imageSource.viewable = isViewable(post.imageSource.contentType);

        delete post.fileSource;
        if(!post.imageSource.viewable){
          // This gives us a link to the non-viewable image file.
          post.fileSource = post.imageSource;
        }

        if(post.imageSource.renderSize){
          post.renderSizeRatio = ((post.imageSource.renderSize.height / post.imageSource.renderSize.width)*100) + '%';
        }
      }
      else if(post.fileSource){
        post.fileSource.readableSize = humanFileSize(post.fileSource.size);
      }

      post.isScheduled = _.has(post, 'scheduledByQueue');
      if(post.isScheduled){
        post.reorder = function(){
          $state.go(states.creators.posts.scheduled.queues.reorder.name, {id: post.collectionId});
        };
      }

      processPostDayGrouping(post, previousPost);

      updatePostUris(post, accessMap);
    };

    var processPostDayGrouping = function(post, previousPost){
      if(!previousPost){
        post.dayGrouping = true;
      }
      else{
        post.dayGrouping = !post.moment.isSame(previousPost.moment, 'day');
      }
    };

    var processPosts = function(posts, accessMap){
      var previousPost;
      _.forEach(posts, function(post){
        processPost(post, previousPost, accessMap);
        previousPost = post;
      });
    };

    service.populateCurrentCreatorInformation = function(posts, accountSettingsRepository, channelRepository) {
      if(!posts || posts.length === 0){
        return $q.when();
      }

      var channelMap;
      var accountSettings;
      return channelRepository.getChannelMap()
        .then(function (result) {
          channelMap = result;
          return accountSettingsRepository.getAccountSettings();
        })
        .then(function(result){
          accountSettings = result;

          _.forEach(posts, function (post) {
            post.channel = channelMap[post.channelId];

            if (post.collectionId) {
              post.collection = post.channel.collections[post.collectionId];
            }

            post.creator = {
              username: accountSettings.username,
              profileImage: accountSettings.profileImage
            };
          });
        });
    };

    service.processPostsForRendering = function(posts){
      if(!posts || posts.length === 0){
        return $q.when();
      }

      return accessSignatures.getContainerAccessMap()
        .then(function(accessMap){
          processPosts(posts, accessMap);
        });
    };

    service.processPostForRendering = function(post){
      return accessSignatures.getContainerAccessMap()
        .then(function(accessMap){
          processPost(post, undefined, accessMap);
        });
    };

    service.removePost = function(posts, postId){
      if(!posts || posts.length === 0){
        return $q.when();
      }

      for(var i=0; i < posts.length; ++i) {
        if (posts[i].postId === postId) {
          posts.splice(i, 1);

          if (posts.length > i) {
            processPostDayGrouping(posts[i], i === 0 ? undefined : posts[i - 1]);
          }

          return $q.when();
        }
      }
    };

    var backlogComparison = function(firstPost, secondPost){
      return firstPost.moment.isBefore(secondPost.moment);
    };
    var timelineComparison = function(firstPost, secondPost){
      return firstPost.moment.isAfter(secondPost.moment) || firstPost.moment.isSame(secondPost.moment);
    };

    service.replacePostAndReorderIfRequired = function(isBacklog, posts, oldPostMoment, newPost){
      var shouldRemove = false;
      if(isBacklog){
        shouldRemove = !newPost.isScheduled;
      }
      else{
        shouldRemove = newPost.isScheduled;
      }

      if(shouldRemove){
        service.removePost(posts, newPost.postId);
        return;
      }

      if(posts.length === 1 || oldPostMoment.isSame(newPost.moment)){
        var index = _.findIndex(posts, { postId: newPost.postId });
        if(index !== -1){
          newPost.dayGrouping = posts[index].dayGrouping;
          posts[index] = newPost;
        }
        return;
      }

      var shouldInsert = timelineComparison;
      if(isBacklog) {
        shouldInsert = backlogComparison;
      }

      service.removePost(posts, newPost.postId);
      for(var i=0; i < posts.length; ++i){
        if(shouldInsert(newPost, posts[i])){
          posts.splice(i, 0, newPost);
          processPostDayGrouping(posts[i], i === 0 ? undefined : posts[i - 1]);
          processPostDayGrouping(posts[i + 1], posts[i]);
          return;
        }
      }

      posts.push(newPost);
      // We know there are at least two posts in the list at this point.
      processPostDayGrouping(posts[posts.length - 1], posts[posts.length - 2]);
    };

    return service;
});
