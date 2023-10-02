from django.urls import path, include

urlpatterns = [
    path('licenses/', include('dashboard.api.urls.licenses_urls')),
    path('requests/', include('dashboard.api.urls.poolrequest_urls')),
    path('pool/', include('dashboard.api.urls.licensepool_urls')),
    path('login/', include('dashboard.api.urls.auth_urls')),
]
