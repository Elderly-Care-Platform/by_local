define(['byApp'],
    function (byApp) {

        'use strict';

        function DiscussLeftController($scope, $rootScope, $route, $routeParams, DiscussPage) {

            var init = getFeaturedData();
            $scope.getShortTitle = BY.byUtil.getShortTitle;

            var tags = [], queryParams = {sort: "lastModifiedAt", s: 5};
            tags = $.map($scope.selectedMenu.tags, function (value, key) {
                return value.id;
            })

            queryParams.tags = tags.toString();
            queryParams.isFeatured = true;
            function getFeaturedData() {
                $("#preloader").show();
                DiscussPage.get(queryParams,
                    function (value) {
                        $scope.discussFeatured = value.data.content;
                        $("#preloader").hide();
                    },
                    function (error) {
                        $("#preloader").hide();
                        console.log(error);
                    });
            }

        }

        DiscussLeftController.$inject = ['$scope', '$rootScope', '$route', '$routeParams',
            'DiscussPage'];

        byApp.registerController('DiscussLeftController', DiscussLeftController);
        return DiscussLeftController;

    });
