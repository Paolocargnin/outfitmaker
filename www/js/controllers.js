angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {
})

.controller('FriendsCtrl', function($scope, Friends) {
  $scope.friends = Friends.all();
})

.controller('FriendDetailCtrl', function($scope, $stateParams, Friends) {
  $scope.friend = Friends.get($stateParams.friendId);
})

.controller('CreateCtrl', function($scope,$location,$timeout,$localstorage,Camera) {
	$scope.init=function(){
		$scope.dresses=$localstorage.getObject('dresses');

		$scope.imageBox={
			imageUrl:'',
			show: function(string){
				$timeout(function(){$scope.imageBox.imageUrl=string;},0);
			}
		}
	};

	$scope.getPhoto = function() {
		Camera.getPicture({
		}).then(function(imageURI) {
			console.log(imageURI);
			Camera.lastPhoto = imageURI;

			$location.path('/tab/create/add/photo');	
		}, function(err) {
			console.err(err);
		}, {
			// quality: 75,
			allowEdit : true,
			saveToPhotoAlbum: false
		});
	};
})
.controller('CreatePhotoCtrl', function($scope, $timeout, $localstorage, Camera) {
	$scope.cropDots=[];
	$scope.dress={
		name:'',
		category:'',
		imageUrl:'',
	}


	$scope.init=function(){
		$scope.notTapped=true;
		$scope.cropped=false;
		$scope.startDotsAnimation();

		$scope.cropArea=document.querySelector('.crop-area');

		$scope.cropMaker=document.getElementById('cropMaker');
		$scope.lastPhoto=Camera.lastPhoto ? Camera.lastPhoto :'http://localhost/149H.jpg';

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
		},500);

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

	$scope.findCroppedLeftTop=function(){
		var ret= {};
		$scope.cropDots.forEach(function(dot,i){
			if (i == 0){
				ret= {
					minLeft:dot.naturalLeft,
					maxLeft:dot.naturalLeft,
					minTop:dot.naturalTop,
					maxTop:dot.naturalTop,
				}
			}

			if (ret.minLeft>dot.naturalLeft){
				ret.minLeft=dot.naturalLeft;
			}
			if ( ret.maxLeft < dot.naturalLeft){
				ret.maxLeft=dot.naturalLeft;
			}

			if (ret.minTop>dot.naturalTop){
				ret.minTop = dot.naturalTop;
			}
			if ( ret.maxTop < dot.naturalTop){
				ret.maxTop = dot.naturalTop;
			}
		});
		return ret;
	};

	$scope.findCroppedCanvasSize= function(ret){
		return {
			width: ret.maxLeft-ret.minLeft,
			height: ret.maxTop-ret.minTop,
		}
	}

	$scope.cropCanvas=function(){
		$scope.contextCropArea.closePath();

		// need toproportional the pixel for the natural width height

		var cropString= '';
		$scope.cropDots.forEach(function(dot,index){
			var naturalLeft= ($scope.image.naturalWidth*dot.left)/$scope.image.width,
				naturalTop=($scope.image.naturalHeight*dot.top)/$scope.image.height;
			
			dot.naturalLeft=naturalLeft;
			dot.naturalTop=naturalTop;

			if (index!=0){
				cropString=cropString+=",";
			}

			cropString=cropString+naturalLeft+','+naturalTop;
		});
		

		$('.imageToAdd').addClass('auto-width').attr('data-polyclip', cropString);

		polyClip.addCallback(function(){
			//Load the third step
			$timeout(function(){$scope.cropped=true;},0);
			$scope.cropArea.removeChild($scope.cropMaker);
			$('.crop-dot').remove();

			$scope.croppedCanvas=document.querySelector('canvas#polyClip0');

			$scope.croppedImage = new Image();
			$scope.croppedImage.src=$scope.croppedCanvas.toDataURL();

			var canvasCroppedLeftTop=$scope.findCroppedLeftTop(),
				canvasSize= $scope.findCroppedCanvasSize(canvasCroppedLeftTop);

			var ctx= $scope.croppedCanvas.getContext("2d");
			ctx.clearRect ( 0 , 0 , $scope.croppedCanvas.width, $scope.croppedCanvas.height );

			$scope.croppedCanvas.width=canvasSize.width;
			$scope.croppedCanvas.height=canvasSize.height;

			ctx.clearRect ( 0 , 0 , canvasSize.width, canvasSize.height );

			ctx.drawImage($scope.croppedImage, canvasCroppedLeftTop.minLeft * -1 , canvasCroppedLeftTop.minTop * -1 );
			// $scope.saveCanvas();
		});
		polyClip.init();
		// $('.imageToAdd').removeClass('auto-width')
	}
	
	$scope.rotateCanvas= function(degrees){
		$scope.croppedImage = new Image();
		$scope.croppedImage.src=$scope.croppedCanvas.toDataURL();

		var ctx= $scope.croppedCanvas.getContext("2d");
		ctx.clearRect ( 0 , 0 , $scope.croppedCanvas.width, $scope.croppedCanvas.height );

		//And now, re-put the image on the canvas, but roteting it by 90 degrees!!!! Oh fuck yeah bitch I love to write english comments.

		var y = $scope.croppedCanvas.width;
		$scope.croppedCanvas.width=$scope.croppedCanvas.height;
		$scope.croppedCanvas.height=y;

		ctx.translate($scope.croppedCanvas.width/2,$scope.croppedCanvas.height/2);
		ctx.rotate(degrees*Math.PI/180);

		ctx.drawImage($scope.croppedImage, $scope.croppedCanvas.height/2*-1, $scope.croppedCanvas.width/2*-1);
	};
	
	$scope.saveCanvas= function(){
		var canvasEl=document.querySelector('.polyClip-clipped');

	   	if (window.canvas2ImagePlugin){

		   	window.canvas2ImagePlugin.saveImageDataToLibrary(
				function(msg) {
					$scope.dress.imageUrl=msg;
					$scope.storeDress();

					navigator.notification.alert(
						'Dress saved',
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
		}else{
			$scope.dress.imageUrl=$scope.croppedImage.src;
			$scope.storeDress();
		}
	};

	$scope.storeDress = function(){

		//Va fatto un servizio. Sia chiaro
		var dresses = $localstorage.getObject('dresses');
		if (dresses.items==undefined){
			dresses.items=[];
		}
		dresses.items.push($scope.dress);
		$localstorage.setObject('dresses',dresses);
	};
});
