define(['byProdEcomConfig'], function (byProdEcomConfig) {
    function SharedContext() {
        var pickupAddress = null, productDeliveryMode = BY.config.product.deliveryMode.DELIVER;

        function setDeliverMode(mode){
            productDeliveryMode = mode;
            localStorage.setItem("USER_PRODUCT_DELIVERYMODE", mode);
        }

        function getDeliveryMode(){
            var deliveryMode = localStorage.getItem("USER_PRODUCT_DELIVERYMODE");
            return deliveryMode;
        }

        function setPickupAddress(address){
            pickupAddress = address;
            productDeliveryMode = BY.config.product.deliveryMode.PICKUP;
            localStorage.setItem("USER_PRODUCT_PICKUP_DETAILS", JSON.stringify(pickupAddress));
            setDeliverMode(BY.config.product.deliveryMode.PICKUP);
        }

        function getPickupAddress(id){
            if(id){
                var pickupDetails = JSON.parse(localStorage.getItem("USER_PRODUCT_PICKUP_DETAILS"));
                return pickupDetails;
            }else{
                return pickupAddress;
            }

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
