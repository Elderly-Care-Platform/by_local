define(['byProductApp', 'byProdEcomConfig'], function (byProductApp, byProdEcomConfig) {
    function SelectAddressController($scope,
                                     $log,
                                     $location,
                                     $rootScope,
                                     SelectAddressService,
                                     CartService,
                                     BreadcrumbService,
                                     PAGE_URL, SessionIdService, LogisticService, SharedContextService) {

        $log.debug('Inside SelectAddress Controller');

        var breadCrumb;
        $scope.customerId = null;
        $scope.shipToAddressDisabled = false;
        $scope.userProfile = null;
        $scope.selectedAddress = null;
        $scope.editAddress = editAddress;
        $scope.shipToAddress = shipToAddress;
        $scope.shipToNewAddress = shipToNewAddress;
        $scope.pickupFromAddress = pickupFromAddress;
        $scope.pickupDetails = {};

        if (localStorage.getItem("by_cust_id") && !localStorage.getItem("USER_ID") && !SessionIdService.getSessionId()) {
            $scope.customerId = localStorage.getItem("by_cust_id");
        }

        var init = initialize();

        function initialize() {
            /**
             * Retrieve the list of address
             */
            $("#preloader").show();
            var getAddressPromise = SelectAddressService.getAddress();
            if (getAddressPromise) {
                getAddressPromise.then(successCallBack, errorCallBack);
            }

            /**
             * Store the list of address in address object
             * @param  {object} result contains list of address
             * @return {void}
             */
            function successCallBack(result) {
                $scope.customerAddress = result.data.data;
                var pickupDetails = SharedContextService.getPickupAddress();
                if(pickupDetails){
                    $scope.pickupDetails = pickupDetails;
                }
                $scope.pickupPoints = BY.config.product.pickupPoints;
                $("#preloader").hide();
            }

            function errorCallBack() {
                $("#preloader").hide();
                console.log('can\'t get the data');
                var pickupDetails = SharedContextService.getPickupAddress();
                if(pickupDetails){
                    $scope.pickupDetails = pickupDetails;
                }
                $scope.pickupPoints = BY.config.product.pickupPoints;
            }
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
            $scope.selectedAddress = $scope.customerAddress[addressIndex];
            SharedContextService.setDeliverMode(BY.config.product.deliveryMode.PICKUP);

            var pinCode = $scope.selectedAddress.address.zip;
            if (pinCode) {
                checkLogisticAvailability(pinCode);
            } else {
                $scope.selectedAddress.shipToAddressDisabled = true;
            }

        }

        function checkLogisticAvailability(pincode) {
            var checkLogistic = LogisticService.checkLogisticAvailability(pincode);
            if (checkLogistic) {
                checkLogistic.then(logisticSuccessRes, logisticErrorRes);
            }

            function logisticSuccessRes(data) {
                console.log("Logistic Available");
                if (data.data === "" || data.status === 240) {
                    console.log("Logistic Unavailable");
                    $scope.selectedAddress.logisticError = true;
                } else {
                    console.log("Logistic Available");
                    $location.path(PAGE_URL.paymentGateway + $scope.selectedAddress.id);
                }

            }

            function logisticErrorRes(data) {
                console.log("Logistic Unavailable");
                $scope.selectedAddress.logisticError = true;
            }
        }

        /**
         * Redirect to add new address page
         * @return {void}
         */
        function shipToNewAddress() {
            $location.path(PAGE_URL.addAddress);
        }

        function pickupFromAddress(addressIdx, pickupAddressForm){
            $scope.submitted = true;
            if(pickupAddressForm.$valid){
                //$scope.selectedAddress = {};
                $scope.pickupDetails.id = BY.config.product.pickupPoints[addressIdx].id;
                $scope.pickupDetails.address = BY.config.product.pickupPoints[addressIdx].address;

                SharedContextService.setPickupAddress($scope.pickupDetails);
                $location.path(PAGE_URL.paymentGateway + $scope.pickupDetails.id);
            }

        }

        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });

        $scope.leftPanelHeight = function () {
            var clientHeight = $(window).height() - 57;
            $(".by_menuDetailed").css('height', clientHeight + "px");
        }

        $scope.subMenuTabMobileShow = function () {
            $(".by_mobile_leftPanel_image").click(function () {
                if ($(".by_mobile_leftPanel_hide").css('left') == '0px') {
                    $(".by_mobile_leftPanel_image").animate({left: "0%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburgerG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "-90%"}, {duration: 400});
                } else {
                    $(".by_mobile_leftPanel_image").animate({left: "90%"}, {duration: 400});
                    $(".by_mobile_leftPanel_image").css('background', "url('assets/img/community/mobile/humburger-minG.png?versionTimeStamp=%PROJECT_VERSION%')");
                    $(".by_mobile_leftPanel_hide").animate({left: "0%"}, {duration: 400});
                }
            });
        };

    }

    SelectAddressController.$inject = ['$scope', '$log', '$location', '$rootScope',
        'SelectAddressService',
        'CartService',
        'BreadcrumbService',
        'PAGE_URL', 'SessionIdService', 'LogisticService', 'SharedContextService'];


    byProductApp.registerController('SelectAddressController', SelectAddressController);
    return SelectAddressController;
});