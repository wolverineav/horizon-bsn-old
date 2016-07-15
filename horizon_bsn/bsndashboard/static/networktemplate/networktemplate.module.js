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
   * @ngname horizon.dashboard.bsndashboard.networktemplate
   *
   * @description
   * Provides all of the services and widgets required
   * to support and display network template related content.
   */
  angular
    .module('horizon.dashboard.bsndashboard.networktemplate', [
      'ngRoute'
    ])
    .constant('horizon.app.core.networktemplate.resourceType', 'BSN::Neutron::NetworkTemplate')
    .run(run)
    .config(config);

  run.$inject = [
    'horizon.framework.conf.resource-type-registry.service',
    'horizon.app.core.openstack-service-api.bsnneutron',
    'horizon.app.core.networktemplate.basePath',
    'horizon.app.core.networktemplate.resourceType'
  ];

  function run(registry, bsnneutron, basePath, networktemplateResourceType) {
    registry.getResourceType(networktemplateResourceType)
      .setNames(gettext('Network Template'))
      //.setSummaryTemplateUrl(basePath + 'details/drawer.html') Drawer needed if details
      .setProperty('template_name', {
        label: gettext('Template Name')
      })
      .setListFunction(listFunction)
      .tableColumns
      .append({
        id: 'name',
        priority: 1,
        sortDefault: true,
      })
      .append({
        id: 'body',
        priority: 2,
        filters: []
      });

    function listFunction() {
      return bsnneutron.networktemplate_list().then(function(list) {
        return list;
      });
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
    var path = $windowProvider.$get().STATIC_URL + 'networktemplate/';
    $provide.constant('horizon.app.core.networktemplate.basePath', path);

    $routeProvider.when('/bsndashboard/networktemplate/', {
      templateUrl: path + 'panel.html'
    });
  }

})();
