define(["byProductApp", "angular"], function (byProductApp, angular) {
    byProductApp.directive('videoImage', function (STATIC_IMAGE) {
        return {
            link: function (scope, element) {
                var video = element.get(0);
                var canvas = element.next().get(0);
                var image = element.prev().get(0);
                video.muted = true;
                setTimeout(function () {
                    video.currentTime = 5;
                }, 100);

                video.addEventListener('timeupdate', function () {
                    video.pause();
                    draw(video, canvas, image);
                }, false);
            }
        };

        function draw(video, canvas, image) {
            var context = canvas.getContext('2d');
            context.drawImage(video, 0, 0);
            // load video image
            var videoImage = loadImage(STATIC_IMAGE.videoImage);
            videoImage.onload = function () {
                /**
                 * set image in context
                 */
                context.drawImage(videoImage, 0, 0);
                var imageUrl = canvas.toDataURL('image/jpeg', 1.0);
                image.src = imageUrl;
            };
        }

        function loadImage(src) {
            var image = new Image();
            image.src = src;
            return image;
        }
    });
});