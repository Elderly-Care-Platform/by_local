define(["byApp", "discussService"], function (byApp, discussService) {
    'use strict';

    function ShareController($scope, $http, $sce, ShareDiscuss, DisServiceFilter) {

        $scope.pathName = location.pathname;

        $scope.submitted = false;

        $scope.shares = {};
        $scope.emailError = "";

        $scope.trustForcefully = function (html) {
            return $sce.trustAsHtml(html);
        };

        $scope.resetError = function () {
            $scope.emailError = "";
            $(".by_btn_submit").prop("disabled", false);
        }

        $scope.checkSession = localStorage.getItem("SessionId");

        $scope.validateEmails = function () {
            var emailIds;
            if ($scope.shares.email != undefined) {
                emailIds = $scope.shares.email.split(/[\s,;|]+/);
                for (var i = 0; i < emailIds.length; i++) {
                    var emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if (emailIds[i].trim() != "" && !emailValidation.test(emailIds[i].trim())) {
                        $scope.emailError = emailIds[i] + ' does not appear to be a proper email!';
                        //$(".by_btn_submit").prop("disabled", true);
                    } else {
                        $scope.emailError = "";
                        $(".by_btn_submit").prop("disabled", false);
                    }
                }
            } else if (emailIds == null) {
                $scope.emailError = "Please enter atleast one emailId!";
            } else {
                $scope.emailError = '';
            }

        }

        $scope.resetErrorOnModalDismiss = function resetErrorOnModalDismiss() {
            $scope.resetError();
            $scope.shares.email = '';
            $scope.shares.guestName = '';
            $scope.shares.message = '';
            $scope.submitted = false;

        }

        $scope.dismissModal = function dismissModal() {
            $("#shareModal").modal("hide");
        }


        $scope.emailShare = function emailShare(isValidForm, data) {
            $scope.validateEmails();
            $scope.submitted = true;
            if ($scope.emailError != "") {
                return;
            }
            var emailList = $scope.shares.email;
            var emailIds = [];

            emailIds = emailList.split(/[\s,;|]+/);

            var discussId = data.id;

            var emailParams = {
                emailIds: emailIds,
                subject: $scope.shares.message,
                senderName: $scope.shares.guestName
            };

            function updateShareCnt() {
                var shareDiscuss = new ShareDiscuss();
                shareDiscuss.id = data.id;
                shareDiscuss.$post({}, function (res) {
                    data.shareCount = res.data.shareCount;
                    //$scope.$parent.updateShareCount(res.data.shareCount);
                }, function (err) {
                    console.log("alert posting the share count");
                });
            }


            if ($scope.emailError == "") {

                $http.post(apiPrefix + 'api/v1/share/email/' + discussId, emailParams
                ).success(function (response, status, headers, config) {
                        $("#shareEmailModal").modal("hide");
                        $scope.resetErrorOnModalDismiss();
                        if (response) {
                            updateShareCnt();
                        } else {
                            console.log('Post was not published.');
                        }
                    }).error(function (errorRes) {
                        $(".by_btn_submit").prop("disabled", true);
                        if (errorRes == undefined) {
                        } else {
                            $scope.emailError = errorRes.error.errorMsg;
                            $(".by_btn_submit").prop("disabled", true);
                            $("#shareEmailModal").modal("show");
                        }
                    });
            }

        }


        $scope.shareComment = function (sharedObj, $event) {
            var name = "", picture = Math.random() + ".jpg", description = "";
            $event.stopPropagation();
            if (FB && sharedObj) {
                name = sharedObj.title ? sharedObj.title : "BeautifulYears";
                picture = BY.byUtil.getImage(sharedObj, true);
                description = sharedObj.text ? $(sharedObj.text).text() : "";

                if ((!description || description == "") && (sharedObj.linkInfo)) {
                    description = sharedObj.linkInfo.description || "";
                    description = description.length > 300 ? this.substr(0, 300 - 1) + '&hellip;' : description;
                    name = name || sharedObj.linkInfo.title || "BeautifulYears";
                }

                FB.ui({
                    method: 'feed',
                    link: DisServiceFilter.getDiscussAbsUrl(sharedObj),
                    picture: picture,
                    caption: "Beautiful Years",
                    description: description,
                    name: name
                }, function (response) {
                    if (response && response.post_id) {
                        var shareDiscuss = new ShareDiscuss();
                        shareDiscuss.id = sharedObj.id;
                        shareDiscuss.$post({}, function (res) {
                            $scope.$parent.updateShareCount(res.data.shareCount);
                        }, function (err) {
                            console.log("alert posting the share count");
                        });
                    } else {
                        console.log('Post was not published.');
                    }
                });
            }
        }
    }

    ShareController.$inject = ['$scope', '$http', '$sce', 'ShareDiscuss', 'DisServiceFilter'];
    byApp.registerController('ShareController', ShareController);
    return ShareController;

});


