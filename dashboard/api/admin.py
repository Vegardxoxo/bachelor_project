from django.contrib import admin

from .models import SoftwarePerComputer, LicensePool, PoolRequest, CustomUser

# Register your models here.
admin.site.register(SoftwarePerComputer)
admin.site.register(LicensePool)
admin.site.register(PoolRequest)


class PoolRequestsInline(admin.TabularInline):
    model = PoolRequest


class CustomUserAdmin(admin.ModelAdmin):
    inlines = [PoolRequestsInline]
    search_fields = ['primary_user_email', 'organization']


admin.site.register(CustomUser, CustomUserAdmin)
