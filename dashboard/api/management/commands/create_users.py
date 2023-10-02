import os
import sys

from django.core.wsgi import get_wsgi_application
from django.db import transaction

sys.path.append('C:\\Users\\Hjemme_PC\\it2901-bachelor\\dashboard')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'license_dashboard.settings')
application = get_wsgi_application()

from django.contrib.auth import get_user_model
from api.models import SoftwarePerComputer

CustomUser = get_user_model()


email_organization_name_computer_name = SoftwarePerComputer.objects.values_list('primary_user_email', 'organization',
                                                                                'computer_name',
                                                                                'primary_user_full_name').distinct()


total_users = len(email_organization_name_computer_name)


with transaction.atomic():
    for index, (email, organization, computer_name, full_name) in enumerate(email_organization_name_computer_name):
        if email is not None:
            user_exists = CustomUser.objects.filter(primary_user_email=email).exists()
            full_name = full_name if full_name is not None else 'Unknown'

            if not user_exists:
                user = CustomUser.objects.create_user(primary_user_email=email, password='PLACEHOLDER',
                                                      organization=organization, computer_name=computer_name,
                                                      primary_user_full_name=full_name)
                print(
                    f'Created user account for {email} with organization {organization}, computer_name {computer_name} and full name {full_name}')
            else:
                user = CustomUser.objects.get(primary_user_email=email)
                updated = False
                if user.organization != organization:
                    user.organization = organization
                    updated = True
                if user.computer_name != computer_name:
                    user.computer_name = computer_name
                    updated = True
                if user.primary_user_full_name != full_name:
                    user.primary_user_full_name = full_name
                    updated = True

                if updated:
                    user.save()
                    print(
                        f'Updated user account for {email} with organization {organization}, computer_name {computer_name} and full name {full_name}')
                else:
                    print(
                        f'User account for {email} already exists and has the correct organization, computer_name, and full name')

        # Calculate and display the number of remaining users
        remaining_users = total_users - (index + 1)
        print(f'Remaining users to process: {remaining_users}')
