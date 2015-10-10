define(['byProductApp'], function (byProductApp) {
    function EditAddressController($scope,
                                   $routeParams,
                                   $log,
                                   $location,
                                   SelectAddressService,
                                   EditAddressService,
                                   BreadcrumbService,
                                   StateParamsValidator,
                                   AddAddressService,
                                   PAGE_URL) {

        $log.debug('Inside SelectAddress Controller');
        var breadCrumb;
        $scope.customerId = 700;
        $scope.getFilterAddress = getFilterAddress;
        $scope.address = {};
        $scope.shipToAddress = shipToAddress;
        $scope.errorMessage = '';
        $scope.showError = showError;
        $scope.updateAddress = updateAddress;

        breadCrumb = {'url': PAGE_URL.cart, 'displayName': 'CART'};
        BreadcrumbService.setBreadCrumb(breadCrumb, 'SHIPPING ADDRESS');
        $scope.addressId = $routeParams.id;

        /**
         *Retrieve the list of address
         */
        SelectAddressService.getAddress($scope.customerId).then(successCallBack, errorCallBack);

        function showError(ngModelController, error) {
            return ngModelController.$error[error];
        }

        /**
         * Get the requested address and store it in addess object
         * @param  {object} result list of addresses
         * @return {void}
         */
        function successCallBack(result) {
            $scope.address = getFilterAddress(result);
        }

        function errorCallBack() {
            console.log('can\'t get the data');
        }

        /**
         * Find the correct address
         * @param  {object} addresses list of address
         * @return {void}
         */
        function getFilterAddress(addresses) {
            for (var index = 0; index < addresses.length; index = index + 1) {
                if (addresses[index].address.id === parseInt($scope.addressId)) {
                    return addresses[index];
                }
            }
            return {};
        }

        /**
         * If address id passed make request for editing this adress
         * else if address id not passed make request for adding new address
         * and redirect to  payment gateway
         * @return {void}
         */
        function shipToAddress() {
            if (StateParamsValidator.isStateParamValid($scope.addressId)) {
                updateAddress();
            } else {
                // If no address id passed in query parameter,
                // add new address and ship to this address
                addAddress();
            }
        }

        /**
         * Updated the address of id passed
         * @return {void}
         */
        function updateAddress() {
            var params = {}, putData = {};
            params.addressId = $scope.addressId;
            params.customerId = $scope.customerId;
            // Todo remove following line
            putData.address = angular.copy($scope.address.address);
            // delete params.address.primaryEmail;
            EditAddressService.updateAddress(params, putData).
                then(addressUpdateSuccess, addressUpdateError);

            function addressUpdateSuccess(result) {
                $location.path(PAGE_URL.paymentGateway + result.id);
            }

            function addressUpdateError(errorCode) {
                $log.info(errorCode);
            }
        }

        /**
         * Add new address and redirect to payment gateway on sucess
         */
        function addAddress() {
            var params = {}, postData = {};
            params.customerId = $scope.customerId;
            postData = angular.copy($scope.address);
            postData.address.country = {};
            postData.address.country.name = 'United States';
            postData.address.country.abbreviation = 'US';
            AddAddressService.addAddress(params, postData)
                .then(addAddressSuccess, addAddressError);

            function addAddressSuccess(result) {
                $location.path(PAGE_URL.paymentGateway + result.id);
            }

            function addAddressError(errorCode) {
                $log.info(errorCode);
            }
        }

        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });


    }

    EditAddressController.$inject = ['$scope',
        '$routeParams',
        '$log',
        '$location',
        'SelectAddressService',
        'EditAddressService',
        'BreadcrumbService',
        'StateParamsValidator',
        'AddAddressService',
        'PAGE_URL'];

    byProductApp.registerController('EditAddressController', EditAddressController);
    return EditAddressController;
});
