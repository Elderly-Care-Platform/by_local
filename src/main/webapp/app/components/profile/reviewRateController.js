/**
 * Created by sanjukta on 21-07-2015.
 */
//DIscuss All
byControllers.controller('ReviewRateController', ['$scope', '$rootScope', '$location', '$route', '$routeParams','ReviewRateProfile','ValidateUserCredential',
    function ($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile, ValidateUserCredential) {

        $scope.userProfile = $scope.$parent.profileData;
        $scope.selectedRating = 0;
        $scope.reviewText = "";
        $scope.blankReviewRateError = false;
        var postReview = new ReviewRateProfile();

        var editorInitCallback = function(){
            if(tinymce.get("reviewTextArea") && $scope.reviewText){
                tinymce.get("reviewTextArea").setContent($scope.reviewText);
            }
        }
        var tinyEditor = BY.addEditor({"editorTextArea": "reviewTextArea", "commentEditor": true}, editorInitCallback);

        if($scope.$parent.isIndividualProfile){
            $scope.gender =  BY.config.profile.userGender[$scope.userProfile.individualInfo.sex];
        }

        $scope.getReview = function(){
            postReview.$get({associatedId:$scope.userProfile.id, userId:localStorage.getItem("USER_ID"), reviewContentType:$scope.$parent.reviewContentType}, function(response){
                var response = response.data.replies[0];
                if(response){
                    var ratingPercentage = BY.byUtil.getAverageRating(response.userRatingPercentage);
                    $scope.reviewText = response.text;
                    $scope.selectRating(ratingPercentage);
                    editorInitCallback();
                }

            }, function(error){

            })
        }

        $scope.getReview();

        $scope.selectRating = function(value){
            $(".by_btn_submit").removeAttr('disabled');
        	value = parseInt(value);
            $(".profileSelected").removeClass("profileSelected");
            $scope.selectedRating = value;
            $(".profileRate"+value).addClass("profileSelected");
        }

        $scope.postReview = function(){
            var content = tinymce.get("reviewTextArea").getContent();
            var reviewText = tinymce.get("reviewTextArea").getBody().textContent.trim();

            if(content.indexOf("img") !== -1 && reviewText.trim().length > 0){
                $scope.reviewText = content;
            } else{
                $scope.reviewText = null;
            }


            if(parseInt($scope.selectedRating) > 0 || $scope.reviewText.trim().length > 0){
                var ratePercentage = (parseInt($scope.selectedRating)/(parseInt(BY.config.profile.rate.upperLimit) - parseInt(BY.config.profile.rate.lowerLimit)))*100;

                postReview.userRatingPercentage = ratePercentage;
                postReview.text = $scope.reviewText;
                postReview.url = window.location.href;
                $scope.blankReviewRateError = false;
                $scope.unauthorizeUserError = false;

                postReview.$post({associatedId:$scope.userProfile.id, reviewContentType:$scope.$parent.reviewContentType}, function(success){
                    $scope.$parent.showProfile();
                }, function(errorResponse){
                    console.log(errorResponse);
                    if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                        ValidateUserCredential.login();
                    } else if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3001){
                        $scope.unauthorizeUserError = true;
                    }
                })
            }else{
                $scope.blankReviewRateError = true;
            }
        }


    }]);
