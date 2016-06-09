'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:FeatureInfoCtrl
 * @description
 * # FeatureInfoCtrl
 * Feature Controller for rheticus project
 */
angular.module('rheticus')
	.controller('FeatureInfoCtrl',['$rootScope','$scope','ArrayService','Flash','$timeout',function($rootScope,$scope,ArrayService,Flash,$timeout){

		var self = this; //this controller
		//WATCH ALL OVERLAYS
		$scope.overlayForWatch = $scope.getOverlays();
		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */
		angular.extend(self,{
			"overlayName" : "",
			"currentTypeName":"",
			"nameTimeSlider":"",
			"valueInfo": 0,
			"currentTimeSlider":null,
			"featureDetails" : [], // Feature details: array of "layerName" objects who have in thier "properties" KVP which are respectively fieldsName and records values
			"show_features" : false, // dialog box closure
			"showFeatures" : function (show){ // showFeatures hides this view and deletes OLs marker
				self.show_features = show;
				$rootScope.markerVisibility = show;
				if (!show){
					self.psDetails = [];
				}
			}
		});

		$scope.$on("setOverlaysClosure",function(e){// jshint ignore:line
			if (self.show_features) {
				self.showFeatures(false);
			}
		});

		
		/**
		 * WATCHERS
		 */
		// featureCollection watcher for rendering chart line data
		$scope.$watch("overlayResponse",function(overlayResponse){
			$timeout(function(){
				Flash.dismiss();
			}, 1000);

			if(document.getElementById('currentTypeName')){
				self.currentTypeName=document.getElementById('currentTypeName').innerHTML;
				self.nameTimeSlider=document.getElementById('nameTimeSlider').innerHTML;
				self.currentTimeSlider=document.getElementById('currentTimeSlider').innerHTML;
			}
			if(overlayResponse){
				if (overlayResponse.features && (overlayResponse.features!==null) && (overlayResponse.features.length>0)) {
					self.valueInfo=overlayResponse.features[0].properties.BLUE_BAND;
					self.showFeatures(true);
				} else {
					self.showFeatures(false);
					Flash.create('warning', "Layer \""+self.overlayName+"\" returned no features!");
				}
			}

		});


		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var configurationLayers = [];
		/**
		 * Parameters:
		 * idService - {String}
		 * features - {Array<Object>}
		 *
		 * Returns:
		 */
		var generateData = function(idService, features){

		};
	}]);
