from collections import OrderedDict
from urllib.parse import urlencode

from api.models import SoftwarePerComputer, LicensePool, CustomUser
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase, APIClient


# Create your tests here.
class TestSoftwarePCViews(APITestCase):
    def setUp(self):
        self.get_org_url = reverse('organizations')
        SoftwarePerComputer.objects.create(
            computer_name='mycomputer',
            application_name='myapplication',
            category='mycategory',
            family='myfamily',
            family_version='1',
            family_edition='100',
            license_required=True,
            manufacturer='mymanufacturer',
            organization='Servere',
            organization_path='/my/organization/path',
            date_added='2022-01-01',
            last_used='2022-02-01',
            run_times=10,
            total_minutes=1000,
            active_minutes=500,
            average_usage_per_run=100.0,
            active_usage_per_run=50.0,
            remote_total_minutes=0,
            remote_active_minutes=0,
            device_total_minutes=1000,
            device_active_minutes=500,
            server=False,
            cloud=False,
            virtual=False,
            portable=False,
            terminal_server=False,
            test_development=False,
            manual_client=False,
            manual_application=False,
            operating_system='Windows 10',
            total_cpus=2,
            total_cores=4,
            last_scanned='2022-02-14',
            status='Active',
            gdpr_risk=False,
            manufacturer_gdpr_compliant=True,
            manufacturer_ps_sh_compliant=True,
            manufacturer_dpd_compliant=True,
            suite=False,
            part_of_suite=False,
            suite_names='',
            license_suite=False,
            part_of_license_suite=False,
            license_suite_names=None,
            block_listed=False,
            primary_user='myuser',
            primary_user_full_name='My User',
            primary_user_email='myuser@example.com',
            price=750.0
        )
        SoftwarePerComputer.objects.create(
            computer_name='mycomputer',
            application_name='Hovedtillitsvalgte',
            category='mycategory',
            family='myfamily',
            family_version='1',
            family_edition='100',
            license_required=True,
            manufacturer='mymanufacturer',
            organization='Hovedtillitsvalgte',
            organization_path='/my/organization/path',
            date_added='2022-01-01',
            last_used='2022-02-01',
            run_times=10,
            total_minutes=1000,
            active_minutes=500,
            average_usage_per_run=100.0,
            active_usage_per_run=50.0,
            remote_total_minutes=0,
            remote_active_minutes=0,
            device_total_minutes=1000,
            device_active_minutes=500,
            server=False,
            cloud=False,
            virtual=False,
            portable=False,
            terminal_server=False,
            test_development=False,
            manual_client=False,
            manual_application=False,
            operating_system='Windows 10',
            total_cpus=2,
            total_cores=4,
            last_scanned='2022-02-14',
            status='Active',
            gdpr_risk=False,
            manufacturer_gdpr_compliant=True,
            manufacturer_ps_sh_compliant=True,
            manufacturer_dpd_compliant=True,
            suite=False,
            part_of_suite=False,
            suite_names='',
            license_suite=False,
            part_of_license_suite=False,
            license_suite_names='',
            block_listed=False,
            primary_user='myuser',
            primary_user_full_name='My User',
            primary_user_email='myuser@example.com',
            price=750.0
        )

    def test_get_organizations_view(self):
        """
        Test for the get_organizations view. Should return all distinct organizations.
        :return:
        """
        expected_organizations = ['Hovedtillitsvalgte', 'Servere']
        response = self.client.get(self.get_org_url)
        self.assertEqual(response.status_code, 200)
        for org in expected_organizations:
            self.assertIn(org, list(response.data))

    def test_get_software_recommendations_view(self):
        """
        Should return all recommendations the the IT-department (standard).
        """
        url = reverse('recommendations')
        response = self.client.get(url)
        expected_recommendations = [{
            'application_name': 'myapplication', 'primary_user_full_name': 'My User',
            'primary_user_email': 'myuser@example.com', 'organization': 'Servere'

        }, {'application_name': 'Hovedtillitsvalgte', 'primary_user_full_name': 'My User',
            'primary_user_email': 'myuser@example.com', 'organization': 'Hovedtillitsvalgte'

            }]

        selected_fields = []
        for rec in response.data:
            selected_fields.append({'application_name': rec['application_name'],
                                    'primary_user_full_name': rec['primary_user_full_name'],
                                    'primary_user_email': rec['primary_user_email'],
                                    'organization': rec['organization']})

        '''
        expected_fields = []
        for rec in expected_recommendations:
            expected_fields.append({'application_name': rec['application_name'],
                                    'primary_user_full_name': rec['primary_user_full_name'],
                                    'primary_user_email': rec['primary_user_email'],
                                    'organization': rec['organization']})
        '''

        self.assertEqual(response.status_code, 200)
        self.assertEqual(selected_fields, expected_recommendations)

    def test_get_software_recommendations_view_param(self):
        """
        Should only return recommendations for the specified organization.
        """
        organization = 'Hovedtillitsvalgte'
        url = reverse('recommendations') + f'?organization={organization}'
        response = self.client.get(url)
        expected_recommendations = [{'application_name': 'Hovedtillitsvalgte', 'primary_user_full_name': 'My User',
                                     'primary_user_email': 'myuser@example.com', 'organization': 'Hovedtillitsvalgte'}]

        selected_fields = []
        for rec in response.data:
            selected_fields.append({'application_name': rec['application_name'],
                                    'primary_user_full_name': rec['primary_user_full_name'],
                                    'primary_user_email': rec['primary_user_email'],
                                    'organization': rec['organization']})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(selected_fields, expected_recommendations)

    def test_get_organization_software_param(self):
        """
        Should return all software used by the given organization.
        """
        organization = "Servere"
        url = reverse('software') + f'?organization={organization}&status=active&pool=false'
        response = self.client.get(url)
        expected_software = ['myapplication']
        self.assertEqual(response.status_code, 200)
        self.assertEqual(list(response.data), expected_software)

    def test_get_org_software_users_param(self):
        """
        Should return a list of all the software the organization uses, and its users
        """
        organization = "Servere"
        url = reverse('get_applications_by_user') + f'?organization={organization}'
        response = self.client.get(url)
        expected_return_data = [{
            'application_name': 'myapplication', 'users': [{"full_name": "My User", "email": 'myuser@example.com',
                                                            "total_minutes": 1000, "active_minutes": 500}]}]

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_return_data)

    def test_get_licenses_associated_with_users(self):
        """
        Should return specified user with his/her licenses.
        """
        user = CustomUser.objects.create_user(primary_user_email='myuser@example.com',
                                              organization='Hovedtillitsvalgte',
                                              password='test_password',
                                              is_unit_head=False)
        self.client.force_authenticate(user=user)

        url = reverse('get_licenses_associated_with_user')
        response = self.client.get(url)
        expected_software = [{'application_name': 'myapplication', 'computer_name': 'mycomputer', 'status': 'Active'}, {'application_name': 'Hovedtillitsvalgte', 'computer_name': 'mycomputer', 'status': 'Active'}]
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_software)

    def test_get_reallocatabe_by_software_name(self):
        """
        Should return a string with total- and reallocatable licenses for a given software.
        """
        software = 'Hovedtillitsvalgte'
        url = reverse('get_reallocatabe_by_software_name', args=[software])
        response = self.client.get(url)
        expected_response = "There are currently 1 licenses for Hovedtillitsvalgte, " \
                            "where 1 have not been used the last 90 days."
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data, expected_response)

    def test_get_licenseinfo(self):
        query_params = {
            'page': '1',
            'sort': 'application_name',
            'organization': 'Servere',
            'status': 'available',
        }
        encoded_query_params = urlencode(query_params)
        url = reverse('licenseinfo') + '?' + encoded_query_params
        response = self.client.get(url)
        response_data = response.data['results']
        expected_data = [{
            "application_name": 'myapplication',
            "primary_user_full_name": 'My User',
            "primary_user_email": "myuser@example.com",
            "organization": 'Servere',
            "computer_name": 'mycomputer',
            "details": [
                {
                    "id": 1,
                    "last_used": "2022-02-01",
                    "status": "Ledig",
                    "price": 750.0
                }
            ]
        }]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response_data, expected_data)

    def test_get_licenseinfo_invalid_parameters(self):
        query_params = {
            'organization': 'Servere',
        }
        encoded_query_params = urlencode(query_params)
        url = reverse('licenseinfo') + '?' + encoded_query_params
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestLicensePool(TestCase):
    def setUp(self):
        SoftwarePerComputer.objects.create(
            computer_name='mycomputer',
            application_name='Google Chrome 109',
            category='mycategory',
            family='myfamily',
            family_version='1',
            family_edition='100',
            license_required=True,
            manufacturer='mymanufacturer',
            organization='IT-tjenesten',
            organization_path='/my/organization/path',
            date_added='2022-01-01',
            last_used='2022-02-01',
            run_times=10,
            total_minutes=1000,
            active_minutes=500,
            average_usage_per_run=100.0,
            active_usage_per_run=50.0,
            remote_total_minutes=0,
            remote_active_minutes=0,
            device_total_minutes=1000,
            device_active_minutes=500,
            server=False,
            cloud=False,
            virtual=False,
            portable=False,
            terminal_server=False,
            test_development=False,
            manual_client=False,
            manual_application=False,
            operating_system='Windows 10',
            total_cpus=2,
            total_cores=4,
            last_scanned='2022-02-14',
            status='Active',
            gdpr_risk=False,
            manufacturer_gdpr_compliant=True,
            manufacturer_ps_sh_compliant=True,
            manufacturer_dpd_compliant=True,
            suite=False,
            part_of_suite=False,
            suite_names='',
            license_suite=False,
            part_of_license_suite=False,
            license_suite_names='',
            block_listed=False,
            primary_user='myuser',
            primary_user_full_name='My User',
            primary_user_email='myuser@example.com'
        )
        self.license_pool = LicensePool.objects.create(
            id=19,
            application_name='Google Chrome 109',
            date_added='2023-01-01',
            family='myfamily',
            family_version='1',
            family_edition='100',
            freed_by_organization='IT-tjenesten',
            spc_id=999,

        )
        self.url = reverse('software_per_computer_detail', kwargs={'id': self.license_pool.id})

        self.user = CustomUser.objects.create_user(primary_user_email='test@example.com',
                                                   organization='IT-tjenesten',
                                                   password='test_password',
                                                   is_unit_head=True)
        Token.objects.create(user=self.user)
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_get_license_pool(self):
        query_params = {
            'page': '1',
            'sort': 'application_name',
            'organization': 'IT-tjenesten',
            'status': 'available',
        }
        encoded_query_params = urlencode(query_params)
        url = reverse("licensepool") + '?' + encoded_query_params
        response_message = self.client.get(url)
        expected_data = {
            'application_name': 'Google Chrome 109',
            'freed_by_organization': 'IT-tjenesten',
            'details': [
                OrderedDict([
                    ('id', self.license_pool.id),
                    ('freed_by_organization', 'IT-tjenesten'),
                    ('application_name', 'Google Chrome 109'),
                    ('date_added', '2023-01-01'),
                    ('family', 'myfamily'),
                    ('family_version', '1'),
                    ('family_edition', '100'),
                    ('price', None),
                    ('spc_id', 999)
                ])
            ],
        }

        response_message_data = response_message.data.get('results')[0]
        self.assertEqual(response_message.status_code, status.HTTP_200_OK)
        self.assertEqual(response_message_data, expected_data)

    def test_update_license_pool_object(self):
        updated_data = {
            'id': self.license_pool.id,
            'application_name': 'Google Chrome 109',
            'date_added': '2023-01-02',
            'family': 'myfamily',
            'family_version': '1',
            'family_edition': '100',
            'freed_by_organization': 'IT-tjenesten',
            'spc_id': 999,
            'price': None
        }
        response = self.client.put(self.url, updated_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, updated_data)
        self.license_pool.refresh_from_db()
        self.assertEqual(self.license_pool.application_name, updated_data['application_name'])
        self.assertEqual(self.license_pool.spc_id, updated_data['spc_id'])

    def test_create_pool_object(self):
        url = reverse("create_pool_object")
        data = {
            "id": 19,
            "application_name": "Google Chrome 109",
            "date_added": "2023-01-01",
            "family": "myfamily",
            "family_version": "1",
            "family_edition": "100",
            "freed_by_organization": "IT-tjenesten",
            "spc_id": 1001
        }

        self.client.force_authenticate(user=self.user)
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(LicensePool.objects.filter(application_name='Google Chrome 109').count(), 2)
        self.assertEqual(LicensePool.objects.get(spc_id=1001).family, 'myfamily')


class TestAuthentication(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = CustomUser.objects.create_user(primary_user_email='test@example.com',
                                                   organization='Test Organization',
                                                   password='test_password')

    def test_obtain_token(self):
        url = reverse('token_obtain_pair')
        data = {
            'primary_user_email': 'test@example.com',
            'password': 'test_password'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_refresh_token(self):
        response = self.client.post(
            reverse('token_obtain_pair'),
            {
                'primary_user_email': 'test@example.com',
                'password': 'test_password',
            },
            format='json'
        )
        refresh_token = response.data['refresh']
        old_access_token = response.data['access']

        response = self.client.post(
            reverse('token_refresh'),
            {'refresh': refresh_token},
            format='json'
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertNotEqual(old_access_token, response.data['access'])

    def test_invalid_credentials(self):
        url = reverse('token_obtain_pair')
        data = {
            'primary_user_email': 'test@example.com',
            'password': 'wrong_password'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
