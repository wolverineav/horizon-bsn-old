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
    .factory('bsn.bsndashboard.networktemplate.actions.update.service', updateTemplateService);

  updateTemplateService.$inject = [
    'bsn.bsndashboard.networktemplate.resourceType',
    'horizon.app.core.openstack-service-api.bsnneutron',
    'horizon.framework.widgets.toast.service',
    '$modal',
    'horizon.framework.util.actions.action-result.service',
    '$rootScope'
  ];

  /**
   * @ngDoc factory
   * @name horizon.app.core.images.actions.updateTemplateService
   * @Description A service to open the user wizard.
   */
  function updateTemplateService(
    resourceType,
    bsnneutron,
    toast,
    $modal,
    actionResultService,
    $rootScope
  ) {
    var message = {
      success: gettext('Template was successfully updated.')
    };

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

    function perform(template) {
      $rootScope.template = template;
      var localSpec = {
        scope: $rootScope,
        backdrop: 'static',
        controller: 'updateController as ctrl',
        templateUrl: '/static/networktemplate/actions/update/updateModal.html'
      };

      return $modal.open(localSpec).result.then(function update(result) {
        return submit(result);
      });
    }

    function submit(result) {
      debugger;
      return bsnneutron.networktemplate_update(result.id, result).then(onUpdateTemplate);
    }

    function onUpdateTemplate(response) {
      var newTemplate = response.data;
      toast.add('success', interpolate(message.success, [newTemplate.name]));
      return actionResultService.getActionResult()
        .updated(resourceType, newTemplate.id)
        .result;
    }

  } // end of updateTemplateService
})(); // end of IIFE
