define(['byApp'], function (byApp) {

    function DisService($location) {
        return {
            getDiscussDetailUrl: getDiscussDetailUrl,
            formatData: formatData,
            getDiscussAbsUrl:getDiscussAbsUrl,
            getShortTitle:getShortTitle
        };

        function getDiscussDetailUrl(discuss, urlQueryParams, isAngularLocation) {
            var disTitle = "others";
            if (discuss.title && discuss.title.trim().length > 0) {
                disTitle = discuss.title;
            } else if (discuss.text && discuss.text.trim().length > 0) {
                disTitle = discuss.text;
            } else if (discuss.linkInfo && discuss.linkInfo.title && discuss.linkInfo.title.trim().length > 0) {
                disTitle = discuss.linkInfo.title;
            } else {
                disTitle = "others";
            }

            disTitle = BY.byUtil.getSlug(disTitle);
            var newHref = "/communities/" + disTitle;


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

        function formatData(discussObj) {
            var formattedData = [];
            if (discussObj && discussObj.length > 0) {
                for (var i = 0; i < discussObj.length; i++) {
                    var title, id, image = null;
                    title = getShortTitle(discussObj[i]);
                    id = discussObj[i].id;
                    if (discussObj[i].userProfile != null) {
                        if (discussObj[i].userProfile.basicProfileInfo.profileImage != null)
                            image = discussObj[i].userProfile.basicProfileInfo.profileImage;
                    }
                    formattedData.push({
                        title: title,
                        image: image,
                        id: id
                    });
                }
                ;
            }
            return formattedData;
        }

        function getShortTitle(discuss) {
            var disTitle = "";
            if (discuss.discussType == 'Q') {
                disTitle = discuss.text;
            } else if (discuss.discussType == 'P' && discuss.title && discuss.title.trim().length > 0) {
                disTitle = discuss.title;
            } else if (discuss.discussType == 'P' && discuss.linkInfo && discuss.linkInfo.title && discuss.linkInfo.title.trim().length > 0) {
                disTitle = discuss.linkInfo.title;
            } else if (discuss.discussType == 'P' && discuss.shortSynopsis) {
                disTitle = discuss.shortSynopsis;
            } else {
                disTitle = "";
            }

            disTitle = BY.byUtil.getShortTitle(disTitle);
            return disTitle;
        };

        function getDiscussAbsUrl(discuss){
            var discussId = discuss.id, title = BY.byUtil.removeSpecialChars(getShortTitle(discuss)), url = "";
            url = window.location.origin + "/#!/communities/" + title + "?id=" + discussId
            return url;
        }
    }

    byApp.registerService('DisService', DisService);
    return DisService;
});
