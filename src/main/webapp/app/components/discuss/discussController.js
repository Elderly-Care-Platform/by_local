define(['byApp',
        'discussLikeController',
        'shareController',
        'byEditor', 'menuConfig', 'blogMasonary', 'jqueryMasonaryGrid', 'urlFactory', 'userValidation'],
    function (byApp,
              discussLikeController,
              shareController,
              byEditor,
              menuConfig,
              blogMasonary,
              jqueryMasonaryGrid,
              urlFactory, userValidation) {

        'use strict';

        function DiscussAllController($scope, $rootScope, $location, $route, $routeParams, DiscussPage,
                                      DiscussCount, $sce, $timeout, $window, urlFactoryFilter, $q, UserValidationFilter) {


            $rootScope.byTopMenuId = $rootScope.mainMenu[0].id;
            $scope.selectedMenu = $scope.$parent.menuLevel2;
            $scope.isGridInitialized = false;
            $scope.initDiscussListing = initDiscussListing;
            $scope.initScroll = initScroll;
            $scope.showEditorPage = showEditorPage;
            $scope.shareDiscussObject = {};
            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
            $scope.userCredential = {'email': '', 'pwd': ''};

            var tags = [],
                pageSize = 20,
                discussPageIdx = $routeParams.discussPageIdx ? $routeParams.discussPageIdx : 0,
                queryParams = {p: discussPageIdx, s: pageSize, sort: "lastModifiedAt"},
                showEditor = $routeParams.showEditor ? $routeParams.showEditor : null,
                editorType = $routeParams.editorType ? $routeParams.editorType : null,
                init = initialize();


            function initialize() {
                initDiscussListing();
                initScroll();
            }

            $scope.initEditor = function () {
                if (showEditor) {
                    showEditorPage(null, editorType);
                }
            }

        // $scope.updateShareCount = function(count){
        //     $scope.detailResponse.discuss.shareCount = count;
        // }
        
            $scope.openModal = function ($event, data) {
                $event.stopPropagation();
                $scope.shareDiscussObject = data;
                $('#shareModal').modal('show');
            }

            function initScroll() {
                if (showEditor) {
                    $timeout(
                        function () {
                            var tag = $("#discussListContainer");
                            if (tag.length > 0) {
                                $('html,body').animate({scrollTop: tag.offset().top - $(".by_header").height() - 100}, '2000');
                            }
                        }, 100);
                } else if ($scope.discussList && $scope.discussList.length > 0 && $scope.$parent.isLeafMenuSelected) {
                    $timeout(
                        function () {
                            var tag = $("#discussListContainer");
                            if (tag.length > 0) {
                                $('html,body').animate({scrollTop: tag.offset().top - $(".by_header").height() - 100}, '2000');
                            }
                        }, 100);
                }
            }

            $scope.initGrid = function (index) {
                if ($rootScope.windowWidth > 800) {
                    var gridMasonary = $(".masonry");
                    window.setTimeout(function () {
                        masonaryGridInit();
                        $(".masonry").masonry("reload");
                        /*if (gridMasonary.length === 0) {
                         masonaryGridInit();
                         } else {
                         $(".masonry").masonry("reload");
                         }*/

                    }, 100);

                }
                else if ($rootScope.windowWidth < 800) {
                    $(".grid-boxes-in").removeClass('grid-boxes-in');
                    //$("#preloader").hide();
                }
                window.scrollTo(0, 0);
                //masonaryGridInit();
            };

            function updateMetaTags() {
                var metaTagParams = BY.config.seo.communities[$scope.selectedMenu.id];
                if (metaTagParams.description) {
                    metaTagParams.description = "<p>" + metaTagParams.description + "</p>"
                }
                BY.byUtil.updateMetaTags(metaTagParams);

                //var metaTagParams = {
                //    title: $scope.selectedMenu.displayMenuName,
                //    imageUrl: "",
                //    description: "<p>"+seoDesc+"</p>",
                //    keywords: seoKeywords
                //}

            }

            function getDiscussType(){
                var discussType = $routeParams.discussType ? $routeParams.discussType : 'all';  //Needed for left side Q/A/P filters
                discussType = discussType.toLowerCase().trim();
                if(discussType != 'p' && discussType != 'f' && discussType != 'q'){
                    discussType = 'all';
                }
                return discussType;
            }

            function initDiscussListing() {
                if ($scope.selectedMenu) {
                    updateMetaTags();
                    $scope.discussType = getDiscussType();

                    if ($scope.discussType !== "all") {
                        queryParams.discussType = $routeParams.discussType;
                    }

                    tags = $.map($scope.selectedMenu.tags, function (value, key) {
                        return value.id;
                    })

                    queryParams.tags = tags.toString();  //to create comma separated tags list
                    DiscussCount.get({tags: tags, contentTypes: "f,total,p,q"}, function (counts) {
                            $scope.discuss_counts = counts.data;
                        },
                        function (error) {
                            console.log(error);
                        });

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

                                /* if($scope.discussList.length === 0){
                                 $("#preloader").hide();
                                 }*/
                                $("#preloader").hide();
                                initScroll();
                            },
                            function (error) {
                                $("#preloader").hide();
                                console.log(error);
                            });
                    }

                    $scope.getDiscussData(discussPageIdx, pageSize);

                }
            }


            function showEditorPage(event, type) {
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

            $scope.postSuccess = function () {
                $route.reload();
            };

            $scope.trustForcefully = function (html) {
                return $sce.trustAsHtml(html);
            };

            $scope.trustAsResourceUrl = function (url) {
                return $sce.trustAsResourceUrl(url);
            };

            $scope.nextLocation = function ($event, discuss, urlQueryParams) {
                $event.stopPropagation();
                var url = urlFactoryFilter.getDiscussDetailUrl(discuss, urlQueryParams, true);
                $location.path(url);
            };

            $scope.getHref = function (discuss, urlQueryParams) {
                var newHref = urlFactoryFilter.getDiscussDetailUrl(discuss, urlQueryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };


            $scope.getHrefProfile = function (profile, urlQueryParams) {
                var newHref = urlFactoryFilter.getIndvProfileUrl(profile, urlQueryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            //function getProfileDetailUrl(profile, urlQueryParams, isAngularLocation) {
            //    var proTitle = "others";
            //    if (profile && profile.userProfile && profile.userProfile.basicProfileInfo.firstName && profile.userProfile.basicProfileInfo.firstName.length > 0) {
            //        proTitle = profile.userProfile.basicProfileInfo.firstName;
            //        if (profile.userProfile.individualInfo.lastName && profile.userProfile.individualInfo.lastName != null && profile.userProfile.individualInfo.lastName.length > 0) {
            //            proTitle = proTitle + " " + profile.userProfile.individualInfo.lastName;
            //        }
            //    } else if (profile && profile.username && profile.username.length > 0) {
            //        proTitle = BY.byUtil.validateUserName(profile.username);
            //    } else {
            //        proTitle = "others";
            //    }
            //
            //    proTitle = BY.byUtil.getSlug(proTitle);
            //    var newHref = "/users/" + proTitle;
            //
            //
            //    if (urlQueryParams && Object.keys(urlQueryParams).length > 0) {
            //        //Set query params through angular location search method
            //        if (isAngularLocation) {
            //            angular.forEach($location.search(), function (value, key) {
            //                $location.search(key, null);
            //            });
            //            angular.forEach(urlQueryParams, function (value, key) {
            //                $location.search(key, value);
            //            });
            //        } else { //Set query params manually
            //            newHref = newHref + "?"
            //
            //            angular.forEach(urlQueryParams, function (value, key) {
            //                newHref = newHref + key + "=" + value + "&";
            //            });
            //
            //            //remove the last  '&' symbol from the url, otherwise browser back does not work
            //            newHref = newHref.substr(0, newHref.length - 1);
            //        }
            //    }
            //
            //    return newHref;
            //};


            //Discuss like code
            $scope.getUserCredentialForLike = function (discussLikeObj) {
                if ($scope.discussLikeObj) {
                    delete $scope.discussLikeObj.pendingUserCredential
                }
                $scope.discussLikeObj = discussLikeObj;
                $scope.discussLikeObj.pendingUserCredential = true;
                $scope.userCredential.defer = $q.defer();
                window.setTimeout(function () {
                    $(".masonry").masonry("reload");
                }, 100);

                return $scope.userCredential.defer.promise;
            }

            $scope.setUserCredentialForLike = function () {
                if ($scope.userCredential.email && BY.byUtil.validateEmailId($scope.userCredential.email)) {
                    var promise = UserValidationFilter.loginUser($scope.userCredential.email);
                    promise.then(validUser, invalidUser);
                } else {
                    $scope.likeErrMsg = "Please enter valid email";
                }

                function validUser() {
                    if ($scope.userCredential.defer) {
                        $scope.discussLikeObj.pendingUserCredential = false;
                        $scope.userCredential.defer.resolve();
                        //delete $scope.userCredential.promise;
                    }
                    window.setTimeout(function () {
                        $(".masonry").masonry("reload");
                    }, 100);
                }

                function invalidUser(errMsg) {
                    console.log("invalid user error");
                    $scope.likeErrMsg = errMsg;
                    if ($scope.userCredential.defer) {
                        $scope.userCredential.defer.reject();
                    }
                    window.setTimeout(function () {
                        $(".masonry").masonry("reload");
                    }, 100);
                    //delete $scope.userCredential.promise;
                }
            }

            $scope.cancelSetCredentialForLike = function () {
                $scope.discussLikeObj.pendingUserCredential = false;
                if ($scope.userCredential.defer) {
                    $scope.userCredential.defer.reject();
                }
                window.setTimeout(function () {
                    $(".masonry").masonry("reload");
                }, 100);
            }

            
            $scope.smartScroll = function(){
                setTimeout(function(){
                    $scope.smartHeight = $(".by_subMenu").height() + 80 + 57;
                    BY.byUtil.smartScroll($scope.smartHeight);
                }, 100);
            }
        }


        DiscussAllController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams',
            'DiscussPage', 'DiscussCount', '$sce', '$timeout', '$window', 'UrlFactoryFilter', '$q', 'UserValidationFilter'];

        byApp.registerController('DiscussAllController', DiscussAllController);
        return DiscussAllController;

    });
