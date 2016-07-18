# Copyright 2016,  Big Switch Networks, Inc
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
from django.utils.translation import ugettext_lazy as _
from django.utils.translation import ungettext_lazy
from horizon import tables
from openstack_dashboard import policy

from horizon_bsn.content.connections.routes import routemanager

LOG = logging.getLogger(__name__)


class AddRoute(policy.PolicyTargetMixin, tables.LinkAction):
    name = "create"
    verbose_name = _("Add Static Route")
    url = "horizon:project:connections:routes:addroute"
    classes = ("ajax-modal",)
    icon = "plus"
    policy_rules = (("network", "update_router"),)

    def get_link_url(self, datum=None):
        return reverse(self.url)


class UpdateRoute(tables.LinkAction):
    name = "update"
    verbose_name = _("Edit Route")
    url = "horizon:project:connections:routes:update"
    classes = ("ajax-modal", "btn-edit")


class RemoveRoute(policy.PolicyTargetMixin, tables.DeleteAction):
    @staticmethod
    def action_present(count):
        return ungettext_lazy(
            u"Delete Route",
            u"Delete Routes",
            count
        )

    @staticmethod
    def action_past(count):
        return ungettext_lazy(
            u"Deleted Route",
            u"Deleted Routes",
            count
        )

    failure_url = 'horizon:project:connections:index'
    policy_rules = (("network", "update_router"),)

    def delete(self, request, obj_id):
        router_id = self.table.kwargs['router'].id
        routemanager.remove_route(request, router_id=router_id,
                                  route_id=obj_id)


class RoutesTable(tables.DataTable):
    id = tables.Column("id", hidden=True)
    destination = tables.Column("destination",
                                verbose_name=_("Destination CIDR"))
    nexthops = tables.Column("nexthops", verbose_name=_("Next Hops"))

    def get_object_display(self, route):
        return _("(%(destination)s) -> %(nexthops)s") % route

    def get_object_id(self, datum):
        return datum.id

    class Meta(object):
        name = "routes"
        verbose_name = _("Static Routes")
        table_actions = (AddRoute, RemoveRoute)
        row_actions = (UpdateRoute, RemoveRoute)
