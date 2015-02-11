'use strict';

angular.module('webApp').factory('datepickerService', function() {

    var factory = {};

    factory.date = new Date();

    factory.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      this.opened = true;
    };

    return factory;

  });