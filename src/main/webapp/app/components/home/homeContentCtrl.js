
byControllers.controller('BYHomeContentCtrl', ['$scope', '$location', 'DiscussPage', '$sce', 'FindServices',
    function ($scope,  $location, DiscussPage, $sce, FindServices) {
        var contentSize;
        $scope.contentType =  $scope.$parent.contentType;
        if($scope.$parent.contentType==="all"){
            contentSize = 1;
        }else{
            contentSize = 10;
        }

        if($scope.contentType==="all" || $scope.contentType==="P"){
            DiscussPage.get({discussType: 'P',isFeatured:true,p:0,s:contentSize,sort:"lastModifiedAt"},
                function(value){
                    $scope.posts = value.data.content;
                    $scope.postsPageInfo = BY.byUtil.getPageInfo(value.data);
                    $scope.postsPageInfo.isQueryInProgress = false;
                },
                function(error){
                    console.log("DiscussPage");
                });
        }

        if($scope.contentType==="all" || $scope.contentType==="Q"){
            DiscussPage.get({discussType: 'Q',isFeatured:true,p:0,s:contentSize,sort:"lastModifiedAt"},
                function(value){
                    $scope.questions = value.data.content;
                    $scope.questionsPageInfo = BY.byUtil.getPageInfo(value.data);
                    $scope.questionsPageInfo.isQueryInProgress = false;
                },
                function(error){
                    console.log("DiscussPage");
                });
        }

        if($scope.contentType==="all" || $scope.contentType==="S"){
            FindServices.get({page:0,size:contentSize,sort:"lastModifiedAt",isFeatured:true},
                function(value){
                    $scope.services = value.data.content;
                    $scope.servicesPageInfo = BY.byUtil.getPageInfo(value.data);
                    $scope.servicesPageInfo.isQueryInProgress = false;
                },
                function(error){
                    console.log("DiscussPage");
                });
        }

        $scope.loadMore = function($event){
            if($scope.contentType !=="all"){
                if($scope.contentType === "P"){
                    $scope.pageInfo = $scope.postsPageInfo;
                }else if($scope.contentType === "Q"){
                    $scope.pageInfo = $scope.questionsPageInfo;
                }else if($scope.contentType === "S"){
                    $scope.pageInfo = $scope.servicesPageInfo;
                }

                if($scope.pageInfo && !$scope.pageInfo.lastPage && !$scope.pageInfo.isQueryInProgress ){
                    $scope.pageInfo.isQueryInProgress = true;
                    var p = $scope.pageInfo.number + 1,
                        s = $scope.pageInfo.size;

                    if($scope.contentType === "Q"){
                        DiscussPage.get({discussType: $scope.contentType, isFeatured:true, p:p, s:s, sort:"lastModifiedAt"},
                            function(value){
                                if(value.data.content.length > 0){
                                    $scope.questionsPageInfo.isQueryInProgress = false;
                                    $scope.questions = $scope.questions.concat(value.data.content);
                                }
                                $scope.questionsPageInfo = BY.byUtil.getPageInfo(value.data);
                                $scope.questionsPageInfo.isQueryInProgress = false;
                            },
                            function(error){
                                console.log("DiscussPage");
                            });
                    } else if($scope.contentType === "P"){
                        DiscussPage.get({discussType: $scope.contentType, isFeatured:true, p:p, s:s, sort:"lastModifiedAt"},
                            function(value){
                                if(value.data.content.length > 0){
                                    $scope.postsPageInfo.isQueryInProgress = false;
                                    $scope.posts = $scope.posts.concat(value.data.content);
                                }
                                $scope.postsPageInfo = BY.byUtil.getPageInfo(value.data);
                                $scope.postsPageInfo.isQueryInProgress = false;
                            },
                            function(error){
                                console.log("DiscussPage");
                            });
                    } else{
                        FindServices.get({page:p,size:s,sort:"lastModifiedAt",isFeatured:true},
                            function(value){
                                if(value.data.content.length > 0){
                                    $scope.servicesPageInfo.isQueryInProgress = false;
                                    $scope.services = $scope.services.concat(value.data.content);
                                }
                                $scope.servicesPageInfo = BY.byUtil.getPageInfo(value.data);
                                $scope.servicesPageInfo.isQueryInProgress = false;
                            },
                            function(error){
                                console.log("DiscussPage");
                            });
                    }
                }
            }

        };
    }
]);

