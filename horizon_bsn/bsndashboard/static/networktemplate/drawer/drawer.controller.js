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
   * @ngdoc controller
   * @name bsn.bsndashboard.networktemplate.DrawerController
   * @description
   * This is the controller for the templates drawer (summary) view.
   * Its primary purpose is to provide the metadata definitions to
   * the template via the ctrl.metadataDefs member.
   */
  angular
    .module('bsn.bsndashboard.networktemplate')
    .controller('bsn.bsndashboard.networktemplate.DrawerController', controller);

  controller.$inject = [
    'horizon.app.core.openstack-service-api.bsnneutron'
  ];

  function controller(bsnneutron) {
    var ctrl = this;

    // TODO: set ctrl.body to the body of the correct nettemplate
    ctrl.data = bsnneutron.networktemplate_list().success(returnResponse);
    ctrl.body = "TODO: set ctrl.body to the body of the correct nettemplate";
    
    function returnResponse(response) {
      return response;
    }

  }

})();
