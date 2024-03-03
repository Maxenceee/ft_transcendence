from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('user/<int:id>', views.user_page, name='user'),
    
    path('login', views.login, name='login'),
    path('signup', views.signup, name='signup'),

    path('callback/intra', views.callback_intra, name='callback_intra'),
    path('callback/swivel', views.callback_swivel, name='callback_swivel'),

    path('api/user/<int:id>/get', views.get_user, name='get_user'),
    path('api/home/get/lobbies', views.get_lobies, name='get_lobies'),

    path('<path:url>', views.not_found, name='redirect'),
]

