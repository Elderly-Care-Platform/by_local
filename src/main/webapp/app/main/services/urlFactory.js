define(['byApp', 'registrationConfig'], function (byApp, registrationConfig) {

    function UrlFactory($rootScope, $location, $http) {
        return {
            getDiscussDetailUrl : getDiscussDetailUrl,
            getIndvProfileUrl   : getIndvProfileUrl,
            getProfileDetailUrlReview : getProfileDetailUrlReview
        };

        function getDiscussDetailUrl(discuss, queryParams, isAngularLocation) {
            var disTitle = "detail", newHref;
            if (discuss.title && discuss.title.trim().length > 0) {
                disTitle = discuss.title;
            } else if (discuss.text && discuss.text.trim().length > 0) {
                disTitle = discuss.text;
            } else if (discuss.linkInfo && discuss.linkInfo.title && discuss.linkInfo.title.trim().length > 0) {
                disTitle = discuss.linkInfo.title;
            } else {
                disTitle = "detail";
            }

            disTitle = BY.byUtil.getSlug(disTitle);

            if(discuss.promotion == true){
                newHref = "/announcements/" + disTitle;
            }else{
                newHref = "/communities/" + disTitle;
            }



            if (queryParams && Object.keys(queryParams).length > 0) {
                //Set query params through angular location search method
                if (isAngularLocation) {
                    angular.forEach($location.search(), function (value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(queryParams, function (value, key) {
                        $location.search(key, value);
                    });
                } else { //Set query params manually
                    newHref = newHref + "?"
                    angular.forEach(queryParams, function (value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };


        function getIndvProfileUrl(profile, urlQueryParams, isAngularLocation) {
            var proTitle = "anonymous";
            if (profile && profile.username && profile.username.length > 0) {
                proTitle = BY.byUtil.validateUserName(profile.username);
            }

            proTitle = BY.byUtil.getSlug(proTitle);
            var newHref = "/users/" + proTitle;

            if (urlQueryParams && Object.keys(urlQueryParams).length > 0) {
                //Set query params through angular location search method
                if (isAngularLocation) {
                    angular.forEach($location.search(), function (value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(urlQueryParams, function (value, key) {
                        $location.search(key, value);
                    });
                } else { //Set query params manually
                    newHref = newHref + "?"

                    angular.forEach(urlQueryParams, function (value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };


        function getProfileDetailUrlReview(profile, urlQueryParams, isAngularLocation) {
            var proTitle = "reviews";
            if (profile && profile.userName && profile.userName.length > 0) {
                proTitle = BY.byUtil.validateUserName(profile.userName);
            } else {
                proTitle = "reviews";
            }

            proTitle = BY.byUtil.getSlug(proTitle);
            var newHref = "/users/" + proTitle;


            if (urlQueryParams && Object.keys(urlQueryParams).length > 0) {
                //Set query params through angular location search method
                if (isAngularLocation) {
                    angular.forEach($location.search(), function(value, key) {
                        $location.search(key, null);
                    });
                    angular.forEach(urlQueryParams, function(value, key) {
                        $location.search(key, value);
                    });
                } else { //Set query params manually
                    newHref = newHref + "?"

                    angular.forEach(urlQueryParams, function(value, key) {
                        newHref = newHref + key + "=" + value + "&";
                    });

                    //remove the last  '&' symbol from the url, otherwise browser back does not work
                    newHref = newHref.substr(0, newHref.length - 1);
                }
            }

            return newHref;
        };
    }

    byApp.registerService('UrlFactory', UrlFactory);
    return UrlFactory;
});
