define([], function () {

    function ProductServiceFactory(REST_URL, CachedRequestHandler, urlTemplate,
              CONSTANT) {

        var productService, urls;

        urls = {
            forAllProducts: urlTemplate(REST_URL.getProductList),
            forProductsByCategory: urlTemplate(REST_URL.getProductListByCategory + '/:id/' +
                CONSTANT.products),
            forFeaturedProducts: urlTemplate(REST_URL.getFeaturedProductList),
            forSearch: urlTemplate(REST_URL.search + '?q=":query"')
        };

        productService = angular.extend(
            {},
            CachedRequestHandler,
            {
                modelName: 'product',
                baseURL:   urls.base,
                urls:      urls
            },
            {
                getProducts: getProducts,
                getProductsByCategory: getProductsByCategory,
                getFeaturedProducts: getFeaturedProducts,
                getSearchedProduct: getSearchedProduct
            }
        );

        return productService;

        function getProducts(params) {
            return this.$get(urls.forAllProducts(params));
        }

        function getProductsByCategory(params) {
            return this.$get(urls.forProductsByCategory(params));
        }

        function getFeaturedProducts(params) {
            return this.$get(urls.forFeaturedProducts(params));
        }

        function getSearchedProduct(params) {
            return this.$get(urls.forSearch(params));
        }
    }

    return ProductServiceFactory;
});