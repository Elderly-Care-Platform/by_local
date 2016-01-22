define(['byProductApp', 'byProdEcomConfig'], function (byProductApp, byProdEcomConfig) {
    function orderHistoryCtrl($scope,
                              $routeParams,
                              $log,
                              $location,
                              $window,
                              BreadcrumbService,
                              OrderHistoryService,
                              ProductDescriptionService,
                              CartService,
                              SERVERURL_IMAGE,
                              STATIC_IMAGE,
                              DISCOUNT_TYPE,
                              ORDER_HISTORY_TYPE,
                              PAGINATION, LogisticService) {

        $log.debug('Inside OrderHistory Controller');

        /**
         * TODO remove static customerId
         */
        var breadCrumb, customerId = null;


        if (localStorage.getItem("by_cust_id")) {
            customerId = localStorage.getItem("by_cust_id")
        }

        $scope.orderHistoryType = ORDER_HISTORY_TYPE;
        $scope.getOrderHistory = getOrderHistory;
        $scope.discountType = DISCOUNT_TYPE;
        //breadCrumb = [{ 'url': '#', 'displayName': 'YOUR ACCOUNTS'}];
        BreadcrumbService.setBreadCrumb(breadCrumb, 'YOUR ORDERS');

        $scope.page = 0;
        $scope.pageSize = PAGINATION.pageSize;
        $scope.allOrderHistory = [];
        $scope.lastPage = false;
        $scope.isQueryInprogress = false;
        $scope.prodEcomConfig = BY.config.product.ecomTrackOrderConfig;
        /**
         * During controller initialiization get the orderHistory detail,
         * store in promise to show loading icon untill promise fullfilled
         * @type {object}
         */
        $scope.promise = getOrderHistory($scope.orderHistoryType.pastThirtyDays);
        $scope.loadMoreRecords = loadMoreRecords;

        $scope.cancelOrder = cancelOrder;
        $scope.resetValues = resetValues;
        /**
         * Initially set the filter type as all orderhistory detail
         * @type {object}
         */
        $scope.filterType = $scope.orderHistoryType.pastThirtyDays;
        $scope.printInvoice = printInvoice;

        function resetValues(timeInterval) {
            $scope.page = 0;
            $scope.allOrderHistory = [];
            $scope.lastPage = false;
            getOrderHistory(timeInterval);
        }

        /**
         * Retrieve orderHistory detail
         * @return {object} promise
         */
        function getOrderHistory(timeInterval) {
            $scope.isQueryInprogress = true;
            var params = {};
            params.customerId = customerId;
            $scope.page = $scope.page + 1;
            params.page = $scope.page;
            params.pageSize = $scope.pageSize;
            params.timeInterval = timeInterval.replace(/ /g, '');
            $scope.filterType = timeInterval;
            return OrderHistoryService.getOrderHistory(params).
                then(getOrderHistorySucess, failureCallBack);
        }

        function getOrderHistorySucess(result) {
            $scope.orderListLength = result.totalResult;
            var allOrderHistory = result.orders;
            $scope.allOrderHistory = $scope.allOrderHistory.concat(angular.copy(allOrderHistory));
            //angular.forEach($scope.allOrderHistory, function (order) {
            //    order.trackingInfo.deliveryDate = new Date(order.trackingInfo.deliveryDate);
            //});
            //setImageUrl($scope.allOrderHistory);
            $scope.orderHistory = angular.copy($scope.allOrderHistory);
            if (allOrderHistory.length === 0) {
                $scope.lastPage = true;
            }
            $scope.isQueryInprogress = false;
            setImageUrl($scope.orderHistory);

            trackLogistic();
        }

        function failureCallBack(response) {
            $log.info('failed to get order history' + response);
        }


        function trackLogistic(){
            var awbList = [];
            $scope.itemAwbMap = {};
            angular.forEach($scope.allOrderHistory, function (order) {
                angular.forEach(order.orderItems, function (orderItem) {
                    angular.forEach(orderItem.orderItemAttributes, function (orderItemAttr) {
                        if(orderItemAttr.name==="awbNumber"){
                            awbList.push(orderItemAttr.value);
                            orderItem.awbNumber = orderItemAttr.value;
                            $scope.itemAwbMap[orderItemAttr.value] = null;
                        }
                    });
                });
            });

            if(awbList.length > 0){
                var promise = LogisticService.trackOrderItem(awbList);
                if(promise){
                    promise.then(logisticSuccessRes, logisticErrorRes);
                }
            }

            function logisticSuccessRes(data){
                $scope.orderItemLogisticInfo = angular.forEach(data.data.object, function(data){
                    $scope.itemAwbMap[data.field[$scope.prodEcomConfig.awb_number].value] = data.field;
                })

                //console.log($scope.itemAwbMap);
            }

            function logisticErrorRes(data){
                console.log(data);
            }
        }
        /**
         * Iterate through each orderItem in each Order and
         * call addImageUrl method to add imageurl into each orderItem
         * @param {object} orders
         */
        function setImageUrl(orders) {
            for (var orderIndex = 0; orderIndex < orders.length; orderIndex = orderIndex + 1) {
                for (var orderItemIndex = 0; orderItemIndex < orders[orderIndex].orderItems.length;
                     orderItemIndex = orderItemIndex + 1) {
                    addImageUrl(orders[orderIndex].orderItems[orderItemIndex]);
                }
            }
        }

        /**
         * Insert the image url field in orderItem from the productDescription response got using
         * productId
         * If fail to load image then put static image
         * @param {object} orderItem Particular orderItem from the Order object
         */
        function addImageUrl(orderItem) {
            var params = {};
            params.id = orderItem.productId;
            ProductDescriptionService.getProductDescription(params).
                then(sucessCallBack, failureCallBack);

            function sucessCallBack(result) {
                var params = {};
                params.image = result.primaryMedia.url;
                orderItem.imageUrl = SERVERURL_IMAGE.hostUrl + result.primaryMedia.url;
//                CartService.loadImage(params).then(loadImageSuccess, loadImageFailure);
                function loadImageSuccess() {
                    //$log.debug('success in getting image');
                    orderItem.imageUrl = SERVERURL_IMAGE.hostUrl + result.primaryMedia.url;
                }

                function loadImageFailure() {
                    $log.debug('failure in getting image');
                    orderItem.imageUrl = STATIC_IMAGE.imageNotAvailable;
                }
            }
        }

        /**
         * Update the crat/itemCount
         * @param  {object} event
         * @param  {object} args)                  $scope.cartItemCount number of items
         * @return {void}
         */
        $scope.$on('getCartItemCount', function (event, args) {
            $scope.cartItemCount = args;
        });

        function loadMoreRecords() {
            $log.debug('Load more results');
            $scope.lazyPromise = getOrderHistory($scope.filterType);
        }

        function cancelOrder(trackingNumber, orderId) {
            console.log('Inside Cancel Order' + trackingNumber + ' orderId' + orderId);
            var params = {};
            params.trackingNumber = trackingNumber;
            params.orderId = orderId;
            $scope.promise = OrderHistoryService.cancelOrder(params)
                .then(cancelOrderSuccess, cancelOrderFailure);
        }

        function cancelOrderSuccess(result) {
            console.log('cancelOrderSuccess');
            if (result.cancelPendingShipmentServiceSeverity === 'SUCCESS') {
                $scope.cancelOrderStatus = 'SEVERITY_SUCCESS';
            } else {
                $scope.cancelOrderStatus = 'SEVERITY_FAILURE';
            }
            $window.location.reload();
        }

        function cancelOrderFailure(result) {
            console.log('cancelOrderFailure' + result);
            $scope.cancelOrderStatus = 'cancelOrderFailure';
        }

        function printInvoice(id){
            OrderHistoryService.getOrderSummary(id);

            function getOrderSummarySucess(res){
                console.log(res);
            }

            function getOrderSummaryFailed(err){

            }
        }


    }

    orderHistoryCtrl.$inject = ['$scope',
        '$routeParams',
        '$log',
        '$location',
        '$window',
        'BreadcrumbService',
        'OrderHistoryService',
        'ProductDescriptionService',
        'CartService',
        'SERVERURL_IMAGE',
        'STATIC_IMAGE',
        'DISCOUNT_TYPE',
        'ORDER_HISTORY_TYPE',
        'PAGINATION', 'LogisticService'];

    byProductApp.registerController('orderHistoryCtrl', orderHistoryCtrl);
    return orderHistoryCtrl;
});

