describe('fw-post-list-information-controller', function() {
  'use strict';

  var $q;
  var $scope;
  var target;

  var subscriptionRepositoryFactory;
  var subscriptionRepository;
  var fwPostListConstants;
  var aggregateUserStateConstants;
  var errorFacade;
  var subscriptionStub;
  var $state;
  var states;
  var landingPageConstants;

  beforeEach(function () {

    subscriptionRepositoryFactory = jasmine.createSpyObj('subscriptionRepositoryFactory', ['forCurrentUser']);
    subscriptionRepository = jasmine.createSpyObj('subscriptionRepository', ['tryGetBlogs']);
    subscriptionRepositoryFactory.forCurrentUser.and.returnValue(subscriptionRepository);
    errorFacade = jasmine.createSpyObj('errorFacade', ['handleError']);
    subscriptionStub = jasmine.createSpyObj('subscriptionStub', ['putChannelSubscription']);
    $state = jasmine.createSpyObj('$state', ['go']);

    module('webApp');
    module(function ($provide) {
      $provide.value('subscriptionRepositoryFactory', subscriptionRepositoryFactory);
      $provide.value('errorFacade', errorFacade);
      $provide.value('subscriptionStub', subscriptionStub);
      $provide.value('$state', $state);
    });

    inject(function ($injector) {
      $q = $injector.get('$q');
      $scope = $injector.get('$rootScope').$new();
      fwPostListConstants = $injector.get('fwPostListConstants');
      aggregateUserStateConstants = $injector.get('aggregateUserStateConstants');
      states = $injector.get('states');
      landingPageConstants = $injector.get('landingPageConstants');
    });

    errorFacade.handleError.and.callFake(function(error, setMessage) {
      setMessage('friendlyError');
      return $q.when();
    });
  });

  var createController = function () {
    inject(function ($controller) {
      target = $controller('fwPostListInformationCtrl', {$scope: $scope});
    });
  };

  describe('when creating', function(){
    beforeEach(function(){
      createController();
    });

    it('should create the model', function(){
      expect($scope.model).toBeDefined();
    });

    it('should set hasFreeAccess to false', function(){
      expect($scope.model.hasFreeAccess).toBe(false);
    });

    it('should set the updated prices list to empty', function(){
      expect($scope.model.updatedPrices).toEqual([]);
    });

    it('should get a subscription repository', function(){
      expect(subscriptionRepositoryFactory.forCurrentUser).toHaveBeenCalledWith();
    });
  });

  describe('when created', function() {
    beforeEach(function () {
      $scope.userId = 'userId';
      $scope.channelId = 'channelId';
      createController();
    });

    describe('when calling initialize', function(){
      beforeEach(function(){
        spyOn($scope, '$on');
        target.initialize();
      });

      it('should attach to the user state updated event', function(){
        expect($scope.$on).toHaveBeenCalledWith(aggregateUserStateConstants.updatedEvent, target.internal.load);
      });
    });

    describe('when calling acceptPrice', function(){
      var success;
      var error;
      var deferredPutChannelSubscription;
      var updatedPrice;
      beforeEach(function(){
        success = undefined;
        error = undefined;
        deferredPutChannelSubscription = $q.defer();
        subscriptionStub.putChannelSubscription.and.returnValue(deferredPutChannelSubscription.promise);

        updatedPrice = {
          channel: {
            channelId: 'A'
          },
          currentPrice: 100
        };

        $scope.model.updatedPrices = [
          {},
          updatedPrice,
          {}
        ];

        spyOn($scope, '$emit');

        $scope.acceptPrice(updatedPrice).then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call putChannelSubscription', function(){
        expect(subscriptionStub.putChannelSubscription).toHaveBeenCalledWith('A', { acceptedPrice: 100 });
      });

      describe('when putChannelSubscription succeeds', function(){

        describe('when price was an increase', function(){
          beforeEach(function(){
            updatedPrice.isIncrease = true;
            deferredPutChannelSubscription.resolve();
            $scope.$apply();
          });

          it('should remove the updated price from the model', function(){
            expect($scope.model.updatedPrices).toEqual([ {}, {} ]);
          });

          it('should emit the reload event', function(){
            expect($scope.$emit).toHaveBeenCalledWith(fwPostListConstants.reloadEvent);
          });
        });

        describe('when price was a decrease', function(){
          beforeEach(function(){
            updatedPrice.isIncrease = false;
            deferredPutChannelSubscription.resolve();
            $scope.$apply();
          });

          it('should remove the updated price from the model', function(){
            expect($scope.model.updatedPrices).toEqual([ {}, {} ]);
          });

          it('should not emit the reload event', function(){
            expect($scope.$emit).not.toHaveBeenCalled();
          });
        });
      });

      describe('when putChannelSubscription fails', function(){
        beforeEach(function(){
          deferredPutChannelSubscription.reject('error');
          $scope.$apply();
        });

        it('should call handleError', function(){
          expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
        });

        it('should set the error message', function(){
          expect($scope.model.errorMessage).toBe('friendlyError');
        });

        it('should not propagate the error', function(){
          expect(error).toBeUndefined();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });
    });

    describe('when calling manageSubscription', function(){
      describe('when current page is landing page', function(){
        beforeEach(function(){
          $state.current = { name: states.landingPage.name };
          $scope.manageSubscription({ blog: { username: 'username' }});
        });

        it('should naviagate to the manage subscription page', function(){
          expect($state.go).toHaveBeenCalledWith(
            states.landingPage.name,
            {
              username: 'username',
              action: landingPageConstants.actions.manage,
              key: undefined
            });
        });
      });

      describe('when current page is not landing page', function(){
        beforeEach(function(){
          $state.current = { name: 'some-state' };
          $scope.manageSubscription({ blog: { username: 'username' }});
        });

        it('should naviagate to the manage subscription page', function(){
          expect($state.go).toHaveBeenCalledWith(
            states.landingPage.name,
            {
              username: 'username',
              action: landingPageConstants.actions.manage,
              key: 'some-state'
            });
        });
      });
    });

    describe('when load is called', function(){
      var success;
      var error;
      var deferredLoadForCreator;
      beforeEach(function(){
        success = undefined;
        error = undefined;
        deferredLoadForCreator = $q.defer();
        spyOn(target.internal, 'loadForCreator').and.returnValue(deferredLoadForCreator.promise);

        $scope.userId = 'userId';
      });

      var execute = function(){
        target.internal.load().then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      };

      describe('when source is not timeline', function(){
        beforeEach(function(){
          $scope.source = 'something';
          execute();
        });

        it('should not call loadForCreator', function(){
          expect(target.internal.loadForCreator).not.toHaveBeenCalled();
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when source is timeline', function(){
        beforeEach(function(){
          $scope.source = fwPostListConstants.sources.timeline;
          execute();
        });

        it('should call loadForCreator', function(){
          expect(target.internal.loadForCreator).toHaveBeenCalledWith('userId');
        });

        describe('when loadForCreator succeeds', function(){
          beforeEach(function(){
            deferredLoadForCreator.resolve();
            $scope.$apply();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });

        describe('when loadForCreator fails', function(){
          beforeEach(function(){
            deferredLoadForCreator.reject('error');
            $scope.$apply();
          });

          it('should call handleError', function(){
            expect(errorFacade.handleError).toHaveBeenCalledWith('error', jasmine.any(Function));
          });

          it('should set the error message', function(){
            expect($scope.model.errorMessage).toBe('friendlyError');
          });

          it('should not propagate the error', function(){
            expect(error).toBeUndefined();
          });

          it('should complete successfully', function(){
            expect(success).toBe(true);
          });
        });
      });
    });

    describe('when loadForCreator is called', function(){
      var success;
      var error;
      var deferredTryGetBlogs;
      beforeEach(function(){
        success = undefined;
        error = undefined;
        deferredTryGetBlogs = $q.defer();
        subscriptionRepository.tryGetBlogs.and.returnValue(deferredTryGetBlogs.promise);

        spyOn(target.internal, 'loadSubscribedBlogInformation');

        target.internal.loadForCreator('userId').then(function(){ success = true; }, function(e){ error = e; });
        $scope.$apply();
      });

      it('should call tryGetBlogs', function(){
        expect(subscriptionRepository.tryGetBlogs).toHaveBeenCalledWith();
      });

      describe('when tryGetBlogs succeeds', function(){
        beforeEach(function(){
          deferredTryGetBlogs.resolve('blogs');
          $scope.$apply();
        });

        it('should call loadSubscribedBlogInformation', function(){
          expect(target.internal.loadSubscribedBlogInformation).toHaveBeenCalledWith('userId', 'blogs');
        });

        it('should complete successfully', function(){
          expect(success).toBe(true);
        });
      });

      describe('when tryGetBlogs fails', function(){
        beforeEach(function(){
          deferredTryGetBlogs.reject('error');
          $scope.$apply();
        });

        it('should propagate the error', function(){
          expect(error).toBe('error');
        });
      });
    });

    describe('when calling loadSubscribedBlogInformation', function(){
      var blog1;
      var blog2;
      var blogs;
      beforeEach(function(){

        blog1 = {
          creatorId: 'A',
          freeAccess: true,
          channels: [
            {
              channelId: 'A1',
              price: 99,
              acceptedPrice: 90
            },
            {
              channelId: 'A2',
              price: 100,
              acceptedPrice: 100
            },
            {
              channelId: 'A3',
              price: 101,
              acceptedPrice: 110
            }
          ]
        };

        blog2 = {
          creatorId: 'B',
          freeAccess: false,
          channels: [
            {
              channelId: 'B1',
              price: 99,
              acceptedPrice: 90
            },
            {
              channelId: 'B2',
              price: 100,
              acceptedPrice: 100
            },
            {
              channelId: 'B3',
              price: 101,
              acceptedPrice: 110
            }
          ]
        };

        blogs = [
          blog1,
          blog2
        ];

        $scope.model.hasFreeAccess = true;
        $scope.model.updatedPrices = 'something';
      });

      describe('when blogs does not exist', function(){
        beforeEach(function(){
          target.internal.loadSubscribedBlogInformation('creatorId', undefined);
          $scope.$apply();
        });

        it('should set hasFreeAccess to false', function(){
          expect($scope.model.hasFreeAccess).toBe(false);
        });

        it('should set updatedPrices to an empty list', function(){
          expect($scope.model.updatedPrices).toEqual([]);
        });
      });

      describe('when creatorId is not found', function(){
        beforeEach(function(){
          target.internal.loadSubscribedBlogInformation('C', blogs);
          $scope.$apply();
        });

        it('should set hasFreeAccess to false', function(){
          expect($scope.model.hasFreeAccess).toBe(false);
        });

        it('should set updatedPrices to an empty list', function(){
          expect($scope.model.updatedPrices).toEqual([]);
        });
      });

      describe('when user has free access to blog', function(){
        beforeEach(function(){
          $scope.model.hasFreeAccess = false;
          target.internal.loadSubscribedBlogInformation('A', blogs);
          $scope.$apply();
        });

        it('should set hasFreeAccess to true', function(){
          expect($scope.model.hasFreeAccess).toBe(true);
        });

        it('should set updatedPrices to the list of updated channel prices', function(){
          expect($scope.model.updatedPrices).toEqual([
            {
              currentPrice: 0,
              isIncrease: false,
              blog: blog1,
              channel: blog1.channels[0]
            },
            {
              currentPrice: 0,
              isIncrease: false,
              blog: blog1,
              channel: blog1.channels[1]
            },
            {
              currentPrice: 0,
              isIncrease: false,
              blog: blog1,
              channel: blog1.channels[2]
            }
          ]);
        });
      });

      describe('when user does not have free access to blog', function(){
        beforeEach(function(){
          $scope.model.hasFreeAccess = true;
          target.internal.loadSubscribedBlogInformation('B', blogs);
          $scope.$apply();
        });

        it('should set hasFreeAccess to false', function(){
          expect($scope.model.hasFreeAccess).toBe(false);
        });

        it('should set updatedPrices to the list of updated channel prices', function(){
          expect($scope.model.updatedPrices).toEqual([
            {
              currentPrice: 99,
              isIncrease: true,
              blog: blog2,
              channel: blog2.channels[0]
            },
            {
              currentPrice: 101,
              isIncrease: false,
              blog: blog2,
              channel: blog2.channels[2]
            }
          ]);
        });
      });

      describe('when creatorId is not specified', function(){
        beforeEach(function(){
          $scope.model.hasFreeAccess = true;
          target.internal.loadSubscribedBlogInformation(undefined, blogs);
          $scope.$apply();
        });

        it('should set hasFreeAccess to false', function(){
          expect($scope.model.hasFreeAccess).toBe(false);
        });

        it('should set updatedPrices to the list of updated channel prices', function(){
          expect($scope.model.updatedPrices).toEqual([
            {
              currentPrice: 0,
              isIncrease: false,
              blog: blog1,
              channel: blog1.channels[0]
            },
            {
              currentPrice: 0,
              isIncrease: false,
              blog: blog1,
              channel: blog1.channels[1]
            },
            {
              currentPrice: 0,
              isIncrease: false,
              blog: blog1,
              channel: blog1.channels[2]
            },
            {
              currentPrice: 99,
              isIncrease: true,
              blog: blog2,
              channel: blog2.channels[0]
            },
            {
              currentPrice: 101,
              isIncrease: false,
              blog: blog2,
              channel: blog2.channels[2]
            }
          ]);
        });
      });
    });
  });
});
