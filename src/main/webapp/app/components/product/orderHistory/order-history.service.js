define(["byProductResources"], function (byProductResources) {
  /* @ngInject */
  function OrderHistoryFactory(urlTemplate,
                               REST_URL,
                               SERVERURL,
                               CachedRequestHandler) {

    var orderHistoryService, urls;

    urls = {
      forOrderDetail: urlTemplate(REST_URL.getOrder + '/:orderId'),
      forAddress: urlTemplate(REST_URL.getOrder + '?customerId=:customerId'),
      forCancelOrder: urlTemplate(REST_URL.getOrder + '/:orderId'),
      orderFeedback: urlTemplate(REST_URL.orderFeedback + '/:id')
    };

    orderHistoryService = angular.extend(
        {},
        CachedRequestHandler,
        {
          modelName: 'orderHistory',
          baseURL:   urls.base,
          urls:      urls
        },
        {
          getOrderDetail: getOrderDetail,
          getOrderHistory: getOrderHistory,
          cancelOrder: cancelOrder,
          orderFeedback: orderFeedback
        }
    );

    return orderHistoryService;

    function getOrderDetail(params) {
      return this.$get(urls.forOrderDetail(params));
    }

    function getOrderHistory(params) {
      return this.$get(urls.forAddress(params));
    }

    function cancelOrder(params) {
      return this.$remove(urls.forCancelOrder(params));
    }

    function orderFeedback(params) {
      return this.$post(urls.orderFeedback(params.id), params);
    }

    

  }

  //byProductResources.factory('OrderHistoryService', OrderHistoryFactory);
  return OrderHistoryFactory;
});

