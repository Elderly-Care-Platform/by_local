define(['byProductApp'], function (byProductApp) {
    function AddAddressController($scope,
                                  $location,
                                  $log,
                                  AddAddressService,
                                  ADDRESS_FIELDS,
                                  BreadcrumbService,
                                  PAGE_URL) {

        $log.debug('Inside AddAddress Controller');
        var breadCrumb;
        $scope.address = {};
        $scope.ADDRESS_FIELDS = ADDRESS_FIELDS;
        $scope.secondaryMobile = false;
        $scope.secondaryEmail = false;
        $scope.toggleMobileField = toggleMobileField;
        $scope.shipToAddress = shipToAddress;
        $scope.customerId = 700;
        $scope.addAddress = addAddress;

        /**
         * Make request for adding shipping address
         */
        function shipToAddress() {
            breadCrumb = {'url': PAGE_URL.cart, 'displayName': 'CART'};
            BreadcrumbService.setBreadCrumb(breadCrumb, 'SHIPPING ADDRESS');
            addAddress();
        }

        /**
         * Make request for adding address and redirect as per response
         */
        function addAddress() {
            var params = {}, postdata = {};
            params.customerId = $scope.customerId;
            postdata.address = angular.copy($scope.address);
            //Todo Delete following line
            postdata.address.country = {};
            postdata.address.country.name = 'United States';
            postdata.address.country.abbreviation = 'US';
            //End
            AddAddressService.addAddress(params, postdata).then(addAddressSuccess, addAddressError);

            function addAddressSuccess(result) {
                $location.path(PAGE_URL.paymentGateway + result.id);
            }

            function addAddressError(errorCode) {
                $log.info(errorCode);
            }
        }

        /**
         * Toggle the extra mobile and email field
         * @param  {string} field type of ADDRESS_FIELDS
         * @param  {boolean} value toggle value
         * @return {void}
         */
        function toggleMobileField(field, value) {
            switch (field) {
                case $scope.ADDRESS_FIELDS.phoneNumber:
                    if (value) {
                        $scope.secondaryMobile = false;
                    } else {
                        $scope.secondaryMobile = true;
                    }
                    break;
                case $scope.ADDRESS_FIELDS.emailId:
                    if (value) {
                        $scope.secondaryEmail = false;
                    } else {
                        $scope.secondaryEmail = true;
                    }
                    break;
            }
        }

        /**
         * Get the total number of items added in cart
         * @param  {object} event event
         * @param  {object} args) {                 $scope.cartItemCount number of items
         * @return {void}
         */
        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });


    }

    AddAddressController.$inject = ['$scope',
        '$location',
        '$log',
        'AddAddressService',
        'ADDRESS_FIELDS',
        'BreadcrumbService',
        'PAGE_URL'];
    byProductApp.registerController('AddAddressController', AddAddressController);
    return AddAddressController;
});