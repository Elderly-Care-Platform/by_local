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
                }

            }, function(error){

            })
        }

        $scope.getReview();

        $scope.selectRating = function(value){
        	value = parseInt(value);
            $(".profileSelected").removeClass("profileSelected");
            $scope.selectedRating = value;
            $(".profileRate"+value).addClass("profileSelected");
        }

        $scope.postReview = function(){
            if(parseInt($scope.selectedRating) > 0 || $scope.reviewText.trim().length > 0){
                var ratePercentage = (parseInt($scope.selectedRating)/(parseInt(BY.config.profile.rate.upperLimit) - parseInt(BY.config.profile.rate.lowerLimit)))*100;

                postReview.userRatingPercentage = ratePercentage;
                postReview.text = $scope.reviewText;
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
