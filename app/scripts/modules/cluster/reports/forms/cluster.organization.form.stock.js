/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ClusterOrganizationStockForm
 * @description
 * # ClusterOrganizationStockForm
 * Controller of the ngmReportHub
 */

angular.module( 'ngm.widget.organization.stock', [ 'ngm.provider' ])
  .config( function( dashboardProvider ){
    dashboardProvider
      .widget('organization.stock', {
        title: 'Cluster Stock Reports Form',
        description: 'Cluster Stock Reports Form',
        controller: 'ClusterOrganizationStockForm',
        templateUrl: '/scripts/modules/cluster/views/forms/stock/form.html'
      });
  })
  .controller( 'ClusterOrganizationStockForm', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    '$route',
    'ngmUser',
    'ngmData',
    'ngmClusterHelper',
    'config',
    function( $scope, $location, $timeout, $filter, $q, $http, $route, ngmUser, ngmData, ngmClusterHelper, config ){

      // project
      $scope.report = {

        // user
        user: ngmUser.get(),
        // app style
        style: config.style,
        // form
        submit: true,
        // project
        organization: config.organization,
        // report
        report: config.report,
        // last update
        updatedAt: moment( config.report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' ),
        // last update
        titleFormat: moment( config.report.reporting_period ).format('MMMM, YYYY'),

        templatesUrl: '/scripts/modules/cluster/views/forms/stock/',
        locationsUrl: 'locations.html',
        stocksUrl: 'stocks.html',
        stockUrl: 'stock.html',
        notesUrl: 'notes.html',

        // lists
        lists: {
          stocks: ngmClusterHelper.getStocks( config.organization.cluster_id, [] )
        },

        // cancel and delete empty project
        cancel: function() {
          // update
          $timeout(function() {
            // Re-direct to summary
            $location.path( '/cluster/stocks/');
          }, 200);
        },

        // add stock
        addStock: function( $parent ) {
          $scope.inserted = {
            stock_item_type: null,
            stock_item_name: null,
            number_in_stock:0, number_in_pipeline:0, beneficiaries_covered:0
          };
          // process + clean location
          $scope.inserted = 
              ngmClusterHelper.getCleanStocks( $scope.report.report, $scope.report.report.stocklocations[ $parent ], $scope.inserted );
          $scope.report.report.stocklocations[ $parent ].stocks.push( $scope.inserted );
        },

        // show stock type
        showStockType: function( $data, $stock ){
          var selected = [];
          $stock.stock_item_type = $data;
          if($stock.stock_item_type) {
            selected = $filter('filter')( $scope.report.lists.stocks, { stock_item_type: $stock.stock_item_type }, true);
            $stock.stock_item_name = selected[0].stock_item_name;
          }
          return selected.length ? selected[0].stock_item_name : 'No Selection!';
        },

        // update inidcators
        updateInput: function( $parent, $index, indicator, $data ){
          $scope.report.report.stocklocations[$parent].stocks[ $index ][ indicator ] = $data;
        },

        // disable save form
        rowSaveDisabled: function( $data ){
          var disabled = true;
          if ( $data.stock_item_type &&
                $data.number_in_stock >= 0 && $data.number_in_pipeline >= 0 && $data.beneficiaries_covered >= 0 ) {
              disabled = false;
          }
          return disabled;
        },

        // save form on enter
        keydownSaveForm: function(){
          setTimeout(function(){
            $('.editable-input').keydown(function (e) {
              var keypressed = e.keyCode || e.which;
              if (keypressed == 13) {
                $('.save').trigger('click');
              }
            });
          }, 0 );
        },

        // add stock
        // addStock: function( $index ) {

        //   // init load is null
        //   if ( $scope.report.options.stocks[ $index ] ) {
            
        //     // process + clean location
        //     var stocks = 
        //         ngmClusterHelper.getCleanStocks( $scope.report.report, $scope.report.report.stocklocations[ $index ], $scope.report.options.stocks[ $index ] );

        //     // push to stocks
        //     $scope.report.report.stocklocations[ $index ].stocks.push( stocks );

        //     // clear selection
        //     $scope.report.options.stocks[ $index ] = {};

        //     // filter / sort stocks
        //     $scope.report.options.list.stocks[ $index ]
        //         = ngmClusterHelper.getStocks( $scope.report.organization.cluster_id, $scope.report.report.stocklocations[ $index ].stocks );

        //     // update material select
        //     ngmClusterHelper.updateSelect();

        //   }

        // },

        // remove stocks
        removeStock: function( $parent, $index ) {
          $scope.report.report.stocklocations[ $parent ].stocks.splice( $index, 1 );
          // save
          $scope.project.save( false );
        },

        // cofirm exit if changes
        modalConfirm: function( modal ){

          // if not pristine, confirm exit
          if ( modal === 'complete-modal' ) {
            $( '#' + modal ).openModal( { dismissible: false } );
          } else {
            $scope.report.cancel();
          }

        },

        // determine if all locations containt at least one beneficiaries details 
        formComplete: function() {
          var valid = false;
          angular.forEach( $scope.report.report.stocklocations, function( l ){
            angular.forEach( l.stocks, function( b ){
              if ( !$scope.report.rowSaveDisabled( b ) ) {
                valid = true;
              }
            });
          });
          return valid;
        },

        // enable edit report
        editReport: function(){
          $scope.report.report.report_status = 'todo';
          $scope.report.save( false, false );
        },

        // save 
        save: function( complete, display_modal ) {

          // disable btn
          $scope.report.submit = false;

          // set to complete if "submit monthly report"
          $scope.report.report.report_status = complete ? 'complete' : 'todo';

          // time submitted
          $scope.report.report.report_submitted = moment().format();

          // msg
          Materialize.toast( 'Processing Stock Report...' , 3000, 'note');

          // setReportRequest
          var setReportRequest = {
            method: 'POST',
            url: 'http://' + $location.host() + '/api/cluster/stock/setReport',
            data: {
              report: $scope.report.report
            }
          }

          // set report
          ngmData.get( setReportRequest ).then( function( report ){
            // report
            $scope.report.updatedAt = moment( report.updatedAt ).format( 'DD MMMM, YYYY @ h:mm:ss a' );        
            
            // enable
            $scope.report.submit = true;  

            // user msg
            var msg = 'Stock Report for  ' + $scope.report.titleFormat + ' ';
                msg += complete ? 'Submitted!' : 'Saved!';

            // msg
            Materialize.toast( msg , 3000, 'success');

            // Re-direct to summary
            if ( $scope.report.report.report_status !== 'complete' ) {
              // avoids duplicate beneficiaries 
                // ( if 'save' and then 'submit' is submited without a refresh in between ) ???
              // Not if you do it properly (return and set with .populate()!)
              // $route.reload();
              console.log(display_modal)
              if(display_modal){
                // update
                $timeout(function() {
                  // Re-direct to summary
                  $location.path( '/cluster/stocks/');
                }, 200);
              } else {
                $timeout(function() {
                  $route.reload();
                }, 200);
              }
            } else {
              $timeout(function() {
                $location.path( '/cluster/stocks');
              }), 200;
            }

          });

        }
      }
  }

]);

