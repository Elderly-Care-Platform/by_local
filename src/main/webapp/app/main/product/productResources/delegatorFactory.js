define([], function () {
    function DelegatorFactory($q, $http, $log, APPLICATION, SessionIdService) {
        var runningRequests = {},
            delayedRequests = {},
            requestCounter = 0,
            syncMode = false;

        return {
            get: get,
            post: post,
            put: put,
            remove: remove,
            isSyncrhonized: isSyncrhonized,
            synchronize: synchronize
        };

        function nextRequestId() {
            // Increment requestCounter and return new number as a string
            return '' + (requestCounter += 1);
        }

        function http(config) {
            var promise;

            if (syncMode && !config.noDelay) {
                promise = delayHttp(config);
            } else {
                promise = executeHttp(config);
            }

            return promise;
        }

        function executeHttp(config) {
            config = prepareRequest(config || {});
            var alreadyResolved = false;
            var requestId = nextRequestId();


            //----------------------To be added after switching from http://54.169.187.40:8080/ host---------------------------------------
            var bySessionId = SessionIdService.getSessionId();
            $http.defaults.headers.common.sess = bySessionId;

            var promise = httpizePromise(config, $http(config).then(finalize, httpReject));
            var tracker = {id: requestId, config: config, promise: promise};

            if (!alreadyResolved) {
                runningRequests[requestId] = tracker;
            }

            return promise;

            function httpReject(result) {
                // Return a rejected promise to bubble failures
                return $q.reject(finalize(result));
            }

            function finalize(result) {
                if (runningRequests[requestId]) {
                    delete runningRequests[requestId];
                } else {
                    alreadyResolved = true;
                }

                if (result && result.data) {
                    result = processResponseData(result.data);
                }

                return result;
            }
        }

        function processResponseData(data) {
            return data;
        }

        function delayHttp(config) {
            config = prepareRequest(config || {});
            var deferred = $q.defer();
            var requestId = nextRequestId();
            var tracker = {id: requestId, config: config, deferred: deferred};

            delayedRequests[requestId] = tracker;

            return httpizePromise(config, deferred.promise);
        }

        function get(url, params, customConfig) {
            //Manage own caching while using the $http service
            return http(buildShortcutConfig('GET', url, params, customConfig));
        }

        function post(url, params, customConfig) {
            return http(buildShortcutConfig('POST', url, params, customConfig));
        }

        function put(url, params, customConfig) {
            return http(buildShortcutConfig('PUT', url, params, customConfig));
        }

        function remove(url, params, customConfig) {
            return http(buildShortcutConfig('DELETE', url, params, customConfig));
        }

        function buildShortcutConfig(method, url, data, customConfig) {
            var config = angular.extend({}, customConfig || {});

            config.method = method;
            config.url = url;

            if (method === 'POST' || method === 'PUT') {
                config.data = data || {};
            } else {
                config.params = data || {};
            }

            return config;
        }

        function isSyncrhonized() {
            return syncMode;
        }

        function synchronize(modeEnabled) {
            if (angular.isUndefined(modeEnabled)) {
                modeEnabled = true;
            }

            if (syncMode && !modeEnabled) {
                // turn off sync mode
                syncMode = false;
            } else if (!syncMode && modeEnabled) {
                // turn on sync mode
                syncMode = true;
            }

            return syncMode;
        }

        function prepareRequest(inputConfig) {
            var config = angular.extend({headers: {}}, inputConfig);
            var url = config.url || '';
            var urlNeedsExpansion = !(/^\w+:\/\//.test(url)) && !config.domainAlreadyAdded;
            var params = {};

            if (urlNeedsExpansion) {
                config.url = APPLICATION.host + url;
            }

            if (angular.isObject(config.params)) {
                angular.extend(params, config.params);
            }

            if (angular.isObject(config.data)) {
                angular.extend(params, config.data);
            }

            return config;
        }

        function httpizePromise(config, promise) {
            promise.success = function (fn) {
                promise.then(function (response) {
                    fn(response.data, response.status, response.headers, config);
                });
                return promise;
            };

            promise.error = function (fn) {
                promise.then(null, function (response) {
                    fn(response.data, response.status, response.headers, config);
                });
                return promise;
            };

            return promise;
        }
    }

    return DelegatorFactory;
});
