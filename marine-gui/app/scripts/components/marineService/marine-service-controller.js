'use strict';

/**
 * @ngdoc function
 * @name rheticus.controller:marineServiceCtrl
 * @description
 * # marineServiceCtrl
 * marineService Controller for rheticus project
 */
angular.module('rheticus')
    .controller('marineServiceCtrl',['$scope','configuration',
    function ($scope,configuration){

  		angular.extend(this,{
  			"openViewer" : function(){
            window.open(configuration.marineService.catalog);

  			},
        "openHelp" : function(){
            window.open(configuration.marineService.help);

  			}
  		});
    }]);
