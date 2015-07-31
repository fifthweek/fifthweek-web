angular.module('webApp')
  .controller('transactionsCtrl',
  function($scope, initializer, paymentsStub, errorFacade, impersonationService) {
    'use strict';


    $scope.refundReasons = {
      requestedByCustomer: 'requestedByCustomer',
      duplicate: 'duplicate',
      fraudulent: 'fraudulent'
    };

    var model = $scope.model = {
      isLoading: false,
      errorMessage: undefined,
      records: [],
      record: undefined,
      selectedRecords: [],
      filter: {
        startDate: undefined,
        endTimestamp: undefined,
        userId: undefined
      },
      input: {
        comment: undefined,
        refundAmount: 0.00,
        refundReason: $scope.refundReasons.requestedByCustomer
      }
    };

    var internal = this.internal = {};

    internal.stringToColor = function(str) {
      /*jshint bitwise: false */
      // str to hash
      for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash)){}
      // int/hash to hex
      for (var j = 0, color = '#'; j < 3; color += ('00' + ((hash >> j++ * 8) & 0xFF).toString(16)).slice(-2)){}
      /*jshint bitwise: true */
      return color;
    };

    internal.loadForm = function(){
      model.isLoading = true;
      model.records = [];
      model.record = undefined;
      model.selectedRecords = [];

      return paymentsStub.getTransactions(
        model.filter.userId,
        moment(model.filter.startTimestamp).toISOString(),
        moment(model.filter.endTimestamp).toISOString())
        .then(function(result){
          model.records = result.data.records;
          _.forEach(model.records, function(record){
            record.color = internal.stringToColor(record.transactionReference);
          });
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
      $scope.resetFilter();
      return internal.loadForm();
    };

    internal.refreshKeepingRecord = function(){
      var transactionReference = model.record.transactionReference;
      return internal.loadForm()
        .then(function(){
          var record = _.find(model.records, { transactionReference: transactionReference });
          if(record){
            $scope.showDetail(record);
          }
        });
    };

    $scope.showDetail = function(record){
      model.record = record;
      model.selectedRecords = _.where(model.records, { transactionReference: record.transactionReference });
      model.recordJson = JSON.stringify(record, undefined, 2);
    };

    $scope.impersonate = function(userId){
      return impersonationService.impersonate(userId);
    };

    $scope.reverseTransaction = function() {
      if(window.confirm('Are you sure you want to reverse the transaction?')){
        return paymentsStub.postTransactionRefund(
          model.record.transactionReference,
          {
            comment: model.input.comment
          })
          .then(function(){
            return internal.refreshKeepingRecord();
          })
          .catch(function(error){
            return errorFacade.handleError(error, function(message) {
              model.errorMessage = message;
            });
          });
      }
    };

    $scope.refundCredit = function() {
      var amountInDollars = model.input.refundAmount;
      var amountInCents = Math.round(amountInDollars * 100);
      if(window.confirm('Are you sure you want to refund $' + amountInDollars.toFixed(2) + '?')){
        return paymentsStub.postCreditRefund(
          model.record.transactionReference,
          {
            comment: model.input.comment,
            refundCreditAmount: amountInCents,
            reason: model.input.refundReason
          })
          .then(function(){
            return internal.refreshKeepingRecord();
          })
          .catch(function(error){
            return errorFacade.handleError(error, function(message) {
              model.errorMessage = message;
            });
          });
      }
    };

    $scope.filter = function(){
      return internal.loadForm();
    };

    $scope.resetFilter = function(){
      var start = new Date();
      var end = new Date();
      start.setMonth(start.getMonth() - 1);

      model.filter.startTimestamp = start;
      model.filter.endTimestamp = end;
      model.filter.userId = undefined;
    };

    initializer.initialize(internal.initialize);
  });
