define(['byApplicationConfig'], function (byApplicationConfig) {
    function ErrorService($rootScope, $location) {
        function showError(errorObj){
            console.log(errorObj);
            var statusCode = '404';
            if(errorObj && errorObj.status){
                statusCode = errorObj.status.toString();
            }

            angular.forEach($location.search(), function (value, key) {
                $location.search(key, null);
            });

            switch (statusCode){
                default:
                    $location.path('/pageNotFound');
            }

        }

        return {
            showError : showError
        }

    }
    return ErrorService;
});
