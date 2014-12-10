angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('CreateCtrl', function($scope) {
	document.addEventListener("deviceready", onDeviceReady, false);
	function onDeviceReady() {
	    console.log(navigator.camera);
	}
	$scope.photo= function(){
		// navigator.camera.getPicture( cameraSuccess, cameraError, cameraOptions );
		navigator.camera.getPicture( function(cameraSuccess){
			debugger;
		}, cameraError, cameraOptions );
	};
});
