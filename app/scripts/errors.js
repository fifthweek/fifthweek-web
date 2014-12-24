'use strict';

function FifthweekError(message) {
  this.message = message;
  this.stack = Error().stack;
}
FifthweekError.prototype = Object.create(Error.prototype);
FifthweekError.prototype.name = 'FifthweekError';

function ApiError(message) {
  this.message = message;
  this.stack = Error().stack;
}
ApiError.prototype = Object.create(Error.prototype);
ApiError.prototype.name = 'ApiError';

function ConnectionError(message) {
  this.message = message;
  this.stack = Error().stack;
}
ConnectionError.prototype = Object.create(Error.prototype);
ConnectionError.prototype.name = 'ConnectionError';

// Error handler for non-angular errors.  Tries to post the message to the server without
// any dependencies on third party libraries.
// Taken from:
// http://www.mikeobrien.net/blog/client-side-exception-logging-and-notification-in-angular/
window.onerror = function(message, source, line, column) {
  if(source){
    if(source.indexOf('froogaloop') !== -1 ||
      (source.indexOf('vendor') !== -1 && (message.indexOf('contentWindow') !== -1 || message.indexOf('postMessage') !== -1))){
      // Skip froogaloop errors until the issue has been resolved.
      return;
    }
  }

  var escape = function(x) { return x.replace('\\', '\\\\').replace('\"', '\\"'); };
  var XHR = window.XMLHttpRequest || function() {
      try { return new ActiveXObject('Msxml3.XMLHTTP'); } catch (e0) {}
      try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch (e1) {}
      try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch (e2) {}
      try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch (e3) {}
      try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e4) {}
    };
  var xhr = new XHR();
  xhr.open('POST', window.configuredApiBaseUri + '/log', true);
  xhr.setRequestHeader('Content-type', 'application/json');
  if(window.developerName){
    xhr.setRequestHeader('Developer-Name', window.developerName);
  }
  xhr.send('{ level: "error", payload: { ' +
  '"message": "' + escape(message || '') + '",' +
  '"source": "' + escape(source || '') + '",' +
  '"url": "' + escape(window.location.href) + '",' +
  '"line": "' + (line || 0) + '",' +
  '"column": "' + (column || 0) + '"' +
  '}}');
};
