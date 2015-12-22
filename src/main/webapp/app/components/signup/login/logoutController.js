define(['byApp', 'userValidation'], function(byApp, userValidation) {
    function LogoutController(UserValidationFilter) {
        UserValidationFilter.logoutUser();
    }

    LogoutController.$inject = ['UserValidationFilter'];
    byApp.registerController('LogoutController', LogoutController);

    return LogoutController;
});
