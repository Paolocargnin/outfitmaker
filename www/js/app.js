// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'starter.directives'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

    // setup an abstract state for the tabs directive
    .state('tab', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })

    // Each tab has its own nav history stack:

    .state('tab.dash', {
      url: '/dash',
      views: {
        'tab-dash': {
          templateUrl: 'templates/tab-dash.html',
          controller: 'DashCtrl'
        }
      }
    })

    .state('tab.outfits', {
      url: '/outfits',
      views: {
        'tab-outfits': {
          templateUrl: 'templates/tab-outfits.html',
          controller: 'OutfitsCtrl'
        }
      }
    })
    .state('tab.outfit-detail', {
      url: '/outfit/:outfitId',
      views: {
        'tab-outfits': {
          templateUrl: 'templates/outfit-detail.html',
          controller: 'OutfitDetailCtrl'
        }
      }
    })

    .state('tab.dresses', {
      url: '/dresses',
      views: {
        'tab-dresses': {
          templateUrl: 'templates/tab-dresses.html',
          controller: 'DressesCtrl'
        }
      }
    })
    .state('tab.create-dress', {
      url: '/dress/add/:action',
      views: {
        'tab-dresses': {
          templateUrl: 'templates/tab-dress-create.html',
          controller: 'DressCreateCtrl'
        }
      }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/dash');

});

