define([], function () {

    function EditAddressFactory($http,
                                urlTemplate,
                                REST_URL,
                                CachedRequestHandler) {

        var addressService, urls;
        var updateAddressURL = REST_URL.editAddress + '/:addressId' +
            '?customerId=:customerId';
        urls = {
            forUpdateAddress: urlTemplate(updateAddressURL, {}, {type: 'put'})
        };

        /**
         * extend the blank object add CachedRequestHandler and method for
         * making request
         * @type {object}
         */
        addressService = angular.extend({},
            CachedRequestHandler,
            {
                modelName: 'editAddress',
                baseURL: urls.base,
                urls: urls
            },
            {
                updateAddress: updateAddress
            }
        );

        return addressService;

        /**
         * Make request for updating the address
         * @param  {object} params  paramater (contains: customer id)
         * @param  {object} putData data need to send in put request
         * @return {void}
         */
        function updateAddress(params, putData) {
            return this.$put(urls.forUpdateAddress(params), putData.address);
        }

    }

    return EditAddressFactory;
});