;(function(){
  'use strict';

  angular.module('time.registration', [
    'time.dbc',
    'time.users',
  ])
  .config(registrationConfig)
  .controller('RegistrationCtrl', RegistrationController)
  .factory('registration', registrationFactory)


  // @ngInject
  function RegistrationController(registration, $rootScope)
  {
    var s = this;
    $rootScope.currentPage = 'registration';

    s.signinUser = {
      email: null,
      password: null
    };

    s.signin = function(){
      registration.signin(s.signinUser).then(function(){
      });
    }

    s.signupUser = {
      email: null,
      password: null,
      name: null,
      surname: null
    };

    s.signup = function(){
    registration.signup(s.signupUser).then(function(){

      });
    }

  }

  // @ngInject
  function registrationFactory(dbc, $rootScope, users){
    var o = {};
    var auth = dbc.get$Auth();

    $rootScope.logout = function(){
      auth.$unauth();
    };

    auth.$onAuth(function(authData){
      if (authData) {// Logged in
        console.log('$onAuth: Logged in ', authData);
        users.getUser(authData.uid).then(function(_user){
          $rootScope.currentUser = {
            loggedIn: true,
            fullname: _user.name + ' ' + _user.surname
          };
          $rootScope.currentID = authData.uid;

        })
      }else{// Logged out
        console.log('$onAuth: Logged out');
        $rootScope.currentUser = {
          loggedIn: false,
          fullname: null
        };
      }
    });

    o.signin = function(_user){
      return auth.$authWithPassword(_user);
    }

    o.signup = function(_user){
      return auth.$createUser({
        email   : _user.email,
        password: _user.password
      }).then(function(userData){
        console.log('User ' + userData.uid + ' created successfully!');
        var userRef = dbc.getRef().child('users').child(userData.uid);
        userRef.set({
          name: _user.name,
          surname: _user.surname,
          email: _user.email,
          registered: Firebase.ServerValue.TIMESTAMP,
          last_visit: Firebase.ServerValue.TIMESTAMP
        });
        return auth.$authWithPassword({
          email   : _user.email,
          password: _user.password
        });
      });
    }

    return o;
  }

  // @ngInject
  function registrationConfig($stateProvider){
    $stateProvider
    .state('signin', {
      url: '/signin',
      templateUrl: 'app/registration/signin.html',
      controller: 'RegistrationCtrl',
      authenticate: false,
      controllerAs: 'rc'
    })
    .state('signup', {
      url: '/signup',
        templateUrl: 'app/registration/signup.html',
        controller: 'RegistrationCtrl',
        authenticate: false,
        controllerAs: 'rc'
      });
  }

})();
