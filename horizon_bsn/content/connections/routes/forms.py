# Copyright 2016,  Big Switch Networks
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

from django.core.exceptions import ValidationError  # noqa
from django.utils.translation import ugettext_lazy as _
from horizon import exceptions
from horizon import forms
from horizon import messages

from horizon_bsn.content.connections.routes import routemanager

LOG = logging.getLogger(__name__)


class RuleCIDRField(forms.IPField):
    """Extends IPField to allow ('any','external') keywords and requires CIDR

    """
    def __init__(self, *args, **kwargs):
        kwargs['mask'] = True
        super(RuleCIDRField, self).__init__(*args, **kwargs)

    def validate(self, value):
        keywords = ['any', 'external']
        if value in keywords:
            self.ip = value
        else:
            if '/' not in value:
                raise ValidationError(_("Input must be in CIDR format"))
            super(RuleCIDRField, self).validate(value)


class AddRoute(forms.SelfHandlingForm):
    destination = RuleCIDRField(label=_("Destination CIDR"),
                                widget=forms.TextInput())
    nexthops = forms.MultiIPField(label=_("Next Hop "
                                          "Addresses (comma delimited)"),
                                  widget=forms.TextInput(), required=True)
    router_id = forms.CharField(label=_("Router ID"),
                                widget=forms.HiddenInput())
    router_name = forms.CharField(label=_("Router Name"),
                                  widget=forms.TextInput(attrs={'readonly':
                                                                'readonly'}),
                                  required=False)
    failure_url = 'horizon:project:connections:index'

    def __init__(self, request, *args, **kwargs):
        super(AddRoute, self).__init__(request, *args, **kwargs)

    def clean(self):
        cleaned_data = super(AddRoute, self).clean()
        if 'nexthops' not in cleaned_data:
            cleaned_data['nexthops'] = ''
        if ('destination' in cleaned_data
                and cleaned_data['destination'] == '0.0.0.0/0'):
            cleaned_data['destination'] = 'any'
        return cleaned_data

    def handle(self, request, data, **kwargs):
        try:
            new_route = {'destination': data['destination'],
                         'nexthops': data['nexthops'].split(',')}
            router = routemanager.add_route(
                request, router_id=data['router_id'], newroute=new_route)

            msg = (_("Static Route %s was successfully created")
                   % router.routes)
            LOG.debug(msg)
            messages.success(request, msg)
            return router
        except Exception as e:
            exceptions.handle(request,
                              _("Failed to create route due to: %s") % e)


class UpdateForm(AddRoute):
    id = forms.CharField(max_length="36", widget=forms.HiddenInput())

    def clean(self):
        cleaned_data = super(UpdateForm, self).clean()
        return cleaned_data

    def handle(self, request, data, **kwargs):
        try:
            new_route = {'id': data['id'],
                         'destination': data['destination'],
                         'nexthops': data['nexthops'].split(',')}
            router = routemanager.update_route(
                request, router_id=data['router_id'], updated_route=new_route)
            msg = (_("Static Route %s was successfully updated.")
                   % router.routes)
            LOG.debug(msg)
            messages.success(request, msg)
            return router
        except Exception as e:
            exceptions.handle(request,
                              _("Failed to update route due to: %s") % e)
