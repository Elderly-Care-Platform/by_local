var apiPrefix = "";
var reloadDone = false;

require.config({
	// baseUrl: '../',
	urlArgs: "versionTimeStamp=%PROJECT_VERSION%",
	paths : {
		byApp : '../main/app',
		byResource : '../main/appResources',
		byDirectives : '../main/appDirectives',

		jquery : '../../lib/unify/plugins/jquery/jquery.min',
		angular : '../../lib/angular/angular',
		angularRoute : '../../lib/angular/angular-route',
		angularResource : '../../lib/angular/angular-resource',
		angularInfiniteScroll : '../../lib/angular/ng-infinite-scroll',
		angularGoogleLocation : '../../lib/angular/ng-google-location',
		blogMasonary : '../../lib/unify/js/pages/blog-masonry',
		jqueryMasonaryGrid : '../../lib/unify/plugins/masonry/jquery.masonry.min',
//		jqueryUiLib : '../../lib/jqueryPlugins/jquery-ui-1.11.4.custom/jquery-ui.min',

		bootstrapToggle: '../../lib/unify/plugins/bootstrap/js/bootstrap-toggle',

		byUtil : '../shared/util/byUtil',
		byEditor : '../shared/editor/byEditor',
		shareController : '../shared/common/js/shareController',
		userTypeConfig : '../shared/common/config/userTypesConfig',
		editorController : '../shared/editor/editorController',

		homePromoController : '../components/home/homeContentCtrl',
		homeContentController : '../components/home/homePromoController',
		homeConfig : '../components/home/homeConfig',
		discussLikeController : '../components/discussDetail/discussLikeCtrl',
		discussDetailLeftController : '../components/discussDetail/discussDetailLeftCtrl',
		discussReplyController : '../components/discussDetail/DiscussReplyCtrl',
		LoginController : '../components/signup/login/loginController',
		sectionHeaderConfig : '../components/menu/sectionHeaderConfig',

		indvUserProfileCtrl : '../components/profile/indvUserProfileCtrl',
		instProfileCtrl : '../components/profile/instProfileCtrl',
		profUserProfileCtrl : '../components/profile/profUserProfileCtrl',
		reviewRateController : '../components/profile/reviewRateController',
		housingProfileCtrl : '../components/profile/housingProfileCtrl',
		housingProfileLeftCtrl : '../components/profile/housingProfileLeftCtrl',

		registrationConfig : '../components/signup/common/registrationConfig',
		regIndividualCtrl : '../components/signup/registration/regIndividualCtrl',
		regProfessionalCtrl : '../components/signup/registration/regProfessionalCtrl',
		regInstitutionCtrl : '../components/signup/registration/regInstitutionCtrl',
		regHousingCtrl : '../components/signup/registration/regHousingCtrl',
		regHousingFacilityCtrl : '../components/signup/registration/regHousingFacilityCtrl',
		regUserTypeController : '../components/signup/regUserTypeController',
		modifySignupCtrl : '../components/signup/login/modifySignupCtrl'

	},

	shim : {
		'angular' : {
			'exports' : 'angular'
		},
		'angularRoute' : {
			deps : [ "angular" ]
		},
		"angularResource" : {
			deps : [ "angular" ]
		},
		"angularInfiniteScroll" : {
			deps : [ "angular" ]
		},
		"angularGoogleLocation" : {
			deps : [ "angular" ]
		},

		'bootstrapToggle' : {
			deps : [ "jquery" ]
		}
	},

});
require([ 'angular',"byApp","byUtil", "byDirectives"], function(angular, byApp, byUtil, byDirectives) {
	$.ajax({
		url : apiPrefix + 'api/v1/menu/getMenu?parentId=root',
		success : function(response) {
			window.by_menu = response;
			angular.bootstrap(document, [ "byApp" ]);

			var sess = localStorage.getItem("SessionId");
			//alert(sess);
			if(sess != '' && sess != null)
			{
				var log = document.getElementById('login_placeholder');
				log.innerHTML = "Logout";
				log.href = apiPrefix+"#!/users/logout/" + sess;
				document.getElementById("login_placeHolder_li").style.display = "inline";

				var pro = document.getElementById('profile_placeholder');

				var userName = localStorage.getItem("USER_NAME");
				pro.innerHTML = BY.byUtil.validateUserName(userName);
				pro.href = apiPrefix + "#!/users/registrationProfile/";


				if(window.location.href.endsWith("#!/users/login") || window.location.href.endsWith("main.html"))
				{
					window.location = apiPrefix+"#!/users/home?type=home";
				}
			}
			else
			{
				BY.byUtil.inValidateSession();
			}
		}
	});
});