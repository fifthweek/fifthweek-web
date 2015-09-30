describe('fw-form-dirty-confirmation directive', function(){
  'use strict';

  var $q;
  var $rootScope;
  var $compile;

  var $state;
  var $modal;
  var uiRouterConstants;
  var uiBootstrapConstants;

  beforeEach(function() {
    module('webApp', 'webApp.views');

    $state = jasmine.createSpyObj('$state', ['reload', 'go']);
    $modal = jasmine.createSpyObj('$modal', ['open']);

    $state.current = { name: 'state1' };

    module(function($provide) {
      $provide.value('$state', $state);
      $provide.value('$modal', $modal);
    });

    inject(function($injector) {
      $q = $injector.get('$q');
      $rootScope = $injector.get('$rootScope');
      $compile = $injector.get('$compile');
      uiRouterConstants = $injector.get('uiRouterConstants');
      uiBootstrapConstants = $injector.get('uiBootstrapConstants');
    });
  });

  describe('when creating', function(){

    var testData;
    var toParams;
    beforeEach(function(){
      toParams = { name: 'params' };
      testData = {};
    });

    describe('when form is specified', function(){
      var scope;
      var element;
      var isolateScope;

      var performStandardTests = function(){
        var toState;

        var raiseEvent = function(){
          if(testData.isModal){
            isolateScope.$close = jasmine.createSpy('$close');
            return isolateScope.$broadcast(uiBootstrapConstants.modalClosingEvent);
          }
          else{
            return isolateScope.$broadcast(uiRouterConstants.stateChangeStartEvent, toState, toParams);
          }
        };

        it('should be enabled', function(){
          expect(isolateScope.enabled).toBe(true);
        });

        it('should not be displayed', function(){
          expect(isolateScope.displayed).toBe(false);
        });

        it('should be set discardChanges to false on the form', function(){
          expect(scope.someForm.discardChanges).toBe(false);
        });

        it('should be add a discard method to the form', function(){
          expect(scope.someForm.discard).toBeDefined();
        });

        describe('when discard is called', function(){
          beforeEach(function(){
            scope.someForm.discard();
          });

          it('should set discardChanges to true on the form', function(){
            expect(scope.someForm.discardChanges).toBe(true);
          });
        });

        describe('when the dialog should be displayed', function(){
          var dialogResult;
          beforeEach(function(){
            scope.someForm.$dirty = true;
            toState = { name: 'state2' };

            dialogResult = $q.defer();
            $modal.open.and.returnValue({ result: dialogResult.promise });
          });

          describe('when the event is raised', function(){
            var event;
            beforeEach(function(){
              event = raiseEvent();
              scope.$apply();
            });

            it('should should prevent the default behaviour', function(){
              expect(event.defaultPrevented).toBe(true);
            });

            it('should set displayed to true', function(){
              expect(isolateScope.displayed).toBe(true);
            });

            it('should open the dialog', function(){
              expect($modal.open).toHaveBeenCalledWith({
                templateUrl: 'modules/common/fw-form-dirty-confirmation.html',
                size: 'sm'
              });
            });

            describe('when the dialog is completed with rejected promise', function(){
              beforeEach(function(){
                dialogResult.reject();
                scope.$apply();
              });

              it('should set displayed to false', function(){
                expect(isolateScope.displayed).toBe(false);
              });

              it('should not change state', function(){
                expect($state.go).not.toHaveBeenCalled();
              });
            });

            describe('when the dialog is completed with a falsy result', function(){
              beforeEach(function(){
                dialogResult.resolve(false);
                scope.$apply();
              });

              it('should set displayed to false', function(){
                expect(isolateScope.displayed).toBe(false);
              });

              it('should not change state', function(){
                expect($state.go).not.toHaveBeenCalled();
              });
            });

            describe('when the dialog is completed with a true result', function(){
              beforeEach(function(){
                dialogResult.resolve(true);
                scope.$apply();
              });

              it('should set displayed to false', function(){
                expect(isolateScope.displayed).toBe(false);
              });

              it('should set enabled to false', function(){
                expect(isolateScope.enabled).toBe(false);
              });

              it('should resume the operation', function(){
                if(testData.isModal){
                  expect(isolateScope.$close).toHaveBeenCalled();
                }
                else{
                  expect($state.go).toHaveBeenCalledWith('state2', toParams);
                }
              });
            });
          });
        });

        describe('when the dialog should not be displayed because the dialog is already displayed', function(){
          beforeEach(function(){
            scope.someForm.$dirty = true;
            toState = { name: 'state2' };
            isolateScope.displayed = true;
          });

          describe('when the stateChangeStart event is raised', function(){
            var event;
            beforeEach(function(){
              event = raiseEvent();
              scope.$apply();
            });

            it('should should prevent the default behaviour', function(){
              expect(event.defaultPrevented).toBe(true);
            });

            it('should not open the dialog', function(){
              expect($modal.open).not.toHaveBeenCalled();
            });
          });
        });

        describe('when the dialog should not be displayed because the directive is not enabled', function(){
          beforeEach(function(){
            scope.someForm.$dirty = true;
            toState = { name: 'state2' };
            isolateScope.enabled = false;
          });

          describe('when the stateChangeStart event is raised', function(){
            var event;
            beforeEach(function(){
              event = raiseEvent();
              scope.$apply();
            });

            it('should should not prevent the default behaviour', function(){
              expect(event.defaultPrevented).toBe(false);
            });

            it('should not open the dialog', function(){
              expect($modal.open).not.toHaveBeenCalled();
            });
          });
        });

        describe('when the dialog should not be displayed because discardChanges is set on the form', function(){
          beforeEach(function(){
            scope.someForm.$dirty = true;
            toState = { name: 'state2' };
            scope.someForm.discardChanges = true;
          });

          describe('when the stateChangeStart event is raised', function(){
            var event;
            beforeEach(function(){
              event = raiseEvent();
              scope.$apply();
            });

            it('should should not prevent the default behaviour', function(){
              expect(event.defaultPrevented).toBe(false);
            });

            it('should not open the dialog', function(){
              expect($modal.open).not.toHaveBeenCalled();
            });
          });
        });

        describe('when the dialog should not be displayed because the form is submitting', function(){
          beforeEach(function(){
            scope.someForm.$dirty = true;
            toState = { name: 'state2' };
            scope.someForm.isSubmitting = true;
          });

          describe('when the stateChangeStart event is raised', function(){
            var event;
            beforeEach(function(){
              event = raiseEvent();
              scope.$apply();
            });

            it('should should not prevent the default behaviour', function(){
              expect(event.defaultPrevented).toBe(false);
            });

            it('should not open the dialog', function(){
              expect($modal.open).not.toHaveBeenCalled();
            });
          });
        });

        describe('when the dialog should not be displayed because state is the same as the initial state', function(){
          beforeEach(function(){
            if(!testData.isModal) {
              scope.someForm.$dirty = true;
              toState = {name: 'state1'};
            }
          });

          describe('when the stateChangeStart event is raised', function(){
            var event;
            beforeEach(function(){
              if(!testData.isModal){
                event = raiseEvent();
                scope.$apply();
              }
            });

            it('should should not prevent the default behaviour', function(){
              if(!testData.isModal) {
                expect(event.defaultPrevented).toBe(false);
              }
            });

            it('should not open the dialog', function(){
              if(!testData.isModal) {
                expect($modal.open).not.toHaveBeenCalled();
              }
            });
          });
        });

        describe('when the dialog should not be displayed because the form is not dirty', function(){
          beforeEach(function(){
            scope.someForm.$dirty = false;
            toState = { name: 'state2' };
          });

          describe('when the stateChangeStart event is raised', function(){
            var event;
            beforeEach(function(){
              event = raiseEvent();
              scope.$apply();
            });

            it('should should not prevent the default behaviour', function(){
              expect(event.defaultPrevented).toBe(false);
            });

            it('should not open the dialog', function(){
              expect($modal.open).not.toHaveBeenCalled();
            });
          });
        });
      };

      describe('when standard form', function(){
        describe('when form-dirty method is specified', function(){

          var isDirtyFlag;
          beforeEach(function(){
            isDirtyFlag = true;
            scope = $rootScope.$new();
            scope.someForm = { name: 'Some Form' };
            scope.isDirtyFunction = function(){
              return scope.someForm.$dirty && isDirtyFlag;
            };

            element = angular.element('<fw-form-dirty-confirmation form="someForm" form-dirty="isDirtyFunction" />');
            $compile(element)(scope);
            isolateScope = element.isolateScope();
            scope.$digest();
          });

          performStandardTests();

          describe('when the dialog should not be displayed because the form-dirty function returns false', function(){
            var toState;
            beforeEach(function(){
              scope.someForm.$dirty = true;
              toState = { name: 'state2' };
              isDirtyFlag = false;
            });

            describe('when the stateChangeStart event is raised', function(){
              var event;
              beforeEach(function(){
                event = isolateScope.$broadcast(uiRouterConstants.stateChangeStartEvent, toState, toParams);
                scope.$apply();
              });

              it('should should not prevent the default behaviour', function(){
                expect(event.defaultPrevented).toBe(false);
              });

              it('should not open the dialog', function(){
                expect($modal.open).not.toHaveBeenCalled();
              });
            });
          });
        });

        describe('when form-dirty method is not specified', function(){
          beforeEach(function(){
            scope = $rootScope.$new();
            scope.someForm = { name: 'Some Form' };
            element = angular.element('<fw-form-dirty-confirmation form="someForm" />');
            $compile(element)(scope);
            isolateScope = element.isolateScope();
            scope.$digest();
          });

          performStandardTests();
        });
      });

      describe('when modal form', function(){
        beforeEach(function(){
          testData.isModal = true;
        });

        describe('when form-dirty method is specified', function(){

          var isDirtyFlag;
          beforeEach(function(){
            isDirtyFlag = true;
            scope = $rootScope.$new();
            scope.someForm = { name: 'Some Form' };
            scope.isDirtyFunction = function(){
              return scope.someForm.$dirty && isDirtyFlag;
            };

            element = angular.element('<fw-form-dirty-confirmation is-modal="true" form="someForm" form-dirty="isDirtyFunction" />');
            $compile(element)(scope);
            isolateScope = element.isolateScope();
            scope.$digest();
          });

          performStandardTests();

          describe('when the dialog should not be displayed because the form-dirty function returns false', function(){
            var toState;
            beforeEach(function(){
              scope.someForm.$dirty = true;
              toState = { name: 'state2' };
              isDirtyFlag = false;
            });

            describe('when the stateChangeStart event is raised', function(){
              var event;
              beforeEach(function(){
                isolateScope.$close = jasmine.createSpy('$close');
                event = isolateScope.$broadcast(uiBootstrapConstants.modalClosingEvent);
                scope.$apply();
              });

              it('should should not prevent the default behaviour', function(){
                expect(event.defaultPrevented).toBe(false);
              });

              it('should not open the dialog', function(){
                expect($modal.open).not.toHaveBeenCalled();
              });
            });
          });
        });

        describe('when form-dirty method is not specified', function(){
          beforeEach(function(){
            scope = $rootScope.$new();
            scope.someForm = { name: 'Some Form' };
            element = angular.element('<fw-form-dirty-confirmation is-modal="true" form="someForm" />');
            $compile(element)(scope);
            isolateScope = element.isolateScope();
            scope.$digest();
          });

          performStandardTests();
        });

      });
    });

    describe('when form is not specified', function(){

      var scope;
      var element;
      var isolateScope;

      beforeEach(function(){
        scope = $rootScope.$new();
        element = angular.element('<fw-form-dirty-confirmation />');
        $compile(element)(scope);
        scope.$digest();
        isolateScope = element.isolateScope();
      });

      it('should not be enabled', function(){
        expect(isolateScope.enabled).toBeFalsy();
      });
    });
  });
});
