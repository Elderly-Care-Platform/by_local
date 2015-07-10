byApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider
            .when('/users/home', {templateUrl: 'app/components/home/home.html', controller: 'BYHomeController'})
            .when('/users/aboutUs', {templateUrl: 'app/components/aboutUs/aboutUs.html', controller: 'BYAboutUsController'})
            .when('/users/new', {templateUrl: 'app/components/users/create.html', controller: 'UserCreateController'})
            .when('/userprofile', {templateUrl: 'app/components/users/create2.html', controller: 'UserCreate2Controller'})
            .when('/dependent', {templateUrl: 'app/components/users/create3.html', controller: 'UserCreate3Controller'})
            .when('/dependent/list/:userId', {templateUrl: 'app/components/users/dependents.html', controller: 'DependentListController'})
            .when('/dependent/:userId/:id', {templateUrl: 'app/components/users/create3.html', controller: 'DependentShowEditController'})
            .when('/users/login', {templateUrl: 'app/components/login/registration.html', controller: 'RegistrationController'})
            .when('/users/logout/:sessionId', {templateUrl: 'app/components/users/home.html', controller: 'LogoutController'})
            .when('/discuss/:discussType/list/all', {templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussAllController'})
            .when('/discuss/:topicId/all', {templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussCategoryController'})
            .when('/discuss/:discussType/:topicId/:subTopicId', {templateUrl: 'app/components/discuss/discussion.html', controller: 'DiscussSubCategoryController'})

            .when('/search/:term/:disType', {templateUrl: 'app/components/search/search.html', controller: 'DiscussSearchController'})
            .when('/discuss/:discussId', {templateUrl: 'app/components/discussDetail/discussDetail.html', controller: 'DiscussDetailController'})

            .when('/users/privacyPolicy', {templateUrl: 'app/shared/footer/privacyPolicy.html', controller: ''})
            .when('/users/termsCondition', {templateUrl: 'app/shared/footer/termsConditions.html', controller: ''})
            .when('/users/contactUs', {templateUrl: 'app/shared/footer/contactUs.html', controller: 'contactUsController'})
            .when('/find/all', {templateUrl: 'app/components/find/services.html', controller: 'ServicesController'})
            .when('/profile/:profileType/:profileId', {templateUrl: 'app/components/profile/profile.html', controller: 'ProfileController'});

        //.when('/discuss/new/P', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
        //.when('/discuss/new/Q', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
        //.when('/discuss/new/A', {templateUrl: 'views/discuss/create.html', controller: 'DiscussCreateController'})
        //.when('/discuss/showedit/:discussId', {templateUrl: 'views/discuss/edit.html', controller: 'DiscussCreateController'})
        //.when('/discuss/edit/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'DiscussCreateController'})
        //.when('/discuss/delete/:discussId', {templateUrl: 'views/discuss/list.html', controller: 'DiscussDeleteController'});
        //????????$routeProvider.otherwise({redirectTo: '/users/login'});
    }]);