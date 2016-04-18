/**
 * @ngdoc function
 * @name ngmReportHubApp.controller:ReportHealthProjectFormDetailsCtrl
 * @description
 * # ReportHealthProjectFormDetailsCtrl
 * Controller of the ngmReportHub
 */

angular.module('ngm.widget.project.details', ['ngm.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('project.details', {
        title: 'Health Project Details Form',
        description: 'Display Health Project Details Form',
        controller: 'ProjectDetailsCtrl',
        templateUrl: '/views/modules/health/forms/details/form.html'
      });
  })
  .controller('ProjectDetailsCtrl', [
    '$scope',
    '$location',
    '$timeout',
    '$filter',
    '$q',
    '$http',
    'ngmUser',
    'ngmData',
    'config',
    function($scope, $location, $timeout, $filter, $q, $http, ngmUser, ngmData, config){

      // get currency exchange
      // ngmData.get({
      //   method: 'GET',
      //   externalApi: true,
      //   url: 'http://www.apilayer.net/api/live?access_key=1106b426ad52b3fefced5ee9ac6beabc&currencies=USD,AFN&format=1'
      // }).then(function(data){

      //   // set live exchange
      //   $scope.project.exchange = data.quotes;

      // });

      // project
      $scope.project = {

        // user
        user: ngmUser.get(),

        // app style
        style: config.style,

        // exchange rate
        exchange: {
          USDUSD: 1,
          USDAFN: 68.61          
        },

        // project
        definition: config.project,

        // last update
        updatedAt: moment( config.project.updatedAt ).format('DD MMMM, YYYY @ h:mm:ss a'),

        // holder for UI options
        options: {
          list: {
            // beneficiaries
            beneficiaries: [{
              beneficiary_type: 'conflict_displaced',
              beneficiary_name: 'Conflict Displaced'
            },{
              beneficiary_type: 'health_affected_conflict',
              beneficiary_name: 'Health Affected by Conflict'
              
            },{
              beneficiary_type: 'refugees_returnees',
              beneficiary_name: 'Refugees & Returnees'
              
            },{
              beneficiary_type: 'natural_disaster_affected',
              beneficiary_name: 'Natural Disaster Affected'
            },{
              beneficiary_type: 'public_health',
              beneficiary_name: 'Public Health at Risk'
            },{
              beneficiary_type: 'white_area_population',
              beneficiary_name: 'White Area Population'
            }],

            // facility type
            facility_type: [{
              fac_type: 'RH',
              fac_name: 'RH'
            },{
              fac_type: 'PH',
              fac_name: 'PH'
            },{
              fac_type: 'DH',
              fac_name: 'DH'
            },{
              fac_type: 'CHC',
              fac_name: 'CHC'
            },{
              fac_type: 'BHC',
              fac_name: 'BHC'
            },{
              fac_type: 'SHC',
              fac_name: 'SHC'
            },{
              fac_type: 'MHT',
              fac_name: 'MHT'
            },{
              fac_type: 'FATP',
              fac_name: 'FATP'
            },{
              fac_type: 'DATC',
              fac_name: 'DATC'
            },{
              fac_type: 'rehabilitation_center',
              fac_name: 'Rehabilitation Center'
            },{
              fac_type: 'special_hospital',
              fac_name: 'Special Hospital'
            },{
              fac_type: 'BHC+FATP',
              fac_name: 'BHC + FATP'
            },{
              fac_type: 'CHC+FATP',
              fac_name: 'CHC + FATP'
            }]

          },
          filter: {},
          selection: {
            target_beneficiaries: [],
          }
        },

        // details template
        detailsUrl: '/views/modules/health/forms/details/details.html',

        // budget
        budgetUrl: '/views/modules/health/forms/details/budget.html',

        // target beneficiaries
        targetBeneficiariesUrl: '/views/modules/health/forms/details/target-beneficiaries.html',

        // details template
        locationsUrl: '/views/modules/health/forms/details/target-locations.html',

        // details template
        // beneficiariesUrl: '/views/modules/health/forms/details/beneficiaries.html',      

        // currency on budget exchange
        // budgetKeyUp: function( update ){

        //   // if usd
        //   if ( update === 'usd' ) {
        //     // update afn with currency
        //     var exchange = parseInt( ( $scope.project.definition.project_budget_usd * $scope.project.exchange.USDAFN ).toFixed(0) );
        //     $scope.project.definition.project_budget_afn = exchange;
        //   }

        //   // if afn
        //   if ( update === 'afn' ) {
        //     // update afn with currency
        //     var exchange = parseInt( ( $scope.project.definition.project_budget_afn / $scope.project.exchange.USDAFN ).toFixed(0) );
        //     $scope.project.definition.project_budget_usd = exchange;
        //   }

        // },

        // add target benficiaries
        addTargetBeneficiary: function() {

          // copy selection
          var target_beneficiary = angular.copy( $scope.project.options.selection.target_beneficiaries );

          // push to beneficiaries
          $scope.project.definition.target_beneficiaries.unshift({
            organization_id: config.project.organization_id,
            organization: config.project.organization,
            username: ngmUser.get().username,
            email: ngmUser.get().email,
            beneficiary_name: target_beneficiary.beneficiary_name,
            beneficiary_type: target_beneficiary.beneficiary_type,
            under5male: 0,
            under5female: 0,
            over5male: 0,
            over5female: 0,
            penta3_vacc_male_under1: 0,
            penta3_vacc_female_under1: 0,
            skilled_birth_attendant: 0,
            conflict_trauma_treated: 0
          });

          // clear selection
          $scope.project.options.selection.target_beneficiaries = {};

          // filter list
          $scope.project.options.filter.target_beneficiaries = $filter( 'filter' )( $scope.project.options.filter.target_beneficiaries, { beneficiary_type: '!' + target_beneficiary.beneficiary_type }, true);

          // update dropdown
          $timeout(function(){
            // apply filter
            $( '#ngm-target_beneficiary-category' ).material_select( 'update' );
          }, 10);

        },

        // remove target beneficiary
        removeTargetBeneficiary: function( $index ) {

          // add option to selection
          $scope.project.options.filter.target_beneficiaries.push({
            'beneficiary_type': $scope.project.definition.target_beneficiaries[$index].beneficiary_type,
            'beneficiary_name': $scope.project.definition.target_beneficiaries[$index].beneficiary_name,
          });

          // remove location at i
          $scope.project.definition.target_beneficiaries.splice( $index, 1 );

          // sort
          $filter('orderBy')($scope.project.options.filter.target_beneficiaries, '-beneficiary_type');
          
          // update dropdown
          $timeout(function(){
            // apply filter
            $( '#ngm-target_beneficiary-category' ).material_select('update');
          }, 10);

        }, 

        // apply location dropdowns
        locationSelect: function(id, select) {

          var disabled;

          switch(select) {

            case 'district':
              
              // disabled
              disabled = !$scope.project.options.selection.province;

              // filter districts
              $scope.project.options.filter.districts = $filter('filter')( $scope.project.options.list.districts, { prov_code: $scope.project.options.selection.province.prov_code }, true );

              // disable/enable
              $( id ).prop( 'disabled', disabled );

              // update dropdown
              $timeout(function(){
                $( id ).material_select( 'update' );
              }, 100);

              break;

            case 'hf_type':
              
              // disabled
              disabled = !$scope.project.options.selection.district;

              // alert user if conflict district selected
              if( $scope.project.options.selection.district.conflict ){
                Materialize.toast('Alert! ' + $scope.project.options.selection.district.dist_name + ' is listed as a conflict district', 3000);
              }

              // reset dropdowns
              $scope.project.resetLocationSelect( false, false, true, true );

              // disable/enable
              $( id ).prop( 'disabled', disabled );

              // update dropdown
              $timeout(function(){
                $( id ).material_select( 'update' );
              }, 100);              

              break;

            case 'hf_name':
              
              // disabled
              disabled = !$scope.project.options.selection.hf_type;

              // disable/enable
              $( id ).prop( 'disabled', disabled );              

              break;

          }

        },       

        // add location
        addLocation: function(){

          // push location to target_locations
          $scope.project.definition.target_locations.unshift({
            organization_id: config.project.organization_id,
            organization: config.project.organization,
            username: ngmUser.get().username,
            email: ngmUser.get().email,
            project_title: $scope.project.definition.project_title,
            project_type: $scope.project.definition.project_type,
            prov_code: $scope.project.options.selection.province.prov_code,
            prov_name: $scope.project.options.selection.province.prov_name,
            dist_code: $scope.project.options.selection.district.dist_code,
            dist_name: $scope.project.options.selection.district.dist_name,
            conflict: $scope.project.options.selection.district.conflict,
            fac_type: $scope.project.options.selection.hf_type.fac_type,
            fac_name: $scope.project.options.selection.hf_name,
            lng: $scope.project.options.selection.district.lng,
            lat: $scope.project.options.selection.district.lat
          });

          // refresh dropdown options
          $scope.project.resetLocationSelect( true, true, true, true );

        },

        // remove location from location list
        removeLocation: function($index) {
          // remove location at i
          $scope.project.definition.target_locations.splice($index, 1);
          // refresh dropdown options
          $scope.project.resetLocationSelect( true, true, true, true );

        },        

        // refresh dropdown options
        resetLocationSelect: function( province, district, hf_type, hf_name ){

          // reset province
          if ( province ){
            // reset select option
            $scope.project.options.selection.province = {};
            $scope.project.options.list.provinces = angular.fromJson(localStorage.getItem('provinceList'));
            // reset dropdown
            $('#ngm-project-province').prop('selectedIndex',0);
            $timeout(function() {
              // update
              $('#ngm-project-province').material_select('update');
            }, 10);
          }

          // reset district
          if ( district ){
            // reset select option
            $scope.project.options.selection.district = {};
            $scope.project.options.list.districts = angular.fromJson( localStorage.getItem( 'districtList' ) );
            // refresh dropdown
            $('#ngm-project-district').prop( 'selectedIndex', 0 );
            $('#ngm-project-district').prop( 'disabled', true );
            $timeout(function() {
              // update
              $('#ngm-project-district').material_select('update');
            }, 10);
          }

          // reset facility type
          if ( hf_type ){

            // reset select option
            $scope.project.options.selection.hf_type = {};
            // refresh dropdown
            $( '#ngm-project-hf_type' ).prop( 'selectedIndex', 0 );
            $( '#ngm-project-hf_type' ).prop( 'disabled', true );
            $timeout(function() {
              // update
              $( '#ngm-project-hf_type' ).material_select( 'update' );
            }, 10);
            
          }

          // reset facility name
          if ( hf_name ) {
            
            // reset select option
            $scope.project.options.selection.hf_name = '';
            // set disabled            
            $( '#ngm-project-hf_name' ).prop( 'disabled', true );
          }          

        },

        // cofirm exit if changes
        modalConfirm: function(modal){

          // if not pristine, confirm exit
          if( $scope.healthProjectForm.$dirty ){
            $( '#' + modal ).openModal( { dismissible: false } );
          } else{
            $scope.project.cancel();
          }

        },

        // save project
        save: function(){

          // reset to cover updates
          $scope.project.definition.prov_code = [];
          $scope.project.definition.dist_code = [];
          $scope.project.definition.beneficiary_type = [];
          // explode by ","
          // $scope.project.definition.implementing_partners = $scope.project.definition.implementing_partners.split(',');

          // add target_beneficiaries to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_beneficiaries, function( b, i ){

            // push location ids to project
            $scope.project.definition.beneficiary_type.push( b.beneficiary_type );

          });           

          // add target_locations to projects to ensure simple filters
          angular.forEach( $scope.project.definition.target_locations, function( l, i ){

            // push location ids to project
            $scope.project.definition.prov_code.push(l.prov_code);
            $scope.project.definition.dist_code.push(l.dist_code);

          });         

          // open success modal if valid form
          if ( $scope.healthProjectForm.$valid ) {

            // details update
            ngmData.get({
              method: 'POST',
              url: 'http://' + $location.host() + '/api/health/project/setProject',
              data: {
                project: $scope.project.definition
              }
            }).then(function(project){

              // add id to client json
              $scope.project.definition.id = project.id;

              // notification modal
              $('#save-modal').openModal({ dismissible: false });
            });

          } else {
            
            // form validation takes over
            $scope.healthProjectForm.$setSubmitted();
            // inform
            Materialize.toast('Please review the form for errors and try again!', 3000);

          }

        },

        // re-direct on save
        redirect: function(){

          // new becomes active!
          if( $scope.project.definition.project_status === 'new' ) {
            var msg = $scope.project.definition.project_title + ' created!';
          } else {
            var msg = $scope.project.definition.project_title + ' updated!';
          }

          // redirect on success
          $timeout(function(){
            $location.path( '/health/projects/summary/' + $scope.project.definition.id );
            Materialize.toast( msg, 3000, 'success');
          }, 200);

        },

        // cancel and delete empty project
        cancel: function() {
          
          // update
          $timeout(function() {

            // if new
            if($scope.project.definition.project_status === 'new') {
              
              // Re-direct to list
              $location.path( '/health/projects' );
              Materialize.toast( 'Create Project cancelled!', 3000, 'note' );

            } else {

              // Re-direct to summary
              $location.path( '/health/projects/summary/' + $scope.project.definition.id );
              if( $scope.project.definition.project_status !== 'complete' ) {
                Materialize.toast( 'Project update cancelled!', 3000, 'note' );
              }
            }

          }, 100);

        },

        // set start datepicker
        setStartTime: function() {
            
          // set element
          $scope.$input = $('#ngm-start-date').pickadate({
            selectMonths: true,
            selectYears: 15,
            format: 'dd mmm, yyyy',
            onStart: function(){
              $timeout(function(){
                // set time
                var date = moment($scope.project.definition.project_start_date).format('YYYY-MM-DD');
                $scope.project.startPicker.set('select', date, { format: 'yyyy-mm-dd' } );

              }, 10)
            },          
            onSet: function(event){
              // close on date select
              if(event.select){
                // get date
                var selectedDate = moment(event.select);
                // check dates
                if ( (selectedDate).isAfter($scope.project.definition.project_end_date) ) {
                  // inform
                  Materialize.toast('Please check the dates and try again!', 3000);
                  // reset time
                  $scope.project.startPicker.set('select', moment($scope.project.definition.project_start_date).format('X'))

                } else {
                  // set date
                  $scope.project.definition.project_start_date = moment(selectedDate).format('YYYY-MM-DD');
                }
                // close
                $scope.project.startPicker.close();

              }

            }

          });        

          //pickadate api
          $scope.project.startPicker = $scope.$input.pickadate('picker');
          // on click
          $('#ngm-start-date').bind('click', function($e) {
            // open
            $scope.project.startPicker.open();
          });

        },

        // set end datepicker
        setEndTime: function() {
            
          // set element
          $scope.$input = $('#ngm-end-date').pickadate({
            selectMonths: true,
            selectYears: 15,
            format: 'dd mmm, yyyy',
            onStart: function(){
              $timeout(function(){
                // set time
                var date = moment($scope.project.definition.project_end_date).format('YYYY-MM-DD');
                $scope.project.endPicker.set('select', date, { format: 'yyyy-mm-dd' } );

              }, 10)
            },           
            onSet: function(event){
              // close on date select
              if(event.select){
                // get date
                var selectedDate = moment(event.select);

                // check dates
                if ( selectedDate && (selectedDate).isBefore($scope.project.definition.project_start_date) ) {
                  // inform
                  Materialize.toast('Please check the dates and try again!', 3000);
                  // reset time
                  $scope.project.endPicker.set('select', moment($scope.project.definition.project_end_date).format('X'))

                } else {
                  // set date
                  $scope.project.definition.project_end_date = moment(selectedDate).format('YYYY-MM-DD');
                }
                // close
                $scope.project.endPicker.close();

              }

            }

          });        

          //pickadate api
          $scope.project.endPicker = $scope.$input.pickadate('picker');
          // on click
          $('#ngm-end-date').bind('click', function($e) {
            //open
            $scope.project.endPicker.open();
          });
          
        }    

      }

      // on page load
      angular.element(document).ready(function () {

        // give a few seconds to render
        $timeout(function() {

          // selects
          $('select').material_select();

          // modals
          $('.modal-trigger').leanModal();

          // init start date
          $scope.project.setStartTime();

          // init end date
          $scope.project.setEndTime();

          // menu return to list
          $('#go-to-project-list').click(function(){
            $scope.project.cancel();
          });

          // maximise text area
          if ( $scope.project.definition.project_description ) {
            $( 'textarea' ).height( $('textarea')[0].scrollHeight );
          }

          // refresh dropdown options
          $scope.project.resetLocationSelect( true, true, true, true );

          // order target_locations by latest updated
          $scope.project.definition.target_locations = $filter( 'orderBy' )( $scope.project.definition.target_locations, '-createdAt' );


          // fix multiple select 
          if ( $scope.project.definition.project_type ) {
            
            // little fix for materialize, update select multiple
            var type_display = '';
            var type_select = $( '#ngm-project-type' ).parent().find( '.select-dropdown' );

            // get display value
            angular.forEach( $scope.project.definition.project_type, function( d ){
              type_display += d.toUpperCase().replace( '_', ' ' ) + ', '
            });
            
            // slice last 2 
            type_display = type_display.slice( 0, -2 );
            
            // set display value
            type_select.val( type_display );

            // update dropdown UI
            // type_select.find('li').each(function(i, el){
            //   var type = $(el).text();
            //   // update class
            //   angular.forEach( $scope.project.definition.project_type, function(d){
            //     if (d.toUpperCase() === type ) {
            //       $(el).toggleClass('active');
            //       $(el).find('input').prop( 'checked', true );
            //     }
            //   });
            // });
          }


          // fix multiple select 
          if ( $scope.project.definition.project_donor ) {
            // little fix for materialize, update select multiple
            var donor_display = '';
            var donor_select = $( '#ngm-project-donor' ).parent().find('.select-dropdown');

            // get display value
            angular.forEach( $scope.project.definition.project_donor, function(d){
              donor_display += d.toUpperCase() + ', '
            });
            // slice last 2 
            donor_display = donor_display.slice(0, -2);
            // set display value
            donor_select.val(donor_display);

            // update dropdown UI
            // donor_select.find('li').each(function(i, el){
            //   var donor = $(el).text();
            //   // update class
            //   angular.forEach( $scope.project.definition.project_donor, function(d){
            //     if (d.toUpperCase() === donor ) {
            //       $(el).toggleClass('active');
            //       $(el).find('input').prop( 'checked', true );
            //     }
            //   });
            // });
          }


          // set list
          $scope.project.options.filter.target_beneficiaries = $scope.project.options.list.beneficiaries;

          // // update dropdown
          $timeout(function(){
            $( '#ngm-target_beneficiary-category' ).material_select('update');
          }, 10);

        }, 1000);

      });
  }

]);
