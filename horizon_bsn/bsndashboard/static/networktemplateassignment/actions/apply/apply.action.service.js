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
    .module('bsn.bsndashboard.networktemplateassignment.actions')
    .factory('bsn.bsndashboard.networktemplateassignemnt.actions.apply.service', applyService);

  applyService.$inject = [
    'bsn.bsndashboard.networktemplateassignment.resourceType',
    'horizon.app.core.openstack-service-api.bsnneutron',
    'horizon.framework.widgets.toast.service',
    '$modal',
    'horizon.framework.util.actions.action-result.service',
    '$rootScope'
  ];

  /**
   * @ngDoc factory
   * @name horizon.app.core.images.actions.applyService
   * @Description A service to open the user wizard.
   */
  function applyService(
    resourceType,
    bsnneutron,
    toast,
    $modal,
    actionResultService,
    $rootScope
  ) {
    var message = {
      success: gettext('Template application in progress.')
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
    
    var stack_create_response = {};

    function perform() {
      var localSpec = {
        backdrop: 'static',
        controller: 'SelectNetTemplateController as ctrl',
        templateUrl: '/static/networktemplateassignment/actions/apply/selectModal.html'
      };

      var template = {};
      var parameters = {};

      return $modal.open(localSpec).result
        .then(function (selectResult) {
          var result = JSON.parse(selectResult.template);
          template = result;
          return result;
        })
        .then(bsnneutron.template_validate)
        .then(function(validateResult) {
          $rootScope.properties = validateResult.data;
          localSpec = {
            backdrop: 'static',
            controller: 'SelectNetTemplateController as ctrl',
            templateUrl: '/static/networktemplateassignment/actions/apply/applyModal.html',
            scope: $rootScope
          };
          return $modal.open(localSpec).result
        })
        .then(function(params) {

          parameters = params;

          var assignment = {
            template_id: template.id,
            stack_id: 'PENDING'
          };
          return bsnneutron.networktemplateassignment_create(assignment);
        })
        .then(function() {
          // create the heat stack, and return an action result
          var args = {
            stack_name: template.name,
            parameters: parameters,
            template: template.body
          }
          return bsnneutron.heatstack_create(args);
        })
        .then(function(response) {
          stack_create_response = response;
          return bsnneutron.networktemplateassignment_update({'stack_id': response.data.stack.id});
        })
        .then(onApplyTemplate);
    }

    function onApplyTemplate() {
      debugger;
      var newStack = stack_create_response.data;
      toast.add('success', interpolate(message.success, [newStack.stack.id]));
      return actionResultService.getActionResult()
        .created(resourceType, newStack.stack.id)
        .result;
    }

  } // end of applyService
})(); // end of IIFE
