var BY = BY || {};
BY.config = BY.config || {};
BY.config.constants = BY.config.constants || {};

BY.config.constants = {
    //"productHost" : "api/v1/products/beautifulyears/api/v1",
    //"productImageHost" : "http://www.beautifulyears.com/api/v1/products/images",
    //"selfHost" : "http://www.beautifulyears.com",

   "productHost" : "api/v1/products/beautifulyears/api/v1",
    "productImageHost" : "http://dev.beautifulyears.com/api/v1/products/images",
   "selfHost" : "http://dev.beautifulyears.com",

  //  "productHost" : "api/v1/products/beautifulyears/api/v1",
  //  "selfHost" : "http://localhost:8080/ROOT/api/v1/products/images",
   // "productImageHost" : "http://localhost",
 
    "byContactNumber" : "080-6940-0333"
}


BY.config.constants.broadCastConfig = {
    "initMenu" : "initByMenu"
}

BY.config.sessionType =  {
    SESSION_TYPE_FULL : "0",
    SESSION_TYPE_GUEST : "1",
    SESSION_TYPE_PARTIAL : "2"
};

BY.config.userCredentialError =  {
    3001 : "Sorry! You are not authorized to perform the selected operation",
    3002 : "Please login to perform such operation",
    3003 : "Login failed. Invalid user/password combination.",
    3004 : "User with the same credentials already exists",
    3005 : "Invalid session, please login to continue",
    3006 : "User's emailId is not registered",
    3007 : "Validation code has been expired, please generate a new one",
    3008 : "Validation code entered is invalid. Please enter a valid code.",
    3009 : "Oops! Looks like you have already signed in earlier via Facebook or Google. Please click on 'Join Us' to complete the social sign in, and resubmit. Thank you!",
    3010 : "Please login/Register yo perform this operation.",
    3011 : "Please login with your password or social sign in for this operation."
};
