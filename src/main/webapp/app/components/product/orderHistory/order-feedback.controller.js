(function() {
  'use strict';
  angular.module('by')
  .controller('OrderFeedbackController', OrderFeedbackController);

  function OrderFeedbackController(
    $scope,
    $stateParams,
    $log,
    $location,
    BreadcrumbService,
    OrderHistoryService,
    ProductDescriptionService,
    Utility
    ) {

    $log.debug('Inside Order Feedback Controller');

    /**
     * TODO remove static customerId
     */
    var breadCrumb;
    BreadcrumbService.setBreadCrumb(breadCrumb, 'ORDER FEEDBACK');

    $scope.breadCrumb = breadCrumb;
    $scope.orderDetail = orderDetail();
    $scope.orderFeedback = orderFeedback;

    function orderDetail() {
      var params = {};
      if ($location.search().orderId) {
        params.orderId = $location.search().orderId;
      }
      OrderHistoryService.getOrderDetail(params).then(orderDetailSucess, failureCallBack);
      /*$http.get('app/order.json').then(orderDetailSucess, failureCallBack);*/
    }

    function orderFeedback() {
      angular.element('.hideMsg').hide();
      var params = {};
      if ($location.search().orderId) {
        params.id = $location.search().orderId;
      }
      params.feedback = $scope.feedback;
      OrderHistoryService.orderFeedback(params).then(orderFeedbackSucess,failureCallBack);
    }

    function orderDetailSucess(response) {
      var totalProductDeliveryCharges = 0;
      if (response.orderItems) {
        angular.forEach(response.orderItems, function(orderItem) {
          var params = {};
          params.id = orderItem.productId;
          $scope.promise = ProductDescriptionService.getProductDescription(params)
          .then(productDescriptionSuccess, failureCallBack);

          function productDescriptionSuccess(result) {
            orderItem.primaryMedia = result.primaryMedia;
            Utility.checkImages(orderItem);
            orderItem.productDeliveryCharges = result.productDeliveryCharges;
            totalProductDeliveryCharges += result.productDeliveryCharges;
            var floatValue =
             parseFloat(orderItem.orderItemPriceDetails[0].totalAdjustedPrice.amount);
            orderItem.orderItemPriceDetails[0].totalAdjustedPrice.amount = floatValue;
            totalProductDeliveryCharges = 0;
            angular.forEach(response.orderItems, function(item) {
              totalProductDeliveryCharges += item.productDeliveryCharges;
            });
            $scope.totalProductDeliveryCharges = totalProductDeliveryCharges;

            var subTotalAmount = 0;
            angular.forEach(response.orderItems, function(item) {
              subTotalAmount += item.orderItemPriceDetails[0].totalAdjustedPrice.amount;
            });
            $scope.subTotalAmount = subTotalAmount;
          }
        });
      }
      $scope.orderDetail = response;
      $log.info('Sucess to get order details' + response);
    }

    function orderFeedbackSucess(response) {
      angular.element('.hideSuccessMsg').show();
      $log.info('Sucess to get order feedback' + response);
    }

    function failureCallBack(response) {
      angular.element('.hideFailureMsg').show();
      $log.info('failed to get order feedback' + response);
    }
  }
})();
