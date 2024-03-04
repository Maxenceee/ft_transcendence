from django.urls import path
from . import views

urlpatterns = [
	path('2', views.game, name='game'),
	path('4', views.game4, name='game4'),
	path('error', views.gameError, name='gameError'),
	path('win', views.gameWin, name='gameWin'),

	path('<path:url>', views.not_found, name='redirect'),
]