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
    .module('bsn.bsndashboard.networktemplate.actions')
    .factory('bsn.bsndashboard.networktemplate.actions.create.service', createService);

  createService.$inject = [
    'bsn.bsndashboard.networktemplate.resourceType',
    'horizon.app.core.openstack-service-api.bsnneutron',
    'horizon.framework.widgets.toast.service',
    '$modal',
    'horizon.framework.util.actions.action-result.service',
  ];

  /**
   * @ngDoc factory
   * @name horizon.app.core.images.actions.createService
   * @Description A service to open the user wizard.
   */
  function createService(
    resourceType,
    bsnneutron,
    toast,
    $modal,
    actionResultService
  ) {
    var message = {
      success: gettext('Template was successfully created.')
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
        controller: 'CreateNetTemplateController as ctrl',
        templateUrl: '/static/networktemplate/actions/create/createModal.html'
      };

      return $modal.open(localSpec).result.then(function create(result) {
        return submit(result);
      });
    }

    function submit(result) {
      return bsnneutron.networktemplate_create(result).then(onCreateTemplate);
    }

    function onCreateTemplate(response) {
      var newTemplate = response.data;
      toast.add('success', interpolate(message.success, [newTemplate.name]));
      return actionResultService.getActionResult()
        .created(resourceType, newTemplate.id)
        .result;
    }

  } // end of createService
})(); // end of IIFE
