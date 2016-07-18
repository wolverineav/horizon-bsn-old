/**
 * Copyright 2015 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License. You may obtain
 * a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 */

(function() {
  'use strict';

  /**
   * @ngdoc reachabilityTestController
   * @ngController
   *
   * @description
   * Controller for reachability tests.
   * Serve as the focal point for table actions.
   */
  
  angular
    .module('horizon.dashboard.bsndashboard.reachabilitytests')
    .controller('TableController', tableController);

  tableController.$inject = [
    'horizon.framework.widgets.toast.service',
    'horizon.app.core.openstack-service-api.bsnneutron',
    '$modal',
    '$scope'

  ];

  function tableController(toastService, neutron, $modal) {
    var ctrl = this;

    neutron.reachabilitytest_list().success(
      function(items) {
        ctrl.tests = items.items;
      }
    );

    ctrl.createTest = function() {
      var localSpec = {
        backdrop: 'static',
        controller: 'CreateController as ctrl',
        templateUrl: '/static/dashboard/bsndashboard/reachabilitytests/create/createForm.html'
      };

      $modal.open(localSpec).result.then(function create(result) {
        return ctrl.createTestAction(result);
      });
    }

    ctrl.createTestAction = function(result) {
      neutron.reachabilitytest_create(result).then(
        function success() {
          toastService.add('success', interpolate(
            gettext('Test created.'), result, true
          ));

          //start here
          result.test_result = 'PENDING';
          ctrl.tests.push(result);

        }
      );
    }
  }

})();
