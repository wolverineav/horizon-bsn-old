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
  /**
   * @ngdoc overview
   * @ngname bsn.bsndashboard.networktemplateassignment
   *
   * @description
   * Provides all of the actions for template assignments.
   */
  angular.module('bsn.bsndashboard.networktemplateassignment.actions', [
    'horizon.framework.conf',
  ])
    .run(registerNetworkTemplateActions);

  registerNetworkTemplateActions.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'bsn.bsndashboard.networktemplateassignment.actions.remove.service',
    'bsn.bsndashboard.networktemplateassignment.resourceType'
  ];

  function registerNetworkTemplateActions(
    registry,
    removeTemplateInstanceService,
    networkTemplateResourceTypeCode
  ) {
    var networkTemplateResourceType = registry.getResourceType(networkTemplateResourceTypeCode);
    networkTemplateResourceType.itemActions
    //   .append({
    //     id: 'updateTemplateService',
    //     service: updateTemplateService,
    //     template: {
    //       text: gettext('Edit')
    //     }
    //   })
    .append({
        id: 'removeTemplateInstanceService',
        service: removeTemplateInstanceService,
        template: {
          text: gettext('Delete Network Template'),
          type: 'delete'
        }
      });

    // networkTemplateResourceType.globalActions
    //   .append({
    //     id: 'removeTemplateInstanceService',
    //     service: removeTemplateInstanceService,
    //     template: {
    //       text: gettext('Remove Network Template Instance'),
    //       type: 'delete'
    //     }
    //   });

    // networkTemplateResourceType.batchActions
    //   .append({
    //     id: 'batchDeleteImageAction',
    //     service: deleteTemplateService,
    //     template: {
    //       type: 'delete-selected',
    //       text: gettext('Delete Images')
    //     }
    //   });
  }

})();
