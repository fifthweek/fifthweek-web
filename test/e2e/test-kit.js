'use strict';

var _ = require('lodash');
var TestKit = function() {};

TestKit.prototype = Object.create({}, {
  punctuation33: { value: '!@£$%^&*()_+-={}[]:"|;\'\\`,./<>?±§'},
  assertSingleValidationMessage: { value: function(helpMessages, message) {
    expect(helpMessages.count()).toBe(1);
    expect(helpMessages.get(0).getText()).toContain(message);
  }},
  assertRequired: { value: function(helpMessages, field) {
    this.assertSingleValidationMessage(helpMessages, 'A ' + field + ' is required.');
  }},
  assertMinLength: { value: function(helpMessages, length) {
    this.assertSingleValidationMessage(helpMessages, 'Must be at least ' + length + ' characters.');
  }},
  assertMaxLength: { value: function(helpMessages, textBoxId, overSizedValue, length) {
    // Some browsers don't honor maxlength attribute with protractor's sendKeys
    // so we also check the ng-maxlength error as a backup.
    helpMessages.count().then(function(count){
      if (count) {
        expect(count).toBe(1);
        expect(helpMessages.get(0).getText()).toContain('Allowed ' + length + ' characters at most.')
      }
      else{
        expect(element(by.id(textBoxId)).getAttribute('value')).toBe(overSizedValue.substring(0, length));
      }
    });
  }},
  rebaseLinkAndClick: { value: function(linkElement) {
    return linkElement.getAttribute('href').then(function(href) {
      var pathArray = href.split( '/' );
      var protocol = pathArray[0];
      var host = pathArray[2];
      var baseUrl = protocol + '//' + host;
      var path = href.substring(baseUrl.length);

      browser.waitForAngular(); // Not automatically awaited on get.
      return browser.get(path).then(function() {
        return path;
      });
    });
  }},
  clearForm: { value: function(page, inputs) {
    var self = this;
    _.forEach(inputs, function(input) {
      var inputName = input.name;
      if (_.endsWith(inputName, 'TextBox')) {
        self.clear(page[inputName + 'Id']);
      }
    });
  }},
  setFormValues: { value: function(page, inputsNeedingValues, values) {
    var self = this;
    var newValues = {};

    var validatePageObject = function(key) {
      if (page[key] === undefined) {
        throw 'The given property "' + key + '" does not exist in the page object';
      }
    };

    if (values) {
      _.forOwn(values, function(value, inputName) {
        newValues[inputName] = value;
      });
    }

    if (inputsNeedingValues) {
      _.forEach(inputsNeedingValues, function(input) {
        var inputName = input.name;
        if (newValues[inputName] === undefined) {
          newValues[inputName] = input.newValue();
        }
      });
    }

    _.forOwn(newValues, function(newValue, inputName) {
      if (_.endsWith(inputName, 'TextBox')) {
        validatePageObject(inputName + 'Id');
        self.setValue(page[inputName + 'Id'], newValue);
      }
      else if (_.endsWith(inputName, 'Checkbox')) {
        validatePageObject(inputName);
        page[inputName].isSelected().then(function(currentValue) {
          if (currentValue != newValue) {
            page[inputName].click();
          }
        });
      }
      else if (_.endsWith(inputName, 'Select')) {
        validatePageObject(inputName + 'Id');

        element
          .all(by.css('#' + page[inputName + 'Id'] + ' option'))
          .filter(function(option) {
            return option.getText().then(function(text) {
              return text === newValue;
            });
          })
          .first()
          .click();
      }
      else {
        throw 'Unknown inputName type: ' + inputName;
      }
    });

    return newValues;
  }},
  getEmptyFormValues: { value: function(inputs) {
    return _.reduce(inputs, function(formValues, input) {
      formValues[input.name] = '';
      return formValues;
    }, {});
  }},
  expectFormValues: { value: function(page, values) {
    if (!values) {
      throw 'Must provide form values';
    }

    _.forOwn(values, function(value, inputName) {
      if (_.endsWith(inputName, 'TextBox')) {
        expect(element(by.id(page[inputName + 'Id'])).getAttribute('value')).toBe(value);
      }
      else if (_.endsWith(inputName, 'Checkbox')) {
        expect(page[inputName].isSelected()).toBe(value);
      }
      else if (_.endsWith(inputName, 'Select')) {
        expect(element(by.css('#' + page[inputName + 'Id'] + ' option:checked')).getText()).toBe(value);
      }
      else {
        throw 'Unknown inputName type: ' + inputName;
      }
    });
  }},
  makeSelectDirty: { value: function(page, inputName) {
    var selectId = '#' + page[inputName + 'Id'];
    var options = element.all(by.css(selectId + ' option'));
    options.count().then(function(optionCount) {
      if (optionCount === 1) {
        throw 'Cannot change ' + inputName + ' to make form dirty as there is only 1 value to select from';
      }

      var selectedOption = element(by.css(selectId + ' option:checked'));
      selectedOption.getText().then(function(selectedValue) {
        var firstOption = element(by.css(selectId + ' option:nth-child(1)'));
        firstOption.getText().then(function(firstValue) {
          if (selectedValue !== firstValue) {
            firstOption.click();
          }
          else {
            var secondOption = element(by.css(selectId + ' option:nth-child(2)'));
            secondOption.click();
          }
        });
      });
    });
  }},
  itShouldHaveSubmitButtonDisabledUntilDirty: { value: function(page, inputs, button) {
    var self = this;

    it('should be disabled until changes are made', function(){
      expect(button.isEnabled()).toBe(false);
    });

    _.forEach(inputs, function(input) {
      var inputName = input.name;
      it('should become enabled after changing "' + inputName + '"', function(){
        if (_.endsWith(inputName, 'TextBox')) {
          self.clear(page[inputName + 'Id']);
        }
        else if (_.endsWith(inputName, 'Checkbox')) {
          page[inputName].click();
        }
        else if (_.endsWith(inputName, 'Select')) {
          self.makeSelectDirty(page, inputName);
        }
        else {
          throw 'Unknown inputName type: ' + inputName;
        }

        expect(button.isEnabled()).toBe(true);
      });
    });
  }},
  includeHappyPaths: { value: function(page, inputPage, inputName, inputsNeedingValues, saveNewValues) {
    var self = this;

    describe('for "' + inputName + '"', function() {

      inputPage.includeHappyPaths(function (newValue, newValueNormalized) {
        var valuesToTest = {};
        valuesToTest[inputName] = newValue;

        var inputsNeedingValuesResolved = _.isFunction(inputsNeedingValues) ? inputsNeedingValues() : inputsNeedingValues;

        var newFormValues = self.setFormValues(page, inputsNeedingValuesResolved, valuesToTest);

        if (newValueNormalized) {
          // Input page object has stated that the persisted value is expected to be different from the one entered.
          newFormValues[inputName] = newValueNormalized;
        }

        if (_.isFunction(saveNewValues)) {
          saveNewValues(newFormValues)
        }
      });
    });
  }},
  includeSadPaths: { value: function(page, button, helpMessages, inputPage, inputName, inputsNeedingValues, isOptional) {
    var self = this;

    describe('for "' + inputName + '"', function() {

      if (inputsNeedingValues) {
        var inputsNeedingValuesResolved = _.isFunction(inputsNeedingValues) ? inputsNeedingValues() : inputsNeedingValues;

        var inputsExcludingOneUnderTest = _.reject(inputsNeedingValuesResolved, { name: inputName });
        if (inputsExcludingOneUnderTest.length > 0) {

          beforeEach(function() {
            self.setFormValues(page, inputsExcludingOneUnderTest);
          });

        }
      }

      inputPage.includeSadPaths(page[inputName + 'Id'], button, helpMessages, isOptional);
    });
  }},
  clear: { value: function(elementId) {
    browser.executeScript('angular.element(document.getElementById(\'' + elementId + '\')).val(\'\').trigger(\'change\');');
  }},
  setValue: { value: function(elementId, value, blur) {

    // One of the aspects that makes this method efficient is we do not await for angular before setting each input. If
    // we did by enabling the following line, we would see waits between each input (similar to sendKeys, although still
    // slightly faster). Therefore, we must intelligently use browser.waitForAngular when it is actually needed - i.e.
    // after loading another page.
    // browser.waitForAngular();

    value = value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'').replace(/\n/g, '\\n');

    var changeValue = 'angular.element(document.getElementById(\'' + elementId + '\')).val(\'' + value + '\').trigger(\'change\')';
    browser.controlFlow().execute(function() {
      // console.log('SET ' + elementId + ' = ' + value);
      browser.executeScript(blur ? changeValue + '.blur()' : changeValue);
    });
  }}
});

module.exports = TestKit;
