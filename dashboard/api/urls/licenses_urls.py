from api.views import LicenseInfoView, get_organizations, get_software_recommendations, leaderboard, \
    get_org_software_names, \
    get_org_software_users, get_licenses_associated_with_user, get_reallocatabe_by_software_name, \
    get_org_software_users_by_name, software_counts, GetUserInfo, check_if_unused, get_potential_savings
from django.urls import path

urlpatterns = [
    path('organizations/', get_organizations, name='organizations'),
    path('recommendations/', get_software_recommendations, name='recommendations'),
    path('software/', get_org_software_names, name='software'),
    path('applications/', get_org_software_users, name='get_applications_by_user'),
    path('userlicenses/', get_licenses_associated_with_user,
         name='get_licenses_associated_with_user'),
    path('softwarebyname/<str:software>', get_reallocatabe_by_software_name,
         name='get_reallocatabe_by_software_name'),
    path('softwarebyuser/', get_org_software_users_by_name, name='get_org_software_users_by_name'),
    path('count', software_counts, name='software_counts'),
    path('user/', GetUserInfo.as_view(), name='user'),
    path('licenseinfo/', LicenseInfoView.as_view(), name='licenseinfo'),
    path('leaderboard/', leaderboard, name='leaderboard'),
    path('check/', check_if_unused, name='check_if_unused'),
    path('moneysaved/', get_potential_savings, name='get_potential_savings'),

]
