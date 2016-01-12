define(['byApp',
    'discussLikeController',
    'shareController',
    'byEditor', 'menuConfig', 'blogMasonary', 'jqueryMasonaryGrid'],
    function (byApp, discussLikeController, shareController, byEditor, menuConfig, blogMasonary, jqueryMasonaryGrid) {

    'use strict';

    function ServiceOverviewCtrl($scope, $rootScope, $location, $route, $routeParams, DiscussPage,
                                 DiscussCount, $sce, $timeout, $q, UserValidationFilter) {

        window.scrollTo(0, 0);
        $scope.discussType = $routeParams.discussType ? $routeParams.discussType : "all"; //Needed for left side Q/A/P filters
        $scope.selectedMenu = $scope.$parent.selectedMenu;
        $scope.isGridInitialized = false;
        $scope.showContact.showContactNumber = true;
        $scope.userCredential = {'email': '', 'pwd': ''};

        var tags = [],
            pageSize = 20,
            discussPageIdx = $routeParams.discussPageIdx ? $routeParams.discussPageIdx : 0,
            queryParams = {p: discussPageIdx, s: pageSize, sort: "lastModifiedAt"};

        $scope.initGrid = function (index) {
            if ($rootScope.windowWidth > 800) {
                var gridMasonary = $(".masonry");
                window.setTimeout(function () {
                    masonaryGridInit();
                    $(".masonry").masonry("reload");
                }, 100);

            }
            else if ($rootScope.windowWidth < 800) {
                $(".grid-boxes-in").removeClass('grid-boxes-in');
                $("#preloader").hide();
            }
            window.scrollTo(0, 0);
            //masonaryGridInit();
        };
        $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
        function updateMetaTags(){
            var metaTagParams = {
                title: $scope.selectedMenu.displayMenuName,
                imageUrl: "",
                description: "",
                keywords: [$scope.selectedMenu.displayMenuName, "service reviews"]
            }
            BY.byUtil.updateMetaTags(metaTagParams);
        }

        $scope.initDiscussListing = function () {
            if ($scope.selectedMenu) {
                updateMetaTags();

                queryParams.tags = BY.config.menu.reveiwsMenuConfig['service_review'].tag;
                if ($scope.discussType && $scope.discussType.toLowerCase().trim() !== "all") {
                    queryParams.discussType = $routeParams.discussType;
                }

                DiscussCount.get({tags: queryParams.tags, contentTypes: "f,total,p,q"}, function (counts) {
                        $scope.discuss_counts = counts.data;
                    },
                    function (error) {
                        console.log(error);
                    }
                );

                if (queryParams.discussType === 'f') {
                    queryParams.isFeatured = true;
                    delete queryParams.discussType;
                }

                $scope.getDiscussData = function (page, size) {
                    $("#preloader").show();
                    queryParams.p = page;
                    queryParams.s = size;
                    DiscussPage.get(queryParams,
                        function (value) {
                            $scope.discussList = value.data.content;
                            $scope.pageInfo = BY.byUtil.getPageInfo(value.data);
                            $scope.pageInfo.isQueryInProgress = false;
                            $scope.discussPagination = {'pageIndexName': 'discussPageIdx'};
                            $scope.discussPagination.totalPosts = value.data.total;
                            $scope.discussPagination.noOfPages = Math.ceil(value.data.total / value.data.size);
                            $scope.discussPagination.currentPage = value.data.number;
                            $scope.discussPagination.pageSize = pageSize;

                           /* if ($scope.discussList.length === 0) {
                                $("#preloader").hide();
                            }*/
                            $("#preloader").hide();
                        },
                        function (error) {
                            $("#preloader").hide();
                            console.log(error);
                        });
                }

                $scope.getDiscussData(discussPageIdx, pageSize);

            };
        }


        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.trustAsResourceUrl = function (url) {
            return $sce.trustAsResourceUrl(url);
        };

        $scope.nextLocation = function($event, discuss, queryParams){
            $event.stopPropagation();
            var url = getDiscussDetailUrl(discuss, queryParams, true);
            $location.path(url);
        };
        
        $scope.getHref = function(discuss, queryParams){
        	var newHref = getDiscussDetailUrl(discuss, queryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };

        function getDiscussDetailUrl(discuss, queryParams, isAngularLocation){
            var disTitle = "others";
            if(discuss.title && discuss.title.trim().length > 0){
                disTitle = discuss.title;
            } else if(discuss.text && discuss.text.trim().length > 0){
                disTitle = discuss.text;
            } else if(discuss.linkInfo && discuss.linkInfo.title && discuss.linkInfo.title.trim().length > 0){
                disTitle = discuss.linkInfo.title;
            } else{
                disTitle = "others";
            }

            disTitle = BY.byUtil.getSlug(disTitle);
            var newHref = "/communities/"+disTitle;


            if(queryParams && Object.keys(queryParams).length > 0){
                //Set query params through angular location search method
                if(isAngularLocation){
                    angular.forEach($location.search(), function (value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(queryParams, function (value, key) {
                        $location.search(key, value);
                    });
                } else{ //Set query params manually
                    newHref = newHref + "?"
                    angular.forEach(queryParams, function (value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };
        
        $scope.getHrefProfile = function(profile, urlQueryParams){
        	var newHref = getProfileDetailUrl(profile, urlQueryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };

        function getProfileDetailUrl(profile, urlQueryParams, isAngularLocation){
        	var proTitle = "others";
        	 if(profile && profile.userProfile && profile.userProfile.basicProfileInfo.firstName && profile.userProfile.basicProfileInfo.firstName.length > 0){
        		 proTitle = profile.userProfile.basicProfileInfo.firstName;
        		 if(profile.userProfile.individualInfo.lastName && profile.userProfile.individualInfo.lastName != null && profile.userProfile.individualInfo.lastName.length > 0){
        			 proTitle = proTitle + " " + profile.userProfile.individualInfo.lastName;
        		 }
        	 } else if(profile && profile.username && profile.username.length > 0){
        		 proTitle = BY.byUtil.validateUserName(profile.username);
        	 }else{
        		 proTitle = "others";
        	 }

        	proTitle = BY.byUtil.getSlug(proTitle);
            var newHref = "/users/"+proTitle;


            if(urlQueryParams && Object.keys(urlQueryParams).length > 0){
                //Set query params through angular location search method
                if(isAngularLocation){
                    angular.forEach($location.search(), function (value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(urlQueryParams, function (value, key) {
                        $location.search(key, value);
                    });
                } else{ //Set query params manually
                    newHref = newHref + "?"

                    angular.forEach(urlQueryParams, function (value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };

        //Discuss like code
            $scope.getUserCredentialForLike = function(discussLikeObj){
                if($scope.discussLikeObj){
                    delete $scope.discussLikeObj.pendingUserCredential
                }
                $scope.discussLikeObj = discussLikeObj;
                $scope.discussLikeObj.pendingUserCredential = true;
                $scope.userCredential.defer= $q.defer();
                window.setTimeout(function(){
                    $(".masonry").masonry("reload");
                }, 100);

                return $scope.userCredential.defer.promise;
            }

            $scope.setUserCredentialForLike = function(){
                if($scope.userCredential.email && BY.byUtil.validateEmailId($scope.userCredential.email)){
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(validUser, invalidUser);
                }else{
                    $scope.likeErrMsg = "Please enter valid email";
                }

                function validUser(){
                    if($scope.userCredential.defer){
                        $scope.discussLikeObj.pendingUserCredential = false;
                        $scope.userCredential.defer.resolve();
                        //delete $scope.userCredential.promise;
                    }
                    window.setTimeout(function(){
                        $(".masonry").masonry("reload");
                    }, 100);
                }

                function invalidUser(errMsg){
                    console.log("invalid user error");
                    $scope.likeErrMsg = errMsg;
                    if($scope.userCredential.defer){
                        $scope.userCredential.defer.reject();
                    }
                    window.setTimeout(function(){
                        $(".masonry").masonry("reload");
                    }, 100);
                    //delete $scope.userCredential.promise;
                }
            }

            $scope.cancelSetCredentialForLike = function(){
                $scope.discussLikeObj.pendingUserCredential = false;
                if($scope.userCredential.defer){
                    $scope.userCredential.defer.reject();
                }
                window.setTimeout(function(){
                    $(".masonry").masonry("reload");
                }, 100);
            }

            //// Sevices editor
            $scope.showEditorPage= function (event, type) {
                if (event) {
                    event.stopPropagation();
                }

                $scope.showEditorType = type;
                $(".by_editorButtonWrap_thumb").animate({width: '100%', borderRightWidth: '0px'}, "500");
                $("." + type + "hidePanel").hide();
                $("." + type + "by_editorButtonWrap_thumb").hide();
                $("." + type + "showPanel").slideDown("500");

                if ($scope.showEditorType === 'Question') {
                    var tinyEditor = BY.byEditor.addEditor({"editorTextArea": "question_textArea", "autoFocus": "true"});
                }

                if ($scope.showEditorType === 'Article') {
                    var tinyEditor = BY.byEditor.addEditor({
                        "editorTextArea": "article_textArea"
                    });

                }
                $("#shareInputFeild").focus();
            }

            $scope.exitEditorDiscuss = function (type, event) {
                event.stopPropagation();
                $(".by_editorButtonWrap_thumb").animate({width: '50%', borderRightWidth: '1px'}, "500");
                $("." + type + "hidePanel").show();
                $("." + type + "by_editorButtonWrap_thumb").show();
                $("." + type + "showPanel").slideUp("100", function () {
                    BY.byEditor.removeEditor();
                    //$route.reload();
                });

            }

    }


    ServiceOverviewCtrl.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
        'DiscussPage', 'DiscussCount', '$sce', '$timeout', '$q', 'UserValidationFilter'];

    byApp.registerController('ServiceOverviewCtrl', ServiceOverviewCtrl);
    return ServiceOverviewCtrl;

});
