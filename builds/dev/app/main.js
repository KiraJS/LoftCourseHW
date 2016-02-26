;
(function() {
  'use strict';

  angular
    .module('time', [
      'ui.router',
      'ui.bootstrap',
      'time.home',
      'time.statistics',
      'time.users',
      'time.registration',
      'time.dbc',
    ])
    .constant('FURL', 'https:ç//timedem.firebaseio.com/')
    .controller('MainCtrl', MainController)
    .run(MainRun)
    .config(MainConfig);

  // @ngInject
  function MainController($rootScope) {
    var s = this;

    s.hello_message = "Привет, мир!";
    $rootScope.root = 'Root 1';
  }

  // @ngInject
  function MainRun($log, $rootScope, $state, $stateParams, dbc) {
    $log.debug('Main Run');

    $rootScope.alerts = [];
    $rootScope.addAlert = function(_msg, _type) {
      _type = _type || 'warning';
      $rootScope.alerts.push({
        msg: _msg,
        type: _type
      });
    };

    $rootScope.closeAlert = function(index) {
      $rootScope.alerts.splice(index, 1);
    };

    $rootScope.$on('$stateChangeStart',
        function(event, toState, toParams, fromState, fromParams) {
          //console.log('toState:',toState, 'toParams:',toParams, 'fromState:',fromState, 'fromParams:',fromParams);
          if (toState.authenticate && !dbc.isLogin()) {
            $state.transitionTo('signin');
            $rootScope.isLoggin = false;
            event.preventDefault();
          } else if (!toState.authenticate && dbc.isLogin()) {
            $rootScope.isLoggin = true;
            //$state.transitionTo('home');
            //event.preventDefault();
          } else if (!toState.authenticate && !dbc.isLogin()) {
            //$state.transitionTo('home');
            //event.preventDefault();
          }
        });

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;

  }

  // @ngInject
  function MainConfig($urlRouterProvider, $logProvider) {
    console.log('Main Config');
    $urlRouterProvider.otherwise('/home');
    $logProvider.debugEnabled(false);
  }

})();
