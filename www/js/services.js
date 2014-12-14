angular.module('starter.services', [])


.factory('Camera', ['$q', function($q) {
   //options
   // { quality : 75,
  // destinationType : Camera.DestinationType.DATA_URL,
  // sourceType : Camera.PictureSourceType.CAMERA,
  // allowEdit : true,
  // encodingType: Camera.EncodingType.JPEG,
  // targetWidth: 100,
  // targetHeight: 100,
  // popoverOptions: CameraPopoverOptions,
  // saveToPhotoAlbum: false };
  return {
    lastPhoto: '',
    getPicture: function(options) {
      var q = $q.defer();
      
      if (navigator.camera){
        navigator.camera.getPicture(function(result) {
          // Do any magic you need
          q.resolve(result);
        }, function(err) {
          q.reject(err);
        }, options);
      }else{
        q.resolve('http://ideas.homelife.com.au/media/images/8/2/8/9/0/828947-1_ll.jpg');
      }
      return q.promise;
    }
  }

}])

/**
 * A simple example service that returns some data.
 */
.factory('Friends', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var friends = [
    { id: 0, name: 'Scruff McGruff' },
    { id: 1, name: 'G.I. Joe' },
    { id: 2, name: 'Miss Frizzle' },
    { id: 3, name: 'Ash Ketchum' }
  ];

  return {
    all: function() {
      return friends;
    },
    get: function(friendId) {
      // Simple index lookup
      return friends[friendId];
    }
  }
})

.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);
