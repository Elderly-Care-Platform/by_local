define([], function () {
    function AddAddressFactory($http,
                               REST_URL,
                               urlTemplate,
                               SERVERURL,
                               CachedRequestHandler) {

        var addressService, urls;
        var addAddressURL = REST_URL.addAddress + '?customerId=:customerId';
        urls = {
            forAddAddress: urlTemplate(addAddressURL),
            getAddress: urlTemplate(REST_URL.getAddressById + SERVERURL.forwardslash +
                ':addressId')
        };

        addressService = angular.extend({},
            CachedRequestHandler,
            {
                //Todo:Define modelname for selectAdress in appropriate
                modelName: 'addAddress',
                baseURL: urls.base,
                urls: urls
            },
            {
                addAddress: addAddress,
                getAddress: getAddress
            }
        );

        return addressService;

        /**
         * post the request for adding address
         * @param {object} params   parameter to pass
         * @param {object} postdata data need to post
         */
        function addAddress(params, postdata) {
            return this.$post(urls.forAddAddress(params), postdata.address);
        }

        function getAddress(params) {
            return this.$get(urls.getAddress(params));
        }

    }

    return AddAddressFactory;
});
