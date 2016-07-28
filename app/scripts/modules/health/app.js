/**
 * @ngdoc overview
 * @name ngmReportHubApp
 * @description
 * # ngmReportHubApp
 *
 * Main module of the application.
 */
angular
	.module('ngmHealth', [])
	.config([ '$routeProvider', '$compileProvider', function ( $routeProvider, $compileProvider ) {

		// https://medium.com/swlh/improving-angular-performance-with-1-line-of-code-a1fb814a6476#.ufea9sjt1
		$compileProvider.debugInfoEnabled( false )

		// app routes with access rights
		$routeProvider
			.when( '/login', {
				redirectTo: '/health/login'
			})
			// health
			.when( '/health/login', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardLoginCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// health register
			.when( '/health/register', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardRegisterCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// health reset
			.when( '/health/find', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardResetCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// health reset with token
			.when( '/health/find/:token', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardResetCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAnonymous();
					}],
				}
			})
			// forbidden
			.when( '/health/forbidden', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardForbiddenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return !ngmAuth.isAuthenticated();
					}],
				}
			})
			// admin
			.when( '/health/admin', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardAdminCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.hasRole('ADMIN');
					}],
				}
			})
			// admin
			.when( '/health/admin/projects', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardAdminProjectsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.hasRole('ADMIN');
					}],
				}
			})
			// guides
			.when( '/health/guides', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesMenuCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// workshop
			.when( '/health/guides/workshop', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardWorkshopCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})			
			// feedback
			.when( '/health/guides/feedback', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesFeedbackCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})
			// screencasts
			.when( '/health/guides/screens', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardGuidesScreenCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
							return ngmAuth.grantPublicAccess();
					}],
				}
			})			
			// health project list
			.when( '/health/projects', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectAppCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health project summary
			.when( '/health/projects/summary/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectSummaryCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health project details
			.when( '/health/projects/details/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectDetailsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health project reports
			.when( '/health/projects/report/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectReportsListCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health project reports
			.when( '/health/projects/report/:project/:report', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectReportCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})			
			// health project financials
			.when( '/health/projects/financials/:project', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'ReportHealthProjectFinancialsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.isAuthenticated();
					}],
				}
			})
			// health dashboard
			.when( '/health/4w', {
				redirectTo: '/health/4w/afghanistan/all/all/all/2016-01-01/' + moment().format('YYYY-MM-DD')
			})
			// health dashboard
			.when( '/health/4w/:province/:district/:project/:beneficiaries/:start/:end', {
				templateUrl: '/views/app/dashboard.html',
				controller: 'DashboardHealthProjectsCtrl',
				resolve: {
					access: [ 'ngmAuth', function(ngmAuth) { 
						return ngmAuth.grantPublicAccess();
					}],
				}
			})

			// DEFAULT
			.otherwise({
				redirectTo: '/health/projects'
			});

	}]);