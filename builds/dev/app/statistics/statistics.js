;
(function() {
  'use strict';

  angular
    .module('time.statistics', [
      'time.dbc',
      'time.registration'
    ])
    .controller('statisticsCtrl', statisticsController)
    .run( /*@ngInject*/ function($log) {
      $log.debug('Tasks Run');
    })
    .config(TasksConfig)
    .factory('statistics', statisticsFactory);

  /**
   * Tasks Factory
   */
  // @ngInject
  function statisticsFactory () {
    var o = {};

    return o;
  }

  /**
   * Tasks Controller
   */
  // @ngInject
  function statisticsController($log, $rootScope) {
    $log.debug('statisticsController');
    var s = this;

    $rootScope.currentPage = 'statistics';
  }
  /**
   * Tasks Config
   */
  // @ngInject
  function TasksConfig($stateProvider){
    console.log('Statistics Config');
    $stateProvider
      .state('statistics', {
        url: '/statistics',
        templateUrl: 'app/statistics/statistics.html',
        controller: 'statisticsCtrl',
        authenticate: true,
        controllerAs: 'sc',
      });
  }
})();
