///* Write here your custom javascript codes */
//th = 0;
//init_offset = 0;
//init_bc_offset = 0;
//left_flag = false;
//tx = false;
//aq_set = false;
//st_set = false;
//gf_set = false;
//sm_set = false;
//dp = 1;
///*function setHeight(){
//	if($(window).width() < 991){
//		return;
//	}
//	if($(".left-container").length){
//		if($("body").scrollTop() + $(window).height() >= $(".footer-v1").offset().top){
//			$(".left-container").height( $(".footer-v1").offset().top - $(".left-container").offset().top);
//		} else{
//			$(".left-container").height($(window).height() - init_offset);
//		}
//	}
//}*/
//
//$(window).load(function(){
//				$(".preloader").fadeOut('500');
//			});
//function setHeight(){
//	if($(window).width() < 986){
//		var windowHeight = $(window).height();
//
//			if($("body").scrollTop() > windowHeight){
//				$(".topScroll").show();
//			}else
//			{
//				$(".topScroll").hide();
//			}
//			$(".breadCrumbMargin").css("margin-top",'40px');
//			$(".searchWrapper").appendTo('.searchClearboth');
//			var w = $(".left-container").width();
//			$(".left-container-img-wrapper").width(w);
//			if($(".homePage").length){
//				$(".left-container-img-wrapper").width(w - 0);
//			}
//
//			if($(".register-page").length){
//
//				$(".signup-info").prependTo(".second-register-page ");
//				$(".signup-info").prependTo(".first-register-page ");
//			}
//
//
//			if($(".third-register-page").length){
//
//				$(".signup-info").prependTo(".third-register-page");
//
//				var year=new Date().getFullYear();
//				$( "#datepicker,#datepicker1" ).datepicker({
//					showOn: "focus",
//					changeYear: true,
//					yearRange: '1900:year'
//
//				});
//			}
//			if($(".discussion-page").length && !$(".profile-page").length) {
//				$(".submit-article-textarea").css("top",$(".submit-article").offset().top + 35 + "px");
//			}
//
//		return;
//	}
//	if($(".left-container").length){
//		var leftCHeight = $(window).height() - $(".header").height() - $(".headerBottom").height()  - 50 ;
//
//		$(".left-container").height(leftCHeight);
//	}
//	var headerH =  $(".headerBottom").height() + $(".headerBottomImage").height();
//			var bostSTF = $(window).scrollTop();
//
//			if(bostSTF > headerH)
//			{
//				$(".left-container").css('padding-bottom', headerH +"px");
//				$(".left-container").css('margin-top', - headerH +"px");
//
//			}
//			if(bostSTF < headerH){
//				$(".left-container").css('padding-bottom', 0 +"px");
//				$(".left-container").css('margin-top', - 0 +"px");
//			}
//
//	$(window).scroll(function(){
//
//			var headerH =  $(".headerBottom").height() + $(".headerBottomImage").height();
//			var bostSTF = $(window).scrollTop();
//
//			if(bostSTF > headerH)
//			{
//				$(".left-container").css('padding-bottom', headerH +"px");
//				$(".left-container").css('margin-top', - headerH +"px");
//
//			}
//			if(bostSTF < headerH){
//				$(".left-container").css('padding-bottom', 0 +"px");
//				$(".left-container").css('margin-top', - 0 +"px");
//			}
//
//			var windowHeight = $(window).height();
//
//			if($("body").scrollTop() > windowHeight){
//				$(".topScroll").show();
//			}else
//			{
//				$(".topScroll").hide();
//			}
//
//			var footerH = $(".footer-v1").height() ;
//
//
//			if($(window).scrollTop() >= $(document).height() - $(window).height() - footerH  ) {
//
//        var leftCHeight = $(window).height() - $(".header").height() - $(".headerBottom").height()  - 50 - footerH  ;
//
//		$(".left-container").height(leftCHeight);
//    }
//
//	});
//
//}
//$(function(){
//
//
//
//	var screenWidth = $(window).innerWidth();
//	if (screenWidth<991) {
//		$(".searchWrapper").appendTo('.mobileSearch');
//		$(".dropdown-menu .mega-menu-content .equal-height-in").removeClass("col-md-2");
//		$(".exp-dropdown").css('display','block');
//		$(".head-more").parent().hide();
//	};
//	// Search box focus and lost focus
//
//	$(".searchWrapper input").keyup(function(){
//		if($.trim($(this).val()) == ""){
//			$(".header-go-button").addClass("disabled");
//		} else {
//			$(".header-go-button").removeClass("disabled");
//		}
//	});
//	// If likes exist
//
//	$(".icon-heart").each(function(){
//		$(this).parents("li").addClass("add-like");
//	});
//	$(".add-like a").click(function(e){
//		var l = parseInt($(this).parents("li").find("span").text());
//		l++;
//		$(this).parents("li").find("span").text(l.toString());
//	});
//	//
//	/*if($(".left-container").length){
//		$(document).on("mousewheel",".left-container",function(e){
//			if(tx == true){
//				$(".left-container").css("overflow-y","hidden");
//				e.preventDefault();
//				e.stopPropagation();
//			} else {
//				$(".left-container").css("overflow-y","auto");
//			}
//
//		});
//}*/
//
//if($(".articles-page").length || $(".profile-page").length){
//	$(".article-share-links .rounded-x.icon-speech,.article-share-links .post_text-comment").click(function(e){
//		e.preventDefault();
//		var obj = { "scrollTop" : $(".enter-comment-wrap").offset().top};
//		$("body").animate(obj,300);
//		tinyMCE.get('main-commentbox').getBody().focus();
//		return false;
//	});
//	$("body").click(function(e){
//		if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("inner-enter-comment-wrap") || $(e.target).parents(".inner-enter-comment-wrap").length|| $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
//			return false;
//		}
//		if($("#comment-ta").length){
//			hideinnertext();
//		}
//
//		if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("send-message-textarea") || $(e.target).parents(".send-message-textarea").length || $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
//			return false;
//		}
//		hidemessage();
//	});
//	$(document).on("click",".inner-enter-comment-wrap",function(e){
//		e.stopPropagation();
//		return false;
//	});
//	$(document).on("click",".send-message-textarea",function(e){
//		e.stopPropagation();
//		return false;
//	});
//	function hideinnertext(){
//		tinyMCE.get('comment-ta').remove();
//		$(".inner-enter-comment-wrap").remove();
//	}
//	function hidemessage(){
//			//$(".send-message").parent().removeClass("zindex-10");
//			$(".send-message-textarea").css("display","none").css("width","0px");
//			tx = false;
//			//$(".left-container").css("overflow-y","auto");
//		}
//		$(".send-message").click(function(e){
//			e.stopPropagation();
//			//$(this).parent().addClass("zindex-10");
//			var obj = {"width" : $(".container.content").width() + "px"};
//			if(left_flag && !sm_set){
//				$(".send-message-textarea").css("top",parseInt($(".send-message-textarea").css("top")) - $(".left-container").scrollTop() );
//				sm_set = true;
//			}
//			/*if(left_flag){
//				$(".left-container").css("overflow-y","hidden");
//			}*/
//			tx = true;
//			$(".send-message-textarea").css("display","block");
//			$(".send-message-textarea").animate(obj,500).addClass("exp");
//			//tinyMCE.get('message-text').getBody().focus();
//			return false;
//		});
//	}
//	$(".main-comment .add-comment").click(function(e){
//		e.preventDefault();
//		var cur = $(this).parents(".main-comment").first();
//		if($(".inner-enter-comment-wrap").length){
//			hideinnertext();
//		}
//		if(!$(".inner-enter-comment-wrap").length){
//			cur.append('<div class="inner-enter-comment-wrap"><textarea rows="3" id="comment-ta" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
//		}
//		if($(window).width() > 992){
//			var obj = {scrollTop : $(".inner-enter-comment-wrap").offset().top - 230};
//			$("body").animate(obj,200);
//		}
//		initTinyMce("comment-ta");
//		setTimeout(function(){
//			tinyMCE.get('comment-ta').getBody().focus();
//		},300);
//
//		return false;
//	});
//	$(".discussion-page #sidebar-nav-1 li").hover(function(){
//		if(!$(this).hasClass("selected")){
//			$(this).addClass("active");
//		}
//	},function(){
//		if(!$(this).hasClass("selected")){
//			$(this).removeClass("active");
//		}
//	});
//
//
//	$(".discussion-page #sidebar-nav-1 li").click(function(){
//		if($(this).hasClass("selected")){
//			return false;
//		}
//		$(".discussion-page #sidebar-nav-1 .active").removeClass("active");
//		$(".discussion-page #sidebar-nav-1 .selected").removeClass("selected");
//		$(this).addClass("selected");
//		$(this).addClass("active");
//		var className = $(this).data("index");
//		$(".blog-author.main-article[data-index=" + className + "]").css("display","block");
//		$(".blog-author.main-article[data-index!=" + className + "]").css("display","none");
//		if($(window).width() < 992){
//			var obj = { "scrollTop" : $(".article-outer-wrapper").offset().top};
//			$("html,body").animate(obj,300);
//		}
//		setHeight();
//	});
//
//	if($(".discussion-page").length){
//		$(".blog-author[data-index=discussion-QA][data-answers=0] > .blog-author-desc").append("<button class='first-to-answer btn btn-xs btn-warning'>BE THE FIRST TO ANSWER</button>");
//		$(".article-share-links .add-comment .post-text").click(function(e){
//			e.preventDefault();
//			var cur_e = $(e.target);
//			if(cur_e.parents(".answer-focus").length){
//				return;
//			}
//			if($(this).parents(".blog-author").data('index') != "discussion-articles" && $(this).parents(".blog-author").data('index') != "discussion-QA" || $(".QA-wrapper").length){
//				e.preventDefault();
//				if($("#comment-ta").length){
//					hidecommentbox();
//				}
//				var ele = $(this);
//				var cur = $(this).parents(".main-article").first();
//				if(!cur.find(".inner-enter-comment-wrap").length && $(".discussion-wrapper").length){
//					cur.append('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
//				} else if(!cur.find(".inner-enter-comment-wrap").length && $(".QA-wrapper").length){
//					//if(cur_e.parents(".blog-author").hasClass(".answer-block")){
//						if(ele.hasClass("answer-add-comment")){
//							ele.parents(".answer-blog-author-desc").after('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
//						} else {
//							ele.parents(".answer-block").find(".blog-author-desc").first().after('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-sm btn-success disabled">Submit</button><div class="clearfix"></div></div>');
//						}
//
//					//} else {
//					//	cur_e.parents(".blog-author").find(".blog-author-desc").append('<div class="inner-enter-comment-wrap"><textarea id="comment-ta" rows="3" placeholder="Enter your comment here"></textarea><div class="clearfix"></div><button class="inner-comment-submit btn btn-md btn-success disabled">Submit</button><div class="clearfix"></div></div>');
//					//}
//				}
//				if($(window).width() > 992){
//					var obj = {scrollTop : $(".inner-enter-comment-wrap").offset().top - 230};
//					$("body").animate(obj,200);
//				}
//				initTinyMce("comment-ta");
//				setTimeout(function(){
//					tinyMCE.get('comment-ta').getBody().focus();
//					if($(window).width() > 992){
//						setHeight();
//					}
//
//				},100);
//				return false;
//			} else {
//				window.location.href = $(this).parents(".blog-author").data('link');
//			}
//		});
//$(".blog-author[data-index]").click(function(){
//	if($(this).data('link')){
//		window.location.href = $(this).data('link');
//	} else{
//
//	}
//});
//$(".ask-question").click(function(e){
//	e.stopPropagation();
//	if(!$(".ask-question-textarea").hasClass("exp")){
//		hidetextarea();
//	}
//	if(left_flag && !aq_set){
//		$(".ask-question-textarea").css("top",parseInt($(".ask-question-textarea").css("top")) - $(".left-container").scrollTop() );
//		aq_set = true;
//	}
//	/*if(left_flag){
//		$(".left-container").css("overflow-y","hidden");
//	}*/
//	tx = true;
//	//$(".textareas").prepend($(".ask-question-textarea"));
//	var obj = { "width" : $(".container.content").width() + "px"};
//	var st = $("body").scrollTop();
//	$(".ask-question-textarea").css("display","block");
//	$("body").scrollTop(st);
//	$(".ask-question-textarea").animate(obj,500,function(){$("body").scrollTop(st);}).addClass("exp");
//	tinyMCE.get('ask-question').getBody().focus();
//	return false;
//});
//
//$(".share-tips").click(function(e){
//
//	e.stopPropagation();
//	if(!$(".share-tip-textarea").hasClass("exp")){
//		hidetextarea();
//	}
//	if(left_flag && !st_set){
//		$(".share-tip-textarea").css("top",parseInt($(".share-tip-textarea").css("top")) - $(".left-container").scrollTop() );
//		st_set = true;
//	}
//	/*if(left_flag){
//		$(".left-container").css("overflow-y","hidden");
//	}*/
//	tx = true;
//	//$(".textareas").prepend($(".share-tip-textarea"));
//	var obj = {"width" : $(".container.content").width() + "px"};
//	$(".share-tip-textarea").css("display","block");
//	$(".share-tip-textarea").animate(obj,500);
//	tinyMCE.get('share-tip').getBody().focus();
//	return false;
//});
//$(".submit-article").click(function(e){
//
//	e.stopPropagation();
//	if(!$(".submit-article-textarea").hasClass("exp")){
//		hidetextarea();
//	}
//	if(left_flag && !st_set){
//		$(".submit-article-textarea").css("top",parseInt($(".submit-article-textarea").css("top")) - $(".left-container").scrollTop() );
//		st_set = true;
//	}
//	/*if(left_flag){
//		$(".left-container").css("overflow-y","hidden");
//	}*/
//	tx = true;
//	//$(".textareas").prepend($(".share-tip-textarea"));
//	var obj = {"width" : $(".container.content").width() + "px"};
//	$(".submit-article-textarea").css("display","block");
//	$(".submit-article-textarea").animate(obj,500);
//	tinyMCE.get('share-tip').getBody().focus();
//	return false;
//})
//
///*$(".submit-article").click(function(e){
//	$("#fileopen").click();
//});*/
//
//
//
//$(".give-feedback").click(function(e){
//	e.stopPropagation();
//	if(!$(".give-feedback-textarea").hasClass("exp")){
//		hidetextarea();
//	}
//
//	if(left_flag && !gf_set){
//		$(".give-feedback-textarea").css("top",parseInt($(".give-feedback-textarea").css("top")) - $(".left-container").scrollTop() );
//		gf_set = true;
//	}
//	/*if(left_flag){
//		$(".left-container").css("overflow-y","hidden");
//	}*/
//	tx = true;
//    //$(".textareas").prepend($(".give-feedback-textarea"));
//    var obj = {"width" : $(".container.content").width() + "px"};
//    var st = $("html").scrollTop();
//    $(".give-feedback-textarea").css("display","block");
//    $("html").scrollTop(st);
//    $(".give-feedback-textarea").animate(obj,500).addClass("exp");
//    tinyMCE.get('give-feedback').getBody().focus();
//    return false;
//});
//
//$(".textarea-label").addClass("exp");
//$("body").click(function(e){
//	if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("textarea-label") || $(e.target).parents(".textarea-label").length || $(e.target).parents(".mce-container").length || $(e.target).parents(".mce-tooltip").length || $(e.target).parents(".mce-btn").length){
//		return false;
//	}
//	hidetextarea();
//	if($(e.target).parents(".tnymcePopUpwrapper").length || $(e.target).hasClass("inner-enter-comment-wrap") || $(e.target).parents(".inner-enter-comment-wrap").length){
//		return false;
//	}
//	hidecommentbox();
//});
//
//$(".exp").click(function(e){
//	e.stopPropagation();
//});
//
//$(".textarea-label").removeClass("exp");
//
//function hidetextarea(){
//	$(".zindex-10").removeClass("zindex-10");
//	$(".textarea-label").css("display","none");
//	$(".textarea-label").css("width","0px");
//	$(".textarea-label").removeClass("exp");
//	tx = false;
//	//$(".left-container").css("overflow-y","auto");
//}
//function hidecommentbox(){
//	if($("#comment-ta").length){
//		tinymce.get('comment-ta').remove();
//	}
//	$(".inner-enter-comment-wrap").remove();
//}
//}
//
//if($(".QA-wrapper").length || $(".article-wrapper").length){
//	$(document).on("click",".first-to-answer,.answer-focus,.answer-focus .post-text",function(){
//		if($(".enter-comment-wrap").css("display") == "none"){
//			$(".enter-comment-wrap").css("display","block");
//			tinyMCE.get('main-commentbox').getBody().focus();
//			var obj = {scrollTop : $(".enter-comment-wrap").offset().top};
//			$("body").animate(obj,200);
//		} else {
//			//$(".enter-comment-wrap").css("display","none");
//		}
//
//	});
//	$(".enter-comment-wrap .comment-submit").click(function(){
//		if(!$(".article-wrapper").length){
//			var cur = $(this);
//			var text_html = tinyMCE.get('main-commentbox').getContent({format:'raw'});
//			var html = $(".hidden-answer-sample").clone(true);
//			html.find(".article-content").html(text_html);
//			html.find(".post-shares span").html("0");
//			html.removeClass("hidden-answer-sample");
//			$(".article-outer-wrapper > .blog-author > .blog-author-desc").after(html);
//			if($(".article-outer-wrapper > .blog-author").data('answers') == "0"){
//				$(this).attr("data-answers","1");
//				$(".first-to-answer").html("ANSWER THIS QUESTION");
//			}
//			tinyMCE.get('main-commentbox').setContent("");
//			$(".comment-submit").addClass("disabled");
//			$(".enter-comment-wrap").css("display","none");
//			setHeight();
//		} else {
//			var cur = $(this);
//			var text_html = tinyMCE.get('main-commentbox').getContent({format:'raw'});
//			var html = $(".hidden-article-comment").clone(true);
//			html.find(".post-shares.post-shares-lg").before(text_html);
//			html.find(".post-shares span").html("0");
//			html.removeClass("hidden-article-comment");
//			$(".enter-comment-wrap").before(html);
//			tinyMCE.get('main-commentbox').setContent("");
//			$(".comment-submit").addClass("disabled");
//			setHeight();
//		}
//
//	});
//$(".blog-author").on("click",".inner-comment-submit",function(){
//	var cur = $(this);
//	var cur_par = $(this).parents(".blog-author");
//	var text_html = tinyMCE.get('comment-ta').getContent({format:'raw'});
//	var html = $(".hidden-comment-sample").clone(true);
//	html.find(".overflow-h").after(text_html);
//	html.find(".post-shares span").html("0");
//	html.removeClass("hidden-comment-sample");
//	cur.parents(".inner-enter-comment-wrap").after(html);
//	tinyMCE.get('comment-ta').remove();
//	$(".inner-enter-comment-wrap").remove();
//	setHeight();
//});
//}
//
//if($(".register-page").length){
//	//$(".chzn-select").chosen(); $(".chzn-select-deselect").chosen({allow_single_deselect:true});
//	$("#business-establishment").change(function(){
//		$("#taking-care-of,#pro-elder-care,#volunteer,#none,#NGO").prop("checked",false);
//	});
//	$("#none").change(function(){
//		$("#taking-care-of,#pro-elder-care,#volunteer,#business-establishment,#NGO").prop("checked",false);
//	});
//	$("#NGO").change(function(){
//		$("#taking-care-of,#pro-elder-care,#volunteer,#business-establishment,#none").prop("checked",false);
//	});
//	$("#taking-care-of,#pro-elder-care,#volunteer").change(function(){
//		$("#business-establishment,#none,#NGO").prop("checked",false);
//	});
//	if($(".third-register-page").length){
//		$(".dropdown-wrapper").addClass("exp");
//		$(".interests-selector").click(function(e){
//			if(!$(".interests-wrapper").hasClass("exp")){
//				hidewrappers();
//			}
//			e.stopPropagation();
//			if($(".interests-wrapper").css("display") == "none"){
//				$(".interests-wrapper").slideDown();
//				$(".interests-wrapper").addClass("exp");
//			} else {
//				var text="";
//				$(".interests-wrapper .parent").each(function(){
//					var cur = $(this).find("input[type=checkbox]");
//					if(cur.prop("checked")){
//						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
//					}
//				});
//				text = text.substring(0,text.length - 2);
//				$(".interests-selector").val(text);
//				$(".interests-wrapper").slideUp();
//				$(".interests-wrapper").removeClass("exp");
//			}
//		});
//		$(".likes-doing-selector").click(function(e){
//			if(!$(".likes-doing-wrapper").hasClass("exp")){
//				hidewrappers();
//			}
//			e.stopPropagation();
//			if($(".likes-doing-wrapper").css("display") == "none"){
//				$(".likes-doing-wrapper").slideDown();
//				$(".likes-doing-wrapper").addClass("exp");
//			} else {
//				var text="";
//				$(".likes-doing-wrapper .parent").each(function(){
//					var cur = $(this).find("input[type=checkbox]");
//					if(cur.prop("checked")){
//						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
//					}
//				});
//				text = text.substring(0,text.length - 2);
//				$(".likes-doing-selector").val(text);
//				$(".likes-doing-wrapper").slideUp();
//				$(".likes-doing-wrapper").removeClass("exp");
//			}
//		});
//		$(".suffering-from-selector").click(function(e){
//			if(!$(".suffering-wrapper").hasClass("exp")){
//				hidewrappers();
//			}
//			e.stopPropagation();
//			if($(".suffering-wrapper").css("display") == "none"){
//				$(".suffering-wrapper").slideDown();
//				$(".suffering-wrapper").addClass("exp");
//			} else {
//				var text="";
//				$(".suffering-wrapper .parent").each(function(){
//					var cur = $(this).find("input[type=checkbox]");
//					if(cur.prop("checked")){
//						text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
//					}
//				});
//				text = text.substring(0,text.length - 2);
//				$(".suffering-from-selector").val(text);
//				$(".suffering-wrapper").slideUp();
//				$(".suffering-wrapper").removeClass("exp");
//			}
//		});
//		$(".dropdown-wrapper").css("display","block");
//		$(".interests-wrapper").offset({top : $(".interests-selector").offset().top + $(".interests-selector").innerHeight()  , left :$(".interests-selector").offset().left });
//		$(".likes-doing-wrapper").offset({top: $(".likes-doing-selector").offset().top + $(".likes-doing-selector").innerHeight(), left: $(".likes-doing-selector").offset().left});
//		$(".suffering-wrapper").offset({top: $(".suffering-from-selector").offset().top + $(".suffering-from-selector").innerHeight(), left: $(".suffering-from-selector").offset().left});
//		$(".dropdown-wrapper").css("display","none");
//		$("body").click(function(e){
//			e.stopPropagation();
//			hidewrappers();
//		});
//		$(".exp").click(function(e){
//			e.stopPropagation();
//		});
//		$(".interests-wrapper").removeClass("exp");
//		function hidewrappers(){
//			var text = "";
//			$(".interests-wrapper .parent").each(function(){
//				var cur = $(this).find("input[type=checkbox]");
//				if(cur.prop("checked")){
//					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
//				}
//			});
//			text = text.substring(0,text.length - 2);
//			$(".interests-selector").val(text);
//			var text = "";
//			$(".likes-doing-wrapper .parent").each(function(){
//				var cur = $(this).find("input[type=checkbox]");
//				if(cur.prop("checked")){
//					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
//				}
//			});
//			text = text.substring(0,text.length - 2);
//			$(".likes-doing-selector").val(text);
//			var text = "";
//			$(".suffering-wrapper .parent").each(function(){
//				var cur = $(this).find("input[type=checkbox]");
//				if(cur.prop("checked")){
//					text = text + cur.parents(".parent").next(".reg-main-label").find("label").text() + ", ";
//				}
//			});
//			text = text.substring(0,text.length - 2);
//			$(".suffering-from-selector").val(text);
//			$(".dropdown-wrapper").css("display","none").removeClass("exp");
//		}
//		$(".interests-wrapper .parent input[type=checkbox]").change(function(){
//			var id = $(this).parents(".parent").data("parent");
//			if(id === undefined){
//				return false;
//			}
//			if($(this).prop("checked")){
//				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
//			} else {
//				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
//			}
//		});
//		$(".likes-doing-wrapper .parent input[type=checkbox]").change(function(){
//			var id = $(this).parents(".parent").data("parent");
//			if(id === undefined){
//				return false;
//			}
//			if($(this).prop("checked")){
//				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
//			} else {
//				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
//			}
//		});
//		$(".suffering-wrapper .parent input[type=checkbox]").change(function(){
//			var id = $(this).parents(".parent").data("parent");
//			if(id === undefined){
//				return false;
//			}
//			if($(this).prop("checked")){
//				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").not("#other-issues,.other-issues-row input[type=checkbox]").prop("checked",true);
//			} else {
//				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
//			}
//		});
//		$(".interests-wrapper .child input[type=checkbox]").change(function(){
//			var id = $(this).parents(".child").data("parent");
//			if($(this).prop("checked")){
//				$(".interests-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
//			} else {
//				var flag = false;
//				$(".interests-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
//					if($(this).prop("checked")){
//						flag = true;
//					}
//				});
//				if(flag == false){
//					$(".interests-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
//				}
//			}
//		});
//		$(".likes-doing-wrapper .child input[type=checkbox]").change(function(){
//			var id = $(this).parents(".child").data("parent");
//			if($(this).prop("checked")){
//				$(".likes-doing-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
//			} else {
//				var flag = false;
//				$(".likes-doing-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
//					if($(this).prop("checked")){
//						flag = true;
//					}
//				});
//				if(flag == false){
//					$(".likes-doing-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
//				}
//			}
//		});
//		$(".suffering-wrapper .child input[type=checkbox]").change(function(){
//			var id = $(this).parents(".child").data("parent");
//			if($(this).prop("checked")){
//				$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",true);
//			} else {
//				var flag = false;
//				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
//					if($(this).prop("checked")){
//						flag = true;
//					}
//				});
//				if(flag == false){
//					$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
//				}
//			}
//		});
//		$(".sub-parent input[type=checkbox]").change(function(){
//			var cur = $(this);
//			var id = cur.parent(".sub-parent").data("sub-parent");
//			if(cur.prop("checked")){
//				$(".sub-child[data-sub-parent=" + id + "]").slideDown();
//			} else {
//				$(".sub-child[data-sub-parent=" + id + "] input").prop("checked",false);
//				var flag = false;
//				$(".suffering-wrapper .child[data-parent=" + id + "] input[type=checkbox]").each(function(){
//					if($(this).prop("checked")){
//						flag = true;
//					}
//				});
//				if(flag == false){
//					$(".suffering-wrapper .parent[data-parent=" + id + "] input[type=checkbox]").prop("checked",false);
//				}
//				$(".sub-child[data-sub-parent=" + id + "]").slideUp();
//			}
//		});
//		$("#other-medical-issue").change(function(){
//			if($(this).prop("checked")){
//				$(".other-medical-issue-text").css("display","block");
//			} else {
//				$(".other-medical-issue-text").css("display","none").val("");
//			}
//		});
//		$(".suffering-wrapper .parent-other-main input[type=checkbox]").change(function(){
//			if($(this).prop("checked")){
//				$(".suffering-wrapper .child-other-main").css("display","block");
//			} else {
//				$(".suffering-wrapper .child-other-main").css("display","none");
//				$(".suffering-wrapper .child-other-main input[type=text]").val("");
//			}
//		});
//		$(".likes-doing-wrapper .parent-other-main input[type=checkbox]").change(function(){
//			if($(this).prop("checked")){
//				$(".likes-doing-wrapper .child-other-main").css("display","block");
//			} else {
//				$(".likes-doing-wrapper .child-other-main").css("display","none");
//				$(".likes-doing-wrapper .child-other-main input[type=text]").val("");
//			}
//		});
//		$(".add-sig").click(function(){
//			//$(".add-sig-wrap").css("display","none");
//			dp++;
//			var html = '<div class="row margin-bottom-20 add-sig-content-edit-wrap"><div class="col-md-5">';
//			html = html + '<span class="gender-her">Her</span>&nbsp;<span class="edit-res"></span> <input type="text" class="edit-label" /></div>';
//			html = html + '<div class="col-md-6"><section class="col col-6"><label class="input">';
//			html = html + '<i class="icon-append fa fa-calendar"></i> ';
//			html = html + '<input type="text" style="font-weight: 400;" class="name-textbox textbox datepicker" name="name"  id="datepicker' + dp + '" readonly /></label>';
//			html = html + '</section></div><div class="col-md-1 removeExtraDates"><i class="icon-append fa fa-close"></i></div></div>';
//			$(".add-sig-wrap").before(html);
//			$(".add-sig-content-edit-wrap .edit-label").focus();
//			var year=new Date().getFullYear();
//
//			$(".datepicker").datepicker({
//				showOn: "focus",
//				changeYear: true,
//				yearRange: '1900:year'
//			});
//			//alert($(".taking-care-select-2").find('option[value=' + $(".taking-care-select-2").val() + ']').data('gender'));
//			if($(".taking-care-select-2").find('option[value=' + $(".taking-care-select-2").val() + ']').data('gender') == "0"){
//				$(".gender-she").html("She");
//				$(".gender-her").html("Her");
//				$(".gender-her-small").html("her");
//				$(".gender-she-small").html("she");
//			} else {
//				$(".gender-she").html("He");
//				$(".gender-her").html("His");
//				$(".gender-her-small").html("his");
//				$(".gender-she-small").html("he");
//			}
//
//			$(".taking-selected").html($(".taking-care-select option:selected").text());
//			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
//			if(addsigcontenteditwrapCount < 5)
//			{
//				$(".add-sig").show();
//			} else{
//				$(".add-sig").hide();
//			}
//		});
//
//
//$(".add-sig_4").click(function(){
//			//$(".add-sig-wrap").css("display","none");
//			dp++;
//			var html = '<div class="row margin-bottom-20 add-sig-content-edit-wrap"><div class="col-md-5">';
//			html = html + '<span class="gender-her">My</span>&nbsp;<span class="edit-res"></span> <input type="text" class="edit-label" /></div>';
//			html = html + '<div class="col-md-6"><section class="col col-6"><label class="input">';
//			html = html + '<i class="icon-append fa fa-calendar"></i> ';
//			html = html + '<input type="text" style="font-weight: 400;" class="name-textbox textbox datepicker" name="name"  id="datepicker' + dp + '" readonly /></label>';
//			html = html + '</section></div><div class="col-md-1 removeExtraDates"><i class="icon-append fa fa-close"></i></div></div>';
//			$(".add-sig-wrap").before(html);
//			$(".add-sig-content-edit-wrap .edit-label").focus();
//			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
//			if(addsigcontenteditwrapCount < 5)
//			{
//				$(".add-sig_4").show();
//			} else{
//				$(".add-sig_4").hide();
//			}
//			var year=new Date().getFullYear();
//
//			$(".datepicker").datepicker({
//				showOn: "focus",
//				changeYear: true,
//				yearRange: '1900:year'
//			});
//
//
//		});
//
//$(".lives-dependency-select").change(function(){
//	var id = $(this).val();
//	if(id == "2"){
//		$(".lives-town-select").parent().slideUp();
//	}else {
//		$(".lives-town-select").parent().slideDown();
//	}
//	$(".taking-selected").html($(".taking-care-select option:selected").text());
//});
//$(".third-register-page").on("click",".edit-res",function(){
//	var cur= $(this);
//	cur.css("display","none");
//	cur.siblings(".edit-label").css("display","inline-block");
//});
//$(document).on("focus",".edit-label",function(){
//	var cur= $(this);
//	cur.siblings(".edit-res").css("display","none");
//	cur.css("display","inline-block");
//});
//$(document).on("blur",".edit-label",function(){
//	var cur = $(this);
//	if($.trim(cur.val())){
//		cur.siblings(".edit-res").css("display","inline-block");
//		cur.css("display","none");
//		cur.siblings(".edit-res").text(cur.val());
//	} else if(!$.trim(cur.parents(".add-sig-content-edit-wrap").find(".datepicker").val())){
//		cur.parents(".add-sig-content-edit-wrap").remove();
//	}
//});
//$('.grayRegisterBgLight').on('click', '.add-sig-content-edit-wrap .removeExtraDates', function() {
//			//console.log("remove the tab");
//			$(this).parents(".add-sig-content-edit-wrap").remove();
//			var addsigcontenteditwrapCount = $(".add-sig-content-edit-wrap").length;
//			if(addsigcontenteditwrapCount < 5)
//			{
//				$(".add-sig").show();
//				$(".add-sig_4").show();
//			} else{
//				$(".add-sig").hide();
//				$(".add-sig_4").hide();
//			}
//		});
//
//$(".taking-care-select").change(function(){
//	var id = $(this).val();
//	var gender = $(this).find('option[value=' + id + ']').data('gender');
//	if(gender == "0"){
//		$(".gender-she").html("She");
//		$(".gender-her").html("Her");
//		$(".gender-her-small").html("her");
//		$(".gender-she-small").html("she");
//		$(".otherGender").slideUp();
//		$(".taking-care-select-2").val(0);
//	} else if(gender == "1") {
//		$(".gender-she").html("He");
//		$(".gender-her").html("His");
//		$(".gender-her-small").html("his");
//		$(".gender-her-smallapp").html("him");
//		$(".gender-she-small").html("he");
//		$(".otherGender").slideUp();
//		$(".taking-care-select-2").val(0);
//	} else {
//		$(".otherGender").slideDown();
//	}
//	$(".taking-selected").html($(".taking-care-select option:selected").text());
//});
//$(".taking-care-select-2").change(function(){
//	var id = $(this).val();
//	var gender = $(this).find('option[value=' + id + ']').data('gender');
//	if(gender == "0"){
//		$(".gender-she").html("She");
//		$(".gender-her").html("Her");
//		$(".gender-her-small").html("her");
//		$(".gender-she-small").html("she");
//	} else if(gender == "1") {
//		$(".gender-she").html("He");
//		$(".gender-her").html("His");
//		$(".gender-her-small").html("his");
//		$(".gender-her-smallapp").html("him");
//		$(".gender-she-small").html("he");
//	}
//
//});
//$(".add-email").click(function(){
//	var html = '<div class="row added-email-wrap margin-bottom-20"><div class="col-md-5">Alternative Email ID</div>';
//	html = html + '<div class="col-md-6"><input type="email" class="textbox email-text" /></div><div class="col-md-1 removeExtraEmailId"> <i class="icon-append fa fa-close"></i></div></div>';
//	$(".add-email-wrap").before(html);
//	$(".email-text").last().focus();
//	var addedemailwrapCount = $(".added-email-wrap").length;
//			if(addedemailwrapCount < 5)
//			{
//				$(".add-email").show();
//			} else{
//				$(".add-email").hide();
//			}
//});
//$('.grayRegisterBgLight').on('click', '.added-email-wrap .removeExtraEmailId', function() {
//			//console.log("remove the tab");
//			$(this).parents(".added-email-wrap").remove();
//			var addedemailwrapCount = $(".added-email-wrap").length;
//			if(addedemailwrapCount < 5)
//			{
//				$(".add-email").show();
//			} else{
//				$(".add-email").hide();
//			}
//		});
//		/*$(document).on("blur",".email-text",function(){
//			var cur = $(this);
//			if($(".email-text").index(cur) != 0 && $.trim(cur.val()) == ""){
//				cur.parents(".added-email-wrap").remove();
//			}
//		});*/
//$(".add-phone").click(function(){
//	var html = '<div class="row added-phone-wrap margin-bottom-20"><div class="col-md-5">Alternative Phone no</div>';
//	html = html + '<div class="col-md-6"><input type="text" class="textbox phone-text" /></div><div class="col-md-1 removeExtraPhone"> <i class="icon-append fa fa-close"></i></div></div>';
//	$(".add-phone-wrap").before(html);
//	$(".phone-text").last().focus();
//	var addedphonewrapCount = $(".added-phone-wrap").length;
//			if(addedphonewrapCount < 5)
//			{
//				$(".add-phone").show();
//			} else{
//				$(".add-phone").hide();
//			}
//});
//$('.grayRegisterBgLight').on('click', '.added-phone-wrap .removeExtraPhone', function() {
//			//console.log("remove the tab");
//			$(this).parents(".added-phone-wrap").remove();
//			var addedphonewrapCount = $(".added-phone-wrap").length;
//			if(addedphonewrapCount < 5)
//			{
//				$(".add-phone").show();
//			} else{
//				$(".add-phone").hide();
//			}
//		});
//		/*$(document).on("blur",".phone-text",function(){
//			var cur = $(this);
//			if($(".phone-text").index(cur) != 0 && $.trim(cur.val()) == ""){
//				cur.parents(".added-phone-wrap").remove();
//			}
//		});	*/
//$(".profession-select").change(function(){
//	if($(this).val() == "1"){
//		$(".profession-wrap").slideDown();
//	} else {
//		$(".profession-wrap").slideUp();
//	}
//});
//$(".dropdown-wrapper").removeClass("exp");
//}
//}
//
//});
//$(window).load(function(){
//	var screenWidth = $(window).innerWidth();
//	if($(".left-container").length){
//		$(".breadCrumbMargin").css("margin-top",$(".breadcrumbs").height());
//		if(screenWidth > 992){
//			if($(".both-container").length){
//				$(".both-container").css("min-height", $(window).height() - $(".both-container").offset().top - $(".footer-v1").height() + "px");
//			}
//		}
//		$("body").scrollTop(0);
//		init_offset = $(".left-container").offset().top;
//		$("body").scrollTop(0);
//		//init_bc_offset = $(".breadcrumbs").offset().top;
//		$("body").scrollTop(0);
//		if($(".left-container").height() > $(window).height() - $(".left-container").offset().top){
//			left_flag = true;
//		}
//	}
//	if (screenWidth>990) {
//		$(".heightNewsJquery").height($("#heightNews").height());
//	}
//
//	$(window).scroll(function(){
//		setHeight();
//	});
//	setHeight();
//	if($(".discussion-page").length){
//		if($(".ask-question-textarea").length){
//
//
//			$(".ask-question-textarea").css("top",$(".ask-question").offset().top + $(".ask-question").innerHeight() + "px").css("left",$(".ask-question").offset().left + "px");
//			$(".share-tip-textarea").css("top",$(".share-tips").offset().top + $(".share-tips").innerHeight() + "px").css("left",$(".share-tips").offset().left + "px");
//			$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("height","initial").css("width",$(".container.content").width() + "px");
//			$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("display","block");
//			th = $(".ask-question-textarea").height() + 25;
//			$(".give-feedback-textarea").css("top",$(".give-feedback").offset().top - th + "px").css("left",$(".give-feedback").offset().left + "px");
//			$(".ask-question-textarea").css("top",$(".ask-question").offset().top - th + "px").css("left",$(".ask-question").offset().left + "px");
//			$(".share-tip-textarea").css("top",$(".share-tips").offset().top - th + "px").css("left",$(".share-tips").offset().left + "px");
//		//$(".submit-article-textarea").css("top",$(".submit-article").offset().top - th + "px").css("left",$(".submit-article").offset().left + "px");
//		$(".ask-question-textarea,.share-tip-textarea,.submit-article-textarea,.give-feedback-textarea").css("height", th + "px").css("display","none").css("width","0px");
//		}
//	}
//if($(".articles-page").length || $(".profile-page").length){
//	$(".send-message-textarea").css("display","block").css("height","initial").css("width",$(".container.content").width() + "px");
//	th = $(".send-message-textarea").height() + 25;
//	$(".send-message-textarea").css("top",$(".send-message").offset().top - th + "px").css("left",$(".send-message").offset().left + "px");
//	$(".send-message-textarea").css("display","none").css("height", th + "px").css("width","0px");
//}
//if($(".third-register-page").length){
//	var year=new Date().getFullYear();
//	$( "#datepicker,#datepicker1" ).datepicker({
//		showOn: "focus",
//		changeYear: true,
//		yearRange: '1900:year'
//
//	});
//}
//
//});
//function initTinyMce(id){
//	tinymce.init({
//		selector: "#" + id,
//		statusbar : false,
//		menubar:false,
//		toolbar:false,
//		setup : function(ed) {
//			ed.on("keyup", function() {
//				if($.trim(ed.getContent({format: 'text'})).length){
//					$(".inner-comment-submit").removeClass("disabled");
//				} else {
//					$(".inner-comment-submit").addClass("disabled");
//				}
//			});
//		}
//	});
//	//Left area height.
//	//if($(window).width() > 992){
//	//	$(".left-container").height($(window).height() - $(".left-container").offset().top);
//	//}
//}
//
//
