/**
 * Created by sanjukta on 21-07-2015.
 */
define(['byApp', 'byUtil', 'userValidation'], function(byApp, byUtil, userValidation) {
    function ReviewRateController($scope, $rootScope, $location, $route, $routeParams, ReviewRateProfile, ValidateUserCredential, UserValidationFilter){
        $scope.userProfile              = $scope.$parent.profileData;
        $scope.selectedRating           = 0;
        $scope.reviewText               = "";
        $scope.userCredential           = {'email':'', 'pwd':''};
        $scope.userSessionType          = UserValidationFilter.getUserSessionType();
        $scope.blankReviewRateError     = false;
        $scope.getReview                = getReview;
        $scope.selectRating             = selectRating;

        var postReview                  = new ReviewRateProfile();
        var initialize                  = init();
        var setReviewText               = setReviewText;

        function setReviewText(){
            if(tinymce.get("reviewTextArea") && $scope.reviewText){
                tinymce.get("reviewTextArea").setContent($scope.reviewText);
            }
        }

        function init(){
            var pendingReviewByUser = localStorage.getItem('pendingReviewByUser') ? JSON.parse(localStorage.getItem('pendingReviewByUser')) : null;
            if(pendingReviewByUser && pendingReviewByUser.associatedId === $scope.userProfile.id){
                if(pendingReviewByUser.selectedRating && pendingReviewByUser.selectedRating > 0){
                    $scope.selectRating(pendingReviewByUser.selectedRating);
                }

                $scope.reviewText = pendingReviewByUser.reviewText;
                setReviewText();
            }
            var tinyEditor = BY.byEditor.addEditor({"editorTextArea": "reviewTextArea"}, setReviewText);
            if($scope.$parent.isIndividualProfile){
                $scope.gender =  BY.config.profile.userGender[$scope.userProfile.individualInfo.sex];
            }
            $scope.getReview();

        }


        function getReview(){
            //Get review posted by currently logged in user
            postReview.$get({associatedId:$scope.userProfile.id,  userId:localStorage.getItem("USER_ID"), reviewContentType:$scope.$parent.reviewContentType}, function(response){
                var response = response.data.replies[0];
                if(response){
                    var ratingPercentage = BY.byUtil.getAverageRating(response.userRatingPercentage);
                    $scope.reviewText = response.text;
                    $scope.selectRating(ratingPercentage);
                    setReviewText();
                }

            }, function(error){
                console.log(error);
            })
        };


        function selectRating(value){
            $(".profileRatetext").removeClass("profileRate"+$scope.selectedRating);
            $(".by_btn_submit").removeAttr('disabled');
            value = parseInt(value);
            $(".by_rating_left .profileRatetext").css('color', '#000');

            $(".profileRate"+value).siblings(".profileRatetext").addClass("profileRate"+value);
            $(".profileRate"+value).siblings(".profileRatetext").css('color','#fff');
            $scope.selectedRating = value;
        }

        function postHttpReview(){
            var ratePercentage = (parseInt($scope.selectedRating)/(parseInt(BY.config.profile.rate.upperLimit) - parseInt(BY.config.profile.rate.lowerLimit)))*100;
            postReview.userRatingPercentage = ratePercentage;
            postReview.text = $scope.reviewText;
            postReview.url = encodeURIComponent(window.location.href);

            postReview.$post({associatedId:$scope.userProfile.id, reviewContentType:$scope.$parent.reviewContentType}, function(success){
                $scope.$parent.showReviews();
                $scope.$parent.showReviewsVerified();
                $scope.reviewText = "";
                localStorage.removeItem('pendingReviewByUser');
                $("#by_rate_hide").hide();
                $("#by_rate_show").show();
            }, function(errorResponse){
                console.log(errorResponse);
                $(".by_btn_submit").prop("disabled", false);
                if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                    console.log("Not a valid user")
                } else if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3001){
                    $scope.unauthorizeUserError = true;
                }
            })
        }

        $scope.postReview = function(){
            $(".by_btn_submit").prop("disabled", true);
            var content = tinymce.get("reviewTextArea").getContent();
            var reviewText = tinymce.get("reviewTextArea").getBody().textContent.trim();

            if(content.indexOf("img") !== -1 || reviewText.trim().length > 0){
                $scope.reviewText = content;
            } else{
                $scope.reviewText = "";
            }

            if(parseInt($scope.selectedRating) > 0 || $scope.reviewText.trim().length > 0){
                $scope.blankReviewRateError = false;
                $scope.unauthorizeUserError = false;
                if($scope.userSessionType && $scope.userSessionType==BY.config.sessionType.SESSION_TYPE_FULL){
                    postHttpReview();
                } else{
                    var reviewRateObj = {associatedId:$scope.userProfile.id, reviewText:$scope.reviewText, selectedRating: $scope.selectedRating};
                    localStorage.setItem('pendingReviewByUser', JSON.stringify(reviewRateObj));
                    $rootScope.nextLocation = $location.$$url;
                    $location.path('/users/login');
                }

            }else{
                $scope.blankReviewRateError = true;
                $(".by_btn_submit").prop('disabled', false);
            }
        };

        $scope.showRate = function(){
            document.getElementById("by_rate_hide").style.display = "block";
            document.getElementById("by_rate_show").style.display = "none";
        };
        $scope.hideRate = function(){
            document.getElementById("by_rate_hide").style.display = "none";
            document.getElementById("by_rate_show").style.display = "block";
        };

    }

    ReviewRateController.$inject = ['$scope', '$rootScope', '$location', '$route', '$routeParams','ReviewRateProfile','ValidateUserCredential', 'UserValidationFilter'];
    byApp.registerController('ReviewRateController', ReviewRateController);
    return ReviewRateController;
});