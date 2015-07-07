/**
 * Created by sanjukta on 02-07-2015.
 */
byApp.directive('bindHtmlUnsafe', function( $compile ) {
    return function( $scope, $element, $attrs ) {

        var compile = function( newHTML ) { // Create re-useable compile function
            newHTML = $compile(newHTML)($scope); // Compile html
            $element.html('').append(newHTML); // Clear and append it
        };

        var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable
                                              // Where the HTML is stored

        $scope.$watch(htmlName, function( newHTML ) { // Watch for changes to
            // the HTML
            if(!newHTML) return;
            compile(newHTML);   // Compile it
        });

    };
});

byApp.directive('diHref', ['$location', '$route',
    function ($location, $route) {
        return function (scope, element, attrs) {
            scope.$watch('diHref', function () {
                if (attrs.diHref) {
                    element.attr('href', attrs.diHref);
                    element.bind('click', function (event) {
                        scope.$apply(function () {
                            if ($location.url() == attrs.diHref || "#" + $location.url() == attrs.diHref) $route.reload();
                        });
                    });
                }
            });
        }
    }]);


byApp.directive('fallbackSrc', function () {
    var fallbackSrc = {
        link: function postLink(scope, iElement, iAttrs) {
            iElement.bind('error', function() {
            	try{
            		var element = angular.element(this);
                	var count = isNaN(parseInt(element.attr("fallbackCount"))) ?  0 : parseInt(element.attr("fallbackCount")) ;
                	element.attr("fallbackCount", count+1);
                	var fallbackSrs = JSON.parse(iAttrs.fallbackSrc);
                	if(fallbackSrs && fallbackSrs.length > 0 && fallbackSrs.length > count){
                		angular.element(this).attr("src", fallbackSrs[count]);
                	}else{
                		console.log("removing fallback");
                		angular.element(this).removeAttr("fallback-src");
                		angular.element(this).hide();
                	}
            	}catch(e){
            		console.log("fallback error");
            	}
            	
            });
        }
    }
    return fallbackSrc;
});

byApp.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            var storyElem = $("#"+attr.onFinishRender);
            var data = $("<div/>").html(storyElem.text()).text();
            storyElem.html(data);

            $timeout(
                function () {
                    storyElem.dotdotdot();
                }, 100);

//        	storyElem.dotdotdot({ellipsis	: '...', callback	: function( isTruncated, orgContent ) {
//        		if(isTruncated){
//        			element.css("padding-top", "20px");
//        		}else{
//        			element.css("padding-top", "5px");
//        		}
//        	}});

//        	storyElem.find('p').each(function() {
//                var $this = $(this);
//                if($this.html().replace(/\s|&nbsp;/g, '').length == 0)
//                    $this.remove();
//            });
        }
    }
});


byApp.directive('timeSince', function($filter){
    var getTimeSince = {
        link : function(scope, element, attr){
            var seconds = Math.floor((new Date() - attr.timeSince) / 1000);
            var interval = Math.floor(seconds / 60);

            if (interval >= 1 && interval < 60) {
                if(interval===1)
                    element.html(interval + " minute ago");
                else
                    element.html(interval + " minutes ago");
                return;
            } else if(interval < 1){
                element.html("just now");
                return;
            } else {
                interval = Math.floor(seconds / 3600);
                if (interval >= 1 && interval < 24) {
                    if(interval===1)
                        element.html(interval + " hour ago");
                    else
                        element.html(interval + " hours ago");
                    return;
                }

                interval = Math.floor(seconds / 86400);
                if (interval >= 1 && interval < 30) {
                    if(interval===1)
                        element.html(interval + " day ago");
                    else
                        element.html(interval + " days ago");
                    return
                }

                var oldData = $filter('date')(attr.timeSince, 'MMM dd, yyyy');
                element.html(oldData);
                return;
            }
        }

    };
    return getTimeSince;
});


byApp.directive('formValidation', function() {
    var EMAIL_REGEXP = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

    return {
        require: 'ngModel',
        restrict: '',
        link: function(scope, elm, attrs, ctrl) {
            // only apply the validator if ngModel is present and Angular has added the email validator
            if (ctrl && ctrl.$validators.email) {
                // this will overwrite the default Angular email validator
                ctrl.$validators.email = function(modelValue) {
                    return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                };
            }
        }
    };
});

byApp.directive('validateUserName', function(){
    return {
        restrict: '',
        link: function(scope, elm, attrs) {
            if(!attrs.validateUserName || attrs.validateUserName.trim()==="" || attrs.validateUserName==="null"){
                scope.username = "Anonymous";
            }else{
                scope.username = attrs.validateUserName;
            }
        }
    };
});


byApp.directive('image', function($q) {
    'use strict'

    var URL = window.URL || window.webkitURL;

    var getResizeArea = function () {
        var resizeAreaId = 'fileupload-resize-area';

        var resizeArea = document.getElementById(resizeAreaId);

        if (!resizeArea) {
            resizeArea = document.createElement('canvas');
            resizeArea.id = resizeAreaId;
            resizeArea.style.visibility = 'hidden';
            document.body.appendChild(resizeArea);
        }

        return resizeArea;
    }

    var resizeImage = function (origImage, options) {
        var maxHeight = options.resizeMaxHeight || 300;
        var maxWidth = options.resizeMaxWidth || 250;
        var quality = options.resizeQuality || 0.7;
        var type = options.resizeType || 'image/jpg';

        var canvas = getResizeArea();

        var height = origImage.height;
        var width = origImage.width;

        // calculate the width and height, constraining the proportions
        if (width > height) {
            if (width > maxWidth) {
                height = Math.round(height *= maxWidth / width);
                width = maxWidth;
            }
        } else {
            if (height > maxHeight) {
                width = Math.round(width *= maxHeight / height);
                height = maxHeight;
            }
        }

        canvas.width = width;
        canvas.height = height;

        //draw image on canvas
        var ctx = canvas.getContext("2d");
        ctx.drawImage(origImage, 0, 0, width, height);

        // get the data from canvas as 70% jpg (or specified type).
        return canvas.toDataURL(type, quality);
    };

    var createImage = function(url, callback) {
        var image = new Image();
        image.onload = function() {
            callback(image);
        };
        image.src = url;
    };

    var fileToDataURL = function (file) {
        var deferred = $q.defer();
        var reader = new FileReader();
        reader.onload = function (e) {
            deferred.resolve(e.target.result);
        };
        reader.readAsDataURL(file);
        return deferred.promise;
    };


    return {
        restrict: 'A',
        scope: {
            image: '=',
            resizeMaxHeight: '@?',
            resizeMaxWidth: '@?',
            resizeQuality: '@?',
            resizeType: '@?',
        },
        link: function postLink(scope, element, attrs, ctrl) {

            var doResizing = function(imageResult, callback) {
                createImage(imageResult.url, function(image) {
                    var dataURL = resizeImage(image, scope);
                    imageResult.resized = {
                        dataURL: dataURL,
                        type: dataURL.match(/:(.+\/.+);/)[1],
                    };
                    callback(imageResult);
                });
            };

            var applyScope = function(imageResult) {
                scope.$apply(function() {
                    //console.log(imageResult);
                    if(attrs.multiple)
                        scope.image.push(imageResult);
                    else
                        scope.image = imageResult;
                });
            };


            element.bind('change', function (evt) {
                //when multiple always return an array of images
                if(attrs.multiple)
                    scope.image = [];

                var files = evt.target.files;
                for(var i = 0; i < files.length; i++) {
                    //create a result object for each file in files
                    var imageResult = {
                        file: files[i],
                        url: URL.createObjectURL(files[i])
                    };

                    fileToDataURL(files[i]).then(function (dataURL) {
                        imageResult.dataURL = dataURL;
                    });

                    if(scope.resizeMaxHeight || scope.resizeMaxWidth) { //resize image
                        doResizing(imageResult, function(imageResult) {
                            applyScope(imageResult);
                        });
                    }
                    else { //no resizing
                        applyScope(imageResult);
                    }
                }
            });
        }
    };
});
