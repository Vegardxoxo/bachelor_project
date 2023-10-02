from datetime import datetime

from api.models import LicensePool, PoolRequest, SoftwarePerComputer
from api.permissions import IsUnitHead
from api.serializers import PoolRequestSerializer
from django.db import IntegrityError
from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response


class UpdatePoolRequest(generics.RetrieveUpdateAPIView):
    """
    Retrieve, update or delete a pool request.
    """
    queryset = PoolRequest.objects.all()
    serializer_class = PoolRequestSerializer
    permission_classes = [permissions.IsAuthenticated, IsUnitHead]
    lookup_field = 'id'

    def update(self, request, *args, **kwargs):
        pool_request = self.get_object()

        if pool_request.completed:
            return Response({'error': 'This request has already been completed.'}, status=status.HTTP_400_BAD_REQUEST)

        action = request.data.get('action')
        if action not in ['approve', 'disapprove']:
            return Response({'error': 'Invalid action.'}, status=status.HTTP_400_BAD_REQUEST)

        pool_request.reviewed_by = request.user.primary_user_email
        pool_request.reviewed_date = datetime.now().date()
        if action == 'approve':
            pool_request.approved = True
            pool_request.completed = True

            if pool_request.request == 'add':
                try:
                    license_pool = LicensePool(
                        freed_by_organization=pool_request.contact_organization,
                        application_name=pool_request.application_name,
                        date_added=datetime.now(),
                        family=pool_request.family,
                        family_version=pool_request.family_version,
                        family_edition=pool_request.family_edition,
                        price=pool_request.price,
                        spc_id=pool_request.spc_id,
                    )
                    license_pool.save()
                except IntegrityError:
                    return Response({'error': 'This license already exists in the pool.'},
                                    status=status.HTTP_400_BAD_REQUEST)
            # the case where the request is to remove a license from the pool to use it
            elif pool_request.request == 'remove':
                spc_id = pool_request.spc_id
                pool_instance = LicensePool.objects.filter(spc_id=pool_request.spc_id)
                if pool_instance.exists():
                    pool_instance.delete()
                # get the relevant row in the SoftwarePerComputer table and update it to reflect the change.
                software_instance = SoftwarePerComputer.objects.get(id=spc_id)
                software_instance.primary_user_email = pool_request.requested_by.primary_user_email
                software_instance.primary_user_full_name = pool_request.requested_by.primary_user_full_name
                software_instance.computer_name = pool_request.requested_by.computer_name
                software_instance.organization = request.user.organization
                software_instance.last_used = datetime.today()
                software_instance.save()
        elif action == 'disapprove':
            pool_request.approved = False
            pool_request.completed = True

        pool_request.save()
        return Response(PoolRequestSerializer(pool_request).data)


class CreatePoolRequest(generics.CreateAPIView):
    """
    Create a new pool request.
    """
    queryset = PoolRequest.objects.all()
    serializer_class = PoolRequestSerializer


@api_view(['GET'])
def get_pool_request(request):
    """
    Check if the user already has an active request for this license.
    """
    spc_id = request.GET.get('spc_id')
    user = request.user
    if PoolRequest.objects.filter(spc_id=spc_id, requested_by=user.primary_user_email, completed=False).exists():
        return Response({'error': 'Du har allerede en aktiv forespørsel for denne lisensen.'},
                        status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response({}, status=status.HTTP_200_OK)


class GetPoolRequests(generics.ListCreateAPIView):
    """
    Get all pool requests for the current user.
    """
    serializer_class = PoolRequestSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        own_requests = self.get_serializer(queryset['own_requests'], many=True)
        org_requests = self.get_serializer(queryset['org_requests'], many=True)
        history = self.get_serializer(queryset['history'], many=True)

        return Response({
            'own_requests': own_requests.data,
            'org_requests': org_requests.data,
            'history': history.data
        })

    def get_queryset(self):
        user = self.request.user
        print()
        if user.is_unit_head:
            print('user is unit head')
            own_requests = PoolRequest.objects.filter(requested_by=user.primary_user_email, completed=False)
            org_requests = PoolRequest.objects.filter(contact_organization=user.organization, completed=False)
            history = PoolRequest.objects.filter(contact_organization=user.organization, completed=True)

        else:
            own_requests = PoolRequest.objects.filter(requested_by=user.primary_user_email, completed=False)
            org_requests = []
            history = PoolRequest.objects.filter(requested_by=user.primary_user_email, completed=True)
        return {'own_requests': own_requests, 'org_requests': org_requests, 'history': history}
