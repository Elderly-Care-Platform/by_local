// To disallow user from entering space at start in textbox
define([], function () {
    function CustomValidationFactory() {
        return {
            require: 'ngModel',
            link: function(scope, element, attrs, modelCtrl) {

                modelCtrl.$parsers.push(function(inputValue) {

                    var transformedInput = inputValue.replace(/^ /, '');

                    if (transformedInput !== inputValue) {
                        modelCtrl.$setViewValue(transformedInput);
                        modelCtrl.$render();
                    }
                    return transformedInput;
                });
            }
        };
    }

    return CustomValidationFactory;
});