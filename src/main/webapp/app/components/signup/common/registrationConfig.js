var BY = BY || {};
BY.config = BY.config || {};
BY.config.regConfig = BY.config.regConfig || {};


BY.config.regConfig.formConfig = {
    "maxSecondaryPhoneNos":3,
    "maxSecondaryEmailId":2,
    "maxUserAddress":20

}

BY.config.regConfig.userTypeConfig = {
    '-1' : {
        'type':'-1',
        'contentPanel':'app/components/signup/regUserType.html?versionTimeStamp=%PROJECT_VERSION%',
        'category':'NONE',
        'label' : "I am"
    },
    '0' : {
        'type':'0',
        'contentPanel':'app/components/signup/registration/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%',
        'category':'CAREGIVER',
        'label' : "About Me"
    },
    '1' : {
        'type':'1',
        'contentPanel':'app/components/signup/registration/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%',
        'category':'ELDER',
        'label' : "About Me"
    },
    '2' : {
        'type':'2',
        'contentPanel':'app/components/signup/registration/regIndividual.html?versionTimeStamp=%PROJECT_VERSION%',
        'category':'VOLUNTEER',
        'label' : "About Me"
    },
    '3' : {
        'type':'3',
        'contentPanel':'',
        'category':'HOUSING',
        'label' : ""
    },
    '4' : {
        'type':'4',
        'contentPanel':'app/components/signup/registration/regInstitution.html?versionTimeStamp=%PROJECT_VERSION%',
        'category':'SERVICES',
        'label' : "Institution info"
    },
    '5' : {
        'type':'5',
        'contentPanel':'',
        'category':'PRODUCTS',
        'label' : ""
    },
    '6' : {
        'type':'6',
        'contentPanel':'',
        'category':'NGO',
        'label' : ""
    },
    '7' : {
        'type':'7',
        'contentPanel':'app/components/profile/profUserProfile.html?versionTimeStamp=%PROJECT_VERSION%',
        'category':'PROFESSIONAL',
        'label' : "About me"
    }
}
