
var BY = BY || {};
BY.byEditor = {};
BY.textAreas = [];

BY.byEditor.removeEditor = function(){
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

BY.byEditor.addEditor = function(param, initCallback){
    if (tinymce.get(param.editorTextArea)){
        tinyMCE.execCommand("mceRemoveEditor", false, param.editorTextArea);
    }

    var textAreas = $("textarea");
    var isCommentEditor = param.commentEditor ? param.commentEditor : false, toolbar, plugins;
    var autoFocus = (param.autoFocus && param.autoFocus==="true") ? true : false;
    if(isCommentEditor){
        toolbar = "bold italic | emoticons";
        plugins = [
            "image link autolink",
            "searchreplace visualblocks",
            "insertdatetime media paste emoticons"
        ];
    }else{
        toolbar =  "styleselect | bold italic | bullist numlist hr  | undo redo | link unlink | emoticons | image media |  preview ";
        plugins = [
            "advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
            "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
            " emoticons textcolor paste autoresize "
        ];
    }
    tinymce.init({
        selector: "#"+param.editorTextArea,
        auto_focus:autoFocus,
        theme: "modern",
        skin: 'light',
        statusbar: false,
        menubar: false,
        content_css : "assets/css/tinyMce_custom.css",
        plugins: plugins,
        target_list: [
                      {title: 'New page', value: '_blank'}
                ],
        toolbar: toolbar,
        inline_styles : false,
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
                ed.setContent('');
                if(initCallback){
                    initCallback();
                }
            });
            ed.on("keyup", function () {
                var id = ed.id;
                if ($.trim(ed.getContent()).length) {
                    $("#" + id).parents(".by_editor_wrap").find(".by_btn_submit").removeAttr('disabled');
                } else {
                    $("#" + id).parents(".by_editor_wrap").find(".by_btn_submit").attr("disabled", true);
                }
            });
            ed.on("change", function () {
                var id = ed.id;
                if ($.trim(ed.getContent()).length) {
                    $("#" + id).parents(".by_editor_wrap").find(".by_btn_submit").removeAttr('disabled');
                } else {
                    $("#" + id).parents(".by_editor_wrap").find(".by_btn_submit").attr("disabled", true);
                }
            });

            ed.on('blur', function(e) {
                console.log('reset event', e);  
                $(".byEditor").removeClass('byEditorShadow');                
            });

            ed.on('focus', function(e) {
                $(".byEditor").addClass('byEditorShadow');             
            });

            ed.on('remove', function(e) {
                console.log('remove event', e);
            });
        }
    
    });
    

}


BY.byEditor.editorCategoryList = (function(){
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


