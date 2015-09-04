byApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
        	.when('/', {templateUrl: 'app/components/home/home.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'BYHomeController'})
            .when('/users/home', {templateUrl: 'app/components/home/home.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'BYHomeController'})
            .when('/users/aboutUs', {templateUrl: 'app/components/aboutUs/aboutUs.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'BYAboutUsController'})
            .when('/users/login', {templateUrl: 'app/components/signup/registration.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'RegistrationController'})
            .when('/users/logout/:sessionId', {templateUrl: 'app/components/users/home.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'LogoutController'})

            .when('/discuss/list/:slug/:menuId/:discussType', {templateUrl: 'app/components/discuss/discussion.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'DiscussAllController'})
            .when('/discuss/:discussId', {templateUrl: 'app/components/discussDetail/discussDetail.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'DiscussDetailController'})

            .when('/search/:term/:disType', {templateUrl: 'app/components/search/search.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'SearchController'})
            .when('/search/:term/:disType/Discuss', {templateUrl: 'app/components/search/discussSearch.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'DiscussSearchController'})
            .when('/search/:term/:disType/Service', {templateUrl: 'app/components/search/serviceSearch.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ServiceSearchController'})


            .when('/users/privacyPolicy', {templateUrl: 'app/shared/footer/privacyPolicy.html?versionTimeStamp=%PROJECT_VERSION%', controller: ''})
            .when('/users/termsCondition', {templateUrl: 'app/shared/footer/termsConditions.html?versionTimeStamp=%PROJECT_VERSION%', controller: ''})
            .when('/users/contactUs', {templateUrl: 'app/shared/footer/contactUs.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'contactUsController'})
            
            .when('/housing/list/:slug/:menuId/:city', {templateUrl: 'app/components/housing/housing.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'HousingController'})

            .when('/find/:slug/:services/:city', {templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ServicesController'})
            .when('/services/list/:slug/:menuId/:city', {templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ServicesController'})
            .when('/product/All/list/all', {templateUrl: 'app/components/product/product.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ProductAllController'})
            .when('/profile/:profileType/:profileId/:userName', {templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ProfileController'})
            .when('/profile/:profileType/:profileId/', {templateUrl: 'app/components/profile/profile.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ProfileController'})
            .when('/users/resetPassword/:resetPasswordCode', {templateUrl: 'app/components/signup/login/resetPassword.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'LoginController'});


        //.when('/find/:services/:city', {templateUrl: 'app/components/find/services.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'ServicesController'})
        //.when('/discuss/:topicId/all', {templateUrl: 'app/components/discuss/discussion.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'DiscussCategoryController'})
        //.when('/discuss/:discussType/:topicId/:subTopicId', {templateUrl: 'app/components/discuss/discussion.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'DiscussSubCategoryController'})
        //.when('/users/new', {templateUrl: 'app/components/users/create.html?versionTimeStamp=%PROJECT_VERSION%', controller: 'UserCreateController'})
        //.when('/discuss/new/P', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
        //.when('/discuss/new/Q', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
        //.when('/discuss/new/A', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
        //.when('/discuss/showedit/:discussId', {templateUrl: 'views/discuss/edit.html', controller: 'DiscussCreateController'})
        //.when('/discuss/edit/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'DiscussCreateController'})
        //.when('/discuss/delete/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'DiscussDeleteController'});
        //????????$routeProvider.otherwise({redirectTo: '/users/login'});
    }]);