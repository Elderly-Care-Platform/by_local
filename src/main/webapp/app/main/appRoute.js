define([],function(){
    function config($routeProvider) {
        $routeProvider
            .when('/', {templateUrl: 'app/components/home/home.html', controller: 'BYHomeController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['../components/home/homeController'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})
            .when('/users/home', {templateUrl: 'app/components/home/home.html', controller: 'BYHomeController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['../components/home/homeController'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})
            .when('/discuss/list/:slug/:menuId/:discussType', {templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussAllController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['app/components/discuss/discussController.js'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})

            .when('/users/login', {templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'RegistrationController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['app/components/signup/registrationController.js'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})
            
            .when('/users/resetPassword/:resetPasswordCode', {templateUrl: 'app/components/signup/login/resetPassword.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'LoginController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['app/components/signup/login/loginController.js'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})

            .when('/users/registrationProfile', {templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'RegistrationController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['app/components/signup/registrationController.js'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})

            .when('/users/registration/changeCredential', {templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController',
                resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['app/components/signup/registrationController.js'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})

            .when('/users/housingRegistration/:facilityIndex', {templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'RegistrationController', resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/signup/registrationController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})


            .when('/users/logout/:sessionId', {templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'LogoutController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['app/components/signup/login/logoutController.js'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})

            .when('/users/aboutUs', {templateUrl: 'app/components/aboutUs/aboutUs.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'BYAboutUsController', resolve:{
                load:['$q', function($q){
                    var defered = $q.defer();
                    require(['app/components/aboutUs/aboutUsController.js'], function(){
                        defered.resolve();
                    });
                    return defered.promise;
                }]
            }})

            .when('/discuss/:discussId', {templateUrl: 'app/components/discussDetail/discussDetail.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'DiscussDetailController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/discussDetail/discussDetailController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})
            .when('/discuss/:discussId/:comment', {templateUrl: 'app/components/discussDetail/discussDetail.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'DiscussDetailController', resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/discussDetail/discussDetailController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/search/:term/:disType', {templateUrl: 'app/components/search/search.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'SearchController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/search/SearchController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/find/:slug/:services/:city', {templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ServicesController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/find/servicesController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/services/list/:slug/:menuId/:city', {templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ServicesController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/find/servicesController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/profile/:profileType/:profileId/:userName', {templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProfileController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/profile/userProfileCtrl.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/profile/:profileType/:profileId/', {templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ProfileController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/profile/userProfileCtrl.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/housingProfile/:profileType/:profileId/:housingFacilityId', {templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%',
                controller: 'ProfileController', resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/profile/userProfileCtrl.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})

            .when('/housing/list/:slug/:menuId/:city', {templateUrl: 'app/components/housing/housing.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'HousingController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/components/housing/housingController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }
            })


            .when('/users/privacyPolicy', {templateUrl: 'app/shared/footer/privacyPolicy.html?versionTimeStamp=%PROJECT_VERSION%', controller: ''})
            .when('/users/termsCondition', {templateUrl: 'app/shared/footer/termsConditions.html?versionTimeStamp=%PROJECT_VERSION%', controller: ''})
            .when('/users/contactUs', {templateUrl: 'app/shared/footer/contactUs.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'contactUsController',
                resolve:{
                    load:['$q', function($q){
                        var defered = $q.defer();
                        require(['app/shared/footer/contactUsController.js'], function(){
                            defered.resolve();
                        });
                        return defered.promise;
                    }]
                }})


        //.when('/users/aboutUs', {templateUrl: 'app/components/aboutUs/aboutUs.html', controller: 'BYAboutUsController'})
            //.when('/users/new', {templateUrl: 'app/components/users/create.html', controller: 'UserCreateController'})
            //.when('/users/login', {templateUrl: 'app/components/login/registration.html', controller: 'RegistrationController'})
            //.when('/users/logout/:sessionId', {templateUrl: 'app/components/users/home.html', controller: 'LogoutController'})
            //
            //.when('/discuss/:topicId/all', {templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussCategoryController'})
            //.when('/discuss/:discussType/:topicId/:subTopicId', {templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussSubCategoryController'})
            //
            //.when('/search/:term/:disType', {templateUrl: 'app/components/search/search.html', controller: 'DiscussSearchController'})
            //.when('/discuss/:discussId', {templateUrl: 'app/components/discussDetail/discussDetail.html', controller: 'DiscussDetailController'})
            //
            //.when('/users/privacyPolicy', {templateUrl: 'app/shared/footer/privacyPolicy.html', controller: ''})
            //.when('/users/termsCondition', {templateUrl: 'app/shared/footer/termsConditions.html', controller: ''})
            //.when('/users/contactUs', {templateUrl: 'app/shared/footer/contactUs.html', controller: 'contactUsController'})
            //.when('/find/:slug/:services/:city', {templateUrl: 'app/components/find/services.html', controller: 'ServicesController'})
            //.when('/find/:services/:city', {templateUrl: 'app/components/find/services.html', controller: 'ServicesController'})
            //.when('/services/list/:slug/:menuId/:city', {templateUrl: 'app/components/find/services.html', controller: 'ServicesController'})
            //.when('/product/All/list/all', {templateUrl: 'app/components/product/product.html', controller: 'ProductAllController'})
            //.when('/profile/:profileType/:profileId', {templateUrl: 'app/components/profile/profile.html', controller: 'ProfileController'});
    }

    config.$inject=['$routeProvider'];
    return config;
});