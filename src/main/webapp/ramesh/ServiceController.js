var rameshServices = angular.module("rameshServices", [ "ngResource" ]);
var rameshControllers = angular.module("rameshControllers",
		[ 'rameshServices' ]);

var stateService = rameshServices.factory('stateService', function() {
	// loggedInUser
	// topic :-> subTopic
	// currentDiscuss
	// currentDicussComment
	var stateService = {}
	stateService.appState = {
		appState : 'This is where you can see the application state'
	};

	return stateService;
});

var topicService = rameshServices.factory('topicService', function($resource) {
	var topicUrl = '../api/v1/topic';
	var subTopicUrl = '../api/v1/subTopic';
	var topicService = {};

	var myTopicResource = $resource(topicUrl, {}, {
		getTopicList : {
			method : 'GET',
			isArray : true
		},
		update : {
			method : 'PUT'
		},
		remove : {
			method : 'DELETE',
			params : {
				id : '@id'
			}
		}
	})
	topicService.getTopicList = function() {
		return myTopicResource.getTopicList();
	}
	topicService.saveTopic = function(topic, callback) {
		return myTopicResource.update(topic, callback);
	}
	topicService.removeTopic = function(id, callback) {
		return myTopicResource.remove({
			id : id
		}, callback);
	}
	var mySubTopicResource = $resource(subTopicUrl, {}, {
		getSubTopicList : {
			method : 'GET',
			isArray : true,
			params : {
				topicId : "@topicId",
				id : "@id"
			}
		},
		update : {
			method : 'PUT'
		},
		remove : {
			method : 'DELETE',
			params : {
				subTopicId : '@id'
			}
		}
	})

	topicService.getSubTopicList = function(topicId) {
		return mySubTopicResource.getSubTopicList(topicId);
	}
	topicService.saveSubTopic = function(subTopic, callback) {
		return mySubTopicResource.update(subTopic, callback);
	}
	topicService.removeSubTopic = function(id, callback) {
		return mySubTopicResource.remove({
			id : id
		}, callback);
	}
	return topicService;
});

var userService = rameshServices.factory('userService', function($resource) {
	var userUrl = '../api/v1/users/:addln';
	var userService = {};

	var myUserResource = $resource(userUrl, {}, {
		getUserList : {
			method : 'GET',
			isArray : true,
			params : {
				addln : 'listAll'
			}
		},
		update : {
			method : 'PUT'
		},
		remove : {
			method : 'DELETE',
			params : {
				addln : '@id'
			}
		}
	})
	userService.getUserList = function() {
		return myUserResource.getUserList();
	}
	userService.saveUser = function(user, callback) {
		return myUserResource.update(user, callback);
	}
	userService.removeUser = function(id, callback) {
		return myUserResource.remove({
			addln : id
		}, callback);
	}
	return userService;
});

var discussService = rameshServices.factory('discussService', function(
		$resource) {
	var discussUrl = '../api/v1/discuss';
	var discussService = {}

	var myDiscussResource = $resource(discussUrl, {}, {
		getDiscussList : {
			method : 'GET',
			isArray : true,
		},
		getDiscussListOfType : {
			method : 'GET',
			isArray : true,
			params : {
				addln : '@type'
			}
		},
		update : {
			method : 'PUT'
		},

	})
	discussService.getDiscussList = function(query) {
		return myDiscussResource.getDiscussList(query);
	}

	discussService.saveDiscuss = function(discuss, callback) {
		return myDiscussResource.update(discuss, callback);
	}

	// / Discuss Comment
	var discussCommentUrl = '../api/v1/comment';
	var myDiscussCommentResource = $resource(discussCommentUrl, {}, {
		getDiscussCommentList : {
			method : 'GET',
			isArray : true,
		},
		update : {
			method : 'PUT'
		},

	})

	discussService.getDiscussCommentList = function(query) {
		return myDiscussCommentResource.getDiscussCommentList(query);
	}

	discussService.save = function(query, callback) {
		return myDiscussCommentResource.update(query, callback);
	}

	return discussService;
});

var topicController = function($scope, topicService, stateService) {
	var topicController = {}
	$scope.appState = stateService.appState;
	$scope.newEditTopic = false;
	$scope.newEditSubTopic = false;

	// Topic methods

	$scope.getTopicList = function() {
		$scope.topics = topicService.getTopicList();
		$scope.newEditTopic = false;
		$scope.newEditSubTopic = false;
	}

	$scope.newTopic = function() {
		$scope.newEditTopic = {
			topicTitle : 'Enter a new Topic Title'
		};
	}

	$scope.editTopic = function(index) {
		$scope.newEditTopic = $scope.topics[index];
	}

	$scope.resetNewEditTopic = function() {
		$scope.newEditTopic = false;
	}

	$scope.saveTopic = function() {
		topicService.saveTopic($scope.newEditTopic, function() {
			$scope.newEditTopic = false;
			$scope.newEditSubTopic = false;
			$scope.topics = topicService.getTopicList();
			;
		});

	}

	$scope.removeTopic = function(index) {
		topicService.removeTopic($scope.topics[index].id, function() {
			$scope.newEditTopic = false;
			$scope.getTopicList();
		});
		// $scope.topics = topicService.getTopicList();
	}

	$scope.getSubTopics = function(index) {
		$scope.appState.topic = $scope.topics[index];
		$scope.subTopics = topicService
				.getSubTopicList($scope.topics[index].id);
		$scope.newEditTopic = false;
	}

	// Sub Topic methods
	$scope.getSubTopicList = function(index) {
		var topicId = $scope.topics[index].id;
		$scope.appState.topic = $scope.topics[index];
		$scope.subTopics = topicService.getSubTopicList({
			topicId : topicId,
			id : ''
		});
	}
	$scope.getSubTopicListWithTopicId = function(topicId) {
		$scope.subTopics = topicService.getSubTopicList({
			id : '',
			topicId : topicId
		});
	}

	$scope.newSubTopic = function() {
		if ($scope.appState.topic) {
			$scope.newEditSubTopic = {
				topicId : $scope.appState.topic.id,
				subTopicTitle : 'Add a new Sub Topic'
			};
		}
	}

	$scope.editSubTopic = function(index) {
		$scope.newEditSubTopic = $scope.subTopics[index];
	}

	$scope.resetNewEditSubTopic = function() {
		$scope.newEditSubTopic = false;
	}

	$scope.saveSubTopic = function() {
		var topicId = $scope.newEditSubTopic.topicId;
		topicService.saveSubTopic($scope.newEditSubTopic, function() {
			$scope.newEditSubTopic = false;
			$scope.getSubTopicListWithTopicId(topicId);
		});
	}

	$scope.removeSubTopic = function(index) {
		var topicId = $scope.subTopics[index].topicId;
		topicService.removeSubTopic($scope.subTopics[index].id, function() {
			$scope.getSubTopicListWithTopicId(topicId);
		});

	}

	$scope.setSubTopicInState = function(index) {
		if ($scope.appState.topic) {
			$scope.appState.topic.subTopic = $scope.subTopics[index];
		}
	}
	$scope.getTopicList();
	return topicController;
};

rameshControllers.controller('topicController', topicController);

var userController = function($scope, userService, stateService) {
	var userController = {};
	$scope.appState = stateService.appState;
	$scope.newEditUser = false;
	$scope.users = false;

	$scope.newUser = function() {
		$scope.newEditUser = {
			userName : 'Enter User name'
		};
	}

	$scope.getUserList = function() {
		$scope.users = userService.getUserList();
	}
	$scope.editUser = function(index) {
		$scope.newEditUser = $scope.users[index];
	}

	$scope.removeUser = function(index) {
		var chosenUser = $scope.users[index];
		userService.removeUser(chosenUser.id, function() {
			$scope.users = userService.getUserList();
		})
	}
	$scope.setUserInState = function(index) {
		$scope.appState.loggedInUser = $scope.users[index];
	}
	$scope.saveUser = function() {
		userService.saveUser($scope.newEditUser, function() {
			$scope.users = userService.getUserList();
		})
	}
	$scope.resetNewEditUser = function() {
		$scope.newEditUser = false;
	}
	$scope.getUserList();
	return userController;
};

rameshControllers.controller('userController', userController);

var discussController = function($scope, discussService, stateService) {
	var discussController = {};
	$scope.discussType = '';
	$scope.appState = stateService.appState;
	$scope.newEditDiscuss = false;
	$scope.discussList = false;

	$scope.newDiscuss = function() {
		if ($scope.appState.loggedInUser == undefined
				|| $scope.appState.topic == undefined
				|| $scope.appState.topic.subTopic == undefined) {
			alert('Please select sub topic and user to proceed');
		} else {
			$scope.newEditDiscuss = {
				text : 'Enter your discussion text',
				userId : $scope.appState.loggedInUser.id,
				topicId : $scope.appState.topic.subTopic.id,
				subTopicId : $scope.appState.topic.subTopic.id,
				id : ''
			};
		}
	}

	$scope.resetNewEditDiscuss = function() {
		$scope.newEditDiscuss = false;
	}

	$scope.getDiscussList = function() {
		if ($scope.appState.topic && $scope.appState.topic.subTopic) {
			var query = {
				subTopicId : $scope.appState.topic.subTopic.subTopicId,
				discussType : $scope.discussType
			}
			$scope.discussList = discussService.getDiscussList(query);
			$scope.newEditDiscuss = false;
			$scope.newDiscussComment = false;
			$scope.commentList = false;
		} else {
			alert(" You need to select a Sub topic");
		}
	}

	$scope.saveDiscuss = function() {
		discussService.saveDiscuss($scope.newEditDiscuss, function() {
			var query = {
				subTopicId : $scope.newEditDiscuss.subTopicId,
				discussType : $scope.newEditDiscuss.discussType
			}
			$scope.discussList = discussService.getDiscussList(query);
		})
	}

	// Discuss Comment
	$scope.newDiscussComment = false;

	$scope.createCommentOnDiscuss = function(index) {
		var curDiscuss = $scope.discussList[index];
		$scope.newDiscussComment = {
			userId : $scope.appState.loggedInUser.id,
			discussId : curDiscuss.id,
			parentId : '',
			discussCommentTitle : 'Please make your comment ',
			discussCommentType : curDiscuss.discussType == 'Q' ? 'A' : 'C'
		}
	}

	$scope.resetNewDiscussComment = function() {
		$scope.newDiscussComment = false;
	}

	$scope.saveDiscussComment = function() {
		discussService.save($scope.newDiscussComment, function() {
			$scope.newDiscussComment = false;
			var query = {
				parentId : $scope.newDiscussComment.parentId,
				ancestorId : $scope.newDiscussComment.ancestorId
			}
			$scope.commentList = discussService.getDiscussCommentList(query);
		})
	}

	$scope.getComments = function(index) {
		var query = {
			discussId : $scope.discussList[index].id,
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}

	$scope.getCommentsTree = function(index) {
		var query = {
			ancestorId : $scope.discussList[index].id,
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}

	$scope.createCommentOnComment = function(index) {
		var curComment = $scope.commentList[index];
		$scope.newDiscussComment = {
			userId : $scope.appState.loggedInUser.id,
			discussId : curComment.discussId,
			parentId : curComment.id,
			discussCommentTitle : 'Please make your comment ',
			discussCommentType : 'C'
		}
	}

	$scope.getCommentsOnComment = function(index) {
		var curComment = $scope.commentList[index];
		var query = {
			parentId : curComment.id,
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}
	$scope.getCommentsOnCommentTree = function(index) {
		var curComment = $scope.commentList[index];
		var query = {
			parentId : curComment.id,
			ancestorId : curComment.ancestorId
		}
		$scope.commentList = discussService.getDiscussCommentList(query);
	}
	return discussController;
};

rameshControllers.controller('discussController', discussController);
