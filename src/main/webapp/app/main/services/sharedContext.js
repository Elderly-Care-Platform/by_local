define(['byProdEcomConfig'], function (byProdEcomConfig) {
    function SharedContext() {
        var pickupAddress, productDeliveryMode = BY.config.product.deliveryMode.DELIVER;

        function setPickupAddress(address){
            pickupAddress = address;
            productDeliveryMode = BY.config.product.deliveryMode.PICKUP;
        }

        function getPickupAddress(){
            return pickupAddress;
        }

        function getDeliveryMode(){
            return productDeliveryMode;
        }

        return {
            setPickupAddress : setPickupAddress,
            getPickupAddress : getPickupAddress,
            getDeliveryMode : getDeliveryMode
        }

    }
    return SharedContext;
});
