define(['byProductApp'], function (byProductApp) {
    function SelectAddressController($scope,
                                     $log,
                                     $location,
                                     $rootScope,
                                     SelectAddressService,
                                     CartService,
                                     BreadcrumbService,
                                     PAGE_URL, SessionIdService) {

        $log.debug('Inside SelectAddress Controller');

        var breadCrumb;
        $scope.customerId = null;
        $scope.shipToAddressDisabled = false;
        if (localStorage.getItem("by_cust_id") && !localStorage.getItem("USER_ID") && !SessionIdService.getSessionId()) {
            $scope.customerId = localStorage.getItem("by_cust_id");
        }
        $scope.userProfile = null;
        $scope.editAddress = editAddress;
        $scope.shipToAddress = shipToAddress;
        $scope.shipToNewAddress = shipToNewAddress;
        breadCrumb = {'url': PAGE_URL.cart, 'displayName': 'CART'};
        BreadcrumbService.setBreadCrumb(breadCrumb, 'SHIPPING ADDRESS');
        //Todo:Show message if cart is empty,and user directly open this url

        /**
         * Retrieve the list of address
         */
        var getProfilePromise = SelectAddressService.getCustomerProfile();
        if(getProfilePromise){
            getProfilePromise.then(successCallBack, errorCallBack);
        }

        /**
         * Stored thelist of address in address object
         * @param  {object} result contains list of address
         * @return {void}
         */
        function successCallBack(result) {
            var userAddress = [];
            $scope.userProfile = result.data.data;
            var userBasicProfile = result.data.data.basicProfileInfo;
            userAddress.push(userBasicProfile.primaryUserAddress);
            if(userBasicProfile.otherAddresses.length > 0){
                userAddress = userAddress.concat(userBasicProfile.otherAddresses);
            }
            $scope.customerAddress = userAddress;

            if(!userBasicProfile.primaryEmail || !userBasicProfile.primaryPhoneNo){
                $scope.shipToAddressDisabled = true;
            }
        }

        function errorCallBack() {
            console.log('can\'t get the data');
        }

        /**
         * Redirect to edit address page for editing adress with given address id
         * @param  {integer} id id of address
         * @return {void}
         */
        function editAddress(id) {
            $location.path(PAGE_URL.editAddress + id);
        }

        /**
         * Redirect to payment gateway page
         * @param  {integer} id id of address
         * @return {void}
         */
        function shipToAddress(addressIndex) {
            var selectedAddress = $scope.customerAddress[addressIndex];
            if(!$scope.userProfile.basicProfileInfo.primaryEmail || !$scope.userProfile.basicProfileInfo.primaryPhoneNo){
                $scope.mandatoryFieldsError = "Please edit to add Email and Mobile number"
            }
            $location.path(PAGE_URL.paymentGateway + addressIndex);
        }

        /**
         * Redirect to add new address page
         * @return {void}
         */
        function shipToNewAddress() {
            $location.path(PAGE_URL.addAddress);
        }

        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });


    }

    

    SelectAddressController.$inject = ['$scope', '$log', '$location', '$rootScope',
        'SelectAddressService',
        'CartService',
        'BreadcrumbService',
        'PAGE_URL', 'SessionIdService'];


    byProductApp.registerController('SelectAddressController', SelectAddressController);
    return SelectAddressController;
});