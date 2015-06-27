
var BY = BY || {};
BY.textAreas = [];

BY.removeEditor = function(){
    var textAreas = $("textarea");
    for (var i = 0; i < textAreas.length; i++) {
        //Check if element already has editor enabled
        if (tinymce.get(textAreas[i].id))
            tinyMCE.execCommand("mceRemoveEditor", false, textAreas[i].id);
    }

    if(typeof(tinyMCE) !== 'undefined') {
        var length = tinyMCE.editors.length;
        for (var i=length; i>0; i--) {
            tinyMCE.editors[i-1].remove();
        };
    }
}

BY.addEditor = function(param){
    var textAreas = $("textarea");
    var isCommentEditor = param.commentEditor ? param.commentEditor : false, toolbar, plugins;
    if(isCommentEditor){
        toolbar = "bold italic | emoticons";
        plugins = [
            "image link",
            "searchreplace visualblocks",
            "insertdatetime media paste emoticons"
        ];
    }else{
        toolbar =  "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media  preview ";
        plugins = [
            "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
            " emoticons textcolor paste autoresize "
        ];
    }
    tinymce.init({
        selector: "#"+param.editorTextArea,
        theme: "modern",
        skin: 'light',
        statusbar: false,
        menubar: false,
        content_css : "assets/css/tinyMce_custom.css",
        plugins: plugins,
        toolbar: toolbar,
        setup : function(ed) {
            var placeholder = $('#' + ed.id).attr('placeholder');
            if (typeof placeholder !== 'undefined' && placeholder !== false) {
                var is_default = false;
                ed.on('init', function () {
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
                }).on('keydown', function () {
                    // replace the default content on focus if the same as original placeholder
                    if (is_default) {
                        ed.setContent('');
                        is_default = false;
                    }
                }).on('blur', function () {
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
                if(param.autoFocus){
                    ed.focus();
                }
            });
            ed.on("keyup", function () {
                var id = ed.id;
                if ($.trim(ed.getContent({format: 'text'})).length) {
                    $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
                } else {
                    $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
                }
            });

            ed.on('blur', function(e) {
                console.log('reset event', e);
            });

            ed.on('remove', function(e) {
                console.log('remove event', e);
            });
        }
    });

}



//tinymce.init({
//    mode: "textareas",
//    theme: "modern",
//    skin: 'light',
//    statusbar: false,
//    menubar: false,
//    plugins: [
//        "advlist autolink autosave link image lists charmap print preview hr anchor pagebreak spellchecker",
//        "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
//        " emoticons textcolor paste autoresize "
//    ],
//    toolbar: "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink emoticons image media  preview ",
//    setup : function(ed) {
//        var placeholder = $('#' + ed.id).attr('placeholder');
//        if (typeof placeholder !== 'undefined' && placeholder !== false) {
//            var is_default = false;
//            ed.on('init', function () {
//                // get the current content
//                var cont = ed.getContent();
//
//                // If its empty and we have a placeholder set the value
//                if (cont.length === 0) {
//                    ed.setContent(placeholder);
//                    // Get updated content
//                    cont = placeholder;
//                }
//                // convert to plain text and compare strings
//                is_default = (cont == placeholder);
//
//                // nothing to do
//                if (!is_default) {
//                    return;
//                }
//            }).on('keydown', function () {
//                // replace the default content on focus if the same as original placeholder
//                if (is_default) {
//                    ed.setContent('');
//                    is_default = false;
//                }
//            }).on('blur', function () {
//                if (ed.getContent().length === 0) {
//                    ed.setContent(placeholder);
//                }
//            }).on('click', function () {
//                if (!ed.isDirty()) {
//                    ed.setContent('');
//                }
//            });
//        }
//        ed.on('init', function (evt) {
//            var toolbar = $(evt.target.editorContainer)
//                .find('>.mce-container-body >.mce-toolbar-grp');
//            var editor = $(evt.target.editorContainer)
//                .find('>.mce-container-body >.mce-edit-area');
//
//            // switch the order of the elements
//            toolbar.detach().insertAfter(editor);
//        });
//        ed.on("keyup", function () {
//            var id = ed.id;
//            if ($.trim(ed.getContent({format: 'text'})).length) {
//                $("#" + id).parents(".textarea-label").find(".btn").removeClass("disabled");
//            } else {
//                $("#" + id).parents(".textarea-label").find(".btn").addClass("disabled");
//            }
//        });
//
//        ed.on('blur', function(e) {
//            console.log('reset event', e);
//        });
//
//        ed.on('remove', function(e) {
//            console.log('remove event', e);
//        });
//    }
//});

BY.editorCategoryList = (function(){
    var selectedCategoryList = {};


    return {
        selectCategory:function(selectedInput){
            if(selectedInput.checked===true){
                selectedCategoryList[selectedInput.value] = selectedInput.value ;
            }else{
                delete selectedCategoryList[selectedInput.value];
                if($rootScope.discussCategoryListMap[selectedInput.value] && $rootScope.discussCategoryListMap[selectedInput.value].parentId){
                    delete selectedCategoryList[$rootScope.discussCategoryListMap[selectedInput.value].parentId];
                }
            }
        },

        addCategory:function(selectedCategory){
            selectedCategoryList[selectedCategory] = selectedCategory;
        },

        getCategoryList:function(){
            var $body = angular.element(document.body);   // 1
            var $rootScope = $body.scope().$root;
            for(key in selectedCategoryList){
                if($rootScope.discussCategoryListMap[key] && $rootScope.discussCategoryListMap[key].parentId){
                    selectedCategoryList[$rootScope.discussCategoryListMap[key].parentId] = $rootScope.discussCategoryListMap[key].parentId;
                }

            }

            var categoryMap = $.map(selectedCategoryList, function(value, index) {
                return [value];
            });
            return categoryMap;
        },
        resetCategoryList:function(){
            selectedCategoryList = {};
        }

    }
})();


//BY.selectedCategoryList = {};
//BY.selectCategory = function(selectedInput){
//    //var $body = angular.element(document.body);   // 1
//    //var $rootScope = $body.scope().$root;
//    //var categorySelected = selectedInput.value;
//
////    for(category in $rootScope.discussCategoryList) {
////        if($rootScope.discussCategoryList[category].id == categorySelected){
////            var childElements = document.getElementById(categorySelected).children;
////            for(var j=0; j<childElements.length; j++) {
////                childElements[j].children[0].checked = selectedInput.checked;
////                if(selectedInput.checked===true){
////                	BY.selectedCategoryList[childElements[j].children[0].value] = childElements[j].children[0].value;
////                }else{
////                	delete BY.selectedCategoryList[childElements[j].children[0].value];
////                }
////            }
////        }
////
////
////    }
//
//    //if(selectedInput.checked===true && $rootScope.discussCategoryListMap[categorySelected] && $rootScope.discussCategoryListMap[categorySelected].parentId){
//    //	//$('input[value="'+$rootScope.discussCategoryListMap[categorySelected].parentId+'"]').attr("checked",true);
//    //    if()
//    //	BY.selectedCategoryList[$rootScope.discussCategoryListMap[categorySelected].parentId] = $rootScope.discussCategoryListMap[categorySelected].parentId;
//    //}
//
//    if(selectedInput.checked===true){
//    	BY.selectedCategoryList[selectedInput.value] = selectedInput.value ;
//    }else{
//    	delete BY.selectedCategoryList[selectedInput.value];
//    }
//
//}
//
//BY.getCategoryList

