'use strict';

var SidebarPage = function() {};

SidebarPage.prototype = {
  get navigationLinks() { return element.all(by.css('#sidebar a')) }
};

module.exports = SidebarPage;
