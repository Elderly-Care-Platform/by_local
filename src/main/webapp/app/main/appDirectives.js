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


byApp.directive('loadImage', function($q, $http, $timeout) {
    'use strict'

    var URL = window.URL || window.webkitURL;
    var uploadImageinServer = function (formData) {
        var deferred = $q.defer();
        return deferred.promise;
    };

    return {
        restrict: 'A',
        scope: {
            loadImage: '=',
            imgArray:'=?'
        },
        link: function postLink(scope, element, attrs, ctrl) {
            if(attrs.multiple){
                scope.loadImage = scope.$parent.galleryImages || [];
            }

            element.bind('change', function (evt) {
                if(attrs.multiple){
                    scope.loadImage = scope.$parent.galleryImages || [];
                } else{
                    scope.loadImage = [];
                }

                var currentLength = scope.loadImage.length;
                var files = evt.target.files;
                for(var i = 0; i < files.length; i++) {
                    (function(val,idx){
                        scope.$apply(function() {
                            scope.loadImage.push({thumbnailImage:"", loading:true});
                        });
                        var formData = new FormData();
                        formData.append('image', files[val], files[val].name);


                        $http.post('UploadFile?transcoding=true', formData, {
                            transformRequest: angular.identity,
                            headers: {'Content-Type': undefined}
                        }).success(function (result) {
                            scope.loadImage.splice(idx+val, 1, result);
                        }).error(function (result) {
                            console.log("Upload profile image failed");
                        });
                    })(i,currentLength);
                }
            });
        }
    };
});



byApp.directive('autoComplete', function ($timeout) {
    //return function(scope, iElement, iAttrs) {
    //    iElement.autocomplete({
    //        source: scope[iAttrs.options],
    //        select: function(event, item) {
    //            $timeout(function() {
    //                iElement.trigger(event, item);
    //                item.item.selected = true;
    //                scope.selectServiceType(item.item);
    //            }, 0);
    //        }
    //    });
    //};

    return {
        scope: {
            options: '=?',
            details: '=?',
            onSelectCallback: '=?',
            obj: '=?',
            onChangeCallback: '=?'
        },
        link: function (scope, element, attrs) {
            element.autocomplete({
                source: scope.options,
                select: function (event, item) {
                    $timeout(function () {
                        element.trigger(event, item);
                        item.item.selected = true;
                        scope.onSelectCallback(item.item, scope.obj);
                    }, 0);
                },
                change: function(event, item){
                    if(scope.onChangeCallback){
                        scope.onChangeCallback(item.item, scope.obj);
                    }
                }
            });
        }
    };
});

byApp.directive('rateCalculator', function(){
    return {
        restrict: 'A',
        link: function(scope, elem, attrs) {
            var profileRating = BY.byUtil.getAverageRating(attrs.rateCalculator);
            elem.html(profileRating);
            elem.addClass("profileRate"+Math.round(profileRating));
        }
    };
});


byApp.directive('windowResize', function ($window) {
    return {
        scope: {
            callback: '=?'
        },
        link: function (scope, element) {
        	var w = angular.element($window);
            scope.getWindowDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getWindowDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                //var height =  (newValue.h - 100),
	           	 //width = (newValue.w - 100);
	           	scope.callback(scope.windowHeight, scope.windowWidth);

            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    };
});

byApp.directive('elementResize', function () {
    return {
        scope: {
            callback: '=?'
        },
        link: function (scope, element) {
            var w = angular.element(element);
            scope.getElementDimensions = function () {
                return {
                    'h': w.height(),
                    'w': w.width()
                };
            };
            scope.$watch(scope.getElementDimensions, function (newValue, oldValue) {
                scope.windowHeight = newValue.h;
                scope.windowWidth = newValue.w;

                //var height =  (newValue.h - 100),
                //width = (newValue.w - 100);
                scope.callback(scope.windowHeight, scope.windowWidth);

            }, true);

            w.bind('resize', function () {
                scope.$apply();
            });
        }
    };
});



