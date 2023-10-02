from datetime import date

from rest_framework import serializers

from .models import SoftwarePerComputer, PoolRequest, LicensePool


class SoftwarePerComputerSerializer(serializers.ModelSerializer):
    class Meta:
        model = SoftwarePerComputer
        fields = '__all__'


class PoolSerializer(serializers.ModelSerializer):
    class Meta:
        model = LicensePool
        fields = '__all__'

    def validate(self, data):
        if data['freed_by_organization'] not in SoftwarePerComputerSerializer.Meta.model.objects.values_list(
                'organization',
                flat=True).distinct():
            raise serializers.ValidationError("Organization does not exist")

        elif data['application_name'] not in SoftwarePerComputerSerializer.Meta.model.objects.values_list(
                'application_name', flat=True).distinct():
            raise serializers.ValidationError("Application does not exist")
        return data

    def create(self, validated_data):
        validated_data['date_added'] = date.today()
        return super(PoolSerializer, self).create(validated_data)


class PoolRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PoolRequest
        fields = '__all__'

    def validate(self, data):
        if data['contact_organization'] not in SoftwarePerComputerSerializer.Meta.model.objects.values_list(
                'organization',
                flat=True).distinct():
            raise serializers.ValidationError("Organization does not exist")

        if data['application_name'] not in SoftwarePerComputerSerializer.Meta.model.objects.values_list(
                'application_name', flat=True).distinct():
            raise serializers.ValidationError("Application does not exist")

        if data['request'] not in ['add', 'remove']:
            raise serializers.ValidationError("Request must be 'add' or 'remove'")


        if PoolRequestSerializer.Meta.model.objects.filter(spc_id=data['spc_id'], requested_by=data['requested_by'],
                                                           application_name=data['application_name'],
                                                           request=data['request'], completed=False).exists():
            raise serializers.ValidationError("Du har allerede en aktiv forespørsel for denne lisensen.")

        return data

    def create(self, validated_data):
        validated_data['request_date'] = date.today()
        return super(PoolRequestSerializer, self).create(validated_data)
