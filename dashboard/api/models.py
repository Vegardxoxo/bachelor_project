from django.conf import settings
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models

User = settings.AUTH_USER_MODEL



class SoftwarePerComputer(models.Model):
    objects = models.Manager()  # default manager
    computer_name = models.CharField(max_length=100, verbose_name="Computer Name")
    application_name = models.CharField(max_length=100, verbose_name="Application Name")
    category = models.CharField(max_length=100, verbose_name="Category", null=True, blank=True)
    family = models.CharField(max_length=100, verbose_name="Family", null=True, blank=True)
    family_version = models.IntegerField(verbose_name="Family Version", null=True, blank=True)
    family_edition = models.IntegerField(verbose_name="Family Edition", null=True, blank=True)
    license_required = models.BooleanField(verbose_name="License Required", default=False)
    manufacturer = models.CharField(max_length=100, verbose_name="Manufacturer", null=True, blank=True)
    organization = models.CharField(max_length=100, verbose_name="Organization", null=True, blank=True)
    organization_path = models.CharField(max_length=200, verbose_name="Organization Path", null=True, blank=True)
    date_added = models.CharField(max_length=100, verbose_name="Date Added", null=True, blank=True)
    last_used = models.CharField(max_length=100, verbose_name="Last Used", null=True, blank=True)
    run_times = models.IntegerField(verbose_name="Run Times", null=True, blank=True)
    total_minutes = models.IntegerField(verbose_name="Total Minutes", null=True, blank=True)
    active_minutes = models.IntegerField(verbose_name="Active Minutes", null=True, blank=True)
    average_usage_per_run = models.FloatField(verbose_name="Average Usage Per Run", null=True, blank=True)
    active_usage_per_run = models.FloatField(verbose_name="Active Usage Per Run", null=True, blank=True)
    remote_total_minutes = models.IntegerField(verbose_name="Remote Total Minutes", null=True, blank=True)
    remote_active_minutes = models.IntegerField(verbose_name="Remote Active Minutes", null=True, blank=True)
    device_total_minutes = models.IntegerField(verbose_name="Device Total Minutes", null=True, blank=True)
    device_active_minutes = models.IntegerField(verbose_name="Device Active Minutes", null=True, blank=True)
    server = models.BooleanField(verbose_name="Server", default=False)
    cloud = models.BooleanField(verbose_name="Cloud", default=False)
    virtual = models.BooleanField(verbose_name="Virtual", default=False)
    portable = models.BooleanField(verbose_name="Portable", default=False)
    terminal_server = models.BooleanField(verbose_name="Terminal Server", default=False)
    test_development = models.BooleanField(verbose_name="Test Development", default=False)
    manual_client = models.BooleanField(verbose_name="Manual Client", default=False)
    manual_application = models.BooleanField(verbose_name="Manual Application", default=False)
    operating_system = models.CharField(max_length=100, verbose_name="Operating System", null=True, blank=True)
    total_cpus = models.IntegerField(verbose_name="Total CPUs", null=True, blank=True)
    total_cores = models.IntegerField(verbose_name="Total Cores", null=True, blank=True)
    last_scanned = models.DateField(verbose_name="Last Scanned", null=True, blank=True)
    status = models.CharField(max_length=100, verbose_name="Status", null=True, blank=True)
    gdpr_risk = models.BooleanField(verbose_name="GDPR Risk", default=False)
    manufacturer_gdpr_compliant = models.BooleanField(verbose_name="Manufacturer GDPR Compliant", default=False)
    manufacturer_ps_sh_compliant = models.BooleanField(verbose_name="Manufacturer PS/SH Compliant", default=False)
    manufacturer_dpd_compliant = models.BooleanField(verbose_name="Manufacturer DPD Compliant", default=False)
    suite = models.BooleanField(verbose_name="Suite", default=False)
    part_of_suite = models.BooleanField(verbose_name="Part of Suite", default=False)
    suite_names = models.CharField(max_length=100, verbose_name="Suite Names", null=True, blank=True)
    license_suite = models.BooleanField(verbose_name="License Suite", default=False)
    part_of_license_suite = models.BooleanField(verbose_name="Part of License Suite", default=False)
    license_suite_names = models.CharField(max_length=100, verbose_name="License Suite Names", null=True, blank=True)
    block_listed = models.BooleanField(verbose_name="Block Listed", default=False)
    primary_user = models.CharField(max_length=100, verbose_name="Primary User", null=True, blank=True)
    primary_user_full_name = models.CharField(max_length=100, verbose_name="Primary User Full Name", null=True,
                                              blank=True)
    primary_user_email = models.EmailField(verbose_name="Primary User Email", null=True, blank=True)
    price = models.FloatField(verbose_name="Price", null=True, blank=True)


# Model for the License Pool
class LicensePool(models.Model):
    objects = models.Manager()  # default manager
    freed_by_organization = models.CharField(max_length=100)
    application_name = models.CharField(max_length=100)
    date_added = models.DateField(max_length=100, default='1900-01-01')
    family = models.CharField(max_length=100, null=True, blank=True)
    family_version = models.CharField(max_length=100, null=True, blank=True)
    family_edition = models.CharField(max_length=100, null=True, blank=True)
    price = models.FloatField(verbose_name="Price", null=True, blank=True)
    spc_id = models.IntegerField(unique=True)



class PoolRequest(models.Model):
    objects = models.Manager()
    requested_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='requests', null=True,
                                     blank=True)

    contact_organization = models.CharField(max_length=100)
    application_name = models.CharField(max_length=100)
    family = models.CharField(max_length=100, null=True, blank=True)
    family_version = models.CharField(max_length=100, null=True, blank=True)
    family_edition = models.CharField(max_length=100, null=True, blank=True)
    request = models.CharField(max_length=100)
    request_date = models.DateField(blank=True, null=True)
    approved = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    reviewed_by = models.EmailField(max_length=100, null=True, blank=True)
    reviewed_date = models.DateField(blank=True, null=True)
    price = models.FloatField(verbose_name="Price", null=True, blank=True)
    spc_id = models.IntegerField(blank=True, null=True)


class CustomUserManager(BaseUserManager):
    def create_user(self, primary_user_email, password=None, is_unit_head=False, organization=None,
                    primary_user_full_name='', computer_name=''):
        user = self.model(primary_user_email=primary_user_email, is_unit_head=is_unit_head, organization=organization,
                          primary_user_full_name=primary_user_full_name, computer_name=computer_name)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, primary_user_email, password=None, primary_user_full_name='', computer_name=''):
        user = self.create_user(primary_user_email, password, organization='admin',
                                primary_user_full_name=primary_user_full_name, computer_name=computer_name)
        user.is_admin = True
        user.is_unit_head = True
        user.save()
        return user


class CustomUser(AbstractBaseUser):
    primary_user_email = models.EmailField(primary_key=True, unique=True)
    primary_user_full_name = models.CharField(max_length=100, default='')
    computer_name = models.CharField(max_length=100, default='')
    organization = models.CharField(max_length=100, default='')

    is_unit_head = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    objects = CustomUserManager()
    USERNAME_FIELD = 'primary_user_email'

    def __str__(self):
        return self.primary_user_email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_admin

    @property
    def requested_applications(self):
        return self.requests.all()

    @property
    def software_per_computers(self):
        return self.software_per_computer.all()
