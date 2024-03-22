from django.urls import path
from . import views

urlpatterns = [
	path('', views.index, name='index'),
	# temporaire pour les tests
	# path('user/<str:id>', views.user_page, name='user'),
	
	path('login', views.login, name='login'),
	path('signup', views.signup, name='signup'),
	path('logout', views.logout, name='logout'),

	path('callback/intra', views.callback_intra, name='callback_intra'),
	path('callback/swivel', views.callback_swivel, name='callback_swivel'),

	path('api/user/<str:id>/get', views.api_get_user, name='get_user'),
	path('api/user/update/nickname', views.api_update_user, name='update_user'),
	path('api/user/update/picture', views.api_update_picture, name='update_picture'),

	path('<path:url>', views.not_found, name='redirect'),
]