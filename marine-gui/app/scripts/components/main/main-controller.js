'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:MainCtrl
 * @description
 * # MainCtrl
 * Main Controller for rheticus project
 */
angular.module('rheticus')
	.controller('MainCtrl',['$rootScope','$scope','configuration','$translate','$http','olData','ArrayService','SpatialService','Flash',
	function ($rootScope,$scope,configuration,$translate,$http,olData,ArrayService,SpatialService,Flash){

		var self = this; //this controller

		var setCrossOrigin = function() { // Review "CrossOrigin" openlayers parameter from overlays configuration
			var overlays = $rootScope.configurationCurrentHost.layers.overlays.olLayers;
			for(var o=0; o<overlays.length; o++){
				overlays[o].source.crossOrigin = (overlays[o].source.crossOrigin && (overlays[o].source.crossOrigin==="null")) ? null : "";
			}
			return overlays;
		};
		var overlays = setCrossOrigin();

		/**
		 * PUBLIC VARIABLES AND METHODS
		 */
		// OpenLayers Default Events
		var olDefaults = {
			"events" : {
				"map" : ["moveend", "click"],
				"layers" : ["click"]
			},
			"interactions" : {
				"mouseWheelZoom" : true
			},
			"view":{
				"maxZoom": 20,
				"minZoom": 3
			}
		};
		// Openlayers controls
		var olControls = [
			//{"name" : 'zoom', "active" : true}, // TBC ...duplicate in view
			{"name" : 'rotate', "active" : true},
			{"name" : 'zoomtoextent', "active" : false},
			//{"name" : 'zoomslider', "active" : true},
			{"name" : 'scaleline', "active" : true},
			{"name" : 'attribution', "active" : true},
			//{"name" : 'mouseposition', "active" : true},
		];
		//ExternagetDateFromCapabilitiesl Controller management : GETTER and SETTER
		var setController = function(openController){
			activeController = (activeController===openController) ? "" : openController;
		};
		var getController = function(openController){
			return activeController===openController;
		};
		//Setter map view center
		var setCenter = function(center){
			$scope.center.lon = (center.lon && !isNaN(center.lon)) ? center.lon : $scope.center.lon;
			$scope.center.lat = (center.lat && !isNaN(center.lat)) ? center.lat : $scope.center.lat;
			$scope.center.zoom = (center.zoom && !isNaN(center.zoom)) ? center.zoom : $scope.center.zoom;
		};
		// Setter map view extent on GeoJSON bounds
		var setMapViewExtent = function(geometryType,geoJSON){
			if (geoJSON && (geoJSON!==null)){
				var geom = eval("new ol.geom."+geometryType+"(geoJSON);"); // jshint ignore:line
				var extent = geom.getExtent();
				extent = ol.extent.applyTransform(extent, ol.proj.getTransform("EPSG:4326", "EPSG:3857")); // jshint ignore:line
				olData.getMap().then(function (map) {
					map.getView().fit(extent, map.getSize());
				});
			}
		};
		//Getter overlay ols parameters
		var getOverlayParams = function(id){
			return getOverlay("overlays",id);
		};
		// check on zoom level to enable getFeatureInfo query on PS
		var showDetails = function() {
			return $scope.center.zoom>=$rootScope.configurationCurrentHost.map.query.zoom;
		};
		//Getter active baselayer useful for basemap controller
		var getActiveBaselayer = function() {
			return self.baselayers[ArrayService.getIndexByAttributeValue(self.baselayers,"active",true)];
		};
		var getBaselayers = function() {
			return self.baselayers;
		};
		var getOverlays = function() {
			return self.overlays;
		};
		var userDeals = [];
		var getUserDeals = function(){
			return userDeals;
		};




		//CQL_FILTER SETTER ON "SPATIAL" PS
		var setSpatialFilter = function(){

			var provider=[];
				for(var i=0; i<configuration.dataProviders.length; i++){
					if((configuration.dataProviders[i].name.indexOf("Sentinel")> -1) && configuration.dataProviders[i].checked){
						provider.push({
 							"name" : "S01"
 						});
					}else if((configuration.dataProviders[i].name.indexOf("Cosmo")> -1) && configuration.dataProviders[i].checked){
						provider.push({
 							"name" : "CSK"
 						});
					}else if((configuration.dataProviders[i].name.indexOf("TerraSAR-X")> -1) && configuration.dataProviders[i].checked){
						provider.push({
 							"name" : "TSX"
 						});
					}
				}

			//console.log($rootScope.providersFilter);
			//console.log(provider);
			var cqlFilter = "";
			for(var i=0; i<userDeals.length; i++){
				if(provider !== undefined && provider.length!==0){
					if (isActiveSensor(userDeals[i].sensorid,provider)){
						if (userDeals[i].geom_geo_json!==null){
							if (cqlFilter!==""){
								cqlFilter += " OR ";
							}
							var cqlText = SpatialService.getIntersectSpatialFilterCqlText(
								userDeals[i].geom_geo_json.type,
								userDeals[i].geom_geo_json.coordinates
							);
							if (cqlText!==""){
								if (userDeals[i].sensorid!==""){

									cqlText = "("+cqlText+" AND (sensorid='"+userDeals[i].sensorid+"')"+")";
								}
								cqlFilter += cqlText;
							}
						}
					}else{
						if (userDeals[i].geom_geo_json!==null){
							if (cqlFilter!==""){
								cqlFilter += " OR ";
							}
							var cqlText = SpatialService.getIntersectSpatialFilterCqlText(
								userDeals[i].geom_geo_json.type,
								userDeals[i].geom_geo_json.coordinates
							);
							if (cqlText!==""){
								if (userDeals[i].sensorid!==""){

									cqlText = "("+cqlText+" AND (sensorid='NotExists')"+")";
								}
								cqlFilter += cqlText;
							}
						}
					}
				}else {
					if (userDeals[i].geom_geo_json!==null){
						if (cqlFilter!==""){
							cqlFilter += " OR ";
						}
						var cqlText = SpatialService.getIntersectSpatialFilterCqlText(
							userDeals[i].geom_geo_json.type,
							userDeals[i].geom_geo_json.coordinates
						);
						if (cqlText!==""){
							if (userDeals[i].sensorid!==""){

								cqlText = "("+cqlText+" AND (sensorid='NotExists')"+")";
							}
							cqlFilter += cqlText;
						}
					}
				}


			}
			advancedCqlFilters.spatial = (cqlFilter!=="") ? "("+cqlFilter+")" : "";
		};

		var isActiveSensor = function(sensorid, provider){
			var exists=false;
			if(provider[0]){
				if(sensorid===provider[0].name){
					exists=true;
				}
			}
			if(provider[1] ){
				if(sensorid===provider[1].name){
					exists=true;
				}
			}
			if(provider[2]){
				if(sensorid===provider[2].name){
					exists=true;
				}
			}
			return exists;
		}


		var applyFiltersToMap = function(){
			var cqlFilter = null;
			for (var key in advancedCqlFilters) {
				if (advancedCqlFilters.hasOwnProperty(key) && (advancedCqlFilters[key]!=="")) {
					if (cqlFilter!==null){
						cqlFilter += " AND "; //Add "AND" condition with prevoius item
					} else {
						cqlFilter = ""; //initialize as empty String
					}
					cqlFilter += advancedCqlFilters[key]; //Add new condition to cqlFilter
				}
			}
			//getOverlayParams("ps").source.params.CQL_FILTER = cqlFilter;
		};

		/**
		 * EXPORT AS PUBLIC CONTROLLER
		 */
		angular.extend(self,{
			"olDefaults" : olDefaults,
			"controls" : olControls,
			"view" : {}, // Openlayers view
			"marker" : {}, // OpenLayers Marker layer for PS query
			"baselayers" : $rootScope.configurationCurrentHost.layers.baselayers,
			"overlays" : overlays, // overlay layer list
		});

		/**
		 * EXPORT AS PUBLIC SCOPE
		 */
		angular.extend($scope,{
			// externalized scope variables for watchers
			"iffi" : null, // IFFI overlay getFeatureInfoResponse
			"sentinel" : null, // SENTINEL overlay getFeatureInfoResponse
			"ps" : null, // PS overlay getFeatureInfoResponse
			"center" : $rootScope.configurationCurrentHost.map.center, // for scope watcher reasons because "ols moveend event" makes ols too slow!
			// externalized scope methods for children controllers
			"setController" : setController,
			"getController" : getController,
			"setMapViewExtent" : setMapViewExtent,
			"getOverlayParams" : getOverlayParams,
			"showDetails" : showDetails,
			"getActiveBaselayer" : getActiveBaselayer,
			"getBaselayers" : getBaselayers,
			"getOverlays" : getOverlays,
			"getUserDeals" : getUserDeals,
			"setSpatialFilter" : setSpatialFilter,
			"applyFiltersToMap" : applyFiltersToMap
		});

		/**
		 * WATCHERS
		 */

		//delete marker when status changes to false
		$rootScope.$watch("markerVisibility", function (visible) {
			if (!visible){
				initMarker();
			}
		});
		//update user details on login change status
		$rootScope.$watch("login.details", function () {
			setUserDeals(
				(($rootScope.login.details!==null) && $rootScope.login.details.info) ? $rootScope.login.details.info : null
			);
		});



		/**
		 * PRIVATE  VARIABLES AND METHODS
		 */
		var MAX_FEATURES = 5;
		var MAX_SENTINEL_MEASURES = 1000;
		//External Controller flag
		var activeController = "";
		var getFeatureInfoPoint = [];
		//Retrieves Overlay ols params or metadata detail
		var getOverlay = function(detail,id){
			var index = ArrayService.getIndexByAttributeValue(self.overlays,"id",id); // jshint ignore:line
			return eval("self."+detail+"[index]"); // jshint ignore:line
		};
		//Marker
		var setMarker = function(response) { // Marker and PS trends management
			self.marker = {
				"lat" : response.point[1],
				"lon" : response.point[0],
				"label": {
					"message": "",
					"show": false,
					"showOnMouseOver": true
				}
			};
		};
		var initMarker = function(){
			setMarker({
				"point" : [99999,99999]
			});
		};

		var advancedCqlFilters = {
			"velocity" : "",
			"coherence" : "",
			"spatial" : ""
		};

		var getCqlTextRange = function(minText, maxText){
			var cqlText = "";
			if ((minText!=="") || (maxText!=="")){
				cqlText += (minText!=="") ? minText : "";
				cqlText += ((minText!=="") && (maxText!=="")) ? " AND " : "";
				cqlText += (maxText!=="") ? maxText : "";
			}
			return cqlText;
		};

		//Creates OLS Layer Source from layer properties
		var getGetFeatureInfoOlLayer = function(l){
			var queryUrl = getOverlayMetadata(l.id).queryUrl;
			var olLayer = null;
			if (queryUrl==="") {
				olLayer = l;
			} else {
				var queryType = getOverlayMetadata(l.id).type;
				switch(queryType) {
					case "ImageWMS":
						var idLayers = "";
						for (var i=0; i<getOverlayMetadata(l.id).custom.LAYERS.length; i++) {
							if (getOverlayMetadata(l.id).custom.LAYERS[i].queryable){
								idLayers += getOverlayMetadata(l.id).custom.LAYERS[i].id + ",";
							}
						}
						if (idLayers!==""){
							idLayers = idLayers.substring(0, idLayers.length-1);
						}
						olLayer = {
							"id" : l.id,
							"name" : l.name,
							"source" : {
								"type" : queryType,
								"url" : queryUrl,
								"params" : {
									"LAYERS" : idLayers
								}
							}
						};
						break;
					case "RheticusApiRest":
						//do nothing
						break;
					default:
						//do nothing
				}
			}
			return(olLayer);
		};

		//User deals management
		var setUserDeals = function(info){
			userDeals = [];
			if ((info!==null) && info.deals && (info.deals.length>0)){
				angular.forEach(info.deals,
					function(item) {
						var coords = (item.geom_geo_json && item.geom_geo_json!=="") ? JSON.parse(item.geom_geo_json) : null;
						if(item.service_type.indexOf("marine")>-1){
							userDeals.push({
								"signature_date" : (item.signature_date && item.signature_date!=="") ? item.signature_date : "",
								"product_id" : (item.product_id && item.product_id!=="") ? item.product_id : -1,
								"product_name" : (item.product_name && item.product_name!=="") ? item.product_name : "",
								"geom_geo_json" : coords, //geojson Object
								"sensorid" : (item.sensorid && item.sensorid!=="") ? item.sensorid : "",
								"start_period" : (item.start_period && item.start_period!=="") ? item.start_period : "",
								"end_period" : (item.end_period && item.end_period!=="") ? item.end_period : ""
							});
						}

					}
				);
			}
			setSpatialFilter();
			applyFiltersToMap();
		};

	}]);
