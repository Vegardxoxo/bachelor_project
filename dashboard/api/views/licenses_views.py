import datetime as dt
from collections import defaultdict
from datetime import datetime
from datetime import timedelta

import numpy as np
import pandas as pd
from api.models import SoftwarePerComputer, LicensePool
from api.serializers import SoftwarePerComputerSerializer
from dateutil.parser import parse
from django.db.models import Count, FloatField, Sum
from django.db.models import Subquery, Q
from django.db.models.functions import Cast
from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.exceptions import ParseError
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

removable_software = ["Check Point Full Disk Encryption 7.4", "Microsoft Office 2007 Outlook",
                      "Microsoft Office 2010 Outlook", "Microsoft Office 2007 Standard", "Snow Inventory 3.2",
                      "Microsoft Office 97 Access", "Trend Micro Apex One 14", "Snow Inventory 3.7",
                      "Microsoft Office 2000 Access", "Microsoft Office 2007 Word", "Microsoft Office 2010 Standard",
                      "Microsoft Office 2000 PowerPoint", "Microsoft Office 2000 Outlook",
                      "Microsoft Office 2007 Excel", "Snow Inventory 6.7"]


@api_view(['GET'])
# @authentication_classes([JWTAuthentication])
# @permission_classes([permissions.IsAuthenticated])
def get_organizations(request, format=None):
    """
    :return: Returns a list of all distinct organizations.
    """
    try:
        organizations = SoftwarePerComputer.objects.values_list('organization', flat=True).distinct()
        organizations = sorted(organizations)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    print(len(organizations))
    return Response(organizations)


@api_view(['GET'])
def get_software_recommendations(request, format=None):
    """
    :param request: A GET request with an optional 'organization' parameter.
    :return: A list of software that has not been used in the last 90 days and could potentially be reallocated.
    """
    organization = request.GET.get('organization', None)

    software_data = SoftwarePerComputer.objects.only('primary_user_full_name', 'primary_user_full_email',
                                                     'organization', 'application_name',
                                                     'last_used').values()
    software_data = software_data.filter(license_required=True)
    if organization:
        software_data = software_data.filter(organization=organization)
    else:
        pass

    df = get_sorted_df_of_unused_licenses(software_data)
    recommendations = df[['application_name', 'primary_user_full_name', 'primary_user_email', 'organization',
                          'last_used']].to_dict('records')
    return Response(recommendations)


@api_view(['GET'])
def get_org_software_users(request, format=None):
    """

    :param request:  A GET request with an optional 'organization' parameter.
    :return:  Returns a list all the software the organization uses, and its users.
    """
    organization = request.GET.get('organization', 'IT-tjenesten')
    software = SoftwarePerComputer.objects.only('organization',
                                                'application_name', 'primary_user_full_name', 'primary_user_email',
                                                'total_minutes', 'active_minutes')
    software = software.filter(license_required=True)
    if organization:
        software = software.filter(organization=organization)

    software_df = pd.DataFrame.from_records(software.values())
    grouped = software_df.groupby("application_name")

    result = []
    for name, group in grouped:
        if 'active_minutes' in group:
            data = {
                "application_name": name,
                "users": []
            }
            sorted_group = group.sort_values(by='active_minutes', ascending=True)
            for i, row in sorted_group.iterrows():
                data["users"].append({
                    "full_name": row["primary_user_full_name"],
                    "email": row["primary_user_email"],
                    "total_minutes": row["total_minutes"],
                    "active_minutes": row["active_minutes"]
                })
            result.append(data)

    return Response(result)


@api_view(['GET'])
def get_licenses_associated_with_user(request):
    """
    :return: Returns a list of all the licenses currently associated with a user or computer_name.
    """
    try:
        user = request.user
        email = user.primary_user_email
        computer_name = user.computer_name
        print(email)
        software_data = SoftwarePerComputer.objects.filter(primary_user_email=email,
                                                           license_required=True)

        result = []
        for item in software_data:
            data = {
                "application_name": item.application_name,
                "computer_name": item.computer_name,
                "status": item.status,
            }
            result.append(data)
        print(len(result))
        return Response(result)
    except Exception as e:
        return Response(str(e))


@api_view(['GET'])
def get_reallocatabe_by_software_name(request, format=None, software=None):
    """
    :param request:  A GET request with an 'application_name' parameter.
    :return: Currently returns a string that with total- and allocateable licenses for a given software.
    """
    try:
        software = request.GET.get('application_name', software)
        if software is None:
            raise KeyError("No software with that name")

        software_list = SoftwarePerComputer.objects.filter(application_name=software).values("application_name",
                                                                                             "last_used")
        software_list = software_list.filter(license_required=True)
        total_licenses = len(list(software_list))

        df = get_sorted_df_of_unused_licenses(software_list)
        total_allocatable = len(df)

        # unused_by_software_name = df[['application_name', 'last_used']].to_dict('records')
        # return Response(unused_by_software_name)

        return Response(f"There are currently {total_licenses} licenses for {software}, where"
                        f" {total_allocatable} have not been used the last 90 days.")
    except KeyError as e:
        return Response("No software with that name")


@api_view(['GET'])
def get_org_software_users_by_name(request, format=None):
    """
    :param request: A GET request with 'application_name' and 'organization' as parameters.
    :return: Returns a list of all the users of the given software within the given organization.
    """
    application_name = request.GET.get('application_name', 'Microsoft Office 2016 PowerPoint')
    organization = request.GET.get('organization', None)

    software = SoftwarePerComputer.objects.filter(application_name=application_name,
                                                  license_required=True, license_suite_names__isnull=True)
    if organization:
        software = software.filter(organization=organization)

    software_df = pd.DataFrame.from_records(software.values())
    # Fill null values in the "active_minutes" and "total_minutes" columns with 0
    software_df[['active_minutes', 'total_minutes']] = software_df[['active_minutes', 'total_minutes']].fillna(0)
    # Sort by "active_minutes" column, moving null values to the end
    sorted_group = software_df.sort_values(by='active_minutes', ascending=True, na_position='last')

    # Group by organization
    groups = sorted_group.groupby('organization')

    result = []
    for org, group in groups:
        details = []
        for i, row in group.iterrows():
            details.append({
                "id": row["id"],
                "primary_user_full_name": row["primary_user_full_name"],
                "computer_name": row["computer_name"],
                "primary_user_email": row["primary_user_email"],
                "total_minutes": row["total_minutes"],
                "active_minutes": row["active_minutes"],
            })
        result.append({
            "application_name": application_name,
            "organization": org,
            "details": details
        })

    return Response(result)


@api_view(['GET'])
def software_counts(request):
    try:
        organization = request.GET.get('organization', None)
        email = request.GET.get('email', None)
        if not organization:
            raise ParseError("No organization provided")

        licenses_in_pool = LicensePool.objects.values('spc_id')
        software = SoftwarePerComputer.objects.filter(organization=organization, license_required=True,
                                                      license_suite_names__isnull=True).exclude(
            Q(id__in=Subquery(licenses_in_pool)))

        software = software.exclude(application_name__in=removable_software)
        if email:
            software = software.filter(primary_user_email=email)

        # Count of total licenses filter by organization
        total_licenses = software.count()

        # Count of software that has last_used = null (Xupervisor haven't registered activity)
        never_used = software.filter(last_used__isnull=True).count()

        # Count of software that has last_used > 90 days
        date = datetime.now() - timedelta(days=90)
        unused_software = software.filter(last_used__lte=date).count()

        # Count of active licenses
        active_licenses = software.filter(last_used__gte=date).count()
        available_licenses = LicensePool.objects.filter(freed_by_organization=organization).count()

        counts = {
            'total_licenses': total_licenses,
            'active_licenses': active_licenses,
            'never_used': never_used,
            'unused_licenses': unused_software,
            'available_licenses': available_licenses
        }
        return Response(counts)
    except ParseError as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def leaderboard(request):
    """
    Function to get the top 25 organizations by active percentage.
    :param request: A GET request with an 'organization' parameter.
    :return: Returns a list of the top 25 organizations by active percentage.
    """
    try:
        organization = request.user.organization
        print(organization)
        org_filter = Q(license_required=True) & Q(license_suite_names__isnull=True)
        now = datetime.now()
        last_90_days = now - timedelta(days=90)

        # Generate queryset of top 25 organizations by active percentage
        top_orgs = SoftwarePerComputer.objects.filter(org_filter).values('organization').annotate(
            total=Count('id'),
            active=Count('id', filter=Q(last_used__gte=last_90_days)),
            active_percentage=Cast(
                100.0 * Count('id', filter=Q(last_used__gte=last_90_days)) / Cast(Count('id'), FloatField()),
                FloatField())
        ).order_by('-active_percentage')

        top_orgs_sliced = top_orgs[:25]

        # Format response data
        leaderboard_data = []
        organization_included = False

        for i, org in enumerate(top_orgs_sliced):
            active_percentage = round(org['active_percentage'], 2)
            leaderboard_data.append({
                'organization': org['organization'],
                'active_percentage': active_percentage,
                'rank': i + 1
            })

            if org['organization'] == organization:
                organization_included = True

        # The org from the request is not in the top 25
        if organization and not organization_included:
            org = top_orgs.filter(organization=organization).first()
            if org:
                index = list(top_orgs).index(org)
                active_percentage = round(org['active_percentage'], 2)
                leaderboard_data.append({
                    'organization': org['organization'],
                    'active_percentage': active_percentage,
                    'rank': index + 1
                })

        response_data = {
            'leaderboard': leaderboard_data
        }
        return Response(response_data)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


def get_sorted_df_of_unused_licenses(software_data):
    """
    :param software_data: The software data object you want to work with
    :return: A sorted dataframe of all the software that haven't been used the las 90 days
    """
    df = pd.DataFrame(list(software_data))
    now = dt.datetime.now()
    three_months_ago = now - dt.timedelta(days=90)
    df = df[df['last_used'].notnull()]  # Filter out None values in the 'last_used' column
    df['last_used'] = np.where(df['last_used'].isnull(), three_months_ago, df['last_used'])  # Handle null values
    df['last_used'] = pd.to_datetime(df['last_used'], errors='coerce')
    df = df[np.array(df['last_used'].dt.date) <= three_months_ago.date()]
    df['last_used'] = (now - df['last_used']).dt.days
    df = df.sort_values(by='last_used', ascending=False)
    return df


@api_view(['GET'])
def get_org_software_names(request, format=None):
    """
    Returns a list of all distinct software used by an organization.
    :param request: A GET request with an optional 'organization' parameter.
    :return: Returns a list of all distinct software used.
    """
    organization = request.GET.get('organization', None)
    application_status = request.GET.get('status', None)
    pool = request.GET.get('pool', None)
    email = request.GET.get('email', None)

    if not application_status:
        raise ParseError("status parameter is required.")

    # Get the date 90 days ago
    threshold_date = datetime.now() - timedelta(days=90)

    try:
        licenses_in_pool = LicensePool.objects.values('spc_id')
        software = None
        if pool == 'true':
            software = LicensePool.objects.values_list('application_name', flat=True).distinct()
        elif pool == 'false':
            software = SoftwarePerComputer.objects.values_list('application_name', flat=True).distinct().exclude(
                Q(id__in=Subquery(licenses_in_pool)))
            software = software.filter(license_required=True, license_suite_names__isnull=True)

            if email:
                software = software.filter(primary_user_email=email)

            if application_status == 'unused':
                software = software.filter(last_used__isnull=True)

            elif application_status == 'available':
                software = software.filter(last_used__isnull=False, last_used__lte=threshold_date)

        if organization:
            software = software.filter(organization=organization)
        if len(software) == 0:
            return Response([])
        software = software.exclude(application_name__in=removable_software)
        software = sorted(software)
        return Response(software)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LicenseInfoView(generics.ListAPIView):
    queryset = SoftwarePerComputer.objects.all()
    serializer_class = SoftwarePerComputerSerializer
    pagination_class = PageNumberPagination

    def get_queryset(self):
        application_name = self.request.query_params.get('application_name', None)
        organization = self.request.query_params.get('organization')
        application_status = self.request.query_params.get('status')
        email = self.request.query_params.get('email')

        if not organization:
            raise ParseError("The 'organization' parameter is required.")
        if not application_status:
            raise ParseError("The 'status' parameter is required.")

        threshold_date = datetime.now() - timedelta(days=90)
        licenses_in_pool = LicensePool.objects.values('spc_id')
        queryset = self.queryset.filter(
            license_required=True,
            license_suite_names__isnull=True,
            organization=organization,
        ).exclude(
            Q(id__in=Subquery(licenses_in_pool)))

        if application_name:
            queryset = queryset.filter(application_name=application_name)
        if email:
            queryset = queryset.filter(primary_user_email=email)

        # Ikke registrert aktivitet i Xupervisor
        if application_status == 'unused':
            queryset = queryset.filter(last_used__isnull=True)

        # Ikke brukt på 90 dager
        elif application_status == 'available':
            queryset = queryset.filter(last_used__lte=threshold_date)
        return queryset

    def aggregate_data(self, data):
        aggregated_data = defaultdict(list)

        for record in data:
            primary_user_full_name = record.get('primary_user_full_name') or 'Ukjent bruker'
            key = (record['application_name'], primary_user_full_name, record['primary_user_email'],
                   record['organization'], record['computer_name'])
            last_used = record['last_used']
            application_status = ('Ubrukt' if last_used is None else
                                  ('Ledig' if parse(last_used) <= datetime.now() - timedelta(days=90) else 'Aktiv'))

            details_record = {
                'id': record['id'],
                'last_used': last_used,
                'status': application_status,
                'price': record['price'],
            }
            aggregated_data[key].append(details_record)

        result = [
            {
                'application_name': application,
                'primary_user_full_name': user,
                'primary_user_email': primary_user_email,
                'organization': organization,
                'computer_name': computer_name,
                'details': details
            }
            for (application, user, primary_user_email, organization, computer_name), details in aggregated_data.items()
        ]
        return result

    def list(self, request, *args, **kwargs):
        sort = self.request.GET.get('sort', None)
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        aggregated_data = self.aggregate_data(serializer.data)

        if sort == "status":
            aggregated_data = sorted(aggregated_data, key=lambda x: x['details'][0]['status'])
        else:
            aggregated_data = sorted(aggregated_data, key=lambda x: x[sort])

        page = self.paginate_queryset(aggregated_data)
        if page is not None:
            return self.get_paginated_response(page)

        return Response(aggregated_data)


class GetUserInfo(APIView):
    """
    Returns the primary user email and organization of the user given a valid JWT.
    """
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        return Response(
            {'primary_user_email': user.primary_user_email, 'primary_user_full_name': user.primary_user_full_name,
             'computer_name': user.computer_name, 'organization': user.organization,
             'is_unit_head': user.is_unit_head})


@api_view(['GET'])
def check_if_unused(request):
    """
    Checks if the given application_name is unused before a potential new license is bought.
    """
    organization = request.GET.get('organization', None)
    application_name = request.GET.get('application_name', None)
    licenses_in_pool = LicensePool.objects.values('spc_id')
    try:
        if not organization:
            raise ParseError("The 'organization' parameter is required.")
        if not application_name:
            raise ParseError("The 'application_name' parameter is required.")

        current_date = timezone.now().date()
        ninety_days_ago = current_date - timedelta(days=90)

        software = SoftwarePerComputer.objects.filter(
            license_required=True,
            license_suite_names__isnull=True,
            organization=organization,
            application_name=application_name
        ).exclude(
            id__in=Subquery(licenses_in_pool)
        ).filter(
            Q(last_used__isnull=True) | Q(last_used__lte=ninety_days_ago)
        )

        if software.count() == 0:
            return Response({"unused": False, "count": 0})
        else:
            return Response({"unused": True, "count": software.count()})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def get_potential_savings(request):
    """
    Returns the amount of unused software within an organization, multiplied with their price.
    """
    try:
        organization = request.GET.get('organization', None)
        if not organization:
            raise ParseError("No organization provided")

        licenses_in_pool = LicensePool.objects.values('spc_id')
        software = SoftwarePerComputer.objects.filter(organization=organization, license_required=True,
                                                      license_suite_names__isnull=True).exclude(
            Q(id__in=Subquery(licenses_in_pool)))

        software = software.exclude(application_name__in=removable_software)

        # Software that has last_used = null (Xupervisor haven't registered activity)
        never_used = software.filter(last_used__isnull=True)

        never_used_price_sum = never_used.aggregate(Sum('price'))['price__sum'] or 0

        # Count of software that has last_used > 90 days
        date = datetime.now() - timedelta(days=90)
        unused_software = software.filter(last_used__lte=date)

        unused_software_price_sum = unused_software.aggregate(Sum('price'))['price__sum'] or 0

        potential_savings = never_used_price_sum + unused_software_price_sum

        return Response(potential_savings)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
