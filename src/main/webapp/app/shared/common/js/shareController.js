define(["byApp"], function(byApp) {
    'use strict';

    function ShareController($scope, $rootScope, $location, ValidateUserCredential,ShareDiscuss) {
        $scope.shareComment = function(sharedObj, $event){
            var caption = "", picture = "", description = "";
        	$event.stopPropagation();
            if(FB && sharedObj){
                caption = sharedObj.title ? sharedObj.title: "BeautifulYears";
                picture = BY.byUtil.getImage(sharedObj);
                description = sharedObj.text ? $(sharedObj.text).text() : "";

                if((!description || description =="") && (sharedObj.linkInfo)){
                	description = sharedObj.linkInfo.description || "";
                	description = description.length>300 ? this.substr(0,300-1)+'&hellip;' : description;
                	caption = caption || sharedObj.linkInfo.title || "BeautifulYears";
                }

                FB.ui({
                    method: 'feed',
                    link: window.location.origin + "/#!/discuss/"+sharedObj.id,
                    picture: picture,
                    caption: "Beautiful Years",
                    description: description,
                    name:caption
                }, function(response){
                    console.log(response);
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
    
    ShareController.$inject=['$scope', '$rootScope', '$location','ValidateUserCredential','ShareDiscuss'];
    byApp.registerController('ShareController', ShareController);
    return ShareController;      

});


