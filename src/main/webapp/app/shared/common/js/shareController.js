define(["byApp"], function(byApp) {
    'use strict';

    function ShareController($scope, $http, $rootScope, $location, $sce, $filter, ValidateUserCredential, ShareDiscuss) {

        $scope.pathName = location.pathname;
        
        $scope.shares = {};
        $scope.emailError = "";
        
        $scope.resetError = function () {
            $scope.emailError = "";
            $scope.shareForm.emails.$invalid = "";
            $(".by_btn_submit").prop("disabled", false);
        }
        
        $scope.checkSession = localStorage.getItem("SessionId");
        
        $scope.validateEmails = function() {
        	var emailIds;
        	if($scope.shares.email != undefined){
        		emailIds = $scope.shares.email.split(',');
            	for (var i = 0; i < emailIds.length; i++) {
            		var emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
                    if(!emailValidation.test(emailIds[i])){
                    	$scope.emailError = emailIds[i] + ' does not appear to be a proper email!';
                    	$(".by_btn_submit").prop("disabled", true);
                    }else{
                        $scope.emailError = "";
                        $(".by_btn_submit").prop("disabled", false);
                    }       
            	}
        	}else{
        		emailIds = null;
        		$scope.emailError = "";
        	}
        	
        }
        	
        $scope.resetErrorOnModalDismiss = function resetErrorOnModalDismiss() {
        	$scope.resetError();
        }
        
        $scope.dismissModal = function dismissModal() {
        	$("#shareModal").modal("hide");
        }

        
        
        $scope.emailShare = function emailShare(isValidForm, data) {
            
            var emailList = $scope.shares.email;
            var emailIds = [];
            
            emailIds = emailList.split(",");               

            var discussId = data.id;
            
        	var emailParams = {
        		emailIds: emailIds,
        		subject: $scope.shares.message,
        		senderName: $scope.shares.guestName
        	};
        		
        	if( $scope.emailError == ""){
        		$http.post($scope.pathName + 'api/v1/share/email/' + discussId, emailParams   
        		).success(function (response, status, headers, config) {
        			$("#shareEmailModal").modal("hide");
        			if (response) {
                        var shareDiscuss = new ShareDiscuss();
                        shareDiscuss.id = data.id;
                        shareDiscuss.$post({},function(res){
                            $scope.$parent.updateShareCount(res.data.shareCount);
                        },function(err){
                            console.log("alert posting the share count");
                        });
                    } else {
                        console.log('Post was not published.');
                    }
        		}).error(function(errorRes) {    
        			$(".by_btn_submit").prop("disabled", true);
        			if(errorRes == undefined){
        			}else{
        				$scope.emailError = errorRes.error.errorMsg;
        				$(".by_btn_submit").prop("disabled", true);
        				$("#shareEmailModal").modal("show");
        			}
        		});
        	}

        }
                
    	$scope.shareComment = function(sharedObj, $event){
            var caption = "", picture = Math.random() + ".jpg", description = "";
        	$event.stopPropagation();
            if(FB && sharedObj){
                caption = sharedObj.title ? sharedObj.title: "BeautifulYears";
                picture = BY.byUtil.getImage(sharedObj,true);
                description = sharedObj.text ? $(sharedObj.text).text() : "";

                if((!description || description =="") && (sharedObj.linkInfo)){
                	description = sharedObj.linkInfo.description || "";
                	description = description.length>300 ? this.substr(0,300-1)+'&hellip;' : description;
                	caption = caption || sharedObj.linkInfo.title || "BeautifulYears";
                }

                FB.ui({
                    method: 'feed',
                    link: window.location.origin + "/#!/community/"+sharedObj.id+"?v="+Math.random(),
                    picture: picture,
                    caption: "Beautiful Years",
                    description: description,
                    name:caption
                }, function(response){
                    if (response && response.post_id) {
                        var shareDiscuss = new ShareDiscuss();
                        shareDiscuss.id = sharedObj.id;
                        shareDiscuss.$post({},function(res){
                            $scope.$parent.updateShareCount(res.data.shareCount);
                        },function(err){
                            console.log("alert posting the share count");
                        });
                    } else {
                        console.log('Post was not published.');
                    }
                });
            }
        }
    }
    
    ShareController.$inject=['$scope', '$http', '$rootScope', '$location', '$sce', '$filter', 'ValidateUserCredential','ShareDiscuss'];
    byApp.registerController('ShareController', ShareController);
    return ShareController;      

});


