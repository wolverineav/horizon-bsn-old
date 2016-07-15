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
    .module('horizon.app.core.openstack-service-api')
    .factory('horizon.app.core.openstack-service-api.bsnneutron', neutronAPI);

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
      reachabilitytest_create: reachabilitytest_create,
      reachabilitytest_list: reachabilitytest_list,
      // reachabilitytest_get: reachabilitytest_get,
      // reachabilitytest_update: reachabilitytest_update,
      // reachabilitytest_delete: reachabilitytest_delete,
      //
      // networktemplate_create: networktemplate_create,
      networktemplate_list: networktemplate_list,
      // networktemplate_get: networktemplate_get,
      // networktemplate_update: networktemplate_update,
      // networktemplate_delete: networktemplate_delete,
      //
      // networktemplateassignment_create: networktemplateassignment_create,
      // networktemplateassignment_list: networktemplateassignment_list,
      // networktemplateassignment_get: networktemplateassignment_get,
      // networktemplateassignment_update: networktemplateassignment_update,
      // networktemplateassignment_delete: networktemplateassignment_delete,
      //
      // reachabilityquicktest_create: reachabilityquicktest_create,
      // reachabilityquicktest_list: reachabilityquicktest_list,
      // reachabilityquicktest_get: reachabilityquicktest_get,
      // reachabilityquicktest_update: reachabilityquicktest_update,
      // reachabilityquicktest_delete: reachabilityquicktest_delete
    };

    return service;

    /////////////

    // Neutron Services

    /**
     * @name reachabilitytest_create
     * @param {Object} test - The test
     * @description Create a reachability test.
     *
     * @returns {Object} The result of the creation call.
     */
    function reachabilitytest_create(test) {
      return apiService.post('/api/neutron/reachabilitytests/', test)
        .error(function () {
          toastService.add('error', gettext('Error creating reachability test'));
        });
    }

    /**
     * @name reachabilitytest_list
     * @description Get the list of reachability tests.
     *
     * @returns {Object} An object with property "items." Each item is a test.
     */
    function reachabilitytest_list() {
      return apiService.get('/api/neutron/reachabilitytests/')
        .error(function () {
          toastService.add('error', gettext('Error getting reachability tests'));
        });
    }

    /**
     * @name reachabilitytest_list
     * @description Get the list of reachability tests.
     *
     * @returns {Object} An object with property "items." Each item is a test.
     */
    function networktemplate_list() {

      return {
        "items": [
          {
            "body": "heat_template_version: 2013-05-23\r\n\r\ndescription: >\r\n  Template to create a three tier topology connected by a router.\r\n\r\nparameters:\r\n  out_net_name:\r\n    type: string\r\n    label: Outer Tier Name\r\n    description: Name to assign to the tier exposed to the Internet\r\n    default: web\r\n  out_net_cidr:\r\n    type: string\r\n    label: Outer network CIDR\r\n    description: Network address for the outer tier (CIDR notation)\r\n  mid_net_name:\r\n    type: string\r\n    label: Middle Tier Name\r\n    description: Name to assign to the tier exposed to the outer tier\r\n    default: app\r\n  mid_net_cidr:\r\n    type: string\r\n    label: Middle network CIDR\r\n    description: Network address for middle tier (CIDR notation)\r\n  inner_net_name:\r\n    type: string\r\n    label: Inner Tier Name\r\n    description: Name to assign to the tier exposed to the middle tier\r\n    default: db\r\n  inner_net_cidr:\r\n    type: string\r\n    label: Inner network CIDR\r\n    description: Network address for inner tier (CIDR notation)\r\n\r\n\r\nresources:\r\n  out_net:\r\n    type: OS::Neutron::Net\r\n    properties:\r\n      name: { get_param: out_net_name }\r\n  mid_net:\r\n    type: OS::Neutron::Net\r\n    properties:\r\n      name: { get_param: mid_net_name }\r\n  inner_net:\r\n    type: OS::Neutron::Net\r\n    properties:\r\n      name: { get_param: inner_net_name }\r\n\r\n  out_subnet:\r\n    type: OS::Neutron::Subnet\r\n    properties:\r\n      network_id: { get_resource: out_net }\r\n      cidr: { get_param: out_net_cidr }\r\n  mid_subnet:\r\n    type: OS::Neutron::Subnet\r\n    properties:\r\n      network_id: { get_resource: mid_net }\r\n      cidr: { get_param: mid_net_cidr }\r\n  inner_subnet:\r\n    type: OS::Neutron::Subnet\r\n    properties:\r\n      network_id: { get_resource: inner_net }\r\n      cidr: { get_param: inner_net_cidr }\r\n\r\n  router:\r\n    type: OS::Neutron::Router\r\n\r\n  router_interface:\r\n    type: OS::Neutron::RouterInterface\r\n    properties:\r\n      router_id: { get_resource: router }\r\n      subnet_id: { get_resource: out_subnet }\r\n  router_interface:\r\n    type: OS::Neutron::RouterInterface\r\n    properties:\r\n      router_id: { get_resource: router }\r\n      subnet_id: { get_resource: mid_subnet }\r\n  router_interface:\r\n    type: OS::Neutron::RouterInterface\r\n    properties:\r\n      router_id: { get_resource: router }\r\n      subnet_id: { get_resource: inner_subnet }\r\n",
            "id": "3edc7c1c-9b80-4f4c-b6e3-d42fd955333c",
            "name": "xiong-template"
          }
        ]
      };

      // return apiService.get('/api/neutron/networktemplate/')
      //   .error(function () {
      //     toastService.add('error', gettext('Error getting network template'));
      //   });
    }

  }

}());
