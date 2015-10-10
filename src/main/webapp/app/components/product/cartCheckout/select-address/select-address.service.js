define([], function () {

    /* @ngInject */
    function SelectAddressFactory($http,
                                  CachedRequestHandler,
                                  REST_URL,
                                  urlTemplate) {

        var addressService, urls;
        urls = {forAddress: urlTemplate(REST_URL.getAddress + '/:id')};

        addressService = angular.extend(
            {},
            CachedRequestHandler,
            {
                //Todo:Define modelname for selectAdress in appropriate
                modelName: 'selectAddress',
                baseURL: urls.base,
                urls: urls
            },
            {
                getAddress: getAddress
            }
        );

        return addressService;

        function getAddress(params) {
            return this.$get(urls.forAddress(params));
        }

    }

    return SelectAddressFactory;
});