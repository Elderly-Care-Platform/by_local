/**
 * Created by sanjukta on 21-07-2015.
 */
//DIscuss All
byControllers.controller('ReviewRateController', ['$scope', '$rootScope', '$location', '$route', '$routeParams','ReviewRateProfile',
    function ($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile) {

        $scope.userProfile = $scope.$parent.profileData;
        $scope.selectedRating = null;
        $scope.reviewText = "";
        $scope.blankReviewRateError = false;

        if($scope.$parent.isIndividualProfile){
            $scope.gender =  BY.config.profile.userGender[$scope.userProfile.individualInfo.sex];
        }

        //$scope.username = BY.validateUserName(localStorage.getItem("USER_NAME"));

        $scope.selectRating = function(value){
            $(".profileSelected").removeClass("profileSelected");
            $scope.selectedRating = value;
            $(".profileRate"+value).addClass("profileSelected");
        }

        $scope.postReview = function(){
            if(parseInt($scope.selectedRating) > 0 || $scope.reviewText.trim().length > 0){
                var ratePercentage = (parseInt($scope.selectedRating)/(parseInt(BY.config.profile.rate.upperLimit) - parseInt(BY.config.profile.rate.lowerLimit)))*100;
                var postReview = new ReviewRateProfile();
                postReview.userRatingPercentage = ratePercentage;
                postReview.text = $scope.reviewText;
                $scope.blankReviewRateError = false;

                postReview.$post({associatedId:$scope.userProfile.id}, function(success){
                    $scope.$parent.showProfile();
                }, function(error){

                })
            }else{
                $scope.blankReviewRateError = true;
            }
        }


    }]);
