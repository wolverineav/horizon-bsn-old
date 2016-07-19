# Copyright 2016, Big Switch Networks
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

from django.core.urlresolvers import reverse
from django.core.urlresolvers import reverse_lazy
from django.utils.translation import ugettext_lazy as _
from horizon import exceptions
from horizon import forms
from horizon.utils import memoized
from openstack_dashboard import api

from horizon_bsn.content.connections.routes import forms as routeforms


LOG = logging.getLogger(__name__)


class AddRouteView(forms.ModalFormView):
    form_class = routeforms.AddRoute
    template_name = 'project/connections/routes/create.html'
    url = 'horizon:project:connections:index'
    page_title = _("Add Static Route")

    def get_success_url(self):
        return reverse(self.url)

    @memoized.memoized_method
    def get_object(self):
        try:
            routers = api.neutron.router_list(
                self.request, **{'tenant_id': self.request.user.project_id})
            router = routers[0] if routers else None
            return router
        except Exception:
            redirect = reverse(self.url)
            msg = _("Unable to retrieve router.")
            exceptions.handle(self.request, msg, redirect=redirect)

    def get_context_data(self, **kwargs):
        context = super(AddRouteView, self).get_context_data(**kwargs)
        context['router'] = self.get_object()
        return context

    def get_initial(self, **kwargs):
        router = self.get_object()
        # store the router in the request so the rule manager doesn't have
        # to request it again from the API
        self.request.META['router'] = router
        return {"router_id": router.id,
                "router_name": router.name_or_id}


def _get_route_if_exists(routes, route_id):
    for route in routes:
        if route['id'] == route_id:
            return True, route
    return False, None


class UpdateRouteView(forms.ModalFormView):
    form_class = routeforms.UpdateForm
    template_name = 'project/connections/routes/update.html'
    url = 'horizon:project:connections:index'
    success_url = reverse_lazy('horizon:project:connections:index')
    page_title = _("Edit Static Route")

    def get_object(self):
        try:
            routers = api.neutron.router_list(
                self.request, **{'tenant_id': self.request.user.project_id})
            router = routers[0] if routers else None
            exists, route = _get_route_if_exists(router['routes'],
                                                 int(self.kwargs['id']))
            if not exists:
                raise Exception("Route you're trying to modify "
                                "doesn't exists anymore.")
            router._apidict['update_route'] = route
            return router
        except Exception as e:
            redirect = reverse(self.url)
            msg = _("Unable to retrieve route. %s") % e
            exceptions.handle(self.request, msg, redirect=redirect)

    def get_context_data(self, **kwargs):
        context = super(UpdateRouteView, self).get_context_data(**kwargs)
        context['route'] = self.get_object().update_route
        return context

    def get_initial(self):
        router = self.get_object()
        # store the router in the request so the rule manager doesn't have
        # to request it again from the API
        self.request.META['router'] = router
        return {"router_id": router.id,
                "router_name": router.name_or_id,
                "id": router.update_route['id'],
                "destination": router.update_route['destination'],
                "nexthops": ','.join(router.update_route['nexthops'])}
