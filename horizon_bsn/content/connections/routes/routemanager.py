# Copyright 2013,  Big Switch Networks
#
#    Licensed under the Apache License, Version 2.0 (the "License"); you may
#    not use this file except in compliance with the License. You may obtain
#    a copy of the License at
#
#         http://www.apache.org/licenses/LICENSE-2.0
#
#    Unless required by applicable law or agreed to in writing, software
#    distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
#    WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
#    License for the specific language governing permissions and limitations
#    under the License.

import logging

from horizon import messages
from openstack_dashboard.api import neutron as api

LOG = logging.getLogger(__name__)


def get_route_diff(existing_routes, new_routes):
        existing_dests = set()
        for route in existing_routes:
            existing_dests.add(route['destination'])

        new_dests = set()
        for route in new_routes:
            new_dests.add(route['destination'])

        added = new_dests.difference(existing_dests)
        deleted = existing_dests.difference(new_dests)

        routes_added = [route for route in new_routes
                        if route['destination'] in added]
        routes_removed = [route for route in existing_routes
                          if route['destination'] in deleted]
        return routes_added, routes_removed


def popup_messages(request, old_routeset, new_routeset):
    added_routes, deleted_routes = get_route_diff(
        old_routeset, new_routeset)
    if deleted_routes:
        del_msg = _('Removed routes: %s') % deleted_routes
        LOG.debug(del_msg)
        messages.warning(request, del_msg)
    if added_routes:
        add_msg = _('Added routes: %s') % added_routes
        LOG.debug(add_msg)
        messages.success(request, add_msg)
    if not deleted_routes and not added_routes:
        no_op_msg = _('No change in routes. Either operation failed or '
                      'route exists.')
        LOG.debug(no_op_msg)
        messages.warning(request, no_op_msg)


def routes_list(request, **params):
    if 'router_id' in params:
        params['device_id'] = params['router_id']
    if 'router' in request.META:
        router = request.META['router']
    else:
        router = api.router_get(request, params['device_id'])
    try:
        routes = router.routes
    except AttributeError:
        return (False, [])
    return (True, routes)


def remove_route(request, router_id, route_id):
    LOG.debug("remove_route(): route_id=%s", route_id)
    supported, currentroutes = routes_list(request, **{'router_id': router_id})
    if not supported:
        LOG.error("static routes not supported by router %s" % router_id)
        return
    newroutes = [route for route in currentroutes
                 if route['id'] != int(route_id)]
    body = {'routes': format_for_api(newroutes)}
    new = api.router_update(request, router_id, **body)
    if 'router' in request.META:
        request.META['router'] = new
    popup_messages(request, currentroutes, new.routes)
    return new


def add_route(request, router_id, newroute):
    body = {'routes': []}
    kwargs = {}
    kwargs['router_id'] = router_id
    supported, currentroutes = routes_list(request, **kwargs)
    if not supported:
        LOG.error("static routes are not supported by router %s" % router_id)
        return
    body['routes'] = format_for_api([newroute] + currentroutes)
    new = api.router_update(request, router_id, **body)
    if 'router' in request.META:
        request.META['router'] = new
    popup_messages(request, currentroutes, new.routes)
    return new


def update_route(request, router_id, updated_route):
    body = {'routes': []}
    kwargs = {}
    kwargs['router_id'] = router_id
    supported, currentroutes = routes_list(request, **kwargs)
    if not supported:
        LOG.error("static routes are not supported by router %s" % router_id)
        return
    currentroutes = [route for route in currentroutes
                     if route['id'] != int(updated_route['id'])]
    body['routes'] = format_for_api([updated_route] + currentroutes)
    updated = api.router_update(request, router_id, **body)
    if 'router' in request.META:
        request.META['router'] = updated
    popup_messages(request, currentroutes, updated.routes)
    return updated


def format_for_api(routes):
    apiformroutes = []
    for r in routes:
        # make a copy so we don't damage original dict in rules
        flattened = r.copy()
        # nexthops should only be present if there are nexthop addresses
        if 'nexthops' in flattened:
            cleanednh = [nh.strip()
                         for nh in flattened['nexthops']
                         if nh.strip()]
            if cleanednh:
                flattened['nexthops'] = '+'.join(cleanednh)
            else:
                del flattened['nexthops']
        apiformroutes.append(flattened)
    return apiformroutes
