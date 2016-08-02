/**
 * (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
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
   * @ngname bsn.bsndashboard.routerrules
   *
   * @descriptiont
   * Provides all of the services and widgets required
   * to support and display network template related content.
   */
  angular
    .module('bsn.bsndashboard.routerrules', [
      'ngRoute',
      'bsn.bsndashboard.routerrules.actions'
    ])
    .constant('bsn.bsndashboard.routerrules.resourceType', 'BSN::Neutron::RouterRules')
    .value('bsn.bsndashboard.routerrules.router', {
      router: {}
    })
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.bsnneutron',
    'bsn.bsndashboard.routerrules.basePath',
    'bsn.bsndashboard.routerrules.resourceType',
    'bsn.bsndashboard.routerrules.router'
  ];

  function run(registry, bsnneutron, basePath, routerrulesResourceType, router) {
    registry.getResourceType(routerrulesResourceType)
      .setNames(gettext('Router Policy'), gettext('Router Policies'))
      .setSummaryTemplateUrl(basePath + 'drawer/drawer.html')
      .setProperty('priority', {
        label: gettext('Priority')
      })
      .setProperty('sourcecidr', {
        label: gettext('Source CIDR')
      })
      .setProperty('destcidr', {
        label: gettext('Destination CIDR')
      })
      .setProperty('action', {
        label: gettext('Action')
      })
      .setProperty('nexthops', {
        label: gettext('Next Hops')
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'priority',
        priority: 1,
        sortDefault: true,
      })
      .append({
        id: 'source',
        priority: 1,
        sortDefault: true,
      })
     .append({
        id: 'destination',
        priority: 1,
        sortDefault: true,
      })
      .append({
        id: 'action',
        priority: 1,
        sortDefault: true,
      })
      .append({
        id: 'nexthops',
        priority: 1,
        sortDefault: true,
      })

    // TODO:
    /**
     * Modify this method and routerrules_list so that fewer router_get calls are made
     * Call router_get once here, and keep the router as a constant
     * When we call routerrules_list, pass the router as an argument, so that the server side does not get router again
     * When we call routerrules_create/delete/whatever, same thing, pass the router
     */

    function listFunction() {
      var result = bsnneutron.router_get().then(modifyResponse);
      return result;

      function modifyResponse(response) {
        router.router = response.data;
        var result = {data: {items: response.data.router_rules.map(addTrackBy)}};
        return result;

        function addTrackBy(template) {
          template.trackBy = template.priority;
          return template;
        }
      }
    }
  }

  config.$inject = [
    '$provide',
    '$windowProvider',
    '$routeProvider'
  ];

  /**
   * @name config
   * @param {Object} $provide
   * @param {Object} $windowProvider
   * @param {Object} $routeProvider
   * @description Routes used by this module.
   * @returns {undefined} Returns nothing
   */
  function config($provide, $windowProvider, $routeProvider) {
    var path = $windowProvider.$get().STATIC_URL + 'routerrules/';
    $provide.constant('bsn.bsndashboard.routerrules.basePath', path);

    $routeProvider.when('/bsndashboard/routerrules/', {
      templateUrl: path + 'panel.html'
    });
  }

})();
