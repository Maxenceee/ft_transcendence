from django.urls import path
from . import views

urlpatterns = [
	path('', views.game_2player, name='game'),

	path('<path:url>', views.not_found, name='redirect'),
]