#
#    (c) Copyright 2015 Hewlett-Packard Development Company, L.P.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
"""API over the neutron service.
"""

from django.views import generic

from openstack_dashboard.api.rest import urls
from openstack_dashboard.api.rest import utils as rest_utils

from horizon_bsn.api import neutron

@urls.register
class ReachabilityTests(generic.View):
    """API for BSN Neutron Reachability Tests"""
    url_regex = r'neutron/reachabilitytests/$'

    @rest_utils.ajax()
    def get(self, request):
        result = neutron.reachabilitytest_list(request)
        return {'items': [n.to_dict() for n in result]}
