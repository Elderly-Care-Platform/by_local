/**
 * Base js functions
 */

//$(document).ready(function(){
//    var $container = $('.grid-boxes');
//
//    var gutter = 30;
//    var min_width = 300;
//    $container.imagesLoaded( function(){
//        $container.masonry({
//            itemSelector : '.grid-boxes-in',
//            gutterWidth: gutter,
//            isAnimated: true,
//              columnWidth: function( containerWidth ) {
//                var box_width = (((containerWidth - 2*gutter)/3) | 0) ;
//
//                if (box_width < min_width) {
//                    box_width = (((containerWidth - gutter)/2) | 0);
//                }
//
//                if (box_width < min_width) {
//                    box_width = containerWidth;
//                }
//
//                $('.grid-boxes-in').width(box_width);
//
//                return box_width;
//              }
//        });
//    });
//});

var masonaryGridInit = function(){
	var $container = $('.grid-boxes');

    var gutter = 15;
    var min_width = 300;
    if($container.length > 0){
        $container.imagesLoaded( function(){
            var gridMasonary = $container.masonry({
                itemSelector : '.grid-boxes-in',
                gutterWidth: gutter,
                isAnimated: false,
                columnWidth: function( containerWidth ) {
                    var box_width = (((containerWidth - 2*gutter)/2) | 0) ;
                    var box_width_two = containerWidth ;

                    if (box_width < min_width) {
                        box_width = (((containerWidth - gutter)/2) | 0);
                    }

                    if (box_width < min_width) {
                        box_width = containerWidth;
                    }

                    $('.grid-boxes-in').width(box_width);
                    $('.grid-boxes-in-two').width(box_width_two);


                    return box_width;
                }
            });

            //gridMasonary.masonry("on","layoutComplete", function(){
            //    $("#preloader").hide();
            //});
        });
    }

}
