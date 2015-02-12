'use strict';

angular.module('webApp').factory('datepickerService', function() {

    var factory = {};

    factory.date = new Date();

    factory.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();
      this.opened = true;
    };

    //eg
    //factory.formats = ['dd-MMMM', 'dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'longDate', 'shortDate', 'fullDate'];

    factory.formats = ['fullDate'];
    factory.format = factory.formats[0];

    return factory;

  });