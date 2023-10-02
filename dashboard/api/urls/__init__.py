from django.urls import path, include

from . import auth_urls, licensepool_urls, licenses_urls, poolrequest_urls

urlpatterns = [
    path('licenses/', include(licenses_urls.urlpatterns)),
    path('requests/', include(poolrequest_urls.urlpatterns)),
    path('pool/', include(licensepool_urls.urlpatterns)),
    path('login/', include(auth_urls.urlpatterns)),
]
