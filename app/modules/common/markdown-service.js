angular.module('webApp').factory('markdownService',
  function() {
    'use strict';

    var service = {};
    var internal = service.internal = {};

    internal.renderer = new marked.Renderer();
    internal.renderer.code = function(code){
      return '<pre>' + code + '</pre>';
    };

    service.createMarkdown = function(input){
      if(!input){
        return '';
      }

      return toMarkdown(
        input,
        {
          converters: [
            {
              filter: ['code'],
              replacement: function(content) {
                return '`' + content + '`';
              }
            },
            {
              filter: ['pre'],
              replacement: function(content) {
                return '```\n' + content + '\n```';
              }
            },
            {
              filter: ['html', 'body', 'span', 'div', 'font', 'table'],
              replacement: function(innerHTML) {
                return innerHTML;
              }
            },
            {
              filter: ['head', 'script', 'style'],
              replacement: function() {
                return '';
              }
            }
          ]
        });
    };

    service.renderMarkdown = function(input){
      if(!input){
        return '';
      }

      return marked(input, {renderer: internal.renderer });
    };

    return service;
  });
