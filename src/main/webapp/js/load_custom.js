var byCustomApp = angular.module('customApp', [
 	"byControllers"

 ]);



//load JS file
byControllers.controller('LoadCustomJSController', ['$scope',
	function($scope) {

		//$timeout(function() {

		$scope.load = function() {




			///tintmce

			tinymce.init({
							   selector: "#share-tip,#ask-question,#give-feedback,#main-commentbox",
							   theme: "modern",
							   skin: 'light',
							   statusbar : false,
							   menubar:false,
							   plugins: [
							   "image link",
							   "searchreplace visualblocks",
							   "insertdatetime media paste emoticons"
							   ],
							   toolbar: "bold italic | bullist numlist | link unlink emoticons image media",
							   setup : function(ed) {
								   var placeholder = $('#' + ed.id).attr('placeholder');
								   if (typeof placeholder !== 'undefined' && placeholder !== false) {
									 var is_default = false;
									 ed.on('init', function() {
									   // get the current content
									   var cont = ed.getContent();

									   // If its empty and we have a placeholder set the value
									   if (cont.length === 0) {
										 ed.setContent(placeholder);
										 // Get updated content
										 cont = placeholder;
									 }
									   // convert to plain text and compare strings
									   is_default = (cont == placeholder);

									   // nothing to do
									   if (!is_default) {
										 return;
									 }
								 }).on('keydown', function() {
										   // replace the default content on focus if the same as original placeholder
										   if (is_default) {
											 ed.setContent('');
											 is_default = false;
										 }
									 }).on('blur', function() {
									   if (ed.getContent().length === 0) {
										 ed.setContent(placeholder);
									 }
								 });
								 }
								 ed.on('init', function (evt) {
								   var toolbar = $(evt.target.editorContainer)
								   .find('>.mce-container-body >.mce-toolbar-grp');
								   var editor = $(evt.target.editorContainer)
								   .find('>.mce-container-body >.mce-edit-area');

									   // switch the order of the elements
									   toolbar.detach().insertAfter(editor);
								   });
								 ed.on("keyup", function() {
								   var id = ed.id;
								   if($.trim(ed.getContent({format: 'text'})).length){
									   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
								   } else {
									   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
								   }
							   });
							 }
							   /*file_browser_callback: function(field_name, url, type, win) {
								   win.document.getElementById(field_name).value = myFileBrowser(field_name, url, type, win);
							   }*/
						   });
						   tinymce.init({
							   selector: "#submit-article",
							   theme: "modern",
							   skin: 'light',
							   statusbar : false,
							   menubar:false,
							   plugins: [
							   "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
							   "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
							   "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
							   ],
							   toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media | spellchecker  ",

							   setup : function(ed)
							   {
								   var placeholder = $('#' + ed.id).attr('placeholder');
								   if (typeof placeholder !== 'undefined' && placeholder !== false) {
									 var is_default = false;
									 ed.on('init', function() {
										   // get the current content
										   var cont = ed.getContent();

										   // If its empty and we have a placeholder set the value
										   if (cont.length === 0) {
											 ed.setContent(placeholder);
											 // Get updated content
											 cont = placeholder;
										 }
										   // convert to plain text and compare strings
										   is_default = (cont == placeholder);

										   // nothing to do
										   if (!is_default) {
											 return;
										 }
									 }).on('keydown', function() {
											   // replace the default content on focus if the same as original placeholder
											   if (is_default) {
												 ed.setContent('');
												 is_default = false;
											 }
										 }).on('blur', function() {
										   if (ed.getContent().length === 0) {
											 ed.setContent(placeholder);
										 }
									 });
									 }
									 ed.on('init', function (evt) {
									   var toolbar = $(evt.target.editorContainer)
									   .find('>.mce-container-body >.mce-toolbar-grp');
									   var editor = $(evt.target.editorContainer)
									   .find('>.mce-container-body >.mce-edit-area');

										   // switch the order of the elements
										   toolbar.detach().insertAfter(editor);
									   });
									 ed.on("keyup", function() {
									   var id = ed.id;
									   if($.trim(ed.getContent({format: 'text'})).length){
										   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
									   } else {
										   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
									   }
								   });
							   }


							});

			//tinymce















/* Write here your custom javascript codes */
th = 0;
init_offset = 0;
init_bc_offset = 0;
left_flag = false;
tx = false;
aq_set = false;
st_set = false;
gf_set = false;
sm_set = false;
dp = 1;
/*function setHeight(){
	if($(window).width() < 991){
		return;
	}
	if($(".left-container").length){
		if($("body").scrollTop() + $(window).height() >= $(".footer-v1").offset().top){
			$(".left-container").height( $(".footer-v1").offset().top - $(".left-container").offset().top);
		} else{
			$(".left-container").height($(window).height() - init_offset);
		}
	}
}*/

$(window).load(function(){
				$(".preloader").fadeOut('500');
			});
function setHeight(){
	if($(window).width() < 986){
		var windowHeight = $(window).height();

			if($("body").scrollTop() > windowHeight){
				$(".topScroll").show();
			}else
			{
				$(".topScroll").hide();
			}
			$(".breadCrumbMargin").css("margin-top",'40px');
			$(".searchWrapper").appendTo('.searchClearboth');
			var w = $(".left-container").width();
			$(".left-container-img-wrapper").width(w);
			if($(".homePage").length){
				$(".left-container-img-wrapper").width(w - 0);
			}

			if($(".register-page").length){

				$(".signup-info").prependTo(".second-register-page ");
				$(".signup-info").prependTo(".first-register-page ");
			}


			if($(".third-register-page").length){

				$(".signup-info").prependTo(".third-register-page");

				var year=new Date().getFullYear();
				$( "#datepicker,#datepicker1" ).datepicker({
					showOn: "focus",
					changeYear: true,
					yearRange: '1900:year'

				});
			}
			if($(".discussion-page").length && !$(".profile-page").length) {
				$(".submit-article-textarea").css("top",$(".submit-article").offset().top + 35 + "px");
			}

		return;
	}
	if($(".left-container").length){
		var leftCHeight = $(window).height() - $(".header").height() - $(".headerBottom").height()  - 50 ;

		$(".left-container").height(leftCHeight);
	}
	var headerH =  $(".headerBottom").height() + $(".headerBottomImage").height();
			var bostSTF = $(window).scrollTop();

			if(bostSTF > headerH)
			{
				$(".left-container").css('padding-bottom', headerH +"px");
				$(".left-container").css('margin-top', - headerH +"px");

			}
			if(bostSTF < headerH){
				$(".left-container").css('padding-bottom', 0 +"px");
				$(".left-container").css('margin-top', - 0 +"px");
			}

	$(window).scroll(function(){

			var headerH =  $(".headerBottom").height() + $(".headerBottomImage").height();
			var bostSTF = $(window).scrollTop();

			if(bostSTF > headerH)
			{
				$(".left-container").css('padding-bottom', headerH +"px");
				$(".left-container").css('margin-top', - headerH +"px");

			}
			if(bostSTF < headerH){
				$(".left-container").css('padding-bottom', 0 +"px");
				$(".left-container").css('margin-top', - 0 +"px");
			}

			var windowHeight = $(window).height();

			if($("body").scrollTop() > windowHeight){
				$(".topScroll").show();
			}else
			{
				$(".topScroll").hide();
			}

			var footerH = $(".footer-v1").height() ;


			if($(window).scrollTop() >= $(document).height() - $(window).height() - footerH  ) {

        var leftCHeight = $(window).height() - $(".header").height() - $(".headerBottom").height()  - 50 - footerH  ;

		$(".left-container").height(leftCHeight);
    }

	});

}
$(function(){



	var screenWidth = $(window).innerWidth();
	if (screenWidth<991) {
		$(".searchWrapper").appendTo('.mobileSearch');
		$(".dropdown-menu .mega-menu-content .equal-height-in").removeClass("col-md-2");
		$(".exp-dropdown").css('display','block');
		$(".head-more").parent().hide();
	};
	// Search box focus and lost focus

	$(".searchWrapper input").keyup(function(){
		if($.trim($(this).val()) == ""){
			$(".header-go-button").addClass("disabled");
		} else {
			$(".header-go-button").removeClass("disabled");
		}
	});
	// If likes exist

	$(".icon-heart").each(function(){
		$(this).parents("li").addClass("add-like");
	});
	$(".add-like a").click(function(e){
		var l = parseInt($(this).parents("li").find("span").text());
		l++;
		$(this).parents("li").find("span").text(l.toString());
	});
	//
	/*if($(".left-container").length){
		$(document).on("mousewheel",".left-container",function(e){
			if(tx == true){
				$(".left-container").css("overflow-y","hidden");
				e.preventDefault();
				e.stopPropagation();
			} else {
				$(".left-container").css("overflow-y","auto");
			}

		});
}*/

if($(".articles-page").length || $(".profile-page").length ){
	$(".article-share-links .rounded-x.icon-speech,.article-share-links .post_text-comment").click(function(e){
		e.preventDefault();
		var obj = { "scrollTop" : $(".enter-comment-wrap").offset().top};
		$("body").animate(obj,300);

		//if check added for detail.html
		if(tinyMCE.get('main-commentbox_answer')) tinyMCE.get('main-commentbox_answer').getBody().focus();
		if(tinyMCE.get('main-commentbox_comment')) tinyMCE.get('main-commentbox_comment').getBody().focus();
		return false;
	});
	$("body").click(function(e){
		if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("inner-enter-comment-wrap") || $(e.target).parents(".inner-enter-comment-wrap").length|| $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
			return false;
		}
		if($("#comment-ta").length){
			hideinnertext();
		}

		if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("send-message-textarea") || $(e.target).parents(".send-message-textarea").length || $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
			return false;
		}
		hidemessage();
	});
	$(document).on("click",".inner-enter-comment-wrap",function(e){
		e.stopPropagation();
		return false;
	});
	$(document).on("click",".send-message-textarea",function(e){
		e.stopPropagation();
		return false;
	});
	function hideinnertext(){
		tinyMCE.get('comment-ta').remove();
		$(".inner-enter-comment-wrap").remove();
	}
	function hidemessage(){
			//$(".send-message").parent().removeClass("zindex-10");
			$(".send-message-textarea").css("display","none").css("width","0px");
			tx = false;
			//$(".left-container").css("overflow-y","auto");
		}
		$(".send-message").click(function(e){
			e.stopPropagation();
			//$(this).parent().addClass("zindex-10");
			var obj = {"width" : $(".container.content").width() + "px"};
			if(left_flag && !sm_set){
				$(".send-message-textarea").css("top",parseInt($(".send-message-textarea").css("top")) - $(".left-container").scrollTop() );
				sm_set = true;
			}
			/*if(left_flag){
				$(".left-container").css("overflow-y","hidden");
			}*/
			tx = true;
			$(".send-message-textarea").css("display","block");
			$(".send-message-textarea").animate(obj,500).addClass("exp");
			//tinyMCE.get('message-text').getBody().focus();
			return false;
		});
	}
	$(".main-comment .add-comment").click(function(e){
		e.preventDefault();
		var cur = $(this).parents(".main-comment").first();
		if($(".inner-enter-comment-wrap").length){
			hideinnertext();
		}
		if(!$(".inner-enter-comment-wrap").length){
			cur.append('<div class="inner-enter-comment-wrap"><textarea rows="3" id="comment-ta" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
		}
		if($(window).width() > 992){
			var obj = {scrollTop : $(".inner-enter-comment-wrap").offset().top - 230};
			$("body").animate(obj,200);
		}
		initTinyMce("comment-ta");
		setTimeout(function(){
			tinyMCE.get('comment-ta').getBody().focus();
		},300);

		return false;
	});
	$(".discussion-page #sidebar-nav-1 li").hover(function(){
		if(!$(this).hasClass("selected")){
			$(this).addClass("active");
		}
	},function(){
		if(!$(this).hasClass("selected")){
			$(this).removeClass("active");
		}
	});


	$(".discussion-page #sidebar-nav-1 li").click(function(){
		if($(this).hasClass("selected")){
			return false;
		}
		$(".discussion-page #sidebar-nav-1 .active").removeClass("active");
		$(".discussion-page #sidebar-nav-1 .selected").removeClass("selected");
		$(this).addClass("selected");
		$(this).addClass("active");
		var className = $(this).data("index");
		$(".blog-author.main-article[data-index=" + className + "]").css("display","block");
		$(".blog-author.main-article[data-index!=" + className + "]").css("display","none");
		if($(window).width() < 992){
			var obj = { "scrollTop" : $(".article-outer-wrapper").offset().top};
			$("html,body").animate(obj,300);
		}
		setHeight();
	});

	if($(".discussion-page").length){
		$(".blog-author[data-index=discussion-QA][data-answers=0] > .blog-author-desc").append("<button class='first-to-answer btn btn-xs btn-warning'>BE THE FIRST TO ANSWER</button>");
		$(".article-share-links .add-comment .post-text").click(function(e){
			e.preventDefault();
			var cur_e = $(e.target);
			if(cur_e.parents(".answer-focus").length){
				return;
			}
			if($(this).parents(".blog-author").data('index') != "discussion-articles" && $(this).parents(".blog-author").data('index') != "discussion-QA" || $(".QA-wrapper").length){
				e.preventDefault();
				if($("#comment-ta").length){
					hidecommentbox();
				}
				var ele = $(this);
				var cur = $(this).parents(".main-article").first();
				if(!cur.find(".inner-enter-comment-wrap").length && $(".discussion-wrapper").length){
					cur.append('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
				} else if(!cur.find(".inner-enter-comment-wrap").length && $(".QA-wrapper").length){
					//if(cur_e.parents(".blog-author").hasClass(".answer-block")){
						if(ele.hasClass("answer-add-comment")){
							ele.parents(".answer-blog-author-desc").after('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
						} else {
							ele.parents(".answer-block").find(".blog-author-desc").first().after('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
						}

					//} else {
					//	cur_e.parents(".blog-author").find(".blog-author-desc").append('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-md btn-success disabled">Submit</button><div class="clearfix"></div></div>');
					//}
				}
				if($(window).width() > 992){
					var obj = {scrollTop : $(".inner-enter-comment-wrap").offset().top - 230};
					$("body").animate(obj,200);
				}
				initTinyMce("comment-ta");
				setTimeout(function(){
					tinyMCE.get('comment-ta').getBody().focus();
					if($(window).width() > 992){
						setHeight();
					}

				},100);
				return false;
			} else {
				window.location.href = $(this).parents(".blog-author").data('link');
			}
		});
$(".blog-author[data-index]").click(function(){
	if($(this).data('link')){
		window.location.href = $(this).data('link');
	} else{

	}
});
$(".ask-question").click(function(e){
	e.stopPropagation();
	if(!$(".ask-question-textarea").hasClass("exp")){
		hidetextarea();
	}
	if(left_flag && !aq_set){
		$(".ask-question-textarea").css("top",parseInt($(".ask-question-textarea").css("top")) - $(".left-container").scrollTop() );
		aq_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
	//$(".textareas").prepend($(".ask-question-textarea"));
	var obj = { "width" : $(".container.content").width() + "px"};
	var st = $("body").scrollTop();
	$(".ask-question-textarea").css("display","block");
	$("body").scrollTop(st);
	$(".ask-question-textarea").animate(obj,500,function(){$("body").scrollTop(st);}).addClass("exp");
	tinyMCE.get('ask-question').getBody().focus();
	return false;
});

$(".share-tips").click(function(e){

	e.stopPropagation();
	if(!$(".share-tip-textarea").hasClass("exp")){
		hidetextarea();
	}
	if(left_flag && !st_set){
		$(".share-tip-textarea").css("top",parseInt($(".share-tip-textarea").css("top")) - $(".left-container").scrollTop() );
		st_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
	//$(".textareas").prepend($(".share-tip-textarea"));
	var obj = {"width" : $(".container.content").width() + "px"};
	$(".share-tip-textarea").css("display","block");
	$(".share-tip-textarea").animate(obj,500);
	tinyMCE.get('share-tip').getBody().focus();
	return false;
});
$(".submit-article").click(function(e){

	e.stopPropagation();
	if(!$(".submit-article-textarea").hasClass("exp")){
		hidetextarea();
	}
	if(left_flag && !st_set){
		$(".submit-article-textarea").css("top",parseInt($(".submit-article-textarea").css("top")) - $(".left-container").scrollTop() );
		st_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
	//$(".textareas").prepend($(".share-tip-textarea"));
	var obj = {"width" : $(".container.content").width() + "px"};
	$(".submit-article-textarea").css("display","block");
	$(".submit-article-textarea").animate(obj,500);
	tinyMCE.get('share-tip').getBody().focus();
	return false;
})

/*$(".submit-article").click(function(e){
	$("#fileopen").click();
});*/



$(".give-feedback").click(function(e){
	e.stopPropagation();
	if(!$(".give-feedback-textarea").hasClass("exp")){
		hidetextarea();
	}

	if(left_flag && !gf_set){
		$(".give-feedback-textarea").css("top",parseInt($(".give-feedback-textarea").css("top")) - $(".left-container").scrollTop() );
		gf_set = true;
	}
	/*if(left_flag){
		$(".left-container").css("overflow-y","hidden");
	}*/
	tx = true;
    //$(".textareas").prepend($(".give-feedback-textarea"));
    var obj = {"width" : $(".container.content").width() + "px"};
    var st = $("html").scrollTop();
    $(".give-feedback-textarea").css("display","block");
    $("html").scrollTop(st);
    $(".give-feedback-textarea").animate(obj,500).addClass("exp");
    tinyMCE.get('give-feedback').getBody().focus();
    return false;
});

$(".textarea-label").addClass("exp");
$("body").click(function(e){
	if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("textarea-label") || $(e.target).parents(".textarea-label").length || $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
		return false;
	}
	hidetextarea();
	if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("inner-enter-comment-wrap") || $(e.target).parents(".inner-enter-comment-wrap").length){
		return false;
	}
	hidecommentbox();
});

$(".exp").click(function(e){
	e.stopPropagation();
});

$(".textarea-label").removeClass("exp");

function hidetextarea(){
	$(".zindex-10").removeClass("zindex-10");
	$(".textarea-label").css("display","none");
	$(".textarea-label").css("width","0px");
	$(".textarea-label").removeClass("exp");
	tx = false;
	//$(".left-container").css("overflow-y","auto");
}
function hidecommentbox(){
	if($("#comment-ta").length){
		tinymce.get('comment-ta').remove();
	}
	$(".inner-enter-comment-wrap").remove();
}
}

if($(".QA-wrapper").length || $(".article-wrapper").length){

	$(document).on("click",".first-to-answer,.answer-focus,.answer-focus .post-text",function(){

		if($(".enter-comment-wrap").css("display") == "none"){
			$(".enter-comment-wrap").css("display","block");
			tinyMCE.get('main-commentbox').getBody().focus();
			var obj = {scrollTop : $(".enter-comment-wrap").offset().top};
			$("body").animate(obj,200);
		} else {
			//$(".enter-comment-wrap").css("display","none");
		}

	});
	$(".enter-comment-wrap .comment-submit").click(function(){

		if(!$(".article-wrapper").length){

			var cur = $(this);
			var text_html = tinyMCE.get('main-commentbox').getContent({format:'raw'});
			var html = $(".hidden-answer-sample").clone(true);
			html.find(".article-content").html(text_html);
			html.find(".post-shares span").html("0");
			html.removeClass("hidden-answer-sample");
			$(".article-outer-wrapper > .blog-author > .blog-author-desc").after(html);
			if($(".article-outer-wrapper > .blog-author").data('answers') == "0"){
				$(this).attr("data-answers","1");
				$(".first-to-answer").html("ANSWER THIS QUESTION");
			}
			tinyMCE.get('main-commentbox').setContent("");
			$(".comment-submit").addClass("disabled");
			$(".enter-comment-wrap").css("display","none");
			setHeight();
		} else {
			var cur = $(this);
			var text_html = tinyMCE.get('main-commentbox').getContent({format:'raw'});
			var html = $(".hidden-article-comment").clone(true);
			html.find(".post-shares.post-shares-lg").before(text_html);
			html.find(".post-shares span").html("0");
			html.removeClass("hidden-article-comment");
			$(".enter-comment-wrap").before(html);
			tinyMCE.get('main-commentbox').setContent("");
			$(".comment-submit").addClass("disabled");
			setHeight();
		}

	});
$(".blog-author").on("click",".inner-comment-submit",function(){
	var cur = $(this);
	var cur_par = $(this).parents(".blog-author");
	var text_html = tinyMCE.get('comment-ta').getContent({format:'raw'});
	var html = $(".hidden-comment-sample").clone(true);
	html.find(".overflow-h").after(text_html);
	html.find(".post-shares span").html("0");
	html.removeClass("hidden-comment-sample");
	cur.parents(".inner-enter-comment-wrap").after(html);
	tinyMCE.get('comment-ta').remove();
	$(".inner-enter-comment-wrap").remove();
	setHeight();
});
}

if($(".register-page").length){
	//$(".chzn-select").chosen(); $(".chzn-select-deselect").chosen({allow_single_deselect:true});
	$("#business-establishment").change(function(){
		$("#taking-care-of,#pro-elder-care,#volunteer,#none,#NGO").prop("checked",false);
	});
	$("#none").change(function(){
		$("#taking-care-of,#pro-elder-care,#volunteer,#business-establishment,#NGO").prop("checked",false);
	});
	$("#NGO").change(function(){
		$("#taking-care-of,#pro-elder-care,#volunteer,#business-establishment,#none").prop("checked",false);
	});
	$("#taking-care-of,#pro-elder-care,#volunteer").change(function(){
		$("#business-establishment,#none,#NGO").prop("checked",false);
	});
	if($(".third-register-page").length){
		$(".dropdown-wrapper").addClass("exp");
		$(".interests-selector").click(function(e){
			if(!$(".interests-wrapper").hasClass("exp")){
				hidewrappers();
			}
			e.stopPropagation();
			if($(".interests-wrapper").css("display") == "none"){
				$(".interests-wrapper").slideDown();
				$(".interests-wrapper").addClass("exp");
			} else {
				var text="";
				$(".interests-wrapper .parent").each(function(){
					var cur = $(this).find("input[type=checkbox]");
					if(cur.prop("checked")){
						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
					}
				});
				text = text.substring(0,text.length - 2);
				$(".interests-selector").val(text);
				$(".interests-wrapper").slideUp();
				$(".interests-wrapper").removeClass("exp");
			}
		});
		$(".likes-doing-selector").click(function(e){
			if(!$(".likes-doing-wrapper").hasClass("exp")){
				hidewrappers();
			}
			e.stopPropagation();
			if($(".likes-doing-wrapper").css("display") == "none"){
				$(".likes-doing-wrapper").slideDown();
				$(".likes-doing-wrapper").addClass("exp");
			} else {
				var text="";
				$(".likes-doing-wrapper .parent").each(function(){
					var cur = $(this).find("input[type=checkbox]");
					if(cur.prop("checked")){
						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
					}
				});
				text = text.substring(0,text.length - 2);
				$(".likes-doing-selector").val(text);
				$(".likes-doing-wrapper").slideUp();
				$(".likes-doing-wrapper").removeClass("exp");
			}
		});
		$(".suffering-from-selector").click(function(e){
			if(!$(".suffering-wrapper").hasClass("exp")){
				hidewrappers();
			}
			e.stopPropagation();
			if($(".suffering-wrapper").css("display") == "none"){
				$(".suffering-wrapper").slideDown();
				$(".suffering-wrapper").addClass("exp");
			} else {
				var text="";
				$(".suffering-wrapper .parent").each(function(){
					var cur = $(this).find("input[type=checkbox]");
					if(cur.prop("checked")){
						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
					}
				});
				text = text.substring(0,text.length - 2);
				$(".suffering-from-selector").val(text);
				$(".suffering-wrapper").slideUp();
				$(".suffering-wrapper").removeClass("exp");
			}
		});
		$(".dropdown-wrapper").css("display","block");
		///??????$(".interests-wrapper").offset({top : $(".interests-selector").offset().top + $(".interests-selector").innerHeight()  , left :$(".interests-selector").offset().left });
		//???????$(".likes-doing-wrapper").offset({top: $(".likes-doing-selector").offset().top + $(".likes-doing-selector").innerHeight(), left: $(".likes-doing-selector").offset().left});
		//???????$(".suffering-wrapper").offset({top: $(".suffering-from-selector").offset().top + $(".suffering-from-selector").innerHeight(), left: $(".suffering-from-selector").offset().left});
		//???????$(".dropdown-wrapper").css("display","none");
		$("body").click(function(e){
			e.stopPropagation();
			hidewrappers();
		});
		$(".exp").click(function(e){
			e.stopPropagation();
		});
		$(".interests-wrapper").removeClass("exp");
		function hidewrappers(){
			var text = "";
			$(".interests-wrapper .parent").each(function(){
				var cur = $(this).find("input[type=checkbox]");
				if(cur.prop("checked")){
					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
				}
			});
			text = text.substring(0,text.length - 2);
			$(".interests-selector").val(text);
			var text = "";
			$(".likes-doing-wrapper .parent").each(function(){
				var cur = $(this).find("input[type=checkbox]");
				if(cur.prop("checked")){
					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
				}
			});
			text = text.substring(0,text.length - 2);
			$(".likes-doing-selector").val(text);
			var text = "";
			$(".suffering-wrapper .parent").each(function(){
				var cur = $(this).find("input[type=checkbox]");
				if(cur.prop("checked")){
					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
				}
			});
			text = text.substring(0,text.length - 2);
			$(".suffering-from-selector").val(text);
			$(".dropdown-wrapper").css("display","none").removeClass("exp");
		}
		$(".interests-wrapper .parent input[type=checkbox]").change(function(){
			var id = $(this).parents(".parent").data("parent");
			if(id === undefined){
				return false;
			}
			if($(this).prop("checked")){
				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
			}
		});
		$(".likes-doing-wrapper .parent input[type=checkbox]").change(function(){
			var id = $(this).parents(".parent").data("parent");
			if(id === undefined){
				return false;
			}
			if($(this).prop("checked")){
				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
			}
		});
		$(".suffering-wrapper .parent input[type=checkbox]").change(function(){
			var id = $(this).parents(".parent").data("parent");
			if(id === undefined){
				return false;
			}
			if($(this).prop("checked")){
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").not("#other-issues,.other-issues-row input[type=checkbox]").prop("checked",true);
			} else {
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
			}
		});
		$(".interests-wrapper .child input[type=checkbox]").change(function(){
			var id = $(this).parents(".child").data("parent");
			if($(this).prop("checked")){
				$(".interests-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				var flag = false;
				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".interests-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
			}
		});
		$(".likes-doing-wrapper .child input[type=checkbox]").change(function(){
			var id = $(this).parents(".child").data("parent");
			if($(this).prop("checked")){
				$(".likes-doing-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				var flag = false;
				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".likes-doing-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
			}
		});
		$(".suffering-wrapper .child input[type=checkbox]").change(function(){
			var id = $(this).parents(".child").data("parent");
			if($(this).prop("checked")){
				$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
			} else {
				var flag = false;
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
			}
		});
		$(".sub-parent input[type=checkbox]").change(function(){
			var cur = $(this);
			var id = cur.parent(".sub-parent").data("sub-parent");
			if(cur.prop("checked")){
				$(".sub-child[data-sub-parent=" + id + "]").slideDown();
			} else {
				$(".sub-child[data-sub-parent=" + id + "] input").prop("checked",false);
				var flag = false;
				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
					if($(this).prop("checked")){
						flag = true;
					}
				});
				if(flag == false){
					$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
				}
				$(".sub-child[data-sub-parent=" + id + "]").slideUp();
			}
		});
		$("#other-medical-issue").change(function(){
			if($(this).prop("checked")){
				$(".other-medical-issue-text").css("display","block");
			} else {
				$(".other-medical-issue-text").css("display","none").val("");
			}
		});
		$(".suffering-wrapper .parent-other-main input[type=checkbox]").change(function(){
			if($(this).prop("checked")){
				$(".suffering-wrapper .child-other-main").css("display","block");
			} else {
				$(".suffering-wrapper .child-other-main").css("display","none");
				$(".suffering-wrapper .child-other-main input[type=text]").val("");
			}
		});
		$(".likes-doing-wrapper .parent-other-main input[type=checkbox]").change(function(){
			if($(this).prop("checked")){
				$(".likes-doing-wrapper .child-other-main").css("display","block");
			} else {
				$(".likes-doing-wrapper .child-other-main").css("display","none");
				$(".likes-doing-wrapper .child-other-main input[type=text]").val("");
			}
		});
		$(".add-sig").click(function(){
			//$(".add-sig-wrap").css("display","none");
			dp++;
			var html = '<div class="row margin-bottom-20 add-sig-content-edit-wrap"><div class="col-md-5">';
			html = html + '<span class="gender-her">Her</span>&nbsp;<span class="edit-res"></span> <input type="text" class="edit-label" /></div>';
			html = html + '<div class="col-md-6"><section class="col col-6"><label class="input">';
			html = html + '<i class="icon-append fa fa-calendar"></i> ';
			html = html + '<input type="text" style="font-weight: 400;" class="name-textbox textbox datepicker" name="name"  id="datepicker' + dp + '" readonly /></label>';
			html = html + '</section></div><div class="col-md-1 removeExtraDates"><i class="icon-append fa fa-close"></i></div></div>';
			$(".add-sig-wrap").before(html);
			$(".add-sig-content-edit-wrap .edit-label").focus();
			var year=new Date().getFullYear();

			$(".datepicker").datepicker({
				showOn: "focus",
				changeYear: true,
				yearRange: '1900:year'
			});
			//alert($(".taking-care-select-2").find('option[value=' + $(".taking-care-select-2").val() + ']').data('gender'));
			if($(".taking-care-select-2").find('option[value=' + $(".taking-care-select-2").val() + ']').data('gender') == "0"){
				$(".gender-she").html("She");
				$(".gender-her").html("Her");
				$(".gender-her-small").html("her");
				$(".gender-she-small").html("she");
			} else {
				$(".gender-she").html("He");
				$(".gender-her").html("His");
				$(".gender-her-small").html("his");
				$(".gender-she-small").html("he");
			}

			$(".taking-selected").html($(".taking-care-select option:selected").text());
			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
			if(addsigcontenteditwrapCount < 5)
			{
				$(".add-sig").show();
			} else{
				$(".add-sig").hide();
			}
		});


$(".add-sig_4").click(function(){
			//$(".add-sig-wrap").css("display","none");
			dp++;
			var html = '<div class="row margin-bottom-20 add-sig-content-edit-wrap"><div class="col-md-5">';
			html = html + '<span class="gender-her">My</span>&nbsp;<span class="edit-res"></span> <input type="text" class="edit-label" /></div>';
			html = html + '<div class="col-md-6"><section class="col col-6"><label class="input">';
			html = html + '<i class="icon-append fa fa-calendar"></i> ';
			html = html + '<input type="text" style="font-weight: 400;" class="name-textbox textbox datepicker" name="name"  id="datepicker' + dp + '" readonly /></label>';
			html = html + '</section></div><div class="col-md-1 removeExtraDates"><i class="icon-append fa fa-close"></i></div></div>';
			$(".add-sig-wrap").before(html);
			$(".add-sig-content-edit-wrap .edit-label").focus();
			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
			if(addsigcontenteditwrapCount < 5)
			{
				$(".add-sig_4").show();
			} else{
				$(".add-sig_4").hide();
			}
			var year=new Date().getFullYear();

			$(".datepicker").datepicker({
				showOn: "focus",
				changeYear: true,
				yearRange: '1900:year'
			});


		});

$(".lives-dependency-select").change(function(){
	var id = $(this).val();
	if(id == "2"){
		$(".lives-town-select").parent().slideUp();
	}else {
		$(".lives-town-select").parent().slideDown();
	}
	$(".taking-selected").html($(".taking-care-select option:selected").text());
});
$(".third-register-page").on("click",".edit-res",function(){
	var cur= $(this);
	cur.css("display","none");
	cur.siblings(".edit-label").css("display","inline-block");
});
$(document).on("focus",".edit-label",function(){
	var cur= $(this);
	cur.siblings(".edit-res").css("display","none");
	cur.css("display","inline-block");
});
$(document).on("blur",".edit-label",function(){
	var cur = $(this);
	if($.trim(cur.val())){
		cur.siblings(".edit-res").css("display","inline-block");
		cur.css("display","none");
		cur.siblings(".edit-res").text(cur.val());
	} else if(!$.trim(cur.parents(".add-sig-content-edit-wrap").find(".datepicker").val())){
		cur.parents(".add-sig-content-edit-wrap").remove();
	}
});
$('.grayRegisterBgLight').on('click', '.add-sig-content-edit-wrap .removeExtraDates', function() {
			//console.log("remove the tab");
			$(this).parents(".add-sig-content-edit-wrap").remove();
			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
			if(addsigcontenteditwrapCount < 5)
			{
				$(".add-sig").show();
				$(".add-sig_4").show();
			} else{
				$(".add-sig").hide();
				$(".add-sig_4").hide();
			}
		});

$(".taking-care-select").change(function(){
	var id = $(this).val();
	var gender = $(this).find('option[value=' + id + ']').data('gender');
	if(gender == "0"){
		$(".gender-she").html("She");
		$(".gender-her").html("Her");
		$(".gender-her-small").html("her");
		$(".gender-she-small").html("she");
		$(".otherGender").slideUp();
		$(".taking-care-select-2").val(0);
	} else if(gender == "1") {
		$(".gender-she").html("He");
		$(".gender-her").html("His");
		$(".gender-her-small").html("his");
		$(".gender-her-smallapp").html("him");
		$(".gender-she-small").html("he");
		$(".otherGender").slideUp();
		$(".taking-care-select-2").val(0);
	} else {
		$(".otherGender").slideDown();
	}
	$(".taking-selected").html($(".taking-care-select option:selected").text());
});
$(".taking-care-select-2").change(function(){
	var id = $(this).val();
	var gender = $(this).find('option[value=' + id + ']').data('gender');
	if(gender == "0"){
		$(".gender-she").html("She");
		$(".gender-her").html("Her");
		$(".gender-her-small").html("her");
		$(".gender-she-small").html("she");
	} else if(gender == "1") {
		$(".gender-she").html("He");
		$(".gender-her").html("His");
		$(".gender-her-small").html("his");
		$(".gender-her-smallapp").html("him");
		$(".gender-she-small").html("he");
	}

});
$(".add-email").click(function(){
	var html = '<div class="row added-email-wrap margin-bottom-20"><div class="col-md-5">Alternative Email ID</div>';
	html = html + '<div class="col-md-6"><input type="email" class="textbox email-text" /></div><div class="col-md-1 removeExtraEmailId"> <i class="icon-append fa fa-close"></i></div></div>';
	$(".add-email-wrap").before(html);
	$(".email-text").last().focus();
	var addedemailwrapCount = $(".added-email-wrap").length;
			if(addedemailwrapCount < 5)
			{
				$(".add-email").show();
			} else{
				$(".add-email").hide();
			}
});
$('.grayRegisterBgLight').on('click', '.added-email-wrap .removeExtraEmailId', function() {
			//console.log("remove the tab");
			$(this).parents(".added-email-wrap").remove();
			var addedemailwrapCount = $(".added-email-wrap").length;
			if(addedemailwrapCount < 5)
			{
				$(".add-email").show();
			} else{
				$(".add-email").hide();
			}
		});
		/*$(document).on("blur",".email-text",function(){
			var cur = $(this);
			if($(".email-text").index(cur) != 0 && $.trim(cur.val()) == ""){
				cur.parents(".added-email-wrap").remove();
			}
		});*/
$(".add-phone").click(function(){
	var html = '<div class="row added-phone-wrap margin-bottom-20"><div class="col-md-5">Alternative Phone no</div>';
	html = html + '<div class="col-md-6"><input type="text" class="textbox phone-text" /></div><div class="col-md-1 removeExtraPhone"> <i class="icon-append fa fa-close"></i></div></div>';
	$(".add-phone-wrap").before(html);
	$(".phone-text").last().focus();
	var addedphonewrapCount = $(".added-phone-wrap").length;
			if(addedphonewrapCount < 5)
			{
				$(".add-phone").show();
			} else{
				$(".add-phone").hide();
			}
});
$('.grayRegisterBgLight').on('click', '.added-phone-wrap .removeExtraPhone', function() {
			//console.log("remove the tab");
			$(this).parents(".added-phone-wrap").remove();
			var addedphonewrapCount = $(".added-phone-wrap").length;
			if(addedphonewrapCount < 5)
			{
				$(".add-phone").show();
			} else{
				$(".add-phone").hide();
			}
		});
		/*$(document).on("blur",".phone-text",function(){
			var cur = $(this);
			if($(".phone-text").index(cur) != 0 && $.trim(cur.val()) == ""){
				cur.parents(".added-phone-wrap").remove();
			}
		});	*/
$(".profession-select").change(function(){
	if($(this).val() == "1"){
		$(".profession-wrap").slideDown();
	} else {
		$(".profession-wrap").slideUp();
	}
});
$(".dropdown-wrapper").removeClass("exp");
}
}

});
$(window).load(function(){
	var screenWidth = $(window).innerWidth();
	if($(".left-container").length){
		$(".breadCrumbMargin").css("margin-top",$(".breadcrumbs").height());
		if(screenWidth > 992){
			if($(".both-container").length){
				$(".both-container").css("min-height", $(window).height() - $(".both-container").offset().top - $(".footer-v1").height() + "px");
			}
		}
		$("body").scrollTop(0);
		init_offset = $(".left-container").offset().top;
		$("body").scrollTop(0);
		//init_bc_offset = $(".breadcrumbs").offset().top;
		$("body").scrollTop(0);
		if($(".left-container").height() > $(window).height() - $(".left-container").offset().top){
			left_flag = true;
		}
	}
	if (screenWidth>990) {
		$(".heightNewsJquery").height($("#heightNews").height());
	}

	$(window).scroll(function(){
		setHeight();
	});
	setHeight();
	if($(".discussion-page").length){
		if($(".ask-question-textarea").length){


			$(".ask-question-textarea").css("top",$(".ask-question").offset().top + $(".ask-question").innerHeight() + "px").css("left",$(".ask-question").offset().left + "px");
			$(".share-tip-textarea").css("top",$(".share-tips").offset().top + $(".share-tips").innerHeight() + "px").css("left",$(".share-tips").offset().left + "px");
			$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("height","initial").css("width",$(".container.content").width() + "px");
			$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("display","block");
			th = $(".ask-question-textarea").height() + 25;
			$(".give-feedback-textarea").css("top",$(".give-feedback").offset().top - th + "px").css("left",$(".give-feedback").offset().left + "px");
			$(".ask-question-textarea").css("top",$(".ask-question").offset().top - th + "px").css("left",$(".ask-question").offset().left + "px");
			$(".share-tip-textarea").css("top",$(".share-tips").offset().top - th + "px").css("left",$(".share-tips").offset().left + "px");
		//$(".submit-article-textarea").css("top",$(".submit-article").offset().top - th + "px").css("left",$(".submit-article").offset().left + "px");
		$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("height", th + "px").css("display","none").css("width","0px");
		}
	}
if($(".articles-page").length || $(".profile-page").length){
	$(".send-message-textarea").css("display","block").css("height","initial").css("width",$(".container.content").width() + "px");
	th = $(".send-message-textarea").height() + 25;
	$(".send-message-textarea").css("top",$(".send-message").offset().top - th + "px").css("left",$(".send-message").offset().left + "px");
	$(".send-message-textarea").css("display","none").css("height", th + "px").css("width","0px");
}
if($(".third-register-page").length){
	var year=new Date().getFullYear();
	$( "#datepicker,#datepicker1" ).datepicker({
		showOn: "focus",
		changeYear: true,
		yearRange: '1900:year'

	});
}

});

	///////////tinymce code .////////////////

	function initTinyMce(id){
			tinymce.init({
				selector: "#" + id,
				statusbar : false,
				menubar:false,
				toolbar:false,
				setup : function(ed) {
					ed.on("keyup", function() {
						if($.trim(ed.getContent({format: 'text'})).length){
							$(".inner-comment-submit").removeClass("disabled");
						} else {
							$(".inner-comment-submit").addClass("disabled");
						}
					});
				}
		});
		   tinymce.init({
				   selector: "#share-tip,#ask-question,#give-feedback",
				   theme: "modern",
				   skin: 'light',
				   statusbar : false,
				   menubar:false,
				   plugins: [
				   "image link",
				   "searchreplace visualblocks",
				   "insertdatetime media paste emoticons"
				   ],
				   toolbar: "bold italic | bullist numlist | link unlink emoticons image media",
				   setup : function(ed) {
					   var placeholder = $('#' + ed.id).attr('placeholder');
					   if (typeof placeholder !== 'undefined' && placeholder !== false) {
						 var is_default = false;
						 ed.on('init', function() {
						   // get the current content
						   var cont = ed.getContent();

						   // If its empty and we have a placeholder set the value
						   if (cont.length === 0) {
							 ed.setContent(placeholder);
							 // Get updated content
							 cont = placeholder;
						 }
						   // convert to plain text and compare strings
						   is_default = (cont == placeholder);

						   // nothing to do
						   if (!is_default) {
							 return;
						 }
					 }).on('keydown', function() {
							   // replace the default content on focus if the same as original placeholder
							   if (is_default) {
								 ed.setContent('');
								 is_default = false;
							 }
						 }).on('blur', function() {
						   if (ed.getContent().length === 0) {
							 ed.setContent(placeholder);
						 }
					 });
					 }
					 ed.on('init', function (evt) {
					   var toolbar = $(evt.target.editorContainer)
					   .find('>.mce-container-body >.mce-toolbar-grp');
					   var editor = $(evt.target.editorContainer)
					   .find('>.mce-container-body >.mce-edit-area');

						   // switch the order of the elements
						   toolbar.detach().insertAfter(editor);
					   });
					 ed.on("keyup", function() {
					   var id = ed.id;
					   if($.trim(ed.getContent({format: 'text'})).length){
						   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
					   } else {
						   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
					   }
				   });
				 }
				   /*file_browser_callback: function(field_name, url, type, win) {
					   win.document.getElementById(field_name).value = myFileBrowser(field_name, url, type, win);
				   }*/
			   });
			   tinymce.init({
				   selector: "#submit-article",
				   theme: "modern",
				   skin: 'light',
				   statusbar : false,
				   menubar:false,
				   plugins: [
				   "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
				   "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
				   "table contextmenu directionality emoticons template textcolor paste fullpage textcolor colorpicker textpattern"
				   ],
				   toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media | spellchecker  ",

				   setup : function(ed)
				   {
					   var placeholder = $('#' + ed.id).attr('placeholder');
					   if (typeof placeholder !== 'undefined' && placeholder !== false) {
						 var is_default = false;
						 ed.on('init', function() {
							   // get the current content
							   var cont = ed.getContent();

							   // If its empty and we have a placeholder set the value
							   if (cont.length === 0) {
								 ed.setContent(placeholder);
								 // Get updated content
								 cont = placeholder;
							 }
							   // convert to plain text and compare strings
							   is_default = (cont == placeholder);

							   // nothing to do
							   if (!is_default) {
								 return;
							 }
						 }).on('keydown', function() {
								   // replace the default content on focus if the same as original placeholder
								   if (is_default) {
									 ed.setContent('');
									 is_default = false;
								 }
							 }).on('blur', function() {
							   if (ed.getContent().length === 0) {
								 ed.setContent(placeholder);
							 }
						 });
						 }
						 ed.on('init', function (evt) {
						   var toolbar = $(evt.target.editorContainer)
						   .find('>.mce-container-body >.mce-toolbar-grp');
						   var editor = $(evt.target.editorContainer)
						   .find('>.mce-container-body >.mce-edit-area');

							   // switch the order of the elements
							   toolbar.detach().insertAfter(editor);
						   });
						 ed.on("keyup", function() {
						   var id = ed.id;
						   if($.trim(ed.getContent({format: 'text'})).length){
							   $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
						   } else {
							   $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
						   }
					   });
				   }


				});


				function myFileBrowser (field_name, url, type, win) {

					//alert("Field_Name: " + field_name + "nURL: " + url + "nType: " + type + "nWin: " + win); // debug/testing

					/* If you work with sessions in PHP and your client doesn't accept cookies you might need to carry
					   the session name and session ID in the request string (can look like this: "?PHPSESSID=88p0n70s9dsknra96qhuk6etm5").
					   These lines of code extract the necessary parameters and add them back to the filebrowser URL again. */

					var cmsURL = window.location.toString();    // script URL - use an absolute path!
					if (cmsURL.indexOf("?") < 0) {
						//add the type as the only query parameter
						cmsURL = cmsURL + "?type=" + type;
					}
					else {
						//add the type as an additional query parameter
						// (PHP session ID is now included if there is one at all)
						cmsURL = cmsURL + "&type=" + type;
					}

					tinyMCE.activeEditor.windowManager.open({
						file : cmsURL,
						title : 'My File Browser',
						width : 80,  // Your dimensions may differ - toy around with them!
						height : 80,
						resizable : "yes",
						inline : "yes",  // This parameter only has an effect if you use the inlinepopups plugin!
						close_previous : "no"
					}, {
						window : win,
						input : field_name
					});
					return false;

				}
				/////////////tinymce ends///////////////////


				///bbotstrap-multiselect starts ////
				/**
				 * @author zhixin wen <wenzhixin2010@gmail.com>
				 * @version 1.1.0
				 *
				 * http://wenzhixin.net.cn/p/multiple-select/
				 */

				(function ($) {

				    'use strict';

				    function MultipleSelect($el, options) {
				        var that = this,
				            name = $el.attr('name') || options.name || ''

				        $el.parent().hide();
				        var elWidth = $el.css("width");
				        $el.parent().show();
				        if (elWidth=="0px") {elWidth = $el.outerWidth()+20}

				        this.$el = $el.hide();
				        this.options = options;
				        this.$parent = $('<div' + $.map(['class', 'title'],function (att) {
				            var attValue = that.$el.attr(att) || '';
				            attValue = (att === 'class' ? ('ms-parent' + (attValue ? ' ' : '')) : '') + attValue;
				            return attValue ? (' ' + att + '="' + attValue + '"') : '';
				        }).join('') + ' />');
				        this.$choice = $('<button type="button" class="ms-choice"><span class="placeholder">' +
				            options.placeholder + '</span><div></div></button>');
				        this.$drop = $('<div class="ms-drop ' + options.position + '"></div>');
				        this.$el.after(this.$parent);
				        this.$parent.append(this.$choice);
				        this.$parent.append(this.$drop);

				        if (this.$el.prop('disabled')) {
				            this.$choice.addClass('disabled');
				        }
				        this.$parent.css('width', options.width || elWidth);

				        if (!this.options.keepOpen) {
				            $('body').click(function (e) {
				                if ($(e.target)[0] === that.$choice[0] ||
				                    $(e.target).parents('.ms-choice')[0] === that.$choice[0]) {
				                    return;
				                }
				                if (e.target.tagName.toUpperCase() === "INPUT" &&
				                    ($(e.target)[0] === that.$drop[0] ||
				                    $(e.target).parents('.ms-drop')[0] !== that.$drop[0]) &&
				                    that.options.isOpen) {
				                    that.close();
				                }
				            });
				        }

				        this.selectAllName = 'name="selectAll' + name + '"';
				        this.selectGroupName = 'name="selectGroup' + name + '"';
				        this.selectItemName = 'name="selectItem' + name + '"';
				    }

				    MultipleSelect.prototype = {
				        constructor: MultipleSelect,

				        init: function () {
				            var that = this,
				                html = [];
				            if (this.options.filter) {
				                html.push(
				                    '<div class="ms-search">',
				                    '<input type="text" autocomplete="off" autocorrect="off" autocapitilize="off" spellcheck="false">',
				                    '</div>'
				                );
				            }
				            html.push('<ul>');
				            if (this.options.selectAll && !this.options.single) {
				                html.push(
				                    '<li class="ms-select-all">',
				                    '<label>',
				                    '<input type="checkbox" ' + this.selectAllName + ' /> ',
				                    this.options.selectAllDelimiter[0] + this.options.selectAllText + this.options.selectAllDelimiter[1],
				                    '</label>',
				                    '</li>'
				                );
				            }
				            $.each(this.$el.children(), function (i, elm) {
				                html.push(that.optionToHtml(i, elm));
				            });
				            html.push('<li class="ms-no-results">' + this.options.noMatchesFound + '</li>');
				            html.push('</ul>');
				            this.$drop.html(html.join(''));

				            this.$drop.find('ul').css('max-height', this.options.maxHeight + 'px');
				            this.$drop.find('.multiple').css('width', this.options.multipleWidth + 'px');

				            this.$searchInput = this.$drop.find('.ms-search input');
				            this.$selectAll = this.$drop.find('input[' + this.selectAllName + ']');
				            this.$selectGroups = this.$drop.find('input[' + this.selectGroupName + ']');
				            this.$selectItems = this.$drop.find('input[' + this.selectItemName + ']:enabled');
				            this.$disableItems = this.$drop.find('input[' + this.selectItemName + ']:disabled');
				            this.$noResults = this.$drop.find('.ms-no-results');
				            this.events();
				            this.updateSelectAll(true);
				            this.update(true);

				            if (this.options.isOpen) {
				                this.open();
				            }
				        },

				        optionToHtml: function (i, elm, group, groupDisabled) {
				            var that = this,
				                $elm = $(elm),
				                html = [],
				                multiple = this.options.multiple,
				                optAttributesToCopy = ['class', 'title'],
				                clss = $.map(optAttributesToCopy, function (att, i) {
				                    var isMultiple = att === 'class' && multiple;
				                    var attValue = $elm.attr(att) || '';
				                    return (isMultiple || attValue) ?
				                        (' ' + att + '="' + (isMultiple ? ('multiple' + (attValue ? ' ' : '')) : '') + attValue + '"') :
				                        '';
				                }).join(''),
				                disabled,
				                type = this.options.single ? 'radio' : 'checkbox';

				            if ($elm.is('option')) {
				                var value = $elm.val(),
				                    text = that.options.textTemplate($elm),
				                    selected = (that.$el.attr('multiple') != undefined) ? $elm.prop('selected') : ($elm.attr('selected') == 'selected'),
				                    style = this.options.styler(value) ? ' style="' + this.options.styler(value) + '"' : '';

				                disabled = groupDisabled || $elm.prop('disabled');
				                if ((this.options.blockSeparator > "") && (this.options.blockSeparator == $elm.val())) {
				                    html.push(
				                        '<li' + clss + style + '>',
				                        '<label class="' + this.options.blockSeparator + (disabled ? 'disabled' : '') + '">',
				                        text,
				                        '</label>',
				                        '</li>'
				                    );
				                } else {
				                    html.push(
				                        '<li' + clss + style + '>',
				                        '<label' + (disabled ? ' class="disabled"' : '') + '>',
				                        '<input type="' + type + '" ' + this.selectItemName + ' value="' + value + '"' +
				                            (selected ? ' checked="checked"' : '') +
				                            (disabled ? ' disabled="disabled"' : '') +
				                            (group ? ' data-group="' + group + '"' : '') +
				                            '/> ',
				                        text,
				                        '</label>',
				                        '</li>'
				                    );
				                }
				            } else if (!group && $elm.is('optgroup')) {
				                var _group = 'group_' + i,
				                    label = $elm.attr('label');

				                disabled = $elm.prop('disabled');
				                html.push(
				                    '<li class="group">',
				                    '<label class="optgroup' + (disabled ? ' disabled' : '') + '" data-group="' + _group + '">',
				                    (this.options.hideOptgroupCheckboxes ? '' : '<input type="checkbox" ' + this.selectGroupName +
				                        (disabled ? ' disabled="disabled"' : '') + ' /> '),
				                    label,
				                    '</label>',
				                    '</li>');
				                $.each($elm.children(), function (i, elm) {
				                    html.push(that.optionToHtml(i, elm, _group, disabled));
				                });
				            }
				            return html.join('');
				        },

				        events: function () {
				            var that = this;

				            function toggleOpen(e) {
				                e.preventDefault();
				                that[that.options.isOpen ? 'close' : 'open']();
				            }

				            var label = this.$el.parent().closest('label')[0] || $('label[for=' + this.$el.attr('id') + ']')[0];
				            if (label) {
				                $(label).off('click').on('click', function (e) {
				                    if (e.target.nodeName.toLowerCase() !== 'label' || e.target !== this) {
				                        return;
				                    }
				                    toggleOpen(e);
				                    if (!that.options.filter || !that.options.isOpen) {
				                        that.focus();
				                    }
				                    e.stopPropagation(); // Causes lost focus otherwise
				                });
				            }
				            this.$choice.off('click').on('click', toggleOpen)
				                .off('focus').on('focus', this.options.onFocus)
				                .off('blur').on('blur', this.options.onBlur);

				            this.$parent.off('keydown').on('keydown', function (e) {
				                switch (e.which) {
				                    case 27: // esc key
				                        that.close();
				                        that.$choice.focus();
				                        break;
				                }
				            });
				            this.$searchInput.off('keydown').on('keydown',function (e) {
				                if (e.keyCode === 9 && e.shiftKey) { // Ensure shift-tab causes lost focus from filter as with clicking away
				                    that.close();
				                }
				            }).off('keyup').on('keyup', function (e) {
				                    if (that.options.filterAcceptOnEnter &&
				                        (e.which === 13 || e.which == 32) && // enter or space
				                        that.$searchInput.val() // Avoid selecting/deselecting if no choices made
				                        ) {
				                        that.$selectAll.click();
				                        that.close();
				                        that.focus();
				                        return;
				                    }
				                    that.filter();
				                });
				            this.$selectAll.off('click').on('click', function () {
				                var checked = $(this).prop('checked'),
				                    $items = that.$selectItems.filter(':visible');
				                if ($items.length === that.$selectItems.length) {
				                    that[checked ? 'checkAll' : 'uncheckAll']();
				                } else { // when the filter option is true
				                    that.$selectGroups.prop('checked', checked);
				                    $items.prop('checked', checked);
				                    that.options[checked ? 'onCheckAll' : 'onUncheckAll']();
				                    that.update();
				                }
				            });
				            this.$selectGroups.off('click').on('click', function () {
				                var group = $(this).parent().attr('data-group'),
				                    $items = that.$selectItems.filter(':visible'),
				                    $children = $items.filter('[data-group="' + group + '"]'),
				                    checked = $children.length !== $children.filter(':checked').length;
				                $children.prop('checked', checked);
				                that.updateSelectAll();
				                that.update();
				                that.options.onOptgroupClick({
				                    label: $(this).parent().text(),
				                    checked: checked,
				                    children: $children.get()
				                });
				            });
				            this.$selectItems.off('click').on('click', function () {
				                that.updateSelectAll();
				                that.update();
				                that.updateOptGroupSelect();
				                that.options.onClick({
				                    label: $(this).parent().text(),
				                    value: $(this).val(),
				                    checked: $(this).prop('checked')
				                });

				                if (that.options.single && that.options.isOpen && !that.options.keepOpen) {
				                    that.close();
				                }
				            });
				        },

				        open: function () {
				            if (this.$choice.hasClass('disabled')) {
				                return;
				            }
				            this.options.isOpen = true;
				            this.$choice.find('>div').addClass('open');
				            this.$drop.show();

				            // fix filter bug: no results show
				            this.$selectAll.parent().show();
				            this.$noResults.hide();

				            // Fix #77: 'All selected' when no options
				            if (this.$el.children().length === 0) {
				                this.$selectAll.parent().hide();
				                this.$noResults.show();
				            }

				            if (this.options.container) {
				                var offset = this.$drop.offset();
				                this.$drop.appendTo($(this.options.container));
				                this.$drop.offset({ top: offset.top, left: offset.left });
				            }
				            if (this.options.filter) {
				                this.$searchInput.val('');
				                this.$searchInput.focus();
				                this.filter();
				            }
				            this.options.onOpen();
				        },

				        close: function () {
				            this.options.isOpen = false;
				            this.$choice.find('>div').removeClass('open');
				            this.$drop.hide();
				            if (this.options.container) {
				                this.$parent.append(this.$drop);
				                this.$drop.css({
				                    'top': 'auto',
				                    'left': 'auto'
				                });
				            }
				            this.options.onClose();
				        },

				        update: function (isInit) {
				            var selects = this.getSelects(),
				                $span = this.$choice.find('>span');

				            if (selects.length === 0) {
				                $span.addClass('placeholder').html(this.options.placeholder);
				            } else if (this.options.countSelected && selects.length < this.options.minimumCountSelected) {
				                $span.removeClass('placeholder').html(
				                    (this.options.displayValues ? selects : this.getSelects('text'))
				                        .join(this.options.delimiter));
				            } else if (this.options.allSelected &&
				                selects.length === this.$selectItems.length + this.$disableItems.length) {
				                $span.removeClass('placeholder').html(this.options.allSelected);
				            } else if ((this.options.countSelected || this.options.etcaetera) && selects.length > this.options.minimumCountSelected) {
				                if (this.options.etcaetera) {
				                    $span.removeClass('placeholder').html((this.options.displayValues ? selects : this.getSelects('text').slice(0, this.options.minimumCountSelected)).join(this.options.delimiter) + '...');
				                }
				                else {
				                    $span.removeClass('placeholder').html(this.options.countSelected
				                        .replace('#', selects.length)
				                        .replace('%', this.$selectItems.length + this.$disableItems.length));
				                }
				            } else {
				                $span.removeClass('placeholder').html(
				                    (this.options.displayValues ? selects : this.getSelects('text'))
				                        .join(this.options.delimiter));
				            }
				            // set selects to select
				            this.$el.val(this.getSelects());

				            // add selected class to selected li
				            this.$drop.find('li').removeClass('selected');
				            this.$drop.find('input[' + this.selectItemName + ']:checked').each(function () {
				                $(this).parents('li').first().addClass('selected');
				            });

				            // trigger <select> change event
				            if (!isInit) {
				                this.$el.trigger('change');
				            }
				        },

				        updateSelectAll: function (Init) {
				            var $items = this.$selectItems;
				            if (!Init) { $items = $items.filter(':visible'); }
				            this.$selectAll.prop('checked', $items.length &&
				                $items.length === $items.filter(':checked').length);
				            if (this.$selectAll.prop('checked')) {
				                this.options.onCheckAll();
				            }
				        },

				        updateOptGroupSelect: function () {
				            var $items = this.$selectItems.filter(':visible');
				            $.each(this.$selectGroups, function (i, val) {
				                var group = $(val).parent().attr('data-group'),
				                    $children = $items.filter('[data-group="' + group + '"]');
				                $(val).prop('checked', $children.length &&
				                    $children.length === $children.filter(':checked').length);
				            });
				        },

				        //value or text, default: 'value'
				        getSelects: function (type) {
				            var that = this,
				                texts = [],
				                values = [];
				            this.$drop.find('input[' + this.selectItemName + ']:checked').each(function () {
				                texts.push($(this).parents('li').first().text());
				                values.push($(this).val());
				            });

				            if (type === 'text' && this.$selectGroups.length) {
				                texts = [];
				                this.$selectGroups.each(function () {
				                    var html = [],
				                        text = $.trim($(this).parent().text()),
				                        group = $(this).parent().data('group'),
				                        $children = that.$drop.find('[' + that.selectItemName + '][data-group="' + group + '"]'),
				                        $selected = $children.filter(':checked');

				                    if ($selected.length === 0) {
				                        return;
				                    }

				                    html.push('[');
				                    html.push(text);
				                    if ($children.length > $selected.length) {
				                        var list = [];
				                        $selected.each(function () {
				                            list.push($(this).parent().text());
				                        });
				                        html.push(': ' + list.join(', '));
				                    }
				                    html.push(']');
				                    texts.push(html.join(''));
				                });
				            }
				            return type === 'text' ? texts : values;
				        },

				        setSelects: function (values) {
				            var that = this;
				            this.$selectItems.prop('checked', false);
				            $.each(values, function (i, value) {
				                that.$selectItems.filter('[value="' + value + '"]').prop('checked', true);
				            });
				            this.$selectAll.prop('checked', this.$selectItems.length ===
				                this.$selectItems.filter(':checked').length);
				            this.update();
				        },

				        enable: function () {
				            this.$choice.removeClass('disabled');
				        },

				        disable: function () {
				            this.$choice.addClass('disabled');
				        },

				        checkAll: function () {
				            this.$selectItems.prop('checked', true);
				            this.$selectGroups.prop('checked', true);
				            this.$selectAll.prop('checked', true);
				            this.update();
				            this.options.onCheckAll();
				        },

				        uncheckAll: function () {
				            this.$selectItems.prop('checked', false);
				            this.$selectGroups.prop('checked', false);
				            this.$selectAll.prop('checked', false);
				            this.update();
				            this.options.onUncheckAll();
				        },

				        focus: function () {
				            this.$choice.focus();
				            this.options.onFocus();
				        },

				        blur: function () {
				            this.$choice.blur();
				            this.options.onBlur();
				        },

				        refresh: function () {
				            this.init();
				        },

				        filter: function () {
				            var that = this,
				                text = $.trim(this.$searchInput.val()).toLowerCase();
				            if (text.length === 0) {
				                this.$selectItems.parent().show();
				                this.$disableItems.parent().show();
				                this.$selectGroups.parent().show();
				            } else {
				                this.$selectItems.each(function () {
				                    var $parent = $(this).parent();
				                    $parent[$parent.text().toLowerCase().indexOf(text) < 0 ? 'hide' : 'show']();
				                });
				                this.$disableItems.parent().hide();
				                this.$selectGroups.each(function () {
				                    var $parent = $(this).parent();
				                    var group = $parent.attr('data-group'),
				                        $items = that.$selectItems.filter(':visible');
				                    $parent[$items.filter('[data-group="' + group + '"]').length === 0 ? 'hide' : 'show']();
				                });

				                //Check if no matches found
				                if (this.$selectItems.filter(':visible').length) {
				                    this.$selectAll.parent().show();
				                    this.$noResults.hide();
				                } else {
				                    this.$selectAll.parent().hide();
				                    this.$noResults.show();
				                }
				            }
				            this.updateOptGroupSelect();
				            this.updateSelectAll();
				        }
				    };

				    $.fn.multipleSelect = function () {
				        var option = arguments[0],
				            args = arguments,

				            value,
				            allowedMethods = [
				                'getSelects', 'setSelects',
				                'enable', 'disable',
				                'checkAll', 'uncheckAll',
				                'focus', 'blur',
				                'refresh', 'close'
				            ];

				        this.each(function () {
				            var $this = $(this),
				                data = $this.data('multipleSelect'),
				                options = $.extend({}, $.fn.multipleSelect.defaults,
				                    $this.data(), typeof option === 'object' && option);

				            if (!data) {
				                data = new MultipleSelect($this, options);
				                $this.data('multipleSelect', data);
				            }

				            if (typeof option === 'string') {
				                if ($.inArray(option, allowedMethods) < 0) {
				                    throw "Unknown method: " + option;
				                }
				                value = data[option](args[1]);
				            } else {
				                data.init();
				                if (args[1]) {
				                    value = data[args[1]].apply(data, [].slice.call(args, 2));
				                }
				            }
				        });

				        return value ? value : this;
				    };

				    $.fn.multipleSelect.defaults = {
				        name: '',
				        isOpen: false,
				        placeholder: '',
				        selectAll: true,
				        selectAllText: 'Select all',
				        selectAllDelimiter: ['[', ']'],
				        allSelected: 'All selected',
				        minimumCountSelected: 20,
				        countSelected: '# of % selected',
				        noMatchesFound: 'No matches found',
				        multiple: false,
				        multipleWidth: 80,
				        single: false,
				        filter: false,
				        width: undefined,
				        maxHeight: 250,
				        container: null,
				        position: 'bottom',
				        keepOpen: false,
				        blockSeparator: '',
				        displayValues: false,
				        delimiter: ', ',

				        styler: function () {
				            return false;
				        },
				        textTemplate: function ($elm) {
				            return $elm.text();
				        },

				        onOpen: function () {
				            return false;
				        },
				        onClose: function () {
				            return false;
				        },
				        onCheckAll: function () {
				            return false;
				        },
				        onUncheckAll: function () {
				            return false;
				        },
				        onFocus: function () {
				            return false;
				        },
				        onBlur: function () {
				            return false;
				        },
				        onOptgroupClick: function () {
				            return false;
				        },
				        onClick: function () {
				            return false;
				        }
				    };
				})(jQuery);

				////bootstrap-multiselect ends ////


				////////// fileuploadajax//////////
				///////////////////
				jQuery.extend({
					createUploadIframe:function(id,uri){
						var frameId='jUploadFrame' + id;
						if(window.ActiveXObject){
							var io=document.createElement('<iframe id="'+frameId+'" name="'+frameId+'" />');
							if(typeof uri=='boolean'){
								io.src='javascript:false';
							}else if(typeof uri=='string'){
								io.src=uri;
							}
						}else{
							var io=document.createElement('iframe');
							io.id=frameId;
							io.name=frameId;
						}
						io.style.position='absolute';
						io.style.top='-1000px';
						io.style.left='-1000px';
						document.body.appendChild(io);
						return io;
					},
					createUploadForm:function(id,fileElementId){
						// Create form
						var formId = 'jUploadForm' + id;
						var fileId = 'jUploadFile' + id;
						var form = $('<form  action="" method="POST" name="' + formId + '" id="' + formId + '" enctype="multipart/form-data"></form>');
						var oldElement = $('#' + fileElementId);
						var newElement = $(oldElement).clone();
						$(oldElement).attr('id', fileId);
						$(oldElement).before(newElement);
						$(oldElement).appendTo(form);
						// Set CSS attributes
						$(form).css('position', 'absolute');
						$(form).css('top', '-1200px');
						$(form).css('left', '-1200px');
						$(form).appendTo('body');
						return form;
					},
					ajaxFileUpload:function(s){
						// TODO introduce global settings, allowing the client to modify them for all requests, not only timeout
						s = jQuery.extend({}, jQuery.ajaxSettings, s);
						var id = new Date().getTime();
						var form = jQuery.createUploadForm(id,s.fileElementId);
						var io = jQuery.createUploadIframe(id,s.secureuri);
						var frameId = 'jUploadFrame' + id;
						var formId = 'jUploadForm' + id;
						// Watch for a new set of requests
						if(s.global && !jQuery.active++){
							jQuery.event.trigger( "ajaxStart" );
						}
						var requestDone = false;
						// Create the request object
						var xml = {}
						if(s.global){
							jQuery.event.trigger("ajaxSend", [xml, s]);
						}
						// Wait for a response to come back
						var uploadCallback = function(isTimeout){
							var io = document.getElementById(frameId);
							try{
								if(io.contentWindow){
									xml.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:null;
									xml.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
								}else if(io.contentDocument){
									xml.responseText = io.contentDocument.document.body?io.contentDocument.document.body.innerHTML:null;
									xml.responseXML = io.contentDocument.document.XMLDocument?io.contentDocument.document.XMLDocument:io.contentDocument.document;
								}
							}catch(e){
								jQuery.handleError(s,xml,null,e);
							}
							if(xml || isTimeout=="timeout"){
								requestDone = true;
								var status;
								try{
									status = isTimeout != "timeout" ? "success" : "error";
									// Make sure that the request was successful or notmodified
									if(status != "error"){
										// process the data (runs the xml through httpData regardless of callback)
										var data = jQuery.uploadHttpData(xml,s.dataType);
										// If a local callback was specified, fire it and pass it the data
										if(s.success){
											s.success( data, status );
										}
										// Fire the global callback
										if(s.global){
											jQuery.event.trigger("ajaxSuccess",[xml,s]);
										}
									}else{
										jQuery.handleError(s,xml,status);
									}
								}catch(e){
									status = "error";
									jQuery.handleError(s,xml,status,e);
								}
								// The request was completed
								if(s.global){
									jQuery.event.trigger("ajaxComplete",[xml,s]);
								}
								// Handle the global AJAX counter
								if(s.global && !--jQuery.active){
									jQuery.event.trigger("ajaxStop");
								}
								// Process result
								if(s.complete){
									s.complete(xml, status);
								}
								jQuery(io).unbind();
								setTimeout(function(){
									try{
										$(io).remove();
										$(form).remove();
									}catch(e){
										jQuery.handleError(s, xml, null, e);
									}
								},100);
								xml = null;
							}
						}
						// Timeout checker
						if(s.timeout>0){
							setTimeout(function(){
								// Check to see if the request is still happening
								if(!requestDone) uploadCallback("timeout");
							},s.timeout);
						}
						try{
							// var io = $('#' + frameId);
							var form = $('#' + formId);
							$(form).attr('action', s.url);
							$(form).attr('method', 'POST');
							$(form).attr('target', frameId);
							if(form.encoding){
								form.encoding = 'multipart/form-data';
							}else{
								form.enctype = 'multipart/form-data';
							}
							$(form).submit();
						}catch(e){
							jQuery.handleError(s,xml,null,e);
						}
						if(window.attachEvent){
							document.getElementById(frameId).attachEvent('onload', uploadCallback);
						}else{
							document.getElementById(frameId).addEventListener('load', uploadCallback, false);
						}
						return {abort:function(){}};
					},
					uploadHttpData:function(r,type){
						var data = !type;
						data = type == "xml" || data ? r.responseXML : r.responseText;
						// If the type is "script", eval it in global context
						if(type=="script"){
							jQuery.globalEval(data);
						}
						// Get the JavaScript object, if JSON is used.
						if(type=="json"){
							eval("data = "+data);
						}
						// evaluate scripts within html
						if(type=="html"){
							jQuery("<div>").html(data).evalScripts();
						}
						//alert($('param', data).each(function(){alert($(this).attr('value'));}));
						return data;
					}
				})

				//////////////////////


				////////fileupladajax///////////

		}
	}
		   //don't forget to call the load function
   		$scope.load();

   	}
   ]);

