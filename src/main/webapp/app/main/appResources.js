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

    //var broadCastMenuDetail = byServices.factory('broadCastMenuDetail', function ($rootScope) {
    //    var menuDetails = {};
    //    menuDetails.selectedMenu = null;
    //
    //    menuDetails.setMenuId = function (item) {
    //        menuDetails.selectedMenu = item;
    //        this.broadcastNewData();
    //    };
    //
    //    menuDetails.broadcastNewData = function () {
    //        $rootScope.$broadcast('handleBroadcastMenu');
    //    }
    //
    //    return menuDetails;
    //});


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


    return byServices;
});
