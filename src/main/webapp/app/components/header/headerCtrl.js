define([], function() {
    function BYHeaderCtrl($scope, $window, $rootScope){
       var isHome = true;
       if(isHome == true){
    	   $scope.templateUrl= 'app/components/header/homeHeader.html?versionTimeStamp=%PROJECT_VERSION%';
         // on scrolling adding header background
         angular.element($window).bind("scroll", function() {
          var headerHeight = $(".by_header").height();
          if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= headerHeight){
            $(".by_header").addClass("by_header_image");
           
          } else{
            $(".by_header").removeClass("by_header_image");
          }
      });///////////////////////
       } else{
    	   $scope.templateUrl= 'app/components/header/otherHeader.html?versionTimeStamp=%PROJECT_VERSION%';
         
       }


     
      
       $scope.searchInputShow = function(){
        if($(".by_header_right_search").css('display') == 'none'){
          $(".by_header_right_search").fadeIn('1000');
        } else{
          document.getElementById('search_link').click()
        }         
      };
       
    }
    BYHeaderCtrl.$inject = ['$scope', '$window', '$rootScope'];
    return BYHeaderCtrl;
});

