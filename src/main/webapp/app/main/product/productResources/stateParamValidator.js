define([], function () {

  function StateParamsValidator() {

    return {
      isStateParamValid: isStateParamValid
    };

    function isStateParamValid(param) {
      if (angular.isUndefined(param) || '' === param || isNaN(param)) {
        return false;
      } else {
        return true;
      }
    }
  }
  return StateParamsValidator;
});
