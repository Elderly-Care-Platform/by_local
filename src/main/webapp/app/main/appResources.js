/**
 * Created by sanjukta on 02-07-2015.
 */
define(["byApp", "angular"], function (byApp, angular) {

    var byServices = angular.module("byServices", ["ngResource"]);

    var sessionIdService = byServices.factory('SessionIdService', function ($rootScope, $location) {
        var sessionID = '';
        return {
            getSessionId: function () {
                if ((sessionID == '' || sessionID == null)) {

                    if ("localStorage" in window) {
                        sessionID = localStorage.getItem("SessionId");
                        $rootScope.bc_userId = localStorage.getItem("USER_ID");
                    }
                    else {
                        alert("No local storage");
                    }
                }

                console.log("Get sessionId => " + sessionID);

                return sessionID;
            },

            setSessionId: function (sessId) {
                console.log("Set sessionId=" + sessId);
                localStorage.setItem("SessionId", sessId);
                sessionID = sessId;
                return;
            }
        }
    });

    var broadCastData = byServices.factory('broadCastData', function ($rootScope) {
        var data = {};
        data.newData = null;

        data.update = function (item) {
            data.newData = item;
            this.broadcastNewData();
        };

        data.broadcastNewData = function () {
            $rootScope.$broadcast('handleBroadcast');
        }

        return data;
    });

    var broadCastMenuDetail = byServices.factory('broadCastMenuDetail', function ($rootScope) {
        var menuDetails = {};
        menuDetails.selectedMenu = null;

        menuDetails.setMenuId = function (item) {
            menuDetails.selectedMenu = item;
            this.broadcastNewData();
        };

        menuDetails.broadcastNewData = function () {
            $rootScope.$broadcast('handleBroadcastMenu');
        }

        return menuDetails;
    });


    var validateUserCredential = byServices.factory('ValidateUserCredential', function ($rootScope) {
        var user = {};
        user.login = function () {
            $rootScope.inContextLogin = true;
            $('#myModalHorizontal').modal('show');
        };

        user.loginCallback = function () {
            $rootScope.inContextLogin = false;
            $('#myModalHorizontal').modal('hide');
        };

        return user;
    });

//BY Menu api
    var byMenu = byServices.factory('BYMenu', function ($resource) {
        return $resource(apiPrefix + 'api/v1/menu/getMenu?parentId=root', {q: '*'}, {
            get: {method: 'GET', params: {}},
            query: {
                method: 'GET', interceptor: {
                    response: function (response) {
                        return response.data;
                    }
                }, isArray: true
            }
        })
    });

//discuss detail page API
    var discussDetail = byServices.factory('DiscussDetail', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discussDetail', {}, {
            remove: {method: 'DELETE', params: {discussId: '@id'}, isArray: false},
            update: {method: 'PUT', params: {discussId: '@id'}, isArray: false},
            get: {method: 'GET', params: {discussId: '@id'}, isArray: false},
            postAnswer: {method: 'POST', params: {type: 1}, isArray: false},
            postComment: {method: 'POST', params: {type: 0}, isArray: false}
        });
    });

//discuss Likes api
    var discussLike = byServices.factory('DiscussLike', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discussLike', {}, {
            likeDiscuss: {method: 'POST', params: {type: 0, discussId: '@discussId', url: '@url'}, isArray: false}
        })
    })

    var discussReplyLike = byServices.factory('DiscussReplyLike', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discussReplyLike', {}, {
            likeComment: {method: 'POST', params: {type: 1, replyId: '@replyId', url: '@url'}, isArray: false},
            likeAnswer: {method: 'POST', params: {type: 2, replyId: '@replyId', url: '@url'}, isArray: false}
        })
    })


//ContactUs -

    var contactUs = byServices.factory('ContactUs', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discuss/contactUs', {}, {})
    });


//Find All
    var findServices = byServices.factory('FindServices', function ($resource) {
        return $resource(apiPrefix + 'api/v1/userProfile/list/serviceProviders', {}, {
            get: {method: 'GET', params: {city: '@city', services: '@services', page: '@page', size: '@size'}}

        })
    });

//Find Housing
    var findHousing = byServices.factory('FindHousing', function ($resource) {
        return $resource(apiPrefix + 'api/v1/housing/page', {}, {
            get: {method: 'GET', params: {city: '@city', tags: '@tags', page: '@page', size: '@size'}}

        })
    });


//New selected user profile
    var userProfile = byServices.factory('UserProfile', function ($resource) {
        return $resource(apiPrefix + 'api/v1/userProfile/:userId', {}, {
            get: {method: 'GET', params: {}},
            post: {method: 'POST', params: {}},
            update: {method: 'PUT', params: {}}
        })
    });

//User
    var user = byServices.factory('User', function ($resource) {
        return $resource(apiPrefix + 'api/v1/users/:userId', {}, {
            get: {method: 'GET', params: {userId: '@id'}},
            post: {method: 'PUT', params: {userId: '@id'}},
            put: {method: 'PUT', params: {userId: '@id'}}
        })
    });


    var discussListing = byServices.factory('DiscussPage', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discuss/page', {}, {
            get: {method: 'GET',
                params: {
                    discussType: '@discussType',
                    tags: '@tags',
                    userId: '@userId',
                    p: '@p',
                    s: '@s',
                    isFeatured: '@isFeatured'
                },
                isArray: false
            }
        })
    });

    var discussCount = byServices.factory('DiscussCount', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discuss/count', {}, {
            get: {method: 'GET', params: {tags: '@tags', userId: '@userId'}, isArray: false, isArray: false}
        })
    });


//Discuss -

    var discuss = byServices.factory('Discuss', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discuss', {}, {
//        remove:{method: 'DELETE', params: {discussId: '@id'}},
//        update:{method: 'PUT', params: {discussId: '@id'}},
//        get: {method: 'GET', params: {discussId: '@id'}}
        })
    });


    var discussComment = byServices.factory('DiscussComment', function ($resource) {
        return $resource(apiPrefix + 'api/v1/comment/:commentId', {}, {
            remove: {method: 'DELETE', params: {commentId: '@id'}},
            update: {method: 'PUT', params: {commentId: '@id'}},
            get: {method: 'GET', isArray: true, params: {commentId: '@id'}}
        })
    });


    var discussSearch = byServices.factory('DiscussSearch', function ($resource) {

        return $resource(apiPrefix + 'api/v1/search/discussPageSearch', {}, {
            get: {method: 'GET'}

        })
    });

    var ServicePageSearch = byServices.factory('ServicePageSearch', function ($resource) {

        return $resource(apiPrefix + 'api/v1/search/servicePageSearch', {}, {
            get: {method: 'GET'}
        })
    });

    var HousingPageSearch = byServices.factory('HousingPageSearch', function ($resource) {

        return $resource(apiPrefix + 'api/v1/search/housingPageSearch', {}, {
            get: {method: 'GET'}
        })
    });

    var searchByDiscussType = byServices.factory('DiscussSearchForDiscussType', function ($resource) {
        return $resource(apiPrefix + 'api/v1/search/:term/:discussType', {}, {
            get: {method: 'GET', params: {term: '@term', discussType: '@discussType'}}
        })
    });


    var discussCategoryList = byServices.factory('discussCategoryList', function ($resource) {
        return $resource('api/v1/topic/list/all',
            {q: '*'},
            {
                'query': {
                    method: 'GET',
                    interceptor: {
                        response: function (response) {
                            return response.data;
                        }
                    }
                }

            })
    });

//FindService types
    var serviceTypeList = byServices.factory('ServiceTypeList', function ($resource) {
        return $resource(apiPrefix + 'api/v1/service_types/list/all', {q: '*'}, {
            get: {method: 'GET', params: {}},
            query: {
                method: 'GET', interceptor: {
                    response: function (response) {
                        return response.data;
                    }
                }, isArray: false
            }
        })
    });

//Review and Rate profile
    var reviewRateProfile = byServices.factory('ReviewRateProfile', function ($resource) {
        return $resource(apiPrefix + 'api/v1/reviewRate', {}, {
            get: {method: 'GET', params: {associatedId: "@associatedId", reviewContentType: "@reviewContentType"}},
            post: {method: 'POST', params: {associatedId: "@associatedId", reviewContentType: "@reviewContentType"}}
        })
    });

    var shareDiscuss = byServices.factory('ShareDiscuss', function ($resource) {
        return $resource(apiPrefix + 'api/v1/discuss/addShare', {}, {
            post: {method: 'POST'}
        })
    });


    //var productService = byServices.factory('ProductService', function (REST_URL, CachedRequestHandler, urlTemplate,
    //                                                                    CONSTANT) {
    //    var productService, urls;
    //
    //    urls = {
    //        forAllProducts: urlTemplate(REST_URL.getProductList),
    //        forProductsByCategory: urlTemplate(REST_URL.getProductListByCategory + '/:id/' +
    //            CONSTANT.products),
    //        forFeaturedProducts: urlTemplate(REST_URL.getFeaturedProductList),
    //        forSearch: urlTemplate(REST_URL.search + '?q=":query"')
    //    };
    //
    //    productService = angular.extend(
    //        {},
    //        CachedRequestHandler,
    //        {
    //            modelName: 'product',
    //            baseURL:   urls.base,
    //            urls:      urls
    //        },
    //        {
    //            getProducts: getProducts,
    //            getProductsByCategory: getProductsByCategory,
    //            getFeaturedProducts: getFeaturedProducts,
    //            getSearchedProduct: getSearchedProduct
    //        }
    //    );
    //
    //    return productService;
    //
    //    function getProducts(params) {
    //        return this.$get(urls.forAllProducts(params));
    //    }
    //
    //    function getProductsByCategory(params) {
    //        return this.$get(urls.forProductsByCategory(params));
    //    }
    //
    //    function getFeaturedProducts(params) {
    //        return this.$get(urls.forFeaturedProducts(params));
    //    }
    //
    //    function getSearchedProduct(params) {
    //        return this.$get(urls.forSearch(params));
    //    }
    //});
    //
    //var CachedRequestHandler = byServices.factory('CachedRequestHandler', function ( ErrorStore,
    //                                                                                 DelegatorService,
    //                                                                                 $http,
    //                                                                                 $angularCacheFactory,
    //                                                                                 $q,
    //                                                                                 $log,
    //                                                                                 apiCache,
    //                                                                                 APPLICATION) {
    //    var CachedRequestHandler;
    //
    //    CachedRequestHandler = {
    //        find:                find,
    //        extractResponseData: extractResponseData,
    //        initAndCache:        initAndCache,
    //        getObjectStore:      getObjectStore,
    //        getById:             getById,
    //        cacheObjects:        cacheObjects,
    //        query:               query,
    //        querySingle:         querySingle,
    //        getURL:              getURL,
    //        resourceClass:       null,
    //        buildPlaceholder:    buildPlaceholder
    //    };
    //
    //    // Add "hidden" methods ($http, $get, etc..) to avoid further need
    //    // to inject DelegatorService in the services that use this
    //    angular.forEach(
    //        ['http', 'get', 'post', 'put', 'remove'],
    //        function(name) {
    //            var basicName     = '$' + name,
    //                unwrappedName = name,
    //                basicMethod   = angular.bind(DelegatorService, DelegatorService[name]);
    //
    //            // defines .$get, .$post, etc...
    //            CachedRequestHandler[basicName]     = basicMethod;
    //            // defines .get, .post, etc...
    //            CachedRequestHandler[unwrappedName] = unwrappedMethod;
    //
    //            function unwrappedMethod() {
    //                return basicMethod.apply(this, arguments).then(
    //                    angular.bind(this, this.extractResponseData)
    //                );
    //            }
    //        }
    //    );
    //
    //    return CachedRequestHandler;
    //
    //    function find(id, params) {
    //        var self    = this,
    //            dfd     = $q.defer(),
    //            context = {},
    //            url,
    //            cachedObj;
    //
    //        if (angular.isObject(id)) {
    //            angular.extend(context, id);
    //        } else {
    //            context.id = id;
    //        }
    //
    //        angular.extend(context, params);
    //        id  = context.id;
    //        url = buildFindURL(this, context);
    //
    //        dfd.$needResolve = true;
    //        cachedObj        = retrieveFromCache(this, id, dfd, true, this.buildPlaceholder(id));
    //
    //        cachedObj.$loadInProgress = true;
    //
    //        this.$get(url).then(
    //            function(response) {
    //                self.initAndCache(response, context).then(function(item) {
    //                    updateReference(item, cachedObj, dfd);
    //                });
    //            },
    //            function(error) { handleError(dfd, error); }
    //        );
    //
    //        return dfd.promise;
    //    }
    //
    //    function query(url, querySingleton, initContext) {
    //        var self = this;
    //        var dfd = $q.defer();
    //        dfd.$needResolve = true;
    //        var cachedObj = retrieveFromCache(self, url, dfd, querySingleton);
    //
    //        cachedObj.$loadInProgress = true;
    //
    //        this.$get(url).then(function(resp) {
    //            self.initAndCache(resp, initContext).then(function(item) {
    //                updateReference(item, cachedObj, dfd);
    //            });
    //
    //        }, function(err) {
    //            handleError(dfd, err);
    //        });
    //
    //        return dfd.promise;
    //    }
    //
    //    function querySingle(url, initContext) {
    //        return this.query(url, true, initContext);
    //    }
    //
    //    function updateReference(newData, ref, dfd) {
    //        if (angular.isArray(ref)) {
    //            ref.length = 0;
    //            Array.prototype.push.apply(ref, newData);
    //        } else {
    //            angular.extend(ref, newData || {});
    //        }
    //
    //        ref.$loadInProgress = false;
    //        if (dfd.$needResolve) {
    //            dfd.resolve(ref);
    //        }
    //    }
    //
    //    function retrieveFromCache(service, objKey, dfd, singular, placeholder) {
    //        var objStore  = service.getObjectStore();
    //        var cachedObj = objStore.get(objKey);
    //
    //        if (angular.isObject(cachedObj)) {
    //            // $log.debug('resolved request for ' + objKey + ' from cache');
    //            dfd.resolve(cachedObj);
    //            dfd.$needResolve = false;
    //        } else {
    //            if (singular) {
    //                cachedObj = placeholder || service.buildPlaceholder();
    //            } else {
    //                cachedObj = [];
    //            }
    //        }
    //        return cachedObj;
    //    }
    //
    //    function initAndCache(response, initContext) {
    //        return this.extractResponseData(response, initContext).then(
    //            angular.bind(this, this.cacheObjects)
    //        );
    //    }
    //
    //    function extractResponseData(response, initContext) {
    //        var service      = this,
    //            isArray      = angular.isArray(response.data),
    //            dataItems    = _.flattenDeep([response.data]),
    //            initializer  = this.initializeInstance;
    //
    //        if (!angular.isFunction(initializer)) {
    //            initializer = _.identity;
    //        }
    //
    //        return $q.all(dataItems.map(callInitializer)).then(onSuccess, onError);
    //
    //        function callInitializer(item) {
    //            return initializer.call(service, item, initContext);
    //        }
    //
    //        function onSuccess(initializedDataItems) {
    //            return isArray ? initializedDataItems : initializedDataItems[0];
    //        }
    //
    //        function onError(errorData) {
    //            if (angular.isFunction(service.handleDeserializationError)) {
    //                return service.handleDeserializationError(errorData);
    //            } else {
    //                return $q.reject(errorData);
    //            }
    //        }
    //    }
    //
    //    function cacheObjects(objects) {
    //        var objectStore = this.getObjectStore();
    //
    //        _.flattenDeep([objects]).forEach(
    //            function(object) {
    //                if (angular.isString(object.id)) {
    //                    objectStore.put(object.id, object);
    //                }
    //            }
    //        );
    //
    //        return objects;
    //    }
    //
    //    function getById(id, params) {
    //        var url;
    //
    //        if (angular.isFunction(this.baseURL)) {
    //            params = angular.extend({id: id}, params);
    //            url    = this.baseURL.call(this, params);
    //        } else {
    //            url    = this.baseURL + (id || '').toString();
    //        }
    //
    //        return this.$get(url);
    //    }
    //
    //    function getURL(url) {
    //        return DelegatorService.get(url);
    //    }
    //
    //    function getObjectStore() {
    //        var cache;
    //        var cacheName;
    //
    //        if (this.modelName) {
    //            cacheName = APPLICATION.cache + '.' + this.modelName;
    //            cache     = $angularCacheFactory.get(cacheName) || $angularCacheFactory(cacheName);
    //        } else {
    //            cache     = apiCache;
    //        }
    //
    //        return cache;
    //    }
    //
    //    // if the service defines its own error handler, use it
    //    // if not just add the error to store.
    //    function handleError(dfd, err) {
    //        dfd.reject(err);
    //        if (angular.isFunction(this.handleHTTPError)) {
    //            this.handleHTTPError(err);
    //        } else {
    //            ErrorStore.add(err);
    //        }
    //    }
    //
    //    function buildPlaceholder() {
    //        var placeholder;
    //
    //        if (this.resourceClass) {
    //            placeholder = this.resourceClass.wrap.apply(this.resourceClass, arguments);
    //        } else {
    //            placeholder = {};
    //            angular.forEach(
    //                arguments,
    //                function(argument) {
    //                    if (angular.isObject(argument)) {
    //                        angular.extend(placeholder, argument);
    //                    } else {
    //                        placeholder.id = placeholder.id || argument;
    //                    }
    //                }
    //            );
    //        }
    //
    //        return placeholder;
    //    }
    //
    //    function buildFindURL(service, params) {
    //        var baseURL = service.baseURL || '',
    //            findURL;
    //
    //        if (angular.isFunction(baseURL)) {
    //            findURL = baseURL.call(service, params);
    //        } else {
    //            findURL = baseURL.toString() + params.id;
    //        }
    //
    //        return findURL;
    //    }
    //});
    //
    //var ErrorStore = byServices.factory('ErrorStore', function ($resource) {
    //    return {
    //        messages: [],
    //        add: addMessage,
    //        display: displayMessage
    //    };
    //
    //    function addMessage(errorMessage) {
    //        this.messages.push(errorMessage);
    //        if (this.messages.length > 100) {
    //            while (this.messages.length > 100) {
    //                this.messages.shift();
    //            }
    //        }
    //    }
    //
    //    function displayMessage() {
    //        var displayedMessages = angular.copy(this.messages);
    //        while (this.messages.length > 0) {
    //            this.messages.pop();
    //        }
    //        return displayedMessages;
    //    }
    //});

    return byServices;
});
