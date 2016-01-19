define(['byApp', 'discussService'],
    function(byApp, discussService) {

        'use strict';

        function DiscussLeftController($scope, $rootScope, $route, $routeParams, DiscussPage, discussServiceFilter) {

            $scope.getFeaturedData = getFeaturedData;

            var tags = [],
                queryParams = {
                    sort: "lastModifiedAt",
                    s: 5
                };
            tags = $.map($scope.selectedMenu.tags, function(value, key) {
                return value.id;
            })

            queryParams.tags = tags.toString();
            queryParams.isFeatured = true;

            function getFeaturedData() {
                $("#preloader").show();
                DiscussPage.get(queryParams,
                    function(value) {
                        $scope.discussFeatured = value.data.content;
                        $scope.formattedData = discussServiceFilter.formatData($scope.discussFeatured);
                        $("#preloader").hide();
                    },
                    function(error) {
                        $("#preloader").hide();
                        console.log(error);
                    });
            }
            getFeaturedData();

            
        }



        DiscussLeftController.$inject = ['$scope', '$rootScope', '$route', '$routeParams',
            'DiscussPage', 'DisServiceFilter'
        ];

        byApp.registerController('DiscussLeftController', DiscussLeftController);
        return DiscussLeftController;

    });