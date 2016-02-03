define([], function () {

    function PaymentGatewayFactory($http) {
        return {
            getAddress: getAddress
        };
        function getAddress() {
            return $http.get(apiPrefix + 'assets/dummy/dummyjson.json');
        }

        // var addressService, urls;

        // urls = {
        //   forAddress: urlTemplate(REST_URL.getAddress)
        // };

        // addressService = angular.extend(
        //   {},
        //   CachedRequestHandler,
        //   {
        //     //Todo:Define modelname for selectAdress in appropriate
        //     modelName: 'selectAddress',
        //     baseURL:   urls.base,
        //     urls:      urls
        //   },
        //   {
        //     getAddress: getAddress
        //   }
        // );

        // return addressService;

        // function getAddress(params) {
        //   return this.$get(urls.forAddress(params));
        // }
    }

    return PaymentGatewayFactory;
});