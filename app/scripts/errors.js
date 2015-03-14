'use strict';

// http://massalabs.com/dev/2013/10/17/handling-errors-in-nodejs.html
var config = {
  configurable: true,
  value: function() {
    var alt = {};
    var storeKey = function(key) {
      alt[key] = this[key];
    };
    Object.getOwnPropertyNames(this).forEach(storeKey, this);
    return alt;
  }
};
Object.defineProperty(Error.prototype, 'toJSON', config);

// Used for web application errors containing information that the user
// isn't concerned with.
function FifthweekError(message) {
  this.message = message;
  this.stack = Error().stack;
}
FifthweekError.prototype = Object.create(Error.prototype);
FifthweekError.prototype.constructor = FifthweekError;

// Used for when the web application fails to connect to another service.
function ConnectionError(message) {
  this.message = message;
  this.stack = Error().stack;
}
ConnectionError.prototype = Object.create(Error.prototype);
ConnectionError.prototype.constructor = ConnectionError;

// Used to wrap any errors resulting from interactions with Azure services.
function AzureError(message, response) {
  this.message = message;
  this.response = response;
  this.stack = Error().stack;
}
AzureError.prototype = Object.create(Error.prototype);
AzureError.prototype.constructor = AzureError;

// An error which contains information that can be displayed to the user.
function DisplayableError(displayMessage, detailedMessage) {
  this.message = displayMessage;
  this.detailedMessage = detailedMessage;
  this.stack = Error().stack;
}
DisplayableError.prototype = Object.create(Error.prototype);
DisplayableError.prototype.constructor = DisplayableError;

  // Derives from DisplayableError. Used if there is a problem validating user input.
  // These are not logged back to the API.
  function InputValidationError(message) {
    this.message = message;
    this.stack = Error().stack;
  }
  InputValidationError.prototype = Object.create(DisplayableError.prototype);
  InputValidationError.prototype.constructor = InputValidationError;

  // Derives from DisplayableError.  Used for errors resulting from interactions
  // with the Fifthweek API.
  // These are not logged back to the API.
  function ApiError(message, response) {
    this.message = message;
    this.response = response;
    this.stack = Error().stack;
  }
  ApiError.prototype = Object.create(DisplayableError.prototype);
  ApiError.prototype.constructor = ApiError;

    // Derives from ApiError. Used specifically for when the a request was denied
    // because the user was unauthenticated.
    function UnauthenticatedError(message) {
      this.message = message;
      this.stack = Error().stack;
    }
    UnauthenticatedError.prototype = Object.create(ApiError.prototype);
    UnauthenticatedError.prototype.constructor = UnauthenticatedError;

    // Derives from ApiError. Used specifically for when the a request was denied
    // because the user was unauthorized for the request.
    function UnauthorizedError(message) {
      this.message = message;
      this.stack = Error().stack;
    }
    UnauthorizedError.prototype = Object.create(ApiError.prototype);
    UnauthorizedError.prototype.constructor = UnauthorizedError;

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
