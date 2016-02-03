define(["byApp", "angular"], function (byApp, angular) {

    /**
     * Created by sanjukta on 02-07-2015.
     */
    /**
     * Created by sanjukta on 02-07-2015.
     */
    byApp.directive('bindHtmlUnsafe', function ($compile) {
        return function ($scope, $element, $attrs) {

            var compile = function (newHTML) { // Create re-useable compile function
                newHTML = $compile(newHTML)($scope); // Compile html
                $element.html('').append(newHTML); // Clear and append it
            };

            var htmlName = $attrs.bindHtmlUnsafe; // Get the name of the variable
                                                  // Where the HTML is stored

            $scope.$watch(htmlName, function (newHTML) { // Watch for changes to
                // the HTML
                if (!newHTML) return;
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
                                if ($location.url() == attrs.diHref || "#!" + $location.url() == attrs.diHref) $route.reload();
                            });
                        });
                    }
                });
            }
        }]);


    byApp.directive('fallbackSrc', function () {
        var fallbackSrc = {
            link: function postLink(scope, iElement, iAttrs) {
                iElement.bind('error', function () {
                    try {
                        var element = angular.element(this);
                        var count = isNaN(parseInt(element.attr("fallbackCount"))) ? 0 : parseInt(element.attr("fallbackCount"));
                        element.attr("fallbackCount", count + 1);
                        var fallbackSrs = JSON.parse(iAttrs.fallbackSrc);
                        if (fallbackSrs && fallbackSrs.length > 0 && fallbackSrs.length > count) {
                            angular.element(this).attr("src", fallbackSrs[count]);
                        } else {
                            console.log("removing fallback");
                            angular.element(this).removeAttr("fallback-src");
                            angular.element(this).hide();
                        }
                    } catch (e) {
                        console.log("fallback error");
                    }

                });
            }
        }
        return fallbackSrc;
    });


    byApp.directive('timeSince', function ($filter) {
        var getTimeSince = {
            link: function (scope, element, attr) {
                var seconds = Math.floor((new Date() - attr.timeSince) / 1000);
                var interval = Math.floor(seconds / 60);

                if (interval >= 1 && interval < 60) {
                    if (interval === 1)
                        element.html(interval + " minute ago");
                    else
                        element.html(interval + " minutes ago");
                    return;
                } else if (interval < 1) {
                    element.html("just now");
                    return;
                } else {
                    interval = Math.floor(seconds / 3600);
                    if (interval >= 1 && interval < 24) {
                        if (interval === 1)
                            element.html(interval + " hour ago");
                        else
                            element.html(interval + " hours ago");
                        return;
                    }

                    interval = Math.floor(seconds / 86400);
                    if (interval >= 1 && interval < 30) {
                        if (interval === 1)
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


    byApp.directive('formValidation', function () {
        var EMAIL_REGEXP = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;

        return {
            require: 'ngModel',
            restrict: '',
            link: function (scope, elm, attrs, ctrl) {
                // only apply the validator if ngModel is present and Angular has added the email validator
                if (ctrl && ctrl.$validators.email) {
                    // this will overwrite the default Angular email validator
                    ctrl.$validators.email = function (modelValue) {
                        return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
                    };
                }
            }
        };
    });

    byApp.directive('validateUserName', function () {
        return {
            restrict: '',
            link: function (scope, elm, attrs) {
                if (!attrs.validateUserName || attrs.validateUserName.trim() === "" || attrs.validateUserName === "null") {
                    scope.username = "Anonymous";
                } else {
                    scope.username = attrs.validateUserName;
                }
            }
        };
    });


    byApp.directive('loadImage', function ($q, $http, $timeout) {
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
                imgArray: '=?',
                callback: '=?'
            },
            link: function postLink(scope, element, attrs, ctrl) {
                if (attrs.multiple) {
                    scope.loadImage = scope.$parent.galleryImages || [];
                }

                element.bind('change', function (evt) {
                    if (attrs.multiple) {
                        scope.loadImage = scope.$parent.galleryImages || [];
                    } else {
                        scope.loadImage = [];
                    }

                    var currentLength = scope.loadImage.length;
                    var files = evt.target.files;
                    for (var i = 0; i < files.length; i++) {
                        (function (val, idx) {
                            scope.$apply(function () {
                                scope.loadImage.push({thumbnailImage: "", loading: true});
                            });
                            var formData = new FormData();
                            formData.append('image', files[val], files[val].name);


                            $http.post(apiPrefix + 'UploadFile?transcoding=true', formData, {
                                transformRequest: angular.identity,
                                headers: {'Content-Type': undefined}
                            }).success(function (result) {
                                scope.loadImage.splice(idx + val, 1, result);
                                if (scope.callback) {
                                    scope.callback(result);
                                }

                            }).error(function (result) {
                                console.log("Upload profile image failed");
                            });
                        })(i, currentLength);
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
                var oldVal = scope.obj;
                element.autocomplete({
                    source: scope.options,
                    select: function (event, item) {
                        $timeout(function () {
                            element.trigger(event, item);
                            item.item.selected = true;
                            scope.onSelectCallback(item.item, scope.obj, oldVal);
                        }, 0);
                    },
                    change: function (event, item) {
                        console.log(item);
                        if (scope.onChangeCallback) {
                            scope.onChangeCallback(item.item, scope.obj, oldVal);
                        }
                    }
                });
            }
        };
    });

    byApp.directive('rateCalculator', function () {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                var profileRating = BY.byUtil.getAverageRating(attrs.rateCalculator);
                elem.html(profileRating);
                elem.addClass("profileRate" + Math.round(profileRating));
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

    byApp.directive('dropdownMultiselect', function () {
        return {
            restrict: 'E',
            scope: {
                model: '=',
                options: '=',
                pre_selected: '=preSelected'
            },
            template: "<div class='col-md-12' data-ng-class='{open: open}'>" +
            "<div class='col-md-12 dropdown-toggle' data-ng-click='open=!open;openDropdown()'>Select <span class='caret'></span></div>" +
                //"<button class='btn btn-small dropdown-toggle' data-ng-click='open=!open;openDropdown()'><span class='caret'></span></button>"+
            "<ul class='dropdown-menu' aria-labelledby='dropdownMenu'>" +
            "<li><a data-ng-click='selectAll()'><i class='icon-ok-sign'></i>  Check All</a></li>" +
            "<li><a data-ng-click='deselectAll();'><i class='icon-remove-sign'></i>  Uncheck All</a></li>" +
            "<li class='divider'></li>" +
            "<li data-ng-repeat='option in options'> <a data-ng-click='setSelectedItem()'>{{option.displayMenuName}}" +
            "<i data-ng-class='isChecked(option.id)'></i></a></li>" +
            "</ul>" +
            "</div>",
            controller: function ($scope) {

                $scope.openDropdown = function () {
                    $scope.selected_items = [];
                    if ($scope.pre_selected && $scope.pre_selected.length > 0) {
                        for (var i = 0; i < $scope.pre_selected.length; i++) {
                            $scope.selected_items.push($scope.pre_selected[i].id);
                        }
                    }
                };

                $scope.selectAll = function () {
                    for (var i = 0; i < $scope.options.length; i++) {
                        $scope.selected_items.push($scope.options[i].id);
                    }
                    console.log($scope.selected_items);
                };

                $scope.deselectAll = function () {
                    $scope.selected_items = [];
                    console.log($scope.selected_items);
                };
                $scope.setSelectedItem = function () {
                    var id = this.option.id;
                    if ($scope.selected_items && $scope.selected_items.indexOf(id) > -1) {
                        $scope.selected_items.splice($scope.selected_items.indexOf(id), 1);
                    } else {
                        $scope.selected_items.push(id);
                    }

                    console.log($scope.selected_items);
                    return false;
                };
                $scope.isChecked = function (id) {
                    if ($scope.selected_items && $scope.selected_items.indexOf(id) > -1) {
                        return 'glyphicon glyphicon-ok pull-right';
                    }
                    return false;
                };
            }
        }
    });

    byApp.directive('byPagination', function () {
        return {
            scope: {
                obj: '=?',
                callback: '=?'

            },
            templateUrl: 'app/shared/common/template/contentPagination.html?versionTimeStamp=%PROJECT_VERSION%',
            controller: function ($scope) {
                $scope.contentPagination = $scope.obj;
                $scope.maxPageNo = 5;
                $scope.selectedPageNo = 0;

                var firstPageIndex = 0, lastPageIndex = $scope.maxPageNo;
                var setPageArray = function () {
                    $scope.pageArray = [];
                    for (var i = firstPageIndex; i <= lastPageIndex - 1; i++) {
                        $scope.pageArray.push(i);
                    }
                };


                var setPrevPageArr = function () {
                    if (($scope.selectedPageNo + 1) - $scope.maxPageNo > 0) {
                        firstPageIndex = ($scope.selectedPageNo + 1) - $scope.maxPageNo;
                        lastPageIndex = firstPageIndex + $scope.maxPageNo;
                    } else {
                        firstPageIndex = 0;
                        lastPageIndex = Math.min($scope.maxPageNo, $scope.contentPagination.noOfPages);
                    }
                    setPageArray();
                };

                var getNextPageArray = function () {
                    if ($scope.contentPagination.noOfPages - $scope.selectedPageNo >= $scope.maxPageNo) {
                        firstPageIndex = $scope.selectedPageNo;
                        lastPageIndex = Math.min(firstPageIndex + $scope.maxPageNo, $scope.contentPagination.noOfPages);

                    } else {
                        firstPageIndex = $scope.contentPagination.noOfPages - $scope.maxPageNo;
                        lastPageIndex = $scope.contentPagination.noOfPages;
                    }
                    setPageArray();
                };

                var updateNextPevLink = function () {
                    if ($scope.selectedPageNo === $scope.contentPagination.noOfPages - 1) {
                        $scope.nextDisabled = true;
                    } else {
                        $scope.nextDisabled = false;
                    }

                    if ($scope.selectedPageNo === 0) {
                        $scope.prevDisabled = true;
                    } else {
                        $scope.prevDisabled = false;
                    }
                }

                $scope.initPageArray = function () {
                    if ($scope.contentPagination.noOfPages > $scope.maxPageNo) {
                        firstPageIndex = 0;
                        lastPageIndex = $scope.maxPageNo;
                    } else {
                        firstPageIndex = 0;
                        lastPageIndex = $scope.contentPagination.noOfPages;
                    }
                    setPageArray();
                    updateNextPevLink();
                };

                $scope.selectPage = function (pageNo) {
                    $scope.selectedPageNo = pageNo;
                    $scope.callback($scope.selectedPageNo, $scope.contentPagination.pageSize);
                    updateNextPevLink();
                };

                $scope.nextPageSet = function (pageNo) {
                    if (pageNo < $scope.contentPagination.noOfPages) {
                        $scope.selectedPageNo = pageNo;
                        $scope.callback($scope.selectedPageNo, $scope.contentPagination.pageSize);
                        if (lastPageIndex < $scope.contentPagination.noOfPages) {
                            getNextPageArray();
                        }
                        updateNextPevLink();
                    }
                };

                $scope.previousPageSet = function (pageNo) {
                    if (pageNo >= 0) {
                        $scope.selectedPageNo = pageNo;
                        $scope.callback($scope.selectedPageNo, $scope.contentPagination.pageSize);
                        if (firstPageIndex > 0) {
                            setPrevPageArr();
                        }
                        updateNextPevLink();
                    }

                };
            }
        };
    });

    byApp.directive('discussPagination', function () {
        return {
            scope: {
                obj: '=?',
                callback: '=?'

            },
            templateUrl: 'app/shared/common/template/discussPagination.html?versionTimeStamp=%PROJECT_VERSION%',
            controller: function ($scope, $location) {
                $scope.pageIndexName = $scope.obj.pageIndexName;
                $scope.maxPageSize = 3;
                $scope.selectedPageNo = $scope.obj.currentPage;
                $scope.totalNoPages = $scope.obj.noOfPages;

                var setPageArray = function () {
                    $scope.pageArray = [];
                    for (var i = $scope.firstPageIndex; i <= $scope.lastPageIndex; i++) {
                        $scope.pageArray.push(i);
                    }
                };


                var updateNextPevLink = function () {
                    $scope.moreDisabled = false;
                    if ($scope.selectedPageNo >= $scope.totalNoPages - 1) {
                        $scope.nextDisabled = true;
                    } else {
                        $scope.nextDisabled = false;
                    }

                    if ($scope.selectedPageNo <= 0) {
                        $scope.prevDisabled = true;
                    } else {
                        $scope.prevDisabled = false;
                    }
                }


                $scope.getPageLocation = function (page) {
                    if(page < 0 || page > ($scope.totalNoPages - 1)){
                        return null;
                    }else{
                        var newHref = "#!" + $location.path();
                        newHref = newHref + "?";
                        angular.forEach($location.search(), function (value, key) {
                            if (key !== $scope.pageIndexName) {
                                newHref = newHref + key + "=" + value + "&";
                            }
                        });
                        newHref = newHref + $scope.pageIndexName + "=" + page;
                        return newHref;
                    }

                }

                $scope.initPageArray = function () {
                    var selectedPageIndex = $scope.selectedPageNo + 1, maxPageIndex = $scope.maxPageSize - 1, totalPageIndex = $scope.totalNoPages - 1;
                    if ($scope.selectedPageNo === 0) {
                        if ($scope.totalNoPages > $scope.maxPageSize) {
                            $scope.firstPageIndex = 0;
                            $scope.lastPageIndex = maxPageIndex;
                        } else {
                            $scope.firstPageIndex = 0;
                            $scope.lastPageIndex = totalPageIndex;
                        }
                    } else {
                        $scope.selectedPageSet = Math.ceil(selectedPageIndex / $scope.maxPageSize);
                        $scope.lastPageIndex = ($scope.selectedPageSet * $scope.maxPageSize) - 1,
                            $scope.firstPageIndex = $scope.lastPageIndex - maxPageIndex;

                        if ($scope.lastPageIndex > totalPageIndex) {
                            $scope.lastPageIndex = totalPageIndex;
                        }
                    }
                    setPageArray();
                    updateNextPevLink();
                };

            }
        };
    });

    byApp.directive('formatAddress', function () {
        return {
            scope: {
                callback: '=?',
                formatAddress: '='
            },

            link: function (scope, element) {
                var formattedAddress = "", address = scope.formatAddress;

                if (address.streetAddress && address.streetAddress.trim().length > 0) {
                    formattedAddress = address.streetAddress;
                }

                if (address.locality && address.locality.trim().length > 0 && formattedAddress.indexOf(address.locality) === -1) {
                    if (formattedAddress.trim().length > 0) {
                        formattedAddress = formattedAddress + ", "
                    }
                    formattedAddress = formattedAddress + address.locality;
                }

                if (address.city && address.city.trim().length > 0 && formattedAddress.indexOf(address.city) === -1) {
                    if (formattedAddress.trim().length > 0) {
                        formattedAddress = formattedAddress + ", "
                    }
                    formattedAddress = formattedAddress + address.city;
                }

                if (address.country && address.country.trim().length > 0 && formattedAddress.indexOf(address.country) === -1) {
                    if (formattedAddress.trim().length > 0) {
                        formattedAddress = formattedAddress + ", "
                    }
                    formattedAddress = formattedAddress + address.country;
                }

                if (address.zip && address.zip.trim().length > 0 && formattedAddress.indexOf(address.zip) === -1) {
                    if (formattedAddress.trim().length > 0) {
                        formattedAddress = formattedAddress + " - "
                    }
                    formattedAddress = formattedAddress + address.zip;
                }

                if (formattedAddress.trim().length === 0) {
                    scope.formatAddress.fullAddress = null;
                } else {
                    scope.formatAddress.fullAddress = formattedAddress;
                }

            }
        };
    });


    byApp.directive('backgroundFallbackSrc', function () {
        return {
            link: function postLink(scope, element, attrs) {
                element.bind('error', function () {
                    element.parent().css('background-image', 'url("' + attrs.backgroundFallbackSrc + '")');
                });
            }
        }
    });

    byApp.directive('enterEvent', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.enterEvent);
                    });

                    event.preventDefault();
                }
            });
        };
    });

    byApp.directive('ngElevateZoom', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {

                element.bind('load', function () {
                    $('[data-imagezoom]').imageZoom();
                })
            }
        };
    });


    byApp.directive('validateByCategories', function ($rootScope) {
        return {
            scope: {
                validateByCategories: '='
            },
            link: function (scope) {
                var categoryArr = [];
                for (var i = 0; i < scope.validateByCategories.length; i++) {
                    if ($rootScope.menuCategoryMap[scope.validateByCategories[i]]) {
                        categoryArr.push(scope.validateByCategories[i]);
                    }
                }
                scope.validateByCategories = categoryArr;


                //var oldVal = scope.obj;
                //element.autocomplete({
                //    source: scope.options,
                //    select: function (event, item) {
                //        $timeout(function () {
                //            element.trigger(event, item);
                //            item.item.selected = true;
                //            scope.onSelectCallback(item.item, scope.obj, oldVal);
                //        }, 0);
                //    },
                //    change: function(event, item){
                //        console.log(item);
                //        if(scope.onChangeCallback){
                //            scope.onChangeCallback(item.item, scope.obj, oldVal);
                //        }
                //    }
                //});
            }
        };
    });
});



