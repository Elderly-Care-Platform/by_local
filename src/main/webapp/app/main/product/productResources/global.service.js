define([], function () {

    function GlobalServiceFactory($log,
                                  $rootScope) {
        $log.debug('Inside Global Service');
        var globalService;

        globalService = {
            rootScope: rootScope,
            setInRootScope: setInRootScope
        };

        return globalService;

        function rootScope() {
            if ($rootScope.varStack === undefined) {
                $rootScope.varStack = {};
            }
            return $rootScope.varStack;
        }

        function setInRootScope(key, object) {
            rootScope()[key] = object;
        }
    }

    return GlobalServiceFactory;
});
