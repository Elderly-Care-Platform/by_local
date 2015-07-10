/**
 * Created by sanjukta on 02-07-2015.
 */
var discuss = byServices.factory('SessionIdService', function($rootScope, $location) {
    var sessionID = '';
    return {
        getSessionId: function() {


            if((sessionID=='' || sessionID==null))
            {

                if ("localStorage" in window)
                {
                    sessionID = localStorage.getItem("SessionId");
                    $rootScope.bc_userId = localStorage.getItem("USER_ID");
                }
                else
                {
                    alert("No local storage");
                }
            }

            console.log("Get sessionId => " + sessionID);

            return sessionID;
        },

        setSessionId: function(sessId) {
            console.log("Set sessionId=" + sessId);
            localStorage.setItem("SessionId", sessId);
            sessionID = sessId;
            return;
        }
    }
});

var broadCastData = byServices.factory('broadCastData', function($rootScope){
    var data = {};
    data.newData = null;

    data.update = function(item){
        data.newData = item;
        this.broadcastNewData();
    };

    data.broadcastNewData = function(){
        $rootScope.$broadcast('handleBroadcast');
    }

    return data;
});

////home featured content API
//var homeFeaturedContent = byServices.factory('HomeFeaturedContent', function ($resource) {
//    return $resource('api/v1/discuss/list/all/:discussType?featured=true&count=3&sort=lastModifiedAt', {}, {
//        query: {method: 'GET', isArray: false}
//        
//    });
//});

//discuss detail page API
var discussDetail = byServices.factory('DiscussDetail', function($resource) {
    return $resource(apiPrefix+'api/v1/discussDetail',{}, {
        remove:{method: 'DELETE', params: {discussId: '@id'},isArray:false},
        update:{method: 'PUT', params: {discussId: '@id'},isArray:false},
        get: {method: 'GET', params: {discussId: '@id'},isArray:false},
        postAnswer: {method:'POST', params:{type:1},isArray:false},
        postComment: {method:'POST', params:{type:0},isArray:false}
    });
});

//discuss Likes api
var discussLike = byServices.factory('DiscussLike', function($resource){
    return $resource(apiPrefix+'api/v1/discussLike',{},{
        likeDiscuss:{method:'POST', params:{type:0, discussId: '@discussId'},isArray:false},
        likeComment:{method:'POST', params:{type:1, replyId:'@replyId'},isArray:false},
        likeAnswer:{method:'POST', params:{type:2, replyId:'@replyId'},isArray:false}
    })
})

//user articles list for detail left panel

//var discussByUserFilter = byServices.factory('UserDiscussList', function($resource) {
//    ///start here
//    return $resource(apiPrefix+'api/v1/discuss/list/:discussType/:topicId/:subTopicId/:userId',{}, {
//        get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId', userId: '@userId'}, isArray: false}
//
//    })
//});


//ContactUs -

var contactUs = byServices.factory('ContactUs', function($resource) {
    return $resource(apiPrefix+'api/v1/discuss/contactUs',{}, {
    })
});


//Find All
var findAllService = byServices.factory('FindAllService', function($resource) {
    return $resource(apiPrefix +'api/v1/userProfile/list?page=0&size=100',{}, {
        get: {method: 'GET', params: {}, isArray: true}

    })
});

//New selected user profile
var userProfile = byServices.factory('UserProfile', function($resource) {
    return $resource(apiPrefix +'api/v1/userProfile/:userId',{}, {
        get: {method: 'GET', params: {}},
        post:{method: 'POST', params: {}},
        update:{method: 'PUT', params: {}}
    })
});








//User
var user = byServices.factory('User', function($resource) {
    return $resource(apiPrefix+'api/v1/users/:userId',{}, {
        get: {method: 'GET', params: {userId: '@id'}},
        post:{method: 'PUT', params: {userId: '@id'}},
        put:{method: 'PUT', params: {userId: '@id'}}
    })
});

////UserProfile old
//var userProfile = byServices.factory('UserProfile', function($resource) {
//    return $resource(apiPrefix+'api/v1/userprofile/:userId',{}, {
//        remove:{method: 'DELETE', params: {userId: '@userId'}},
//        update:{method: 'PUT', params: {userId: '@userId'}},
//        get: {method: 'GET', params: {userId: '@userId'}}
//    })
//});


//var depList = byServices.factory('DependentList', function($resource) {
//    return $resource(apiPrefix+'api/v1/dependent/list/:userId',{}, {
//        //remove:{method: 'DELETE', params: {userId: '@userId'}},
//        //update:{method: 'PUT', params: {userId: '@userId'}},
//        //query: { method: "GET", isArray: true },
//        get: {method: 'GET', params: {userId: '@userId'}}
//    })
//});


//Show dependent details for edit
//var userDependent = byServices.factory('ShowDependent', function($resource) {
//    return $resource(apiPrefix+'api/v1/dependent/:userId/:id',{}, {
//        show: {method: 'GET', params: {userId: '@userId', id: '@id'}},
//        get: {method: 'GET', params: {userId: '@userId', id: '@id'}},
//        update:{method: 'PUT', params: {userId: '@userId', id: '@id'}},
//        query: { method: "GET", isArray: true }
//    })
//});


//UserProfile - step 3
//var userProfile3 = byServices.factory('UserDependent', function($resource) {
//    return $resource(apiPrefix+'api/v1/dependent/:userId',{}, {
//        remove:{method: 'DELETE', params: {userId: '@userId'}},
//        update:{method: 'PUT', params: {userId: '@userId'}},
//        get: {method: 'GET', params: {userId: '@userId'}}
//    })
//});


//
//var userShow = byServices.factory('UserShow', function($resource) {
//    return $resource(apiPrefix+'api/v1/users/show/:userId',{}, {
//        show: {method: 'GET', params: {userId: '@id'}},
//        get: {method: 'GET', params: {userId: '@id'}}
//    })
//});

//var userEdit = byServices.factory('UserEdit', function($resource) {
//    return $resource(apiPrefix+'api/v1/users/edit/:userId',{}, {
//        get: {method: 'GET', params: {userId: '@id'}}
//    })
//});

//var userByFilter = byServices.factory('UserList', function($resource) {
//    return $resource(apiPrefix+'api/v1/users/list/all',{}, {
//    	query: {method: 'GET', isArray: false}
//    })
//});

var discuss = byServices.factory('DiscussPage', function($resource) {
    return $resource(apiPrefix+'api/v1/discuss/page',{}, {
      get: {method: 'GET',params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId', userId: '@userId',p:'@p',s:'@s',isFeatured:'@isFeatured'}, isArray: false}
    })
});

var discuss = byServices.factory('DiscussCount', function($resource) {
    return $resource(apiPrefix+'api/v1/discuss/count',{}, {
      get: {method: 'GET',params: {topicId: '@topicId', subTopicId: '@subTopicId', userId: '@userId'}, isArray: false, isArray:false}
    })
});


//Discuss -

var discuss = byServices.factory('Discuss', function($resource) {
    return $resource(apiPrefix+'api/v1/discuss',{}, {
//        remove:{method: 'DELETE', params: {discussId: '@id'}},
//        update:{method: 'PUT', params: {discussId: '@id'}},
//        get: {method: 'GET', params: {discussId: '@id'}}
    })
});


//
//var discussUserLikes = byServices.factory('DiscussUserLikes', function($resource) {
//    return $resource(apiPrefix+'api/v1/discusslikes/create/:userId/:discussId',{}, {
//        remove:{method: 'DELETE', params: {userId: '@userId', discussId: '@discussId'}},
//        update:{method: 'PUT', params: {userId: '@userId', discussId: '@discussId'}},
//        get: {method: 'GET', params: {userId: '@userId', discussId: '@discussId'}}
//    })
//});


var commentUserLikes = byServices.factory('AnswerCommentUserLikes', function($resource) {
    return $resource(apiPrefix+'api/v1/commentlikes/create/:userId/:commentId',{}, {
        remove:{method: 'DELETE', params: {userId: '@userId', commentId: '@commentId'}},
        update:{method: 'PUT', params: {userId: '@userId', commentId: '@commentId'}},
        get: {method: 'GET', params: {userId: '@userId', commentId: '@commentId'}}
    })
});



var discussComment = byServices.factory('DiscussComment', function($resource) {
    return $resource(apiPrefix+'api/v1/comment/:commentId',{}, {
        remove:{method: 'DELETE', params: {commentId: '@id'}},
        update:{method: 'PUT', params: {commentId: '@id'}},
        get: {method: 'GET', isArray : true, params: {commentId: '@id'}}
    })
});


//
//var discuss = byServices.factory('DiscussCreate', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss',{}, {
//    })
//});


//var discussByFilterPost = byServices.factory('PostDiscuss', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/list/P/:bc_topic/:bc_subTopic',{}, {
//        get: {method: 'GET', params: {bc_topic: '@bc_topic'}}
//    })
//});


//var discussByFilterQuestion = byServices.factory('QuestionDiscuss', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/list/Q/:bc_topic/:bc_subTopic',{}, {
//    })
//});

//var discussByFilterArticle = byServices.factory('ArticleDiscuss', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/list/A/:bc_topic/:bc_subTopic',{}, {
//    })
//});

//
//var discussByFilter = byServices.factory('DiscussList', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/list/all',{}, {
//    	query: {method: 'GET', isArray: false}
//    })
//});


var discussSearch = byServices.factory('DiscussSearch', function($resource) {

    ///start here
    return $resource(apiPrefix+'api/v1/search/:term',{}, {
        //get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId', userId: '@userId'}}

    })
});


//var allDiscussByTypeFilter = byServices.factory('DiscussAllForDiscussType', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/list/all/:discussType',{}, {
//        get: {method: 'GET', params: {discussType: '@discussType'},isArray:false},
//        query: {method: 'GET', params: {discussType: '@discussType'},isArray:false}
//    })
//});


var searchByDiscussType = byServices.factory('DiscussSearchForDiscussType', function($resource) {
    return $resource(apiPrefix+'api/v1/search/:term/:discussType',{}, {
        get: {method: 'GET', params: {term: '@term', discussType: '@discussType'}}
    })
});


//var discussByOTASTFilter = byServices.factory('DiscussOneTopicAllSubTopicList', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/list/:topicId/all',{}, {
//        get: {method: 'GET', params: {topicId: '@topicId'}}
//    })
//});

//var discussByOTOSTFilter = byServices.factory('DiscussOneTopicOneSubTopicList', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/list/:discussType/:topicId/:subTopicId',{}, {
//        get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId'}, isArray: false},
//        query: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId'}, isArray: false}
//    })
//});


/*
 var discussByOTOSTFilterCount = byServices.factory('DiscussOneTopicOneSubTopicListCount', function($resource) {
 return $resource(apiPrefix+'api/v1/discuss/count/:discussType/:topicId/:subTopicId',{}, {
 //get: {method: 'GET', params: {discussType: '@discussType', topicId: '@topicId', subTopicId: '@subTopicId'}}
 })
 });
 */



//var discussByOTOSTFilterCount = byServices.factory('DiscussOneTopicOneSubTopicListCount', function($http, $timeout, $q) {
//
//    var counts = [];
//
//    return {
//        // Get all projects
//        get: function(queryStr) {
//
//
//            var deferred = $q.defer();
//
//            // Don't do call if we already have projects
//            //alert(counts);
//            if (counts.length === 0) {
//
//                // Using a timeout to simulate a server call
//                //$timeout(function() {
//                $http.get(apiPrefix+'api/v1/discuss/count/' + queryStr.discussType + '/' + queryStr.topicId + '/' + queryStr.subTopicId).success(function(data) {
//
//                    deferred.resolve(data);
//                });
//                //}, 200);
//            }
//
//            // Return the projects either way
//            return deferred.promise;
//
//        }
//    }
//});

//var discussShow = byServices.factory('DiscussShow', function($resource) {
//    return $resource(apiPrefix+'api/v1/discuss/:discussId',{}, {
//        show: {method: 'GET', params: {discussId: '@id'}},
//        get: {method: 'GET', params: {discussId: '@id'}}
//    })
//});
//


var discussCategoryList = byServices.factory('discussCategoryList', function ($resource) {
    return $resource('api/v1/topic/list/all',
        {q: '*' },
        {'query': { method: 'GET' ,
            interceptor: {
                response: function(response) {
                    return response.data;
                }
            }
        }

        })
});

//FindService types
var serviceTypeList = byServices.factory('ServiceTypeList', function($resource) {
    return $resource(apiPrefix +'api/v1/service_types/list/all',{q: '*'}, {
        get: {method: 'GET', params: {}},
        query: {method: 'GET',interceptor: {
            response: function(response) {
                return response.data;
            }
        }, isArray: false}
    })
});
