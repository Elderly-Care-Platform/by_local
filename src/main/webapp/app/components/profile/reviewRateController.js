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
<<<<<<< HEAD
            $(".by_btn_submit").removeAttr('disabled');
        	value = parseInt(value);
            $(".profileSelected").removeClass("profileSelected");
            $scope.selectedRating = value;
            $(".profileRate"+value).addClass("profileSelected");
=======
            $(".profileRatetext").removeClass("profileRate"+$scope.selectedRating);
            $(".by_btn_submit").removeAttr('disabled');
        	value = parseInt(value);
            $(".by_rating_left .profileRatetext").css('color', '#000');

            $(".profileRate"+value).siblings(".profileRatetext").addClass("profileRate"+value);
            $(".profileRate"+value).siblings(".profileRatetext").css('color','#fff');
            $scope.selectedRating = value;
>>>>>>> remotes/origin/profileChanges
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
                var ratePercentage = (parseInt($scope.selectedRating)/(parseInt(BY.config.profile.rate.upperLimit) - parseInt(BY.config.profile.rate.lowerLimit)))*100;

                postReview.userRatingPercentage = ratePercentage;
                postReview.text = $scope.reviewText;
                postReview.url = window.location.href;
                $scope.blankReviewRateError = false;
                $scope.unauthorizeUserError = false;

                postReview.$post({associatedId:$scope.userProfile.id, reviewContentType:$scope.$parent.reviewContentType}, function(success){
<<<<<<< HEAD
                    $scope.$parent.showProfile();
=======
                    $scope.$parent.showReviews();
                    $scope.reviewText = "";
                    $("#by_rate_hide").hide();
                    $("#by_rate_show").show();
>>>>>>> remotes/origin/profileChanges
                }, function(errorResponse){
                    console.log(errorResponse);
                    $(".by_btn_submit").prop("disabled", false);
                    if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3002){
                        ValidateUserCredential.login();
                    } else if(errorResponse.data && errorResponse.data.error && errorResponse.data.error.errorCode === 3001){
                        $scope.unauthorizeUserError = true;
                    }
                })
            }else{
                $scope.blankReviewRateError = true;
                $(".by_btn_submit").prop('disabled', false);
            }
        }
<<<<<<< HEAD
=======
        
        $scope.showRate = function(){
        	document.getElementById("by_rate_hide").style.display = "block";
            document.getElementById("by_rate_show").style.display = "none";
        };
        $scope.hideRate = function(){
        	document.getElementById("by_rate_hide").style.display = "none";
            document.getElementById("by_rate_show").style.display = "block";
        };
>>>>>>> remotes/origin/profileChanges


    }]);
