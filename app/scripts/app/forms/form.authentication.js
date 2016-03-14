/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ProjectFinancialsCtrl
 * @description
 * # ProjectFinancialsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.form.authentication', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('form.authentication', {
        title: 'ReportHub Authentication Form',
        description: 'ReportHub Authentication Form',
        controller: 'AuthenticationFormCtrl',
        templateUrl: '/views/app/authentication/view.html'
      });
  })
  .controller('AuthenticationFormCtrl', [
    '$scope',
    '$location',
    '$timeout',
    'ngmAuth',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, ngmAuth, ngmUser, ngmData, config){

      // project
      $scope.panel = {

        // error
        error:{
          msg: ''
        },

        // login fn
        login: function(ngmLoginForm){

          // if invalid
          if(ngmLoginForm.$invalid){
            // set submitted for validation
            ngmLoginForm.$setSubmitted();
          } else {
            // login
            ngmAuth.login({ user: $scope.panel.user }).success(function(result) { 
              
              // go to default org page 
              $location.path( '/' + result.app_home );

              // user toast msg
              $timeout(function(){
                Materialize.toast('Welcome back ' + result.username + '!', 3000, 'note');
              }, 2000);

            }).error(function(err) {
              // update 
              $scope.panel.error = {
                msg: 'Email/password incorrect!'
              }
            });
          }
        },

        // register fn
        register: function(ngmRegisterForm){

          // if $invalid
          if(ngmRegisterForm.$invalid){
            // set submitted for validation
            ngmRegisterForm.$setSubmitted();
          } else {
            // register
            ngmAuth.register({ user: $scope.panel.user }).success(function(result) {
              
              // go to default org page
              $location.path( '/' + result.app_home );

              // user toast msg
              $timeout(function(){
                Materialize.toast('Welcome ' + result.username + ', time to create a Project!', 3000, 'success');
              }, 2000);

            }).error(function(err) {
              // update 
              $scope.panel.error = {
                msg: 'There has been an error!'
              }
            });            
          }
        },

        // register fn
        passwordResetSend: function(ngmResetForm){

          // if $invalid
          if(ngmResetForm.$invalid){
            // set submitted for validation
            ngmResetForm.$setSubmitted();
          } else {

            // user toast msg
            $timeout(function(){
              Materialize.toast('Your email is being prepared!', 3000, 'note');
            }, 1000);            

            // resend password email
            ngmAuth.passwordResetSend({ user: $scope.panel.user, url: 'http://' + $location.host() + '/#/health/find/' }).success(function(result) {
              
              // go to default org page
              $scope.panel.reset = true;

              // user toast msg
              $timeout(function(){
                Materialize.toast('Email sent!', 3000, 'success');
              }, 400);

            }).error(function(err) {

              // go to default org page
              $scope.panel.reset = true;

              // user toast msg
              $timeout(function(){
                Materialize.toast('Account not found!', 3000);
              }, 400);              

              // update 
              $scope.panel.error = {
                msg: 'There has been a error!'
              }
            });
          }

        },

        // register fn
        passwordReset: function(ngmResetPasswordForm, token){

          // if $invalid
          if(ngmResetPasswordForm.$invalid){
            // set submitted for validation
            ngmResetPasswordForm.$setSubmitted();
          } else {
            // register
            ngmAuth.passwordReset({ reset: $scope.panel.user, token: token }).success(function(result) {

              // go to default org page 
              $location.path( '/' + result.app_home );

              // user toast msg
              $timeout(function(){
                Materialize.toast('Welcome back ' + result.username + '!', 3000, 'note');
              }, 2000);


            }).error(function(err) {
              // update 
              $scope.panel.error = {
                msg: 'There has been an error!'
              }
            });
          }

        }        

      }

      // Merge defaults with config
      $scope.panel = angular.merge({}, $scope.panel, config);

    }

]);
