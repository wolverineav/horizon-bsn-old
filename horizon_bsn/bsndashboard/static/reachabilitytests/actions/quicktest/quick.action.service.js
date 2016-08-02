/**
 * (c) Copyright 2016 Hewlett-Packard Development Company, L.P.
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

  angular
    .module('bsn.bsndashboard.reachabilitytests.actions')
    .factory('bsn.bsndashboard.reachabilitytests.actions.quick.service', quickService);

  quickService.$inject = [
    'bsn.bsndashboard.reachabilitytests.resourceType',
    'horizon.app.core.openstack-service-api.bsnneutron',
    'horizon.framework.widgets.toast.service',
    '$modal',
    'horizon.framework.util.actions.action-result.service',
  ];

  /**
   * @ngDoc factory
   * @name horizon.app.core.images.actions.quickService
   * @Description A service to open the user wizard.
   */
  function quickService(
    resourceType,
    bsnneutron,
    toast,
    $modal,
    actionResultService
  ) {
    var message = {
      success: gettext('Quick Test was successfully created.')
    };

    var model = {};

    var service = {
      perform: perform,
      allowed: allowed
    };

    return service;

    //////////////
    function allowed() {
      var promise = new Promise(function (resolve) {
        resolve(true);
      });

      return promise;
    }

    function perform() {
      var localSpec = {
        backdrop: 'static',
        controller: 'QuickTestController as ctrl',
        templateUrl: '/static/reachabilitytests/actions/quicktest/quickModal.html'
      };

      return $modal.open(localSpec).result.then(function (result) {
        return submit(result);
      });
    }

    function submit(result) {
      return bsnneutron.reachabilityquicktest_create(result).then(onCreateTest);
    }

    function onCreateTest(response) {
      // need to run and give option to save
      var newTest = response.data;
      toast.add('success', interpolate(message.success, [newTest.name]));
      return actionResultService.getActionResult()
        .created(resourceType, newTest.id)
        .result;
    }

  } // end of quickService
})(); // end of IIFE
