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
  function statisticsController($log) {
    $log.debug('statisticsController');
    var s = this;

    $rootScope.currentPage = 'statistics';
  }
  /**
   * Tasks Config
   */
  // @ngInject
  function TasksConfig($stateProvider){
    console.log('Tasks Config');
    $stateProvider
      .state('statistics', {
        url: '/statistics',
        templateUrl: 'app/statistic/statistics.html',
        controller: 'statisticsCtrl',
        authenticate: false,
        controllerAs: 'sc',
      });
  }
})();
