'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:TimeSliderCtrl
 * @description
 * # TimeSliderCtrl
 * Time Slider Controller for rheticus project
 */
angular.module('rheticus')
	.controller('TimeSliderCtrl',['$rootScope','$timeout','$scope','configuration','$translate','Flash','$http','olData',function($rootScope,$timeout,$scope,configuration,$translate,Flash,$http,olData){
		var self = this; //this controller
		$scope.myDateMax = new Date();
		$scope.myDateMin = new Date();
		$scope.limitDate = "";
		$scope.limitDate1 = "";
		$scope.limitDate10 = "";
		$scope.limitDate30 = "";
		$scope.limitDate30P = "";
    $scope.currentDate=0;
		$scope.layerFound=[];
		$scope.pickerOptions = {
	    "showWeeks": false
	  };
		//WATCH ALL OVERLAYS
		$scope.overlayForWatch = $scope.getOverlays();

		angular.extend(self,{
				//INSERT HERE YOUR FILTERS
				"overlays" : $scope.getOverlays(),
				"chl" : $scope.getOverlayParams("chl"),
				"sst" : $scope.getOverlayParams("sst"),
				"wt" : $scope.getOverlayParams("wt"),
				"maxSlider": 0,
				"minSlider": 0,
				"nameTimeSlider": "",
				"timeSlider": "dailySlider",
				"currentDateFormat": "",
				"currentType":"chl",
				"currentTypeName":"",
				"showCalendar":false,
				"showCalendarView":function () {
					self.showCalendar=!self.showCalendar;
				}
		});

		//UPDATE CURRENTVIEW TRANSLATIONS WHEN CLICK NEW LANGUAGE
			$rootScope.$on('$translateChangeSuccess', function (){
				$rootScope.$broadcast("setOverlaysClosure");
				$translate(self.timeSlider).then(function (translation) {
					self.nameTimeSlider = translation;
				});
				$translate(self.currentType).then(function (translation) {
					self.currentTypeName = translation;
				});
	    });

		//INITIALIZE CURRENTVIEW
			$translate('dailySlider').then(function (translation) {
				self.nameTimeSlider = translation;
			});
			$translate('chl').then(function (translation) {
				self.currentTypeName = translation;
			});


	//update values on login change status
	$rootScope.$watch("login.details", function () {
			$scope.statusSlider=false;
			document.getElementById('playButton').src="images/icons/play.png";
			document.getElementById('playButtonMin').src="images/icons/play.png";
			$scope.currentDate=0;
	  	$scope.getMinMaxDateDeals();
			$scope.getDateFromCapabilities("CHL");
			$scope.countMin=false;
			$scope.countMax=false;
	});

	$scope.$watch("datePicker",function(value){
			if(value){
				var i =0;
				var found=false;
				console.log("time"+value);
				while (i < $scope.arrayDataTimeCurrent.length && !found) {
					console.log($scope.arrayDataTimeCurrent[i]);
					if(value<=$scope.arrayDataTimeCurrent[i]){
						found=true;
						$scope.currentDate=i;
						console.log("trovato: "+i);
					}
					i++;
				}
				if(!found){
					$translate("noData").then(function (translation) {
						Flash.create("warning", translation);
					});
				}
			}


	});


	//WATCH SST
	$scope.$watch("overlayForWatch[0].visible",function(value){
			if (value && $scope.layerFound.length>0){
			console.log("attivo SST: "+$scope.overlayForWatch[0].source.params.LAYERS);
			//SET MENU PERIOD
			var i =0;
			var trovato=false;
			while(i<$scope.layerFound.length && !trovato){
				if ($scope.layerFound[i].Name==="SST"){
					trovato=true;
					$scope.limitDate=d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length-1]);
				}
				i++;
			}
			self.currentType='sst',
			$translate('sst').then(function (translation) {
				self.currentTypeName = translation;
			});
			//UPDATE ALL LAST DATE MENU
			$scope.updateMenuDate("SST");
			//RESTART WITH CURRENT TYPE
			$scope.restart(self.timeSlider);
		}

	});
	//WATCH WT
	$scope.$watch("overlayForWatch[1].visible",function(value){
			if (value && $scope.layerFound.length>0){
			//console.log("attivo WT: "+$scope.overlayForWatch[1].source.params.LAYERS);
			//SET MENU PERIOD
			var i =0;
			var trovato=false;
			while(i<$scope.layerFound.length && !trovato){
				if ($scope.layerFound[i].Name==="WT"){
					trovato=true;
					$scope.limitDate=d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length-1]);
				}
				i++;
			}
			self.currentType='wt',
			$translate('wt').then(function (translation) {
				self.currentTypeName = translation;
			});
			//UPDATE ALL LAST DATE MENU
			$scope.updateMenuDate("WT");
			//RESTART WITH CURRENT TYPE
			$scope.restart(self.timeSlider);
		}

	});
	//WATCH CHL
	$scope.$watch("overlayForWatch[2].visible",function(value){
		if (value && $scope.layerFound.length>0){
			//console.log("attivo CHL: "+$scope.overlayForWatch[2].source.params.LAYERS);
			//SET MENU PERIOD
			var i =0;
			var trovato=false;
			while(i<$scope.layerFound.length && !trovato){
				if ($scope.layerFound[i].Name==="CHL"){
					trovato=true;
					$scope.limitDate=d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length-1]);
				}
				i++;
			}
			self.currentType='chl',
			$translate('chl').then(function (translation) {
				self.currentTypeName = translation;
			});
			//UPDATE ALL LAST DATE MENU
			$scope.updateMenuDate("CHL");
			//RESTART WITH CURRENT TYPE
			$scope.restart(self.timeSlider);
		}

	});

	//WATCH CURRENTDATE (MODEL SLIDER) AND UPDATE INTERFACE
  $scope.$watch("currentDate",function(nameLayer){
      if($scope.arrayDataTimeCurrent){
        $scope.setSlider();
      }

	});
	//UPDATE MENU DATE WHEN CHANGING LAYER
	$scope.updateMenuDate = function (nameLayer) {
		var find=false;
	  var i=0;
		while(i<$scope.layerFound.length && !find){
			var time=d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length-1]);
			if($scope.layerFound[i].Name===nameLayer){
				$scope.limitDate1=time;
			}else if ($scope.layerFound[i].Name.indexOf(nameLayer+"10")>-1) {
				$scope.limitDate10=time;
			}
			else if ($scope.layerFound[i].Name.indexOf(nameLayer+"30")>-1 && $scope.layerFound[i].Name.indexOf("P")===-1) {
				$scope.limitDate30=time;
			}
			else if ($scope.layerFound[i].Name.indexOf(nameLayer+"30P")>-1) {
				$scope.limitDate30P=time;
				find=true;
			}
			i++;
		}
	}


	//CALL GET CAPABILITIES AND WITH JQUERY EXTRACT AN ARRAY WITH ALL LAYER NAME AND DIMENSIONS
	$scope.getDateFromCapabilities=function(nameLayer){
			var value;
			for(var i=0;i<self.overlays.length;i++){
				if(self.overlays[i].visible){
					value=i;
				}
			}
			if (value!==undefined){
				$http.get(self.overlays[value].source.urls[0]+"?service=wms&request=GetCapabilities")
				.success(function (result) {
					var xmlDoc = $.parseXML( result );
					var xml = $( xmlDoc );
					var arrayLayers = xml.find("Layer");
					var layerFound=[];
					for(var i =0;i<arrayLayers.length;i++){
						var completeLayer=[];
						for(var j =0;j<arrayLayers[i].childNodes.length;j++){
							if(arrayLayers[i].childNodes[j].nodeName==="Name")
							{
								completeLayer.push(arrayLayers[i].childNodes[j].textContent);
							}
							if(arrayLayers[i].childNodes[j].nodeName==="Dimension")
							{
								completeLayer.push(arrayLayers[i].childNodes[j].childNodes[0].data);
							}
						}
						if(completeLayer.length===2){
							var values = completeLayer[1].split(',');
							var arrayDate=[];
							for(var k =0;k<values.length;k++){
								arrayDate.push(new Date(values[k]));
							}
							$scope.layerFound.push({
								"Name":completeLayer[0],
								"Dimension":arrayDate,
							});
						}
					}
					//console.log($scope.layerFound);
					var find=false;
					i=0;
					while(i<$scope.layerFound.length && !find){
						var time=d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length-1]);
						if($scope.layerFound[i].Name===nameLayer){
							//console.log("Found"+$scope.layerFound[i].Name);
							//RESET ALL
							$scope.limitDate=d3.time.format("%d/%m/%Y")($scope.layerFound[i].Dimension[$scope.layerFound[i].Dimension.length-1]);
							//console.log($scope.limitDate);
							$scope.currentDate=0;
							document.getElementById('playButton').src="images/icons/play.png";
							document.getElementById('playButtonMin').src="images/icons/play.png";
							$scope.arrayDataTime=$scope.layerFound[i].Dimension;
							$scope.filterWMSDate();
							$scope.arrayDataTimeCurrent=$scope.arrayDataTime;
							$scope.setSlider();
							$scope.limitDate1=time;

						}else if ($scope.layerFound[i].Name.indexOf(nameLayer+"10")>-1) {
							$scope.limitDate10=time;
						}
						else if ($scope.layerFound[i].Name.indexOf(nameLayer+"30")>-1 && $scope.layerFound[i].Name.indexOf("P")===-1) {
							$scope.limitDate30=time;
						}
						else if ($scope.layerFound[i].Name.indexOf(nameLayer+"30P")>-1) {
							$scope.limitDate30P=time;
							find=true;
						}
						i++;
					}
				});
			}

		};


		//EXTRACT MIN AND MAX DATE FROM USER CONTRACT
	$scope.getMinMaxDateDeals= function () {
			var deals=$scope.getUserDeals();
			var minDate;
			var maxDate;
			if(deals.length>0) {// if exists at least one contract
				minDate=new Date(deals[0].start_period).getTime();
				maxDate=new Date(deals[0].end_period).getTime();
					for (var d=0; d<deals.length; d++) {
							if(minDate>new Date(deals[d].start_period).getTime()){
								minDate=new Date(deals[d].start_period).getTime();
							}
							if(maxDate<new Date(deals[d].end_period).getTime()){
								maxDate=new Date(deals[d].end_period).getTime();
							}
						}
						$scope.minDate=new Date(minDate);
						$scope.maxDate=new Date(maxDate);
				}
		}


	//FILTER LAYER DIMENSION BY USER CONTRACT
	$scope.filterWMSDate= function () {
				var correctDate=[];
				for(var i=0;i<$scope.arrayDataTime.length;i++){
					if($scope.arrayDataTime[i]<($scope.maxDate) && $scope.arrayDataTime[i]>($scope.minDate)){
						correctDate.push($scope.arrayDataTime[i]);
					}
				}
				$scope.arrayDataTime=correctDate;
				if(correctDate.length!==0){
	        self.maxSlider=$scope.arrayDataTime.length-1;
					self.currentTimeSlider=d3.time.format("%d/%m/%Y")($scope.arrayDataTime[0]);
				}else{
	        self.maxSlider=0;
					self.currentTimeSlider="";
				}
		};


	// CALL ITSELF EVERY 3 SEC AND CHANGE WMS TIME++
	$scope.statusSlider=false;
	$scope.loopSlider= function() {
			if($scope.statusSlider){
				//console.log("startLoop");
				if($scope.currentDate<$scope.arrayDataTimeCurrent.length-1){
					$scope.currentDate++;
					$scope.setSlider();
					$timeout($scope.loopSlider, 3000);
				}
			}
	}


	//START SLIDER PLAY AND CHANGE INTERFACE
	$scope.playSlider= function() {
			if(document.getElementById('playButton').src.indexOf("play.png")>-1 && document.getElementById('playButtonMin').src.indexOf("play.png")>-1){
				document.getElementById('playButton').src="images/icons/pause.png";
				document.getElementById('playButtonMin').src="images/icons/pause.png";
				$scope.statusSlider=true;
				$timeout($scope.loopSlider, 500);
			}else if(document.getElementById('playButton').src.indexOf("pause.png")>-1 && document.getElementById('playButtonMin').src.indexOf("pause.png")>-1){
				$scope.statusSlider=false;
				$timeout($scope.loopSlider, 500);
				document.getElementById('playButton').src="images/icons/play.png";
				document.getElementById('playButtonMin').src="images/icons/play.png";
			}else {
				$scope.currentDate=0;
				if($scope.arrayDataTimeCurrent[$scope.currentDate]!==undefined){
					self.currentTimeSlider=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				}else{
					self.currentTimeSlider="";
				}
				$scope.statusSlider=false;
				$timeout($scope.loopSlider, 500);
				document.getElementById('playButton').src="images/icons/play.png";
				document.getElementById('playButtonMin').src="images/icons/play.png";
			}
	};


	//CHANGE WMS TIME --
	$scope.rewindSlider= function() {
				if($scope.currentDate>0){
					$scope.currentDate--;
				}
				$scope.setSlider();
	};


	//CHANGE WMS TIME ++
	$scope.forwardSlider= function() {
				if($scope.currentDate<$scope.arrayDataTime.length-1){
					$scope.currentDate++;
				}
				//$scope.changeWithNoRefreshMap();
				$scope.setSlider();
	};


	//UPDATE INTERFACE WITH THE CURRENT DATE AND UPDATE TIME PARAMS IN ALL OVERLAYS
  $scope.setSlider= function() {
				//console.log("setSlider");
				$rootScope.$broadcast("setOverlaysClosure");
				self.chl.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.sst.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.wt.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				if($scope.arrayDataTimeCurrent[$scope.currentDate]!==undefined){
					self.currentTimeSlider=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
					if(document.getElementById('playButton').src.indexOf("images/icons/stop.png")>-1 && document.getElementById('playButtonMin').src.indexOf("images/icons/stop.png")>-1){
						document.getElementById('playButton').src="images/icons/play.png";
						document.getElementById('playButtonMin').src="images/icons/play.png";
					}
					if($scope.currentDate===$scope.arrayDataTimeCurrent.length-1){
						document.getElementById('playButton').src="images/icons/stop.png";
						document.getElementById('playButtonMin').src="images/icons/stop.png";
					}
				}else{
					self.currentTimeSlider="";
				}
	};

 //THIS FUNCTIONS ARE CALLED BY TIME TYPE CHANGE.
	$scope.dailySlider=function () {
				self.timeSlider = "dailySlider";
				$translate('dailySlider').then(function (translation) {
					self.nameTimeSlider = translation;
				});

				$scope.restart("dailySlider");
				document.getElementById('listTypeButton').src="images/icons/1.png"
				document.getElementById('listTypeButtonMin').src="images/icons/1.png"
	};

	$scope.tenDaysSlider=function () {
				self.timeSlider = "tenDaysSlider";
				$translate('tenDaysSlider').then(function (translation) {
					self.nameTimeSlider = translation;
				});
				$scope.restart("tenDaysSlider");
				document.getElementById('listTypeButton').src="images/icons/10.png"
				document.getElementById('listTypeButtonMin').src="images/icons/10.png"
	};

	$scope.monthSlider=function () {
				self.timeSlider = "monthSlider";
				$translate('monthSlider').then(function (translation) {
					self.nameTimeSlider = translation;
				});
				$scope.restart("monthSlider");
				document.getElementById('listTypeButton').src="images/icons/30.png"
				document.getElementById('listTypeButtonMin').src="images/icons/30.png"
	};

	$scope.month90Slider=function () {
				self.timeSlider = "month90Slider";
				$translate('month90Slider').then(function (translation) {
					self.nameTimeSlider = translation;
				});
				$scope.restart("month90Slider");
				document.getElementById('listTypeButton').src="images/icons/30p.png"
				document.getElementById('listTypeButtonMin').src="images/icons/30p.png"
	};

	//CREATE ARRAY WITH NAME LAYERS AND CORRISPECTIVE TIME DIMENSION
	$scope.getDimensionAfterCapabilities= function () {
				var currentOverlay=$scope.getCurrentCategory();
				//console.log(currentOverlay);
				var i =0;
				var trovato=false;
				while(i<$scope.layerFound.length && !trovato){
					if ($scope.layerFound[i].Name===currentOverlay.source.params.LAYERS){
						trovato=true;
					}
					i++;
				}

				if(trovato){
					//console.log($scope.layerFound[i-1].Dimension);
					return $scope.layerFound[i-1].Dimension;
				}else{
					return [];
				}
	};

	//GET THE VISIBLE OVERLAY
	$scope.getCurrentCategory= function () {
				var overlays=$scope.getOverlays();
				var i =0;
				var trovato=false;
				while(i<overlays.length && !trovato){
					if (overlays[i].visible){
						trovato=true;
					}
					i++;
				}
				if(trovato){
					return overlays[i-1];
				}else{
					return null;
				}
	};

	//RESTART THE CURRENT LAYER WITH NEW TIME TYPE.
	$scope.restart=function (type) {
				//console.log("restart");
				//RESET ALL
				$scope.setOverlaysToType(type);
				//CALCULATE NEW LAYER DIMENSION AND SET MAXSLIDER
				var dimension = $scope.getDimensionAfterCapabilities();
				if(dimension){

					//SET MAX SLIDER LENGTH
					self.maxSlider=dimension.length-1;
					//SET SLIDER INDEX NEAR THE CURRENT DATE
					var i =0;
					var found=false;
					while (i < dimension.length && !found) {
						if(dimension[i]>=$scope.arrayDataTimeCurrent[$scope.currentDate]){
							found=true;
						}
						i++;
					}
					//FILTER DATE BY USER CONTRACT AND RESET INTERFACE
					document.getElementById('playButton').src="images/icons/play.png";
					document.getElementById('playButtonMin').src="images/icons/play.png";
					$scope.arrayDataTime=dimension;
					$scope.filterWMSDate();
					$scope.arrayDataTimeCurrent=$scope.arrayDataTime;
					//TIMEOUT NEEDED BECAUSE SYNC CHANGE OF currentDate AND MAXSLIDER GENERATE ERROR
					$timeout(function () {
						$scope.currentDate=parseInt(i-1);
						$scope.setSlider();
					}, 0);
				}else{
					console.log("Layer not found");
				}

	};


	//SET ALL LAYERS TO THE INPUT TYPE USING MAPPING IN COMMON.JS
	$scope.setOverlaysToType=function (type) {
				//console.log("setOverlaysToType with type:"+type);
				var overlays=$scope.getOverlays();
				for (var i=0;i<overlays.length;i++){
					eval("overlays[i].source.params.LAYERS=configuration."+overlays[i].name+"."+type); // jshint ignore:line
				}
	};


	$scope.changeWithNoRefreshMap=function () {
			olData.getMap().then(function(map){
					var layers = map.getLayers();
	        layers.forEach(function(layer) {
	          if (layer.get('name') === 'Overlays') {
							//console.log((layer.getLayers().getArray())[2].get('name'));
									for (var i = 0; i < (layer.getLayers().getArray()).length; i++) {
											if((layer.getLayers().getArray())[i].get('name')==='SST' || (layer.getLayers().getArray())[i].get('name')==='WT' || (layer.getLayers().getArray())[i].get('name')==='CHL'){
												var source=(layer.getLayers().getArray())[i].getSource();
												var params = source.getParams();
												console.log(source.getParams());
												params.TIME = d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
												source.updateParams(params);
												console.log(source.getParams());
											 }
									}
	            }
						});
			});
	};





	}]);
