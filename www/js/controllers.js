angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('CreateCtrl', function($scope,$location,Camera) {
	$scope.getPhoto = function() {
		Camera.getPicture({
			targetWidth: 700,
			targetHeight: 700,
		}).then(function(imageURI) {
			console.log(imageURI);
			Camera.lastPhoto = imageURI;

			$location.path('/tab/create/add/photo');	
			// setTimeout(function() {
			// 	$('.imageToAdd').attr('width',400);
			// 	$('.imageToAdd').attr('height',200);
			// 	polyClip.init();
			// }, 1200);
		}, function(err) {
			console.err(err);
		}, {
			// quality: 75,
			allowEdit : true,
			saveToPhotoAlbum: false
		});
	};
})
.controller('CreatePhotoCtrl', function($scope,Camera) {
	$scope.cropDots=[];

	$scope.init=function(){
		$scope.notTapped=true;
		$scope.startDotsAnimation();

		$scope.cropArea=document.querySelector('.crop-area');

		$scope.cropMaker=document.getElementById('cropMaker');
		$scope.lastPhoto=Camera.lastPhoto ? Camera.lastPhoto :'http://ideas.homelife.com.au/media/images/8/2/8/9/0/828947-1_ll.jpg';

		setTimeout(function(){
			$scope.image={
				width: parseInt($('.imageToAdd').width()),
				height: parseInt($('.imageToAdd').height()),
				naturalWidth: $('.imageToAdd')[0].naturalWidth,
				naturalHeight: $('.imageToAdd')[0].naturalHeight
			}
			$scope.cropMaker.setAttribute('width',$scope.image.width);
			$scope.cropMaker.setAttribute('height',$scope.image.height);


			$scope.contextCropArea=$scope.cropMaker.getContext("2d");
			$scope.contextCropArea.lineWidth = 3;
			$scope.contextCropArea.lineCap='round';
			$scope.contextCropArea.lineJoin='round';
		},2000);

	};

	$scope.startDotsAnimation= function(){

		setTimeout(function(){
			if ($scope.notTapped){
				$scope.addCropPoint('10%','20%');
			}
		},1000);

		setTimeout(function(){
			if ($scope.notTapped){
				$scope.addCropPoint('80%','10%');
			}
		},2000);

		setTimeout(function(){
			if ($scope.notTapped){
				$scope.addCropPoint('80%','85%');
			}
		},3000);

		setTimeout(function(){
			if ($scope.notTapped){
				$scope.addCropPoint('15%','90%');
			}
		},4000);
	}

	$scope.addTouchedCropPoint= function(event){
		if ($scope.notTapped){
			$('.crop-dot').remove(); // I fucking hate to use jQuery. But it's so simple :/ Hate/love? I don't know.
		}
		// $scope.notTapped=false;
		$scope.addCropPoint(event.gesture.center.pageX+"px",parseInt(event.gesture.center.pageY-90)+"px");
		$scope.addCropSection(event.gesture.center.pageX,parseInt(event.gesture.center.pageY-90));
	};

	$scope.addCropPoint= function(left,right){
		var node = document.createElement("DIV");

		node.classList.add('crop-dot');
		node.style.left=left;
		node.style.top=right;
		$scope.cropArea.appendChild(node);
	}


	$scope.addCropSection = function(left,top){
		$scope.cropDots.push({left:left,top:top});
		if ($scope.notTapped){
			$scope.contextCropArea.beginPath();
			$scope.contextCropArea.moveTo(left,top);
			$scope.notTapped=false;
			return true;
		}

		$scope.contextCropArea.lineTo(left,top);

		$scope.contextCropArea.stroke();
	};

	$scope.crop=function(){
		$scope.contextCropArea.closePath();

		// need toproportional the pixel for the natural width height

		var cropString= '';
		$scope.cropDots.forEach(function(dot,index){
			var left= ($scope.image.naturalWidth*dot.left)/$scope.image.width,
				top=($scope.image.naturalHeight*dot.top)/$scope.image.height;
			if (index!=0){
				cropString=cropString+=",";
			}
			cropString=cropString+left+','+top;
		});
		$('.imageToAdd').attr('data-polyclip', cropString);
		polyClip.init();
	}

	$scope.saveCanvas= function(){
		$scope.crop();

		var canvasEl=document.querySelector('.polyClip-clipped');
		if (canvasEl){
			navigator.notification.alert(
				'Ho trovato l\'oggetto',
				function(){},
				"Complete",
				"OK");
		}

	   	window.canvas2ImagePlugin.saveImageDataToLibrary(
			function(msg) {
				navigator.notification.alert(
					msg,
					function(){},
					"Complete",
					"OK");
			},
			function(err){
				$scope.imageToSave=err;
				console.log(err);
			},
			document.querySelector('.polyClip-clipped')
	    );
	};
});
