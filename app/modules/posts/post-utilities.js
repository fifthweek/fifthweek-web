angular.module('webApp').factory('postUtilities',
  function($q, $state, states, accessSignatures, jsonService) {
    'use strict';

    var service = {};
    service.internal = {};

    service.internal.humanFileSize = function(size) {
      var i = Math.floor( Math.log(size) / Math.log(1024) );
      return ( size / Math.pow(1024, i) ).toFixed(2) * 1 + ' ' + ['bytes', 'KB', 'MB', 'GB', 'TB'][i];
    };

    service.internal.getImageUri = function(image, thumbnail, caches){
      var accessInformation = caches.accessMap.containerName[image.containerName];
      if(!accessInformation){
        return undefined;
      }

      var blob = image.fileId;
      if (thumbnail) {
        blob = blob + '/' + thumbnail;
      }

      return accessInformation.uri + '/' + blob + accessInformation.signature;
    };

    service.internal.processFileSource = function(parent, source){
      source.readableSize = service.internal.humanFileSize(source.size);

      if(source.renderSize){
        parent.renderSizeRatio = ((source.renderSize.height / source.renderSize.width)*100) + '%';
        var postMaximumWidth = 945;
        var postMaximumHeight = 720;
        var calculatedHeight = (postMaximumWidth / source.renderSize.width) * source.renderSize.height;

        if(calculatedHeight > postMaximumHeight){
          parent.renderSizeMaximumWidth = postMaximumWidth * (postMaximumHeight / calculatedHeight);
        }
      }
    };

    service.internal.processFileInformation = function(parent, information, accessInformation, caches){
      information.resolvedUri = service.internal.getImageUri(information, 'feed', caches);
      if(!information.resolvedUri && accessInformation){
        information.isPreview = true;
        information.resolvedUri = accessInformation.uri + accessInformation.signature;
      }
    };

    service.internal.processFile = function(parent, information, source, accessInformation, caches) {
      delete parent.renderSizeRatio;
      delete parent.renderSizeMaximumWidth;

      if(source){
        service.internal.processFileSource(parent, source);
      }

      if(information){
        service.internal.processFileInformation(parent, information, accessInformation, caches);
      }
    };

    service.internal.calculateReadingTime = function(post){
      var wordsPerMinute = 200;
      var imagesPerMinute = 2;
      var filesPerMinute = 2;
      var wordCount = (post.wordCount - post.previewWordCount) || 0;
      var imageCount = (post.imageCount - (post.image ? 1 : 0)) || 0;
      var fileCount = post.fileCount || 0;

      post.readingTime = Math.round((wordCount / wordsPerMinute) + (imageCount / imagesPerMinute) + (fileCount / filesPerMinute));
    };

    service.internal.processTimestamps = function(post){
      post.moment = moment(post.liveDate);
      post.liveIn = post.moment.fromNow();
    };

    service.internal.processFiles = function(post, caches){
      service.internal.processFile(post, post.image, post.imageSource, post.imageAccessInformation, caches);

      if(post.files){
        _.forEach(post.files, function(file){
          service.internal.processFile(file, file.information, file.source, file.accessInformation, caches);
        });
      }

      if(post.creator && post.creator.profileImage){
        post.creator.profileImage.resolvedUri = service.internal.getImageUri(post.creator.profileImage, 'footer', caches);
      }
    };

    service.internal.processAccess = function(post, caches){
      var canAffordPost = caches.accountSettings && (caches.accountSettings.accountBalance > 0 || caches.accountSettings.isRetryingPayment);
      var channelPrice = !post.isSubscribed || post.isGuestList ? 0 : post.channel.price;
      var hasAcceptedHigherPrice = post.isSubscribed && channelPrice <= post.channel.acceptedPrice;

      post.readAccess = !!(post.isOwner || post.isGuestList || post.isFreePost || (post.isSubscribed && canAffordPost && hasAcceptedHigherPrice));
      post.readAccessIgnoringPayment = !!(post.isOwner || post.isGuestList || post.isSubscribed || post.isFreePost);
      post.priceAccepted = !post.isSubscribed || channelPrice === post.channel.acceptedPrice;
      post.freePostsRemaining = caches.accountSettings ? caches.accountSettings.freePostsRemaining : undefined;
    };

    service.internal.processScheduledPost = function(post) {
      // Only backlog posts contain a queueId field.
      post.isScheduled = _.has(post, 'queueId');
      if(post.isScheduled && post.queueId){
        post.reorder = function(){
          $state.go(states.creator.posts.scheduled.queues.reorder.name, {id: post.queueId});
        };
      }
    };

    service.internal.processContent = function(post) {
      if(post.content){
        post.blocks = jsonService.fromJson(post.content);
        _.forEach(post.blocks, function(block){
          if(block.data.fileId){
            var externalData = _.find(post.files, function(file){ return file.information.fileId === block.data.fileId; });
            _.assign(block, externalData);
          }
        });
      }
    };

    service.internal.processPost = function(post, previousPost, caches){
      service.internal.populateCreatorInformation(post, caches);
      service.internal.processAccess(post, caches);
      service.internal.processTimestamps(post);
      service.internal.processFiles(post, caches);
      service.internal.processScheduledPost(post);
      service.internal.processContent(post);
      service.internal.calculateReadingTime(post);
    };

    service.internal.processPosts = function(posts, caches){
      var previousPost;
      _.forEach(posts, function(post){
        service.internal.processPost(post, previousPost, caches);
        previousPost = post;
      });
    };

    service.internal.populateCreatorInformation = function(post, caches) {
      post.isOwner = false;
      post.isSubscribed = false;
      post.isGuestList = false;

      if(post.creatorId === caches.userId){
        post.isOwner = true;
        service.internal.populateCurrentCreatorInformation(post, caches);
      }
      else{
        var blog = caches.subscriptionMap[post.blogId];
        if(blog){
          post.isGuestList = !!blog.freeAccess;
          post.isSubscribed = !!blog.channels[post.channelId];
          service.internal.populateCreatorInformationFromBlog(post, blog);
        }
        else{
          service.internal.populateUnknownCreatorInformation(post);
        }
      }
    };

    service.internal.populateCurrentCreatorInformation = function(post, caches) {

      var blog = caches.blog;
      var accountSettings = caches.accountSettings;

      post.channel = blog.channels[post.channelId];

      if (post.queueId) {
        post.queue = blog.queues[post.queueId];
      }

      if(!post.blog){
        post.blog = {
          name: blog.name
        };
      }

      if(!post.creator){
        post.creator = {
          username: accountSettings.username,
          profileImage: accountSettings.profileImage
        };
      }
    };

    service.internal.populateCreatorInformationFromBlog = function(post, blog){
      var channel = blog.channels[post.channelId];
      if(channel){
        post.channel = channel;

        if (post.queueId) {
          var queue = blog.queues[post.queueId];
          if(queue) {
            post.queue = queue;
          }
        }
      }

      if(!post.blog){
        post.blog = {
          name: blog.name,
        };
      }

      if(!post.creator){
        post.creator = {
          username: blog.username,
          profileImage: blog.profileImage
        };
      }
    };

    service.internal.populateUnknownCreatorInformation = function(post){
      if(!post.channel){
        post.channel = {
          channelId: post.channelId,
          name: 'Unknown Channel'
        };
      }

      if (!post.queue && post.queueId) {
        post.queue = {
          queueId: post.queueId,
          name: 'Unknown Queue'
        };
      }

      if(!post.blog){
        post.blog = {
          name: 'Unknown Blog'
        };
      }

      if(!post.creator){
        post.creator = {
          username: 'Unknown Creator',
          profileImage: undefined
        };
      }
    };

    service.internal.getPopulatedCaches = function(accountSettingsRepository, blogRepository, subscriptionRepository){
      var caches = {};

      caches.userId = blogRepository.getUserId();

      return accessSignatures.getContainerAccessMap()
        .then(function(result) {
          caches.accessMap = result;
          return subscriptionRepository.getBlogMap();
        })
        .then(function (result) {
          caches.subscriptionMap = result;
          return blogRepository.tryGetBlogMap();
        })
        .then(function (result) {
          caches.blog = result;
          return accountSettingsRepository.getAccountSettings();
        })
        .then(function(result){
          caches.accountSettings = result;
          return $q.when(caches);
        });
    };

    service.processPostsForRendering = function(posts, accountSettingsRepository, blogRepository, subscriptionRepository){
      if(!posts || posts.length === 0){
        return $q.when();
      }

      return service.internal.getPopulatedCaches(accountSettingsRepository, blogRepository, subscriptionRepository)
        .then(function(caches){
          service.internal.processPosts(posts, caches);
        });
    };

    service.processPostForRendering = function(post, accountSettingsRepository, blogRepository, subscriptionRepository){
      return service.internal.getPopulatedCaches(accountSettingsRepository, blogRepository, subscriptionRepository)
        .then(function(caches){
          service.internal.processPost(post, undefined, caches);
        });
    };

    service.removePost = function(posts, postId){
      if(!posts || posts.length === 0){
        return;
      }

      for(var i=0; i < posts.length; ++i) {
        if (posts[i].postId === postId) {
          posts.splice(i, 1);
          return;
        }
      }
    };

    service.internal.backlogComparison = function(firstPost, secondPost){
      return firstPost.moment.isBefore(secondPost.moment);
    };

    service.internal.timelineComparison = function(firstPost, secondPost){
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
          posts[index] = newPost;
        }
        return;
      }

      var shouldInsert = service.internal.timelineComparison;
      if(isBacklog) {
        shouldInsert = service.internal.backlogComparison;
      }

      service.removePost(posts, newPost.postId);
      for(var i=0; i < posts.length; ++i){
        if(shouldInsert(newPost, posts[i])){
          posts.splice(i, 0, newPost);
          return;
        }
      }

      posts.push(newPost);
    };

    return service;
});
