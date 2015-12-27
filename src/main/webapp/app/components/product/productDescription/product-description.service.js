define([], function () {

  function ProductDescFactory(REST_URL,
                              DelegatorService,
                              CachedRequestHandler,
                              urlTemplate,
                              CONSTANT,
                              $log) {

    var productDescriptionService, urls;
    var forProductSkuURL = REST_URL.getProductById + '/:id' + REST_URL.getProductSku;
    var forProductSkuInventoryURL = REST_URL.getProductSkuInventory + '?id=' + ':id';
    var forProductListByCategoryURL = REST_URL.getProductListByCategory + '/:id/' +
        CONSTANT.products;
    var updateProductQuantityURL = REST_URL.updateProductQuantity + '/:id' +
        '?customerId=:customerId' + '&quantity=:quantity';
    var forFedexRateWebServiceURL = REST_URL.fedexRateWebService;
    urls = {
      forId: urlTemplate(REST_URL.getProductById + '/:id'),
      forProductSku: urlTemplate(forProductSkuURL),
      forProductSkuInventory: urlTemplate(forProductSkuInventoryURL),
      forProductListByCategory: urlTemplate(forProductListByCategoryURL),
      updateProductQuantity: urlTemplate(updateProductQuantityURL, {}, {type: 'put'}),
      forFedexRateWebService: urlTemplate(forFedexRateWebServiceURL)
    };

    productDescriptionService = angular.extend(
        {},
        CachedRequestHandler,
        {
          modelName: 'product',
          baseURL: urls.base,
          urls: urls
        },
        {
          getProductDescription: getProductDescription,
          getProductListByCategory: getProductListByCategory,
          getProductSku: getProductSku,
          getProductSkuInventory: getProductSkuInventory,
          updateProductQuantity: updateProductQuantity,
          fedexRateWebService: fedexRateWebService
        }
    );

    return productDescriptionService;

    function getProductDescription(params) {
      return this.$get(urls.forId(params));
    }

    function getProductSku(params) {
      return this.$get(urls.forProductSku(params));
    }

    function getProductSkuInventory(params) {
      return this.$get(urls.forProductSkuInventory(params));
    }

    function getProductListByCategory(params) {
      return this.$get(urls.forProductListByCategory(params));
    }

    function updateProductQuantity(params) {
      return this.$put(urls.updateProductQuantity(params), params);
    }

    function fedexRateWebService() {
      return this.$get(urls.forFedexRateWebService());
    }
  }

  return ProductDescFactory;
});
