//$(document).ready(function() {
//var options = {
//        beforeSend : function() {
//                $("#progressbox").show();
//                // clear everything
//                $("#progressbar").width('0%');
//                $("#message").empty();
//                $("#percent").html("0%");
//        },
//        uploadProgress : function(event, position, total, percentComplete) {
//                $("#progressbar").width(percentComplete + '%');
//                $("#percent").html(percentComplete + '%');
//
//                // change message text to red after 50%
//                if (percentComplete > 50) {
//                $("#message").html("<span class='redColor'>File Upload is in progress</span>");
//                }
//        },
//        success : function() {
//                $("#progressbar").width('100%');
//                $("#percent").html('100%');
//        },
//        complete : function(response) {
//        	//alert(response.responseText);
//        $("#message").html("<a href='" + response.responseText + "'" +  ">" + response.responseText + "</a>");
//        },
//        error : function() {
//        //$("#message").html("<span class='redColor'> ERROR: unable to upload files</span>");
//        }
//};
//try
//{
//$("#UploadForm").ajaxForm(options);
//}
//catch(e)
//{
//}
//});