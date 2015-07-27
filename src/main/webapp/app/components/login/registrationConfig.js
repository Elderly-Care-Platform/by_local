var BY = BY || {};

BY.config = BY.config || {};
BY.config.registration = BY.config.registration || {};

BY.regConfig = {
    "maxSecondaryPhoneNos":3,
    "maxSecondaryEmailId":2,
    "maxUserAddress":20

};


BY.config.registration.websitePattern = "/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/";