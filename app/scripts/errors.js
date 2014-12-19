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


// http://www.mikeobrien.net/blog/client-side-exception-logging-and-notification-in-angular/
window.onerror = function(message, source, line, column) {
  //try {
    var escape = function(x) { return x.replace('\\', '\\\\').replace('\"', '\\"'); };
    var XHR = window.XMLHttpRequest || function() {
        try { return new ActiveXObject("Msxml3.XMLHTTP"); } catch (e0) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
        try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
        try { return new ActiveXObject("Microsoft.XMLHTTP"); } catch (e4) {}
      };
    var xhr = new XHR();
    xhr.open('POST', window.configuredApiBaseUri + '/log', true);
    xhr.setRequestHeader('Content-type', 'application/json');
    xhr.send('{ level: "error", payload: { ' +
    '"message": "' + escape(message || '') + '",' +
    '"source": "' + escape(source || '') + '",' +
    '"url": "' + escape(window.location.href) + '",' +
    '"line": "' + (line || 0) + '",' +
    '"column": "' + (column || 0) + '"' +
    '}}');
  //}
  //finally {
  //  window.onload = function() {
  //    if (document.getElementById('page-error')) return; // The error is already displayed
  //    var errorMessage = document.createElement('div');
  //    errorMessage.setAttribute('id', 'page-error');
  //    errorMessage.innerHTML = 'An error has occured and the details have been logged. ' +
  //    'Please contact customer support for assistance.';
  //    document.body.appendChild(errorMessage);
  //  }
  //}
};
