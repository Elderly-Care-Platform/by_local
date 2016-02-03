define([], function () {

    function LogisticFactory($http) {

        return {
            //getCustomerProfile: getCustomerProfile,
            checkLogisticAvailability : checkLogisticAvailability,
            trackOrderItem : trackOrderItem
        };

        function checkLogisticAvailability(pincode) {
            return $http.get(apiPrefix + BY.config.constants.productHost + '/logistic/pincode/' + pincode);
        }

        function trackOrderItem(awbList){
            if(awbList.length > 0){
                awbList = awbList.toString();
                return $http.get(apiPrefix + BY.config.constants.productHost + '/logistic/track?awb=' + awbList);
            }
        }

    }

    return LogisticFactory;
});