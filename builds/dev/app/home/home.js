;
(function() {
  'use strict';

  angular
    .module('time.home', [])
    .controller('HomeCtrl', HomeController)
    .run( /*@ngInject*/ function($log) {
      $log.debug('Home Run')
    })
    .config(HomeConfig)
    .factory('tasks', tasksFactory)



  /**
   * Home Factory
   */
  // @ngInject
  function tasksFactory($q, $http, dbc, $firebaseArray, $firebaseObject, registration, $rootScope) {
    var o = {};

    var ref = dbc.getRef();
    var authRef = dbc.isLogin();
    var curUserRef = authRef.uid;
    var usersRef = ref.child('users');
    var userRef = usersRef.child(curUserRef);
    var userTasks = userRef.child('tasks');



    var tasks = [];

    o.getAllTasks = function() {
      tasks = $firebaseArray(userTasks);
      return tasks;
    }
    o.addNewTask = function(_newTask) {
      tasks.$add({
        name: _newTask.name,
        time: _newTask.time,
        cost: _newTask.cost
      })
    }
    o.deletTask = function(_task) {
      var taskID = _task.$id;
      return $firebaseObject(userTasks.child(taskID)).$remove();
    }
    o.saveNewName = function(_editTask, _newName) {
      var THISTASK = _editTask.$id
      var obj = $firebaseObject(userTasks.child(THISTASK))
      obj.name = _newName;
      obj.time = _editTask.time;
      obj.cost = _editTask.cost;
      obj.$save().then(function() {});
    }
    return o;
  }

  /**
   * Home Controller
   */
  // @ngInject

  function HomeController($scope, $log, $rootScope, $interval, tasks) {

    $log.debug('HomeController');
    var s = this;

    s.timer = "00:00:00";

    s.tasks = tasks.getAllTasks();
    s.newTask = {
      name: null,
      time: null,
      cost: null
    };
    s.newTaskName = null;
    s.editTASK = null;
    s.editIndex = null;
    s.hideEditingInput = false;

    var startDate, curDate, curTimerStart, timerVal, timer = null;

    s.startBtnText = 'Начать';

    s.start = function(projectCost) {
      if (timer) {
        $interval.cancel(timer);
        timer = null;
        timerVal = timerVal + curDate;
        s.startBtnText = 'Продолжить';
      } else {
        if (!startDate) {
          startDate = new Date();
          timerVal = 0;
        }
        curTimerStart = new Date();
        timer = $interval(function() {
          curDate = new Date() - curTimerStart;
          s.timer = timerVal + curDate;
        }, 1000);
        s.startBtnText = 'Пауза';
      }
    };

    s.reset = function() {
      if (timer) {
        $interval.cancel(timer);
        timer = null;
      }
      s.saveTask();
      s.startBtnText = 'Начать';
    }

    s.saveTask = function() {
      s.newTask.time = s.timer;
      tasks.addNewTask(s.newTask);
      s.newTask = {
        name: null,
        time: null,
        cost: null
      };
      s.timer = "00:00:00";
    }
    s.deletTask = function(_d) {
      tasks.deletTask(_d)
    }
    s.editTask = function(_task, _index) {
      s.editTASK = _task;
      s.editIndex = _index;
      s.hideEditingInput = false;


      console.log("editTaskFunction", s.editTASK, _index)

    }
    s.doneEditing = function() {
      console.log("doneEditingFunction", s.newTaskName)
      tasks.saveNewName(s.editTASK, s.newTaskName);
      s.newTaskName = null;
      s.editTASK = null;
      s.hideEditingInput = true;

    }
    s.showEditingInput = function(_index){
      if (s.editIndex == _index){
        return true;
      }
      else {
        return false;
      }

    }


    $rootScope.currentPage = 'home';
  };


  // @ngInject
  function HomeConfig($stateProvider) {
    console.log('Home Config');
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl',
        authenticate: true,
        controllerAs: 'hc'
      });
  }
})();
