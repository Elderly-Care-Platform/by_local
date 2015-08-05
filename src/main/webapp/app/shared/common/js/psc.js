//$(document).ready(function() {
//	/*$(".searchWrapper input").focus(function() {
//		$(".searchIconPSC").show();
//	});
//	$(".searchWrapper input").blur(function() {
//		$(".searchIconPSC").hide();
//	});*/
//$(".topScroll").click(function(){
//	$('body').animate({
//		scrollTop: 0
//	}, 800);
//});
//
//
//
//$(".submitTextFileButton").click(function(e){
//	$("#submitTextFile").click();
//});
//
//var searchWrapperfooterWidth = $(".searchWrapperfooter").width() - 20;
//$(".searchLeftfooter").css('width', searchWrapperfooterWidth +"px");
//
//$(".subscibeButtonShow").focus(function() {
//	$(".subscribeButton").css('visibility', 'visible');
//});
//$(".subscibeButtonShow").blur(function() {
//	$(".subscribeButton").css('visibility', 'hidden');
//});
//if($(".homePage").length){
//	var lw = $(".left-container").width() - 10;
//	var iw = lw * (91.66666667/100);
//	$(".left-container-img-wrapper").width(iw);
//
//}
//var w = $(".left-container").width();
//$(".left-container-img-wrapper").width(w);
//if($(".homePage").length){
//	$(".left-container-img-wrapper").width(w - 12);
//}
//
//var containerWidth = $(".container").outerWidth();
//var leftcontainerWidth = $(".left-container").outerWidth();
//var leftcontainerWidth2 = containerWidth - leftcontainerWidth - 15 ;
//	//alert(containerWidth);
//	$(".article-outer-wrapper").css('margin-left', leftcontainerWidth +"px");
//	$(".article-outer-wrapper").css('width', leftcontainerWidth2 +"px");
//
//	////////
//
//	$(".personalStoryGalleryItem").css('cursor', 'pointer');
//	$(".personalStoryGalleryItem").click(function(event){
//		event.stopPropagation();
//		var urlPopup = $(this).attr('data-popup');
//		$(".profilePopupImagesWrapperImage").find('img').attr('src', urlPopup);
//		$(".profilePopupImages").fadeIn();
//	});
//	$(".profilePopupImagesWrapperClose").click(function(event){
//		$(".profilePopupImages").fadeOut();
//	});
//
//
//
//
//	$(".personalStoryGalleryItem, .profileHoverImages").hover(function(event){
//		var myHeight =  $(window).scrollTop() + $(window).height();
//		var hoverHeightTop = $(this).offset().top + $(this).height() + $(".profileHoverImages").height() + 5;
//		event.stopPropagation();
//		var urlHover = $(this).attr('data-hover');
//		var hoverHeight = $(this).height();
//		var hoverOffTop = $(this).offset().top + hoverHeight + 5;
//		var hoverOffLeft = $(this).offset().left - 32;
//		$(".profileHoverImages").find('img').attr('src', urlHover);
//		if( myHeight <  hoverHeightTop)
//		{
//			var hoverOffTop = $(this).offset().top - $(".profileHoverImages").height() - 10;
//		}else{
//
//		}
//		$(".profileHoverImages").css('left', hoverOffLeft +"px");
//		$(".profileHoverImages").css('top', hoverOffTop +"px");
//		$(".profileHoverImages").show();
//	}, function(event){
//		$(".profileHoverImages").hide();
//	});
//
//	///////////
//
//	$( ".searchLeft input" ).focusin(function() {
//		$(".searchRight").css('color', '#fff');
//		$(".searchRight").css('background', '#00af50');
//	});
//	$( ".searchLeft input" ).focusout(function() {
//		$(".searchRight").css('color', '#ccc');
//		$(".searchRight").css('background', 'transparent');
//	});
//
//	$( ".searchLeftfooter input" ).focusin(function() {
//		$(".searchRightfooter").css('color', '#fff');
//		$(".searchRightfooter").css('background', '#00af50');
//	});
//	$( ".searchLeftfooter input" ).focusout(function() {
//		$(".searchRightfooter").css('color', '#ccc');
//		$(".searchRightfooter").css('background', 'transparent');
//	});
//
//	///////////////
//
//	$(".shareClick").click(function(event){
//		$(this).find(".shareClickWrapper").show();
//		event.stopPropagation();
//	});
//
//	$(".shareClickWrapperClose").click(function(event){
//		$(".shareClickWrapper").css('display', 'none');
//		event.stopPropagation();
//	});
//
//	$('body').click(function(event){
//		$(".shareClickWrapper").hide();
//	});
//
//
//	/*$('body a').click(function(event){
//		event.stopPropagation();
//	});*/
//	$('body input').click(function(event){
//		event.stopPropagation();
//	});
//
//
//	///////////////////////
//	/*$('.ms, .ms1, .ms2, .ms3 ').change(function() {
//		console.log($(this).val());
//	}).multipleSelect({
//		width: '100%'
//	});
//	*/
//
//	//commented by aditya
//	////////////////////////
//
//
//	$(".ms").click(function(event){
//		$(this).find('.ms-drop.bottom').show();
//		event.stopPropagation();
//	});
//
//	$(".ms1").click(function(event){
//		$(this).find('.ms-drop.bottom').show();
//		event.stopPropagation();
//	});
//
//	$(".ms2").click(function(event){
//		$(this).find('.ms-drop.bottom').show();
//		event.stopPropagation();
//	});
//
//	$(".ms3").click(function(event){
//		$(this).find('.ms-drop.bottom').show();
//		event.stopPropagation();
//	});
//
//	$('body').click(function(event){
//		$('.ms-drop.bottom').hide();
//	});
//
//	$(".ms ul li input").click(function(event){
//		if($(this).val()==="other"){
//			var otherHtml = '<div class=" row margin-bottom-20"><div class="col-md-5"></div><div class="col-md-7"><input type="text" class=" textbox" name="enter" placeholder="Enter other language" /></div></div>';
//			$(this).parents(".otherAppend").after(otherHtml);
//			$(this).parents(".otherAppend").find('.ms-drop.bottom').hide();
//			event.stopPropagation();
//		}
//
//	});
//	$(".ms1 ul li input").click(function(event){
//		if($(this).val()==="other"){
//			var otherHtml = '<div class=" row margin-bottom-20"><div class="col-md-5"></div><div class="col-md-7"><input type="text" class=" textbox" name="enter" placeholder="Enter other interest" /></div></div>';
//			$(this).parents(".otherAppend").after(otherHtml);
//			$(this).parents(".otherAppend").find('.ms-drop.bottom').hide();
//			event.stopPropagation();
//		}
//
//	});
//	$(".ms2 ul li input").click(function(event){
//		if($(this).val()==="other"){
//			var otherHtml = '<div class=" row margin-bottom-20"><div class="col-md-5"></div><div class="col-md-7"><input type="text" class=" textbox" name="enter" placeholder="Enter other like" /></div></div>';
//			$(this).parents(".otherAppend").after(otherHtml);
//			$(this).parents(".otherAppend").find('.ms-drop.bottom').hide();
//			event.stopPropagation();
//		}
//
//	});
//	$(".ms3 ul li input").click(function(event){
//		if($(this).val()==="other"){
//			var otherHtml = '<div class=" row margin-bottom-20"><div class="col-md-5"></div><div class="col-md-7"><input type="text" class=" textbox" name="enter" placeholder="Enter other suffering" /></div></div>';
//			$(this).parents(".otherAppend").after(otherHtml);
//			$(this).parents(".otherAppend").find('.ms-drop.bottom').hide();
//			event.stopPropagation();
//		}
//
//	});
//
//
//	//////////////
//
//
//
//
//});
//
//
//$(document).on("pagecreate",function(event){
//	$(window).on("orientationchange",function(){
//		location.reload();
//
//	});
//});
//
