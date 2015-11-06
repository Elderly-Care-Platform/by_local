define([], function() {
    function BYHeaderCtrl($scope, $window, $rootScope){
       var isHome = false;
       if(isHome == true){
    	   $scope.templateUrl= 'app/components/header/homeHeader.html?versionTimeStamp=%PROJECT_VERSION%';
         // on scrolling adding header background
         angular.element($window).bind("scroll", function() {
          var headerHeight = $(".by_header").height();
          if((document.body.scrollTop || document.documentElement.scrollTop || window.pageYOffset) >= headerHeight){
            $(".by_header").addClass("by_header_image");
            if($rootScope.windowWidth > 720){        
              $(".by_logo").css('width', '180px');    
              $(".by_header_contact").addClass("by_header_rightScroll");
              $(".by_header_right").css('margin-top', '6px');
            }  else{
              $(".by_logo").css('width', '150px');  
            }
          } else{
            $(".by_header").removeClass("by_header_image");
            if($rootScope.windowWidth > 720){
              $(".by_logo").css('width', '180px');
              $(".by_header_contact").removeClass("by_header_rightScroll");
              $(".by_header_right").css('margin-top', '0px');
            } else{
              $(".by_logo").css('width', '150px');  
            }
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

