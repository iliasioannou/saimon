'use strict';

/**
 * @ngdoc overview
 * @name rheticus
 * @description
 * # rheticus
 *
 * Main module for rheticus project
 */

angular
	//modules addition
	.module('rheticus',[
		'ngAnimate',
		'ngMaterial',
		'ngMessages',
		'ngCookies',
		'ngResource',
		'ngRoute',
		'ngSanitize',
		'openlayers-directive',
		'openlayers-layerswitcher',
		'ui.bootstrap',
		'angularAwesomeSlider',
		'nvd3',
		'smart-table',
    'services.config',
		'flash',
		'pascalprecht.translate'
	])

	//routing configuration
	.config(['$routeProvider','configuration',function($routeProvider,configuration) {
		$routeProvider
		.when('/',{
			"templateUrl" : "scripts/components/main/main-view.html",
			"controller" : "MainCtrl",
			"controllerAs" : "main"
		})
		.when('/about', {
			"templateUrl": "scripts/components/about/about-view.html",
			"controller": "AboutCtrl",
			"controllerAs": "about"
		})
		.when('/3d', {
			"redirectTo": function() {
					window.location = configuration.cesiumViewer.url;
				}
		})
		.otherwise({
			"redirectTo": "/"
		});
	}])
	.constant("ANONYMOUS_USER", {
		"username": "anonymous",
		"password": "pwdanonymous"
	})
	//login service configuration
	.run(['$rootScope','$cookies'/*,'$http'*/,'ANONYMOUS_USER','ArrayService','AuthenticationService','configuration',
		function($rootScope,$cookies/*,$http*/,ANONYMOUS_USER,ArrayService,AuthenticationService,configuration) {

			var configurationText = JSON.stringify(configuration).replace(/locationHost/g,document.location.host);
			var configurationCurrentHost = JSON.parse(configurationText);

			angular.extend($rootScope,{
				"configurationCurrentHost" : configurationCurrentHost,
				"markerVisibility" : false,
				"login" : {
					"logged" : false,
					"details" : null
				},
				"anonymousDetails" : null
			});
			//retrieve details for anonymous user (login simulation)
			AuthenticationService.Login(ANONYMOUS_USER.username,ANONYMOUS_USER.password,
				function(response) {
					if(response.username && (response.username===ANONYMOUS_USER.username)) {
						$rootScope.anonymousDetails = {
							"authdata" : "",
							"info" : response
						};
						if (($rootScope.login.details===null) && ($rootScope.anonymousDetails!==null)){
							$rootScope.login.details = ArrayService.cloneObj($rootScope.anonymousDetails);
						}
					} else {
						// do nothing
					}
				}
			);

		}
	]
);
