define(['byProdEcomConfig'], function (byProdEcomConfig) {
    function SharedContext() {
        var pickupAddress = null, productDeliveryMode = BY.config.product.deliveryMode.DELIVER;

        function setDeliverMode(mode){
            productDeliveryMode = mode;
        }

        function getDeliveryMode(){
            return productDeliveryMode;
        }

        function setPickupAddress(address){
            pickupAddress = address;
            productDeliveryMode = BY.config.product.deliveryMode.PICKUP;
        }

        function getPickupAddress(){
            return pickupAddress;
        }



        return {
            setPickupAddress : setPickupAddress,
            getPickupAddress : getPickupAddress,
            getDeliveryMode : getDeliveryMode,
            setDeliverMode : setDeliverMode
        }

    }
    return SharedContext;
});
