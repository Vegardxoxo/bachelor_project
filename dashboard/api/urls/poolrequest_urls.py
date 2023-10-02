from api.views import UpdatePoolRequest, GetPoolRequests, CreatePoolRequest, get_pool_request
from django.urls import path

urlpatterns = [
    path('<int:id>', UpdatePoolRequest.as_view(), name='pool_requests'),
    path('get/', GetPoolRequests.as_view(), name='get_pool_req'),
    path('create', CreatePoolRequest.as_view(), name='create_pool_req'),
    path('check/', get_pool_request, name='check_pool_req')

]
