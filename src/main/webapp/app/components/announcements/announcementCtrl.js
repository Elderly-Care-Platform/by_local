define(['byApp', 'byUtil', 'discussLikeController', 'discussReplyController', 'shareController', 'urlFactory', 'blogMasonary', 'jqueryMasonaryGrid'],
    function (byApp, byUtil, discussLikeController, discussReplyController, shareController, urlFactory, blogMasonary, jqueryMasonaryGrid) {
        function AnnouncementCtrl($scope, $rootScope, $routeParams, $location, $sce, $timeout, DiscussDetail, DiscussPage, UrlFactoryFilter) {

            var discussId = $routeParams.id,	//discuss Id from url
                isComment = $routeParams.comment,
                pageSize = 20,
                discussPageIdx = $routeParams.discussPageIdx ? $routeParams.discussPageIdx : 0,
                queryParams = {p: discussPageIdx, s: pageSize, sort: "lastModifiedAt"},
                initialize = init();
            $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;
            $("#preloader").show();


            function scrollToEditor() {
                if (isComment) {
                    $timeout(
                        function () {
                            var tag = $("#replyEditor:visible");
                            if (tag.length > 0) {
                                $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                            }
                        }, 100);
                }

            };

            function updateMetaTags() {
                var seoTitle = $scope.detailResponse.discuss.title,
                    seoDesc = $scope.detailResponse.discuss.text;

                if (!seoTitle || seoTitle.trim().length == 0) {
                    if ($scope.detailResponse.discuss.linkInfo) {
                        seoTitle = $scope.detailResponse.discuss.linkInfo.title;
                    } else if (seoDesc && seoDesc.trim().length > 0) {
                        var tempDesc = $(seoDesc).text().trim(), nextSpaceIndex;
                        nextSpaceIndex = tempDesc.indexOf(" ", 100);
                        seoTitle = tempDesc.substring(0, nextSpaceIndex);
                    }
                }

                if (!seoDesc || seoDesc.trim().length == 0) {
                    if ($scope.detailResponse.discuss.linkInfo) {
                        seoDesc = "<p>" + $scope.detailResponse.discuss.linkInfo.description + "</p>";
                    } else {
                        seoDesc = "<p>" + seoTitle + "</p>";
                    }
                }

                var metaTagParams = {
                    title: seoTitle,
                    imageUrl: BY.byUtil.getImage($scope.detailResponse.discuss),
                    description: seoDesc,
                    keywords: []
                }
                for (var i = 0; i < $scope.detailResponse.discuss.systemTags.length; i++) {
                    metaTagParams.keywords.push($scope.detailResponse.discuss.systemTags[i].name);
                }
                BY.byUtil.updateMetaTags(metaTagParams);
            };

            function getLeafCategories(categoryList) {
                var leafCategoryArr = [];
                if(categoryList.length > 0){
                    //check hidden menu for announcements
                    for(var i=0; i < categoryList.length; i++){
                        var menu = $rootScope.hiddenMenu[categoryList[i]];
                        if(menu && menu.children.length == 0){
                            leafCategoryArr.push(menu);
                        }
                    }

                    //if announcements are not in hidden menu then pick leaf categories from main menu
                    if(leafCategoryArr.length === 0){
                        for(var i=0; i < categoryList.length; i++){
                            var menu = $rootScope.menuCategoryMap[categoryList[i]];
                            if(menu && menu.children.length == 0){
                                leafCategoryArr.push(menu);
                            }
                        }
                    }
                }
                $scope.editorPostCategories = leafCategoryArr;
                return leafCategoryArr;
            }

            function getAnnouncementPosts(){
                var topicIds = $scope.detailResponse.discuss.topicId,
                    leafCategories = getLeafCategories(topicIds), leafCategoryTags = [];

                $.map(leafCategories, function (category, key) {
                    $.map(category.tags, function (value, key) {
                        leafCategoryTags.push(value.id) ;
                    })
                })
                queryParams.tags = leafCategoryTags.toString();
                queryParams.isPromotion = false;
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
                        $("#preloader").hide();
                    },
                    function (error) {
                        $("#preloader").hide();
                        console.log(error);
                    });
            }

            function init(){
                DiscussDetail.get({discussId: discussId}, function (discussDetail, header) {
                        //broadcast data to left panel, to avoid another query from left panel of detail page
                        $scope.detailResponse = discussDetail.data;
                        $scope.detailResponse.discuss.createdAt = discussDetail.data.discuss.createdAt;
                        getAnnouncementPosts();
                        updateMetaTags();
                        scrollToEditor();
                    },
                    function (error) {
                        console.log("error");
                    });
            }

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
                }
                window.scrollTo(0, 0);
            };

            $scope.trustForcefully = function (html) {
                return $sce.trustAsHtml(html);
            };
            $scope.trustAsResourceUrl = function (url) {
                return $sce.trustAsResourceUrl(url);
            };

            $scope.getHref = function (discuss, queryParams) {
                var newHref = UrlFactoryFilter.getDiscussDetailUrl(discuss, queryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            $scope.getHrefProfile = function (profile, urlQueryParams) {
                var newHref = UrlFactoryFilter.getIndvProfileUrl(profile, urlQueryParams, false);
                newHref = "#!" + newHref;
                return newHref;
            };

            $scope.showEditorPage = function(type) {
                $scope.showEditorType = type;
                $(".by_editorButtonWrap_thumb").animate({width: '100%', borderRightWidth: '0px'}, "500");
                $("." + type + "hidePanel").hide();
                $("." + type + "by_editorButtonWrap_thumb").hide();
                $("." + type + "showPanel").slideDown("500");

                if ($scope.showEditorType === 'Question') {
                    var tinyEditor = BY.byEditor.addEditor({"editorTextArea": "question_textArea"});
                }

                if ($scope.showEditorType === 'Article') {
                    var tinyEditor = BY.byEditor.addEditor({
                        "editorTextArea": "article_textArea"
                    });

                }
                $("#shareInputFeild").focus();
            }

            $scope.exitEditorDiscuss = function (type) {
                $(".by_editorButtonWrap_thumb").animate({width: '50%', borderRightWidth: '1px'}, "500");
                $("." + type + "hidePanel").show();
                $("." + type + "by_editorButtonWrap_thumb").show();
                $("." + type + "showPanel").slideUp("100", function () {
                    BY.byEditor.removeEditor();
                    //$route.reload();
                });

            }
        }

        AnnouncementCtrl.$inject = ['$scope', '$rootScope', '$routeParams', '$location', '$sce', '$timeout', 'DiscussDetail', 'DiscussPage', 'UrlFactoryFilter'];
        byApp.registerController('AnnouncementCtrl', AnnouncementCtrl);
        return AnnouncementCtrl;
    });