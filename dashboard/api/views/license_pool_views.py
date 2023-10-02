from collections import defaultdict
from datetime import datetime

from api.models import LicensePool, SoftwarePerComputer
from api.permissions import IsUnitHead
from api.serializers import PoolSerializer, SoftwarePerComputerSerializer
from django.core.exceptions import ObjectDoesNotExist
from rest_framework import generics, permissions, status
from rest_framework.exceptions import NotFound
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

removable_software = ["Check Point Full Disk Encryption 7.4", "Microsoft Office 2007 Outlook",
                      "Microsoft Office 2010 Outlook", "Microsoft Office 2007 Standard", "Snow Inventory 3.2",
                      "Microsoft Office 97 Access", "Trend Micro Apex One 14", "Snow Inventory 3.7",
                      "Microsoft Office 2000 Access", "Microsoft Office 2007 Word", "Microsoft Office 2010 Standard",
                      "Microsoft Office 2000 PowerPoint", "Microsoft Office 2000 Outlook",
                      "Microsoft Office 2007 Excel", "Snow Inventory 6.7"]


class UpdatePoolObject(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a license pool object.
    """
    queryset = LicensePool.objects.all()
    serializer_class = PoolSerializer
    lookup_field = 'id'

    def get_queryset(self):
        user = self.request.user
        if user.is_unit_head:
            return LicensePool.objects.filter(freed_by_organization=user.organization)
        else:
            return LicensePool.objects.filter(primary_user=user)


class CreatePoolObject(generics.CreateAPIView):
    """
    Create a new object in the license pool.
    """
    permission_classes = [permissions.IsAuthenticated, IsUnitHead]
    queryset = LicensePool.objects.all()
    serializer_class = PoolSerializer


class GetLicensePool(generics.ListAPIView):
    """
    Returns a list of all licenses in the license pool formatted.
    """
    authentication_classes = [JWTAuthentication]
    serializer_class = PoolSerializer
    queryset = LicensePool.objects.all()
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = LicensePool.objects.all().order_by('application_name')
        application_name = self.request.GET.get('application_name', None)
        freed_by_organization = self.request.GET.get('organization', None)

        if application_name:
            if application_name in SoftwarePerComputer.objects.values_list('application_name', flat=True).distinct():
                queryset = queryset.filter(application_name=application_name)
            else:
                raise NotFound("The given application name does not exist.")
        if freed_by_organization:
            if freed_by_organization in SoftwarePerComputer.objects.values_list('organization', flat=True).distinct():
                queryset = queryset.filter(freed_by_organization=freed_by_organization)
            else:
                raise NotFound("The given organization does not exist.")
        queryset = queryset.exclude(application_name__in=removable_software)
        return queryset

    def aggregate_data(self, data):
        aggregated_data = defaultdict(list)

        for record in data:
            key = (record['application_name'], record['freed_by_organization'])
            aggregated_data[key].append(record)

        result = []
        for (application, freed_by_organization), details in aggregated_data.items():
            result.append({
                'application_name': application,
                'freed_by_organization': freed_by_organization,
                'details': details,
            })

        return result

    def list(self, request, *args, **kwargs):
        sort = self.request.GET.get('sort', None)
        queryset = self.get_queryset().order_by(sort)

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            aggregated_data = self.aggregate_data(serializer.data)
            return self.get_paginated_response(aggregated_data)

        serializer = self.get_serializer(queryset, many=True)
        aggregated_data = self.aggregate_data(serializer.data)

        return Response(aggregated_data)


class BuyLicense(generics.GenericAPIView):
    """
    "Buy" a license from the license pool by modifying the SoftwarePerComputer instance.
    """
    queryset = LicensePool.objects.all()
    serializer_class = PoolSerializer
    permission_classes = [IsUnitHead]

    def post(self, request):
        spc_id = request.data.get('spc_id')

        if not spc_id:
            return Response({'error': 'Missing spc_id.'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        pool_instance = LicensePool.objects.filter(spc_id=spc_id)
        if pool_instance.exists():
            pool_instance.delete()
        else:
            return Response({'error': 'License not found in the pool.'}, status=status.HTTP_404_NOT_FOUND)

        try:
            software_instance = SoftwarePerComputer.objects.get(id=spc_id)
            software_instance.primary_user_email = user.primary_user_email
            software_instance.primary_user_full_name = user.primary_user_full_name
            software_instance.computer_name = user.computer_name
            software_instance.organization = user.organization
            software_instance.last_used = datetime.today()
            software_instance.save()

            serialized_software_instance = SoftwarePerComputerSerializer(software_instance)
            return Response(serialized_software_instance.data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({'error': 'SoftwarePerComputer instance not found.'}, status=status.HTTP_404_NOT_FOUND)
