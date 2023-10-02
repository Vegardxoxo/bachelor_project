from api.views import GetLicensePool, UpdatePoolObject, CreatePoolObject, BuyLicense
from django.urls import path

urlpatterns = [
    path('get/', GetLicensePool.as_view(), name='licensepool'),
    path('update/<int:id>/', UpdatePoolObject.as_view(),
         name='software_per_computer_detail'),
    path('create', CreatePoolObject.as_view(), name='create_pool_object'),
    path('buy/', BuyLicense.as_view(), name='buy_license'),

]
