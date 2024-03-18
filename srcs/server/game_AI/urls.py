from django.urls import path
from . import views

urlpatterns = [
	path('', views.game_AI, name='game'),

	path('<path:url>', views.not_found, name='redirect'),
]