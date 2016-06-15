'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderImage : "./images/RheticusLogo.png",
		map : {"center":{"lon":20.4,"lat":39.1,"zoom":8,"bounds":[],"projection":"EPSG:4326"},"view":{"projection":"EPSG:3857","maxZoom":19,"minZoom":3},"query":{"zoom":7},"crs":"EPSG:3857"},
		dataProviders : [{"name":" Sentinel","checked":true},{"name":" Cosmo","checked":true},{"name":" TerraSAR-X","checked":true}],
		geocoder : {"url":"http://nominatim.openstreetmap.org/search?q=","params":"&limit=5&format=json&accept-language=en&polygon_geojson=1","paramsReverse":"&limit=1&format=json&zoom=18&accept-language=en","urlReverse":"http://nominatim.openstreetmap.org/reverse?"},
		//custom environment configuration
		marineService : {"catalog":"http://marineservices.rheticus.eu/geonetwork/srv/eng/catalog.search#/home","help":"../home/pdf/userguide_Marine.pdf"},
		CHL : {"dailySlider":"CHL","tenDaysSlider":"CHL10","monthSlider":"CHL30","month90Slider":"CHL30P"},
		SST : {"dailySlider":"SST","tenDaysSlider":"SST10","monthSlider":"SST30","month90Slider":"SST30P"},
		WT : {"dailySlider":"WT","tenDaysSlider":"WT10","monthSlider":"WT30","month90Slider":"WT30P"},
		layers : {"baselayers":[{"name":"OpenStreetMap","group":"base","source":{"type":"OSM","crossOrigin":"null"},"active":false,"visible":true,"opacity":1,"layerOptions":{"attribution":"© OpenStreetMap contributors","url":"http://www.openstreetmap.org/copyright"}},{"name":"Mapbox","group":"base","source":{"type":"MapBox","mapId":"mapbox.satellite","accessToken":"pk.eyJ1IjoicGsyMDE0IiwiYSI6IkRCTHI5Q28ifQ.oA7Qj3tLfqal-RZCRBISPA","crossOrigin":"null"},"active":true,"visible":true,"opacity":1,"layerOptions":{"attribution":"Mapbox ©","url":"https://www.mapbox.com/about/maps"}},{"name":"Ortofoto RealVista 1.0","group":"base","source":{"type":"XYZ","crossOrigin":"null","url":"http://earth.realvista.it/realvista2d/query?request=ImageryMaps&channel=1004&version=17&x={x}&y={y}&z={z}","params":{"LAYERS":"rv1","TILED":true,"FORMAT":"image/jpeg"}},"active":false,"visible":true,"opacity":1,"layerOptions":{"attribution":"Imagery © Realvista contributors","url":"http://www.realvista.it/"}}],"overlays":{"olLayers":[{"id":"sst","name":"SST","group":"Overlays","unit":"°C","source":{"type":"TileWMS","crossOrigin":"null","legend":"http://maps.planetek.it/acritas/resources/legend/SST_Legend.JPG","urls":["http://locationHost/tebegeoserver/pkh108_SAIMON/wms"],"params":{"LAYERS":"SST","TIME":"2012-04-01","TILED":true}},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"wt","name":"WT","group":"Overlays","unit":"m","source":{"type":"TileWMS","crossOrigin":"null","legend":"http://maps.planetek.it/acritas/resources/legend/WT_Legend.JPG","urls":["http://locationHost/tebegeoserver/pkh108_SAIMON/wms"],"params":{"LAYERS":"WT","TIME":"2012-04-01","TILED":true}},"active":true,"visible":false,"opacity":0.8,"layerOptions":{"attribution":"","url":""}},{"id":"chl","name":"CHL","group":"Overlays","unit":"mg/m3","source":{"type":"TileWMS","crossOrigin":"null","legend":"http://maps.planetek.it/acritas/resources/legend/Chl_Legend.JPG","urls":["http://locationHost/tebegeoserver/pkh108_SAIMON/wms"],"params":{"LAYERS":"CHL","TIME":"2012-04-01","TILED":true},"serverType":"geoserver"},"active":true,"visible":true,"opacity":0.8,"layerOptions":{"attribution":"","url":""}}],"metadata":[]}},
		rheticusAPI : {"host":"http://locationHost/rheticusapi/api/v1","dataset":{"path":"/datasets/#datasetid","datasetid":"#datasetid"},"measure":{"path":"/datasets/#datasetid/pss/#psid/measures?type=DL&periods=#periods","datasetid":"#datasetid","psid":"#psid","periods":"#periods","properties":{"datasetid":"datasetid","psid":"psid","date":"data","measure":"measure"}},"authentication":{"path":"/authenticate?username=#username&password=#password","username":"#username","password":"#password"}}
	});
