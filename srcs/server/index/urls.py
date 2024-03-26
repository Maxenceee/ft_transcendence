from django.urls import path

from index.views.index import (index)
from index.views.login import (login, signup, logout, callback_intra, callback_swivel)
from index.views.api import (api_get_user, api_search_user, api_avatar, api_update_user, api_update_picture, api_follow, api_unfollow)

urlpatterns = [
	path('', index, name='index'),
	
	path('login', login, name='login'),
	path('signup', signup, name='signup'),
	path('logout', logout, name='logout'),

	path('callback/intra', callback_intra, name='callback_intra'),
	path('callback/swivel', callback_swivel, name='callback_swivel'),

	path('api/user/<str:id>/get', api_get_user, name='get_user'),
	path('api/user/<str:id>/search', api_search_user, name='search_user'),
	path('api/avatar/<str:id>', api_avatar, name='avatar'),
	path('api/user/update/nickname', api_update_user, name='update_user'),
	path('api/user/update/picture', api_update_picture, name='update_picture'),
	path('api/follow/<str:id>', api_follow, name='follow'),
	path('api/unfollow/<str:id>', api_unfollow, name='unfollow'),
]