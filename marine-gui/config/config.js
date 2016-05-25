'use strict';

angular
	.module('services.config',[])
	.constant('configuration', {
		//common environment configuration
		rheticusHeaderImage : "@@rheticusHeaderImage",
		map : @@map,
		dataProviders : @@dataProviders,
		geocoder : @@geocoder,
		//custom environment configuration
		marineService : @@marineService,
		CHL : @@CHL,
		SST : @@SST,
		WT : @@WT,
		layers : @@layers,
		rheticusAPI : @@rheticusAPI
	});
