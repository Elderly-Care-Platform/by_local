var BY = BY || {};
BY.byUtil = {};

BY.byUtil.getPageInfo = function (data) {
    var ret = {};
    ret.sort = data.sort;
    ret.numberOfElements = data.numberOfElements;
    ret.size = data.size;
    ret.number = data.number;
    ret.totalElements = data.totalElements;
    ret.totalPages = data.totalPages;
    ret.firstPage = data.firstPage;
    ret.lastPage = data.lastPage;
    return ret;
}

BY.byUtil.getAverageRating = function (value) {
    var range = parseInt(BY.config.profile.rate.upperLimit) - parseInt(BY.config.profile.rate.lowerLimit);
    var averageRating = null;
    value = parseFloat(value);
    if (value > 0) {
        averageRating = (value * range / 100).toFixed(1);
    }

    //Number((parseFloat("22.33333333")*10/100).toFixed(1));

    return averageRating
}


$(window).scroll(function () {
    var windowHeight = $(window).height() / 2;

    if ((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) > windowHeight) {
        $(".topScroll").show();
    } else {
        $(".topScroll").hide();
    }

    ////////////////

    var footerv1Height = $(".footer-v1").height() + 10;
    $(".topScroll").css('bottom', "8px");
    if ($(window).width() < 830) {
        $(".topScroll").css('bottom', "37px");
    }


});

$(document).ready(function () {
    $(".topScroll").click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
    });
});


BY.byUtil.updateMetaTags = function (param) {
    var title = param.title.trim(),
        imageUrl = param.imageUrl || "https://www.beautifulyears.com/assets/img/logo-fb.jpg",
        description = $(param.description).text().trim(),
        keywords = param.keywords, url = location.origin + "/" + location.hash, nextSpaceIndex;

    if (keywords && keywords.length > 0) {
        keywords = keywords.join(", ");
    } else {
        keywords = BY.config.seo.home.keywords;
    }

    if (!title && title === "") {
        title = BY.config.seo.home.title;
    }

    if (!description || description === "" || description === "undefined") {
        description = BY.config.seo.home.description;
    }

    if (title.indexOf("BeautifulYears") == -1) {
        title += " - BeautifulYears";
    }

    nextSpaceIndex = description.indexOf(" ", 300);
    description = description.length > 300 ? description.substring(0, nextSpaceIndex) + '...' : description;

    document.title = title;
    $("meta[property='og\\:url']").attr("content", url);
    $("meta[property='og\\:title']").attr("content", title);
    $("meta[name='twitter\\:title']").attr("content", title);
    $("meta[property='og\\:description']").attr("content", description);
    $("meta[name='description']").attr("content", description);
    $("meta[name='twitter\\:description']").attr("content", description);
    $("meta[property='og\\:image']").attr("content", imageUrl);
    $("meta[name='twitter\\:image']").attr("content", imageUrl);
    $('meta[name=keywords]').attr('content', keywords);
    if (imageUrl != null && imageUrl !== "") {
        var tmpImg = new Image();
        tmpImg.src = imageUrl;
        $(tmpImg).on('load', function () {
            $("meta[property='og\\:image\\:width']").attr("content", tmpImg.width);
            $("meta[property='og\\:image\\:height']").attr("content", tmpImg.height);
        });

    }

    var links = document.getElementsByTagName("link");
    //var canonical = "";
    for (var i = 0; i < links.length; i++) {
        if (links[i].getAttribute("rel") === "canonical") {
            links[i].setAttribute("href", url);
        }
    }
}


BY.byUtil.getImage = function (sharedObj, needAbsolutePath) {
    var picture = sharedObj.articlePhotoFilename ? sharedObj.articlePhotoFilename.original : "";
    if (picture && picture !== "") {
        if (needAbsolutePath) {
            picture = picture.substr(1);
            picture = window.location.origin + window.location.pathname + picture;
        }
    } else if (sharedObj.linkInfo && sharedObj.linkInfo.mainImage) {
        picture = sharedObj.linkInfo.mainImage;
    } else if (sharedObj.linkInfo && sharedObj.linkInfo.otherImages && sharedObj.linkInfo.otherImages.length > 0) {
        picture = sharedObj.linkInfo.otherImages[0];
    }
    return picture;
}

BY.byUtil.validateUserName = function (userName) {
    if (!userName || userName.trim() === "" || userName === "null") {
        userName = "Anonymous";
    }

    userName = userName.replace('-', ' ');

    return userName;
}

BY.byUtil.removeSpecialChars = function (name) {
    if(name){
        var modifiedName = name.replace(/[^a-zA-Z0-9 ]/g, ""),
        modifiedName = modifiedName.replace(/\s+/g, '-').toLowerCase();
        return modifiedName;
    }
}

BY.byUtil.getSlug = function (name) {
    if(name){
        var slug, slugDiv = document.createElement('div'), nextSpaceIndex;
        slugDiv.innerHTML = name;
        slug = slugDiv.textContent;
        nextSpaceIndex = slug.indexOf(" ", 100);
        if (nextSpaceIndex > 1) {
            slug = slug.substr(0, nextSpaceIndex);
        }
        slug = BY.byUtil.removeSpecialChars(slug);
        return slug;
    }
}

BY.byUtil.validateEmailId = function(emailId){
    var validEmail = true, emailValidation = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if(!emailValidation.test(emailId)){
        validEmail = false;
    }
    return validEmail;
}

BY.byUtil.smartScroll = function (smartHeight) {
    var clientHeight = $( window ).height();
    $(".by_subMenuPlus").css('min-height', (clientHeight - 57)+"px");
    $('.by_subMenuPlus').css({
        'position': 'relative',
        'bottom': 'auto'
    });
    $(window).scroll(function () {
        var winTop = $(this).scrollTop(),
        winBottom = winTop + $(this).height(),
        left = $('.by_subMenuPlus'),
        leftBottom = left.height() + smartHeight;

                //when the user reached the bottom of '#leftShort' set its position to fixed to prevent it from moving on scroll
                if (winBottom >= leftBottom) {

                    left.css({
                        'position': 'fixed',
                        'bottom': '0px'
                    });
                } else {
                    //when the user scrolls back up revert its position to relative
                    left.css({
                        'position': 'relative',
                        'bottom': 'auto'
                    });
                }
            });
};

BY.byUtil.getShortTitle = function (name) {
    if(name){
        var title, titleDiv = document.createElement('div'), nextSpaceIndex;
        titleDiv.innerHTML = name;
        title = titleDiv.textContent;
        nextSpaceIndex = title.indexOf(" ", 40);
        if (nextSpaceIndex > 1) {
            title = title.substr(0, nextSpaceIndex);
        }        
        return title;
    }
}

/* adding seo related urls*/
BY.byUtil.paginationSeoUrl = function(queryParams, currentP, lastP) {
    var currentPage = currentP,
        lastPage = lastP,
        currentUrl = window.location.href.split('?')[0],
        previousUrl, nextUrl;
    if (queryParams && Object.keys(queryParams).length > 0) {
        previousUrl = currentUrl + "?"
        $.each(queryParams, function(value, key) {
            if (value == "pageIdx") {
                key = parseInt(key) - 1;
            }
            previousUrl = previousUrl + value + "=" + key + "&";
        });
    }
    if (queryParams && Object.keys(queryParams).length > 0) {
        nextUrl = currentUrl + "?"
        $.each(queryParams, function(value, key) {
            if (value == "pageIdx") {
                key = parseInt(key) + 1;
            }
            nextUrl = nextUrl + value + "=" + key + "&";
        });
    }
    if (queryParams && Object.keys(queryParams).length == 0) {
        nextUrl = currentUrl + "?pageIdx=" + (currentP + 1);
        previousUrl = currentUrl + "?pageIdx=" + (currentP - 1);
    }
    if (currentPage == 0) {
        $("link[rel='next']").attr("href", nextUrl);
        $("link[rel='prev']").attr("href", "");
    } else if (currentPage < lastPage) {
        $("link[rel='next']").attr("href", nextUrl);
        $("link[rel='prev']").attr("href", previousUrl);
    } else {
        $("link[rel='next']").attr("href", "");
        $("link[rel='prev']").attr("href", previousUrl);
    }
}




