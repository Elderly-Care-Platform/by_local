define([], function () {
    function config($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'app/components/home/home.html', controller: 'BYHomeController', resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['../components/home/homeController'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })


            //**************Communities routes start******************************************************************
            .when('/communities/:slug/:menuId/:discussType', {
                templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussMenuCtrl', resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/discuss/discussMenuCtrl.js', 'editorController'], function (discussMenuCtrl, editorController) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/communities/:menuId/:discussType', {
                templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussMenuCtrl', resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/discuss/discussMenuCtrl.js', 'editorController'], function (discussMenuCtrl, editorController) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/communities/:discussTitle/', {
                templateUrl: 'app/components/discussDetail/discussDetail.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'DiscussDetailController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/discussDetail/discussDetailController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/announcements/:discussTitle/', {
                templateUrl: 'app/components/announcements/announcementContainer.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'AnnouncementCtrl',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/announcements/announcementCtrl.js', 'editorController'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            //**********Communities routes end*********************************************************************


            //***********Directory routes start*******************************************************************
            .when('/directory/:slug/:menuId/:city', {
                templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ServicesController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/find/servicesController.js', 'app/components/find/findMenuCtrl.js'],
                            function (servicesController, findMenuCtrl) {
                                defered.resolve();
                            });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/directory/reviews/:menuId', {
                templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ServicesController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/find/servicesController.js', 'app/components/find/findMenuCtrl.js'],
                            function (servicesController, findMenuCtrl) {
                                defered.resolve();
                            });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/directory/:menuId/:city', {
                templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ServicesController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/find/servicesController.js', 'app/components/find/findMenuCtrl.js'],
                            function (servicesController, findMenuCtrl) {
                                defered.resolve();
                            });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })
            //***************Directory routes end*********************************************************************



            //*************Senior living routes start*****************************************************************
            .when('/senior-living/:slug/:menuId/:city', {
                templateUrl: 'app/components/housing/housing.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'HousingController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/housing/housingController.js', 'housingMenuCtrl'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/senior-living/reviews/:menuId', {
                templateUrl: 'app/components/housing/housing.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'HousingController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/housing/housingController.js', 'housingMenuCtrl', 'editorController'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/senior-living/:menuId/:city', {
                templateUrl: 'app/components/housing/housing.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'HousingController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/housing/housingController.js', 'housingMenuCtrl'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byMenu: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($rootScope.menuCategoryMap[$route.current.params.menuId]){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })
            //********************Senior living routes end********************************************************



            //********************Login/Registration routes start**************************************************
            .when('/users/login', {
                templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/registrationController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/users/registrationProfile', {
                templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/registrationController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/users/registration/changeCredential', {
                templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/registrationController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/users/resetPassword/:resetPasswordCode', {
                templateUrl: 'app/components/signup/login/resetPassword.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'LoginController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/login/loginController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }],
                    byResetPasswordCode: ['$route', '$rootScope', '$q', function ($route, $rootScope, $q) {
                        var defered = $q.defer();
                        if($route.current.params.resetPasswordCode){
                            defered.resolve();
                        }else{
                            defered.reject();
                        }
                        return defered.promise;
                    }]
                }
            })

            .when('/users/registrationProfile/orderHistory', {
                templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController', resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/registrationController.js'], function (registrationCtrl) {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })


            .when('/users/housingRegistration/:facilityIndex', {
                templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController', resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/registrationController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/users/institutionRegistration/:branchIndex', {
                templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController', resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/registrationController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/users/logout/:sessionId', {
                templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'LogoutController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/signup/login/logoutController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            //********************Login/Registration routes end**************************************************


            .when('/users/:profileTitle', {
                templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProfileController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/profile/userProfileCtrl.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            /*.when('/housingProfile/:profileType/:profileId/:housingFacilityId', {
                templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProfileController', resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/profile/userProfileCtrl.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })*/

            .when('/privacyPolicy', {
                templateUrl: 'app/shared/footer/privacyPolicy.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: ''
            })

            .when('/termsCondition', {
                templateUrl: 'app/shared/footer/termsConditions.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: ''
            })

            .when('/contactUs', {
                templateUrl: 'app/shared/footer/contactUs.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'contactUsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/shared/footer/contactUsController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/aboutUs', {
                templateUrl: 'app/components/aboutUs/aboutUs.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'BYAboutUsController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/aboutUs/aboutUsController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .when('/search/:term/:searchType', {
                templateUrl: 'app/components/search/search.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'SearchController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/search/SearchController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            // error page
            .when('/pageNotFound', {
                templateUrl: 'app/components/error/error.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'errorController',
                resolve: {
                    load: ['$q', function ($q) {
                        var defered = $q.defer();
                        require(['app/components/error/errorController.js'], function () {
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })

            .otherwise({
                redirectTo: '/pageNotFound'
            });


        //To be removed later
        //.when('/users/home', {
        //    templateUrl: 'app/components/home/home.html', controller: 'BYHomeController', resolve: {
        //        load: ['$q', function ($q) {
        //            var defered = $q.defer();
        //            require(['../components/home/homeController'], function () {
        //                defered.resolve();
        //            });
        //            return defered.promise;
        //        }]
        //    }
        //})

        //.when('/discuss/list/:slug/:menuId/:discussType', {
        //    templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussMenuCtrl', resolve: {
        //        load: ['$q', function ($q) {
        //            var defered = $q.defer();
        //            require(['app/components/discuss/discussMenuCtrl.js'], function (discussMenuCtrl) {
        //                defered.resolve();
        //            });
        //            return defered.promise;
        //        }]
        //    }
        //})

        //.when('/find/:slug/:services/:city', {
        //    templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%',
        //    controller: 'ServicesController',
        //    resolve: {
        //        load: ['$q', function ($q) {
        //            var defered = $q.defer();
        //            require(['app/components/find/servicesController.js'], function () {
        //                defered.resolve();
        //            });
        //            return defered.promise;
        //        }]
        //    }
        //})


        /*.when('/profile/:profileType/:profileId/:userName', {
         templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%',
         controller: 'ProfileController',
         resolve: {
         load: ['$q', function ($q) {
         var defered = $q.defer();
         require(['app/components/profile/userProfileCtrl.js'], function () {
         defered.resolve();
         });
         return defered.promise;
         }]
         }
         })*/

    }

    config.$inject = ['$routeProvider'];
    return config;
});