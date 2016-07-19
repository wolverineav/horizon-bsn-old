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

from django.utils.translation import ugettext_lazy as _
from horizon import tabs

from horizon_bsn.api import neutron as bsn_neutron
from horizon_bsn.content.connections.routes import tables as routestable


class RoutesTab(tabs.TableTab):
    table_classes = (routestable.RoutesTable,)
    name = _("Static Routes")
    slug = "routes"
    template_name = "horizon/common/_detail_table.html"

    def allowed(self, request):
        try:
            getattr(self.tab_group.kwargs['router'], 'routes')
            return True
        except Exception:
            return False

    def get_routes_data(self):
        try:
            routes = getattr(self.tab_group.kwargs['router'], 'routes')
        except Exception:
            routes = []
        routes = sorted(routes, key=lambda k: k['id'])
        return [bsn_neutron.RouterStaticRoute(r) for r in routes]
