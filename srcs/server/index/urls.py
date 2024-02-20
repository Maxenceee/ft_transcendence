from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/user/<int:id>/get', views.get_user, name='get_user'),
    path('api/home/get/lobbies', views.get_lobies, name='get_lobies'),
    path('login', views.login, name='login'),

    path('<path:url>', views.not_found, name='redirect'),
]

