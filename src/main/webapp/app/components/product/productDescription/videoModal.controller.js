define(['byProductApp'], function(byProductApp) {
  function VideoModalController($log, $scope, videoSource){

    $log.debug('Inside VideoModalController');
    /**
     * set the video src in modal
     * @type {obect}
     */
    $scope.src = videoSource;
  }

  VideoModalController.$inject = ['$log', '$scope', 'videoSource'];
  byProductApp.registerController('VideoModalController', VideoModalController);
  return VideoModalController;
});


