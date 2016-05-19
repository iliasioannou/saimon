'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:TimeSliderCtrl
 * @description
 * # TimeSliderCtrl
 * Time Slider Controller for rheticus project
 */
angular.module('rheticus')
	.controller('TimeSliderCtrl',['$rootScope','$timeout','$scope','configuration','$translate','Flash','$http',function($rootScope,$timeout,$scope,configuration,$translate,Flash,$http){
		var self = this; //this controller
		$scope.myDateMax = new Date();
		$scope.myDateMin = new Date();
		$scope.myCurrentDateMax = new Date();
		$scope.myCurrentDateMin = new Date();
    $scope.currentDate=0;
		$scope.layerFound=[];
		$scope.overlayForWatch = $scope.getOverlays();

		angular.extend(self,{
				//INSERT HERE YOUR FILTERS
				"overlays" : $scope.getOverlays(),
				"chl" : $scope.getOverlayParams("chl"),
				"sst" : $scope.getOverlayParams("sst"),
				"wt" : $scope.getOverlayParams("wt"),
				"maxSlider": 0,
				"minSlider": 0,
				"timeSlider": "dailySlider"
		});


		//update values on login change status
		$rootScope.$watch("login.details", function () {
			$scope.statusSlider=false;
			document.getElementById('playButton').src="images/icons/play.png";
			$scope.currentDate=0;
    	$scope.getMinMaxDateDeals();
			$scope.getDateFromCapabilities("CHL");
			$scope.countMin=false;
			$scope.countMax=false;
		});

		//WATCH SST
		$scope.$watch("overlayForWatch[0].visible",function(value){
				if (value && $scope.layerFound.length>0){
				console.log("attivo SST: "+$scope.overlayForWatch[0].source.params.LAYERS);
				$scope.restart(self.timeSlider);
			}

		});
		//WATCH WT
		$scope.$watch("overlayForWatch[1].visible",function(value){
				if (value && $scope.layerFound.length>0){
				console.log("attivo WT: "+$scope.overlayForWatch[1].source.params.LAYERS);
				$scope.restart(self.timeSlider);
			}

		});
		//WATCH CHL
		$scope.$watch("overlayForWatch[2].visible",function(value){
			if (value && $scope.layerFound.length>0){
				console.log("attivo CHL: "+$scope.overlayForWatch[2].source.params.LAYERS);
				$scope.restart(self.timeSlider);
			}

		});

    $scope.$watch("currentDate",function(currentDate){
      if($scope.arrayDataTimeCurrent){
        $scope.setSlider();
      }

		});

		$scope.$watch("myCurrentDateMin",function(myDateMin){
			if($scope.countMin){
				$scope.currentDate=0;
				$scope.filterCurrentWMSDate();
			}else{
				$scope.countMin=true;
			}

		});
		$scope.$watch("myCurrentDateMax",function(myDateMin){
			if($scope.countMax){
				$scope.currentDate=0;
				$scope.filterCurrentWMSDate();
			}else{
				$scope.countMax=true;
			}
		});

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
					console.log($scope.layerFound);
					var find=false;
					i=0;
					while(i<$scope.layerFound.length && !find){
						if($scope.layerFound[i].Name===nameLayer){
							find=true;
							console.log("Found"+$scope.layerFound[i].Name);
							//RESET ALL
							$scope.currentDate=0;
							document.getElementById('playButton').src="images/icons/play.png";
							$scope.arrayDataTime=$scope.layerFound[i].Dimension;
							$scope.filterWMSDate();
							$scope.arrayDataTimeCurrent=$scope.arrayDataTime;
							$scope.setSlider();
						}
						i++;
					}
				});
			}

		};



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
						$scope.myCurrentDateMin=new Date(minDate);
						$scope.myCurrentDateMax=new Date(maxDate);
				}
		}

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
				//console.log(d3.time.format("%d/%m/%Y")($scope.arrayDataTime[0]));
				document.getElementById('currentTimeSlider').innerHTML=d3.time.format("%d/%m/%Y")($scope.arrayDataTime[0]);
			}else{
        self.maxSlider=0;
				document.getElementById('currentTimeSlider').innerHTML="";
			}
		};

		$scope.filterCurrentWMSDate= function () {
			var correctDate=[];
			for(var i=0;i<$scope.arrayDataTime.length;i++){
				if(new Date($scope.arrayDataTime[i])<($scope.myCurrentDateMax) && new Date($scope.arrayDataTime[i])>($scope.myCurrentDateMin)){
					correctDate.push($scope.arrayDataTime[i]);
				}
			}
			$scope.arrayDataTimeCurrent=correctDate;
			if(correctDate.length===0){
				$translate('noResult').then(function (translatedValue) {
						Flash.create('danger', translatedValue);
				});
			}else{
				$translate('loadingResult').then(function (translatedValue) {
						Flash.create('success', translatedValue);
				});
				document.getElementById('currentTimeSlider').innerHTML=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[0]);
			}
		}





	$scope.statusSlider=false;
	$scope.loopSlider= function() {
		if($scope.statusSlider){
			console.log("startLoop");
			if($scope.currentDate<$scope.arrayDataTimeCurrent.length-1){
				$scope.currentDate++;
				self.chl.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.sst.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				self.wt.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				if($scope.arrayDataTimeCurrent[$scope.currentDate]!==undefined){
					document.getElementById('currentTimeSlider').innerHTML=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
				}else{
					document.getElementById('currentTimeSlider').innerHTML="";
				}
				$timeout($scope.loopSlider, 3000);
			}else{
				document.getElementById('playButton').src="images/icons/stop.png";
			}
		}
	}

	$scope.playSlider= function() {
		//console.log("playSlider");
		//console.log(document.getElementById('playButton').src);
		if(document.getElementById('playButton').src.indexOf("play.png")>-1){
			document.getElementById('playButton').src="images/icons/pause.png";
			//console.log("play");
			//console.log($scope.arrayDataTimeCurrent);
			$scope.statusSlider=true;
			$timeout($scope.loopSlider, 500);

		}else if(document.getElementById('playButton').src.indexOf("pause.png")>-1){
			//console.log("pause");
			$scope.statusSlider=false;
			$timeout($scope.loopSlider, 500);
			document.getElementById('playButton').src="images/icons/play.png";
		}else {
			//console.log("stop");
			$scope.currentDate=0;
			if($scope.arrayDataTimeCurrent[$scope.currentDate]!==undefined){
				document.getElementById('currentTimeSlider').innerHTML=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
			}else{
				document.getElementById('currentTimeSlider').innerHTML="";
			}
			$scope.statusSlider=false;
			$timeout($scope.loopSlider, 500);
			document.getElementById('playButton').src="images/icons/play.png";
		}
	};
	$scope.rewindSlider= function() {

		if($scope.currentDate>0){
			$scope.currentDate--;
		}

		self.chl.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		self.sst.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		self.wt.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);

		//$scope.redrawMap($scope.arrayDataTimeCurrent[$scope.currentDate]);
		if($scope.arrayDataTimeCurrent[$scope.currentDate]!==undefined){
			document.getElementById('currentTimeSlider').innerHTML=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		}else{
			document.getElementById('currentTimeSlider').innerHTML="";
		}
		//console.log(self.chl.source.params.TIME);
	};
	$scope.forwardSlider= function() {
		if($scope.currentDate<$scope.arrayDataTime.length-1){
			$scope.currentDate++;
		}
		self.chl.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		self.sst.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		self.wt.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		if($scope.arrayDataTimeCurrent[$scope.currentDate]!==undefined){
			document.getElementById('currentTimeSlider').innerHTML=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		}else{
			document.getElementById('currentTimeSlider').innerHTML="";
		}
		//console.log(self.chl.source.params.TIME);
	};
  $scope.setSlider= function() {
		console.log("setSlider");

		self.chl.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		self.sst.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		self.wt.source.params.TIME=d3.time.format("%Y-%m-%d")($scope.arrayDataTimeCurrent[$scope.currentDate]);

		if($scope.arrayDataTimeCurrent[$scope.currentDate]!==undefined){
			document.getElementById('currentTimeSlider').innerHTML=d3.time.format("%d/%m/%Y")($scope.arrayDataTimeCurrent[$scope.currentDate]);
		}else{
			document.getElementById('currentTimeSlider').innerHTML="";
		}
		//console.log(self.chl.source.params.TIME);
	};




	$scope.dailySlider=function () {
		self.timeSlider = "dailySlider";
		$scope.restart("dailySlider");
	};

	$scope.tenDaysSlider=function () {
		self.timeSlider = "tenDaysSlider";
		$scope.restart("tenDaysSlider");
	};

	$scope.monthSlider=function () {
		self.timeSlider = "monthSlider";
		$scope.restart("monthSlider");
	};

	$scope.month90Slider=function () {
		self.timeSlider = "month90Slider";
		$scope.restart("month90Slider");
	};

	$scope.getDimensionAfterCapabilities= function () {
		var currentOverlay=$scope.getCurrentCategory();
		console.log(currentOverlay);
		var i =0;
		var trovato=false;
		while(i<$scope.layerFound.length && !trovato){
			if ($scope.layerFound[i].Name===currentOverlay.source.params.LAYERS){
				trovato=true;
			}
			i++;
		}

		if(trovato){
			console.log($scope.layerFound[i-1].Dimension);
			return $scope.layerFound[i-1].Dimension;
		}else{
			return null;
		}
	};

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


	$scope.restart=function (type) {
		console.log("restart");
		$scope.setOverlaysToType(type);
		var dimension = $scope.getDimensionAfterCapabilities();
		self.maxSlider=dimension.length-1;
		console.log("set length to :"+self.maxSlider);
		//console.log(currentOverlay);
		//console.log("Dimension: "+dimension);
		//RESET ALL
		var i =0;
		var found=false;
		while (i < dimension.length && !found) {
			if(dimension[i]>=$scope.arrayDataTimeCurrent[$scope.currentDate]){
				found=true;
			}
			i++;
		}
		console.log("currentDate before:"+$scope.currentDate);
		document.getElementById('playButton').src="images/icons/play.png";
		$scope.arrayDataTime=dimension;
		$scope.filterWMSDate();
		$scope.arrayDataTimeCurrent=$scope.arrayDataTime;

		$timeout(function () {
			$scope.currentDate=parseInt(i-1);
			$scope.setSlider();
		}, 50);


		console.log("currentDate after:"+$scope.currentDate);

	};

	$scope.setOverlaysToType=function (type) {
		console.log("setOverlaysToType with type:"+type);
		var overlays=$scope.getOverlays();
		for (var i=0;i<overlays.length;i++){
			console.log(overlays[i].name);
			eval("overlays[i].source.params.LAYERS=configuration."+overlays[i].name+"."+type); // jshint ignore:line
		}
	};








	}]);
