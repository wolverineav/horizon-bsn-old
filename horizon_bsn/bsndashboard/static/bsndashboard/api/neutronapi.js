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
(function () {
  'use strict';

  angular
    .module('bsn-neutron-api')
    .factory('bsn-neutron-api', neutronAPI);

  neutronAPI.$inject = [
    'horizon.framework.util.http.service',
    'horizon.framework.widgets.toast.service'
  ];

  /**
   * @ngdoc service
   * @name neutronAPI
   * @param {Object} apiService
   * @param {Object} toastService
   * @description Provides access to Neutron APIs.
   * @returns {Object} The service
   */
  function neutronAPI(apiService, toastService) {
    var service = {
      //reachabilitytest_create: reachabilitytest_create,
      reachabilitytest_list: reachabilitytest_list,
      /*
      reachabilitytest_get: reachabilitytest_get,
      reachabilitytest_update: reachabilitytest_update,
      reachabilitytest_delete: reachabilitytest_delete,

      networktemplate_create: networktemplate_create,
      networktemplate_list: networktemplate_list,
      networktemplate_get: networktemplate_get,
      networktemplate_update: networktemplate_update,
      networktemplate_delete: networktemplate_delete,

      networktemplateassignment_create: networktemplateassignment_create,
      networktemplateassignment_list: networktemplateassignment_list,
      networktemplateassignment_get: networktemplateassignment_get,
      networktemplateassignment_update: networktemplateassignment_update,
      networktemplateassignment_delete: networktemplateassignment_delete,

      reachabilityquicktest_create: reachabilityquicktest_create,
      reachabilityquicktest_list: reachabilityquicktest_list,
      reachabilityquicktest_get: reachabilityquicktest_get,
      reachabilityquicktest_update: reachabilityquicktest_update,
      reachabilityquicktest_delete: reachabilityquicktest_delete
      */
    };

    return service;

    /////////////

    // Neutron Services

    /**
     * @name getAgents
     * @description Get the list of Neutron agents.
     *
     * @returns {Object} An object with property "items." Each item is an agent.
     */
    function reachabilitytest_list() {
      return apiService.get('/api/neutron/reachabilitytests/')
        .error(function () {
          toastService.add('error', gettext('Some error message for reachability test listing'));
        });
    }

  }

}());

/*
/**
     * @name createNetwork
     * @description
     * Create a new network.
     * @returns {Object} The new network object on success.
     *
     * @param {Object} newNetwork
     * The network to create.  Required.
     *
     * Example new network object
     * {
     *    "name": "myNewNetwork",
     *    "admin_state_up": true,
     *    "net_profile_id" : "asdsarafssdaser",
     *    "shared": true,
     *    "tenant_id": "4fd44f30292945e481c7b8a0c8908869
     * }
     *
     * Description of properties on the network object
     *
     * @property {string} newNetwork.name
     * The name of the new network. Optional.
     *
     * @property {boolean} newNetwork.admin_state_up
     * The administrative state of the network, which is up (true) or
     * down (false). Optional.
     *
     * @property {string} newNetwork.net_profile_id
     * The network profile id. Optional.
     *
     * @property {boolean} newNetwork.shared
     * Indicates whether this network is shared across all tenants.
     * By default, only adminstative users can change this value. Optional.
     *
     * @property {string} newNetwork.tenant_id
     * The UUID of the tenant that will own the network.  This tenant can
     * be different from the tenant that makes the create network request.
     * However, only administative users can specify a tenant ID other than
     * their own.  You cannot change this value through authorization
     * policies.  Optional.
     *
     */
    /*
    function createNetwork(newNetwork) {
      return apiService.post('/api/neutron/networks/', newNetwork)
        .error(function () {
          toastService.add('error', gettext('Unable to create the network.'));
        });
    }
 */