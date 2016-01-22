define(["byProductResources"], function (byProductResources) {
    function OrderHistoryFactory(urlTemplate,
                                 REST_URL,
                                 SERVERURL,
                                 CachedRequestHandler, $http, APPLICATION) {

        var orderHistoryService, urls;

        urls = {
            forOrderDetail: urlTemplate(REST_URL.getOrder + '/:orderId'),
            forAddress: urlTemplate(REST_URL.getOrder + '?customerId=:customerId'),
            forCancelOrder: urlTemplate(REST_URL.getOrder + '/:orderId'),
            orderFeedback: urlTemplate(REST_URL.orderFeedback + '/:id'),
            orderSummary: urlTemplate(REST_URL.orderSummary + '/:id')
        };

        orderHistoryService = angular.extend(
            {},
            CachedRequestHandler,
            {
                modelName: 'orderHistory',
                baseURL: urls.base,
                urls: urls
            },
            {
                getOrderDetail: getOrderDetail,
                getOrderHistory: getOrderHistory,
                cancelOrder: cancelOrder,
                orderFeedback: orderFeedback,
                getOrderSummary: getOrderSummary
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

        function getOrderSummary(id) {
            $.get(APPLICATION.host+"/cart/checkout/getOrderSummary/"+id, function (data) {
                var w = window.open('about:blank', 'windowname');
                w.document.write(data);
                w.document.close();
            });

        }

    }

    //byProductResources.factory('OrderHistoryService', OrderHistoryFactory);
    return OrderHistoryFactory;
});

