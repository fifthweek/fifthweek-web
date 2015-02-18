angular.module('webApp')
  .factory('azureBlobUpload', function($q, logService, azureBlobStub) {
    'use strict';

    var DefaultBlockSize = 1024 * 512;

    var service = {};

    var pad = function (number, length) {
      var str = '' + number;
      while (str.length < length) {
        str = '0' + str;
      }
      return str;
    };

    var handleError = function(error, message, state){
      logService.error({ message: message, error: error });
      state.deferred.reject(error);
    };

    var callProgress = function(state, percentComplete){
      try{
        state.progress(percentComplete);
      }
      catch(error){
        logService.error({ message: 'Progress callback failed during blob upload.', error: error });
      }
    };

    var initializeState = function (config) {
      var blockSize = DefaultBlockSize;
      if (config.blockSize) {
        blockSize = config.blockSize;
      }

      var maxBlockSize = blockSize;
      var numberOfBlocks = 1;

      var file = config.file;

      var fileSize = file.size;
      if (fileSize < blockSize) {
        maxBlockSize = fileSize;
      }

      if (fileSize % maxBlockSize === 0) {
        numberOfBlocks = fileSize / maxBlockSize;
      } else {
        numberOfBlocks = parseInt(fileSize / maxBlockSize, 10) + 1;
      }

      return {
        maxBlockSize: maxBlockSize,
        numberOfBlocks: numberOfBlocks,
        totalBytesRemaining: fileSize,
        currentFilePointer: 0,
        blockIds: [],
        bytesUploaded: 0,
        submitUri: null,
        file: file,
        baseUrl: config.baseUrl,
        sasToken: config.sasToken,
        fileUrl: config.baseUrl + config.sasToken,
        progress: config.progress || function(){},
        azureCalled: config.azureCalled || function(){},
        deferred: $q.defer()
      };
    };

    var uploadFileInBlocks = function (reader, state) {
      if (state.totalBytesRemaining > 0) {
        var fileContent = state.file.slice(state.currentFilePointer, state.currentFilePointer + state.maxBlockSize);
        var blockId = pad(state.blockIds.length, 8);

        state.blockIds.push(blockId);

        state.currentFilePointer += state.maxBlockSize;
        state.totalBytesRemaining -= state.maxBlockSize;
        if (state.totalBytesRemaining < state.maxBlockSize) {
          state.maxBlockSize = state.totalBytesRemaining;
        }

        reader.readAsArrayBuffer(fileContent);
      } else {
        commitBlockList(state);
      }
    };

    var commitBlockList = function (state) {
      azureBlobStub.commitBlockList(state.fileUrl, state.blockIds, state.file.type)
        .then(function() {
          state.deferred.resolve();
        }).catch(function(error) {
          handleError(error, 'Failed to commit blob list.', state);
        });

      state.azureCalled();
    };

    var onLoadEnd = function(event, state, reader){
      try{
        if (event.target.readyState === FileReader.DONE) {

          var requestData = new Uint8Array(event.target.result);
          azureBlobStub.putBlockBlob(state.fileUrl, state.blockIds[state.blockIds.length - 1], requestData)
            .then(function () {
              state.bytesUploaded += requestData.length;

              var percentComplete = ((parseFloat(state.bytesUploaded) / parseFloat(state.file.size)) * 100).toFixed(2);
              callProgress(state, percentComplete);

              uploadFileInBlocks(reader, state);
            }).catch(function(error) {
              handleError(error, 'Failed to upload block blob.', state);
            });

          state.azureCalled();
        }
      }
      catch(error){
        handleError(error, 'Failed to upload block blob.', state);
      }
    };

    // config: {
    //  baseUrl:
    //  sasToken:
    //  file:
    //  progress:
    //  azureCalled: // Note: This is used to help with unit testing, so that $rootScope.$apply() can be called.
    //  blockSize:
    // }
    service.upload = function (config) {
      var state = initializeState(config);

      try{
        var reader = new FileReader();
        reader.onloadend = function (event) {
          return onLoadEnd(event, state, reader);
        };

        uploadFileInBlocks(reader, state);
      }
      catch(error){
        handleError(error, 'Failed to initiate file upload.', state);
      }

      return state.deferred.promise;
    };

    return service;
  });
