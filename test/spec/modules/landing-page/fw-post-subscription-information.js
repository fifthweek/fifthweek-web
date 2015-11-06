describe('fw-post-subscription-information', function(){
  'use strict';

  var $rootScope;
  var $compile;

  var fwSubscriptionInformationCtrl;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    module(function($controllerProvider){
      $controllerProvider.register('fwSubscriptionInformationCtrl', function() { fwSubscriptionInformationCtrl = this; this.initialize = jasmine.createSpy('initialize'); });
    });

    inject(function($injector) {
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
    });
  });

  describe('when creating', function(){

    var scope;
    var element;

    beforeEach(function(){
      scope = $rootScope.$new();
      element = angular.element('<fw-post-subscription-information username="un" requiredChannelId="channelId" />');
      $compile(element)(scope);
      scope.$digest();
    });

    it('should initialize the controller', function(){
      expect(fwSubscriptionInformationCtrl.initialize).toHaveBeenCalledWith();
    });
  });
});
