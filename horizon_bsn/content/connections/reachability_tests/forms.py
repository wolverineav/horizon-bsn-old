# Copyright 2012 United States Government as represented by the
# Administrator of the National Aeronautics and Space Administration.
# All Rights Reserved.
#
# Copyright 2012 Nebula, Inc.
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

from django.forms import ValidationError  # noqa
from django.utils.translation import ugettext_lazy as _
from horizon import exceptions
from horizon import forms
from horizon import messages
from horizon_bsn.api import neutron
import logging
import re

LOG = logging.getLogger(__name__)

NEW_LINES = re.compile(r"\r|\n")
EXPECTATION_CHOICES = [('default', _('--- Select Result ---')),
                       ('reached destination', _('reached destination')),
                       ('dropped by route', _('dropped by route')),
                       ('dropped by policy', _('dropped by policy')),
                       ('dropped due to private segment',
                        _('dropped due to private segment')),
                       ('packet in', _('packet in')),
                       ('forwarded', _('forwarded')),
                       ('dropped', _('dropped')),
                       ('multiple sources', _('multiple sources')),
                       ('unsupported', _('unsupported')),
                       ('invalid input', _('invalid input'))]


class CreateReachabilityTest(forms.SelfHandlingForm):
    def __init__(self, request, *args, **kwargs):
        super(CreateReachabilityTest, self).__init__(request, *args, **kwargs)
        self.fields['src_tenant_id'].initial = request.user.project_id

    name = forms.CharField(max_length="64",
                           label=_("Name"),
                           required=True)

    src_tenant_id = forms.CharField(
        max_length="64",
        label=_("Sepecify source tenant"),
        required=True,
        initial="",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source-tenant':
                       _('Specify source tenant')}))

    src_segment_id = forms.CharField(
        max_length="64",
        label=_("Sepecify source segment"),
        required=True,
        initial="",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source-segment':
                       _('Specify source segment')}))

    src_ip = forms.CharField(
        max_length="16",
        label=_("Use ip address as source"),
        required=True,
        initial="0.0.0.0",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source_type-ip':
                       _('Specify source IP address')}))

    dst_ip = forms.CharField(
        max_length="16",
        label=_("Use ip address as destination"),
        required=True,
        initial="0.0.0.0",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_destination_type-ip':
                       _('Specify destination IP address')}))

    expected_result = forms.ChoiceField(
        label=_('Expected Connection Results'),
        required=True,
        choices=EXPECTATION_CHOICES,
        widget=forms.Select(
            attrs={'class': 'switchable',
                   'data-slug': 'expected_result'}))

    def clean(self):
        cleaned_data = super(CreateReachabilityTest, self).clean()

        def update_cleaned_data(key, value):
            cleaned_data[key] = value
            self.errors.pop(key, None)

        expected_result = cleaned_data.get('expected_result')

        if expected_result == 'default':
            msg = _('A expected connection result must be selected.')
            raise ValidationError(msg)

        return cleaned_data

    def handle(self, request, data):
        try:
            reachabilitytest = neutron.reachabilitytest_create(request, **data)
            msg = _("Reachability Test %s was successfully created") \
                % data['name']
            LOG.debug(msg)
            messages.success(request, msg)
            return reachabilitytest
        except Exception:
            exceptions.handle(request,
                              _("Failed to create reachability test"))


class UpdateForm(forms.SelfHandlingForm):
    def __init__(self, request, *args, **kwargs):
        super(UpdateForm, self).__init__(request, *args, **kwargs)
        self.fields['src_tenant_id'].initial = request.user.project_id

    id = forms.CharField(max_length="36", widget=forms.HiddenInput())

    name = forms.CharField(max_length="255", label=_("Name"), required=True)

    src_tenant_id = forms.CharField(
        max_length="255", label=_("Sepecify source tenant"),
        required=True, initial="",
        widget=forms.TextInput(attrs={'class': 'switched',
                                      'data-connection_source-tenant':
                                          _('Specify source tenant')}))

    src_segment_id = forms.CharField(
        max_length="255",
        label=_("Sepecify source segment"),
        required=True,
        initial="",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source-segment':
                       _('Specify source segment')}))

    src_ip = forms.CharField(
        max_length="255",
        label=_("Use ip address as source"),
        required=True,
        initial="0.0.0.0",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source_type-ip':
                       _('Specify source IP address')}))

    dst_ip = forms.CharField(
        max_length="255",
        label=_("Use ip address as destination"),
        required=True,
        initial="0.0.0.0",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_destination_type-ip':
                       _('Specify destination IP address')}))

    expected_result = forms.ChoiceField(
        label=_('Expected Connection Results'),
        required=True,
        choices=EXPECTATION_CHOICES,
        widget=forms.Select(
            attrs={'class': 'switchable',
                   'data-slug': 'expected_result'}))

    def clean(self):
        cleaned_data = super(UpdateForm, self).clean()

        def update_cleaned_data(key, value):
            cleaned_data[key] = value
            self.errors.pop(key, None)

        expected_result = cleaned_data.get('expected_result')
        if expected_result == 'default':
            msg = _('A expected connection result must be selected.')
            raise ValidationError(msg)

        return cleaned_data

    def handle(self, request, data):
        try:
            id = data['id']
            reachabilitytest = neutron \
                .reachabilitytest_update(request, id, **data)
            msg = _("Reachability Test %s was successfully updated") \
                % data['name']
            LOG.debug(msg)
            messages.success(request, msg)
            return reachabilitytest
        except Exception:
            exceptions.handle(request,
                              _("Failed to update reachability test"))


class RunQuickTestForm(forms.SelfHandlingForm):
    def __init__(self, request, *args, **kwargs):
        super(RunQuickTestForm, self).__init__(request, *args, **kwargs)
        self.fields['src_tenant_id'].initial = request.user.project_id

    src_tenant_id = forms.CharField(
        max_length="255",
        label=_("Sepecify source tenant"),
        required=True,
        initial="",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source-tenant':
                       _('Specify source tenant')}))

    src_segment_id = forms.CharField(
        max_length="255",
        label=_("Sepecify source segment"),
        required=True,
        initial="",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source-segment':
                       _('Specify source segment')}))

    src_ip = forms.CharField(
        max_length="255",
        label=_("Use ip address as source"),
        required=True,
        initial="0.0.0.0",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_source_type-ip':
                       _('Specify source IP address')}))

    dst_ip = forms.CharField(
        max_length="255",
        label=_("Use ip address as destination"),
        required=True,
        initial="0.0.0.0",
        widget=forms.TextInput(
            attrs={'class': 'switched',
                   'data-connection_destination_type-ip':
                       _('Specify destination IP address')}))

    expected_result = forms.ChoiceField(
        label=_('Expected Connection Results'),
        required=True,
        choices=EXPECTATION_CHOICES,
        widget=forms.Select(
            attrs={'class': 'switchable',
                   'data-slug': 'expected_connection'}))

    def clean(self):
        cleaned_data = super(RunQuickTestForm, self).clean()

        def update_cleaned_data(key, value):
            cleaned_data[key] = value
            self.errors.pop(key, None)

        expected_result = cleaned_data.get('expected_result')
        if expected_result == 'default':
            msg = _('A expected connection result must be selected.')
            raise ValidationError(msg)

        return cleaned_data

    def handle(self, request, data):
        data['name'] = "quicktest"
        try:
            reachabilityquicktest = neutron \
                .reachabilityquicktest_get(request, request.user.project_id)
            # update with new fields
            neutron.reachabilityquicktest_update(
                request, request.user.project_id, **data)
        except Exception:
            # test doesn't exist, create
            reachabilityquicktest = neutron.reachabilityquicktest_create(
                request, **data)
        # clear dict
        data = {}
        # set run_test to true and update test to get results
        data['run_test'] = True
        reachabilityquicktest = neutron.reachabilityquicktest_update(
            request, reachabilityquicktest.id, **data)
        return reachabilityquicktest


class SaveQuickTestForm(forms.SelfHandlingForm):
    name = forms.CharField(max_length="255",
                           label=_("Name"),
                           required=True)

    def clean(self):
        cleaned_data = super(SaveQuickTestForm, self).clean()

        def update_cleaned_data(key, value):
            cleaned_data[key] = value
            self.errors.pop(key, None)

        return cleaned_data

    def handle(self, request, data):
        try:
            data['save_test'] = True
            reachabilityquicktest = neutron.reachabilityquicktest_update(
                request, request.user.project_id, **data)
            messages.success(
                request, _('Successfully saved quicktest %s') % data['name'])
            return reachabilityquicktest
        except Exception:
            messages.error(
                request, _('Failed to save quicktest %s') % data['name'])
