define(['byApp', 'byUtil', 'discussLikeController', 'discussDetailLeftController', 'discussReplyController', 'shareController'],
    function(byApp, byUtil, discussLikeController, discussDetailLeftController, discussReplyController, shareController) {
    function DiscussDetailController($scope, $rootScope, $routeParams, $location, DiscussDetail, $sce, broadCastData, $timeout){
        var discussId = $routeParams.id;	//discuss Id from url
        var isComment = $routeParams.comment;
        $scope.removeSpecialChars = BY.byUtil.removeSpecialChars;


        $scope.discussDetailViews = {};
        $scope.discussDetailViews.leftPanel = "app/components/discussDetail/discussDetailLeftPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $scope.discussDetailViews.contentPanel = "app/components/discussDetail/discussDetailContentPanel.html?versionTimeStamp=%PROJECT_VERSION%";
        $("#preloader").show();


        var scrollToEditor = function(){
            if(isComment){
                $timeout(
                    function () {
                        var tag = $("#replyEditor:visible");
                        if (tag.length > 0) {
                            $('html,body').animate({scrollTop: tag.offset().top - $(".breadcrumbs").height() - $(".header").height()}, 'slow');
                        }
                    }, 100);
            }

        };

        DiscussDetail.get({discussId: discussId}, function (discussDetail, header) {
                //broadcast data to left panel, to avoid another query from left panel of detail page
                $scope.detailResponse = discussDetail.data;
                broadCastData.update(discussDetail.data.discuss);
                $scope.detailResponse.discuss.createdAt = discussDetail.data.discuss.createdAt;
                $("#preloader").hide();

                var metaTagParams = {
                    title:  $scope.detailResponse.discuss.title,
                    imageUrl:   BY.byUtil.getImage($scope.detailResponse.discuss),
                    description:    $scope.detailResponse.discuss.text,
                    keywords:[]
                }
                for(var i=0;i<$scope.detailResponse.discuss.systemTags.length ; i++){
                	metaTagParams.keywords.push($scope.detailResponse.discuss.systemTags[i].name);
                }
                BY.byUtil.updateMetaTags(metaTagParams);
                scrollToEditor();
            },
            function (error) {
                console.log("error");
            });



        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };
        $scope.trustAsResourceUrl = function(url) {
            return $sce.trustAsResourceUrl(url);
        };

        //update data in view after comments/answers are posted from child controller
        $scope.$on('handleBroadcast', function () {
            if (broadCastData.newData.discuss && discussId === broadCastData.newData.discuss.id) {
                $scope.detailResponse = broadCastData.newData;
            }
        });

        $scope.updateShareCount = function(count){
            $scope.detailResponse.discuss.shareCount = count;
        }

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

            disTitle = BY.byUtil.getCommunitySlug(disTitle);
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
        	 if(profile.userProfile && profile.userProfile.basicProfileInfo.firstName && profile.userProfile.basicProfileInfo.firstName.length > 0){
        		 proTitle = profile.userProfile.basicProfileInfo.firstName;
        		 if(profile.userProfile.individualInfo.lastName && profile.userProfile.individualInfo.lastName != null  && profile.userProfile.individualInfo.lastName.length > 0){
        			 proTitle = proTitle + " " + profile.userProfile.individualInfo.lastName;
        		 }
        	 } else if(profile.username && profile.username.length > 0){
        		 proTitle = BY.byUtil.validateUserName(profile.username);
        	 }else{
        		 proTitle = "others";
        	 }

        	proTitle = BY.byUtil.getCommunitySlug(proTitle);
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

        $scope.getHrefProfileReply = function(profile, urlQueryParams){
            var newHref = getProfileDetailUrlReply(profile, urlQueryParams, false);
            newHref = "#!" + newHref;
            return newHref;
        };

        function getProfileDetailUrlReply(profile, urlQueryParams, isAngularLocation){
            var proTitle = "others";
             if(profile.userName && profile.userName.length > 0){
                 proTitle = BY.byUtil.validateUserName(profile.username);
             }else{
                 proTitle = "others";
             }

            proTitle = BY.byUtil.getCommunitySlug(proTitle);
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
    }

    DiscussDetailController.$inject = ['$scope', '$rootScope', '$routeParams', '$location', 'DiscussDetail', '$sce', 'broadCastData', '$timeout'];
    byApp.registerController('DiscussDetailController', DiscussDetailController);
    return DiscussDetailController;
});