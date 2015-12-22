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
        imageUrl = param.imageUrl || "http://www.beautifulyears.com/assets/img/logo-fb.jpg",
        description = $(param.description).text().trim(),
        keywords = param.keywords;

    if (keywords && keywords.length > 0) {
        keywords = keywords.join(", ");
    } else {
        keywords = "Beutifulyears , senior care, ageing";
    }

    if (!description || description === "" || description === "undefined") {
        description = "Beautiful Years"
    }

    if (!title && title === "") {
        title = description;
    }

    if (title.indexOf("Beautiful Years") == -1) {
        title += " - Beautiful Years";
    }

    var url = location.origin + "/" + location.hash;
    document.title = title;
    description = description.length > 300 ? description.substring(0, 300) + '...' : description;

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
        var slug;
        var slugDiv = document.createElement('div');
        slugDiv.innerHTML = name;
        slug = slugDiv.textContent;
        var slugIndex = slug.indexOf(" ", 100);
        if (slugIndex > 1) {
            slug = slug.substr(0, slugIndex);
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





