var BY = BY || {};
BY.config = BY.config || {};
BY.config.profile = BY.config.profile || {};

BY.config.profile.userType = {
    '0' : {
        'category':'0',
        'contentPanel':'',
        'type':'CAREGIVER'
    },
    '1' : {
        'category':'0',
        'contentPanel':'',
        'type':'ELDER'
    },
    '2' : {
        'category':'0',
        'contentPanel':'',
        'type':'VOLUNTEER'
    },
    '3' : {
        'category':'1',
        'contentPanel':'',
        'type':'HOUSING'
    },
    '4' : {
        'category':'1',
        'contentPanel':'app/components/profile/institutionProfile.html?versionTimeStamp=%PROJECT_VERSION%',
        'reviewContentPanel':'app/components/profile/reviewRate.html?versionTimeStamp=%PROJECT_VERSION%',
        'type':'SERVICES',
        'reviewContentType':'4',
        'defaultLogo':'assets/img/instituation.png'
    },
    '5' : {
        'category':'1',
        'contentPanel':'',
        'type':'PRODUCTS'
    },
    '6' : {
        'category':'1',
        'contentPanel':'',
        'type':'NGO'
    },
    '7' : {
        'category':'0',
        'contentPanel':'app/components/profile/individualProfile.html?versionTimeStamp=%PROJECT_VERSION%',
        'reviewContentPanel':'app/components/profile/reviewRate.html?versionTimeStamp=%PROJECT_VERSION%',
        'type':'PROFESSIONAL',
        'reviewContentType':'5',
        'defaultLogo':'assets/img/instituation-logo.png'
    }

}

BY.config.profile.userCategory = {
    '0':'INDIVIDUAL',
    '1':'INSTITUTION'
}

BY.config.profile.userGender = {
    '0':'Ms.',
    '1':'Mr.'
}


BY.config.profile.rate = {
    'lowerLimit':'0',
    'upperLimit':'5'
}
