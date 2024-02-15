from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('game/', views.game, name='game'),
    path('game4/', views.game4, name='game4'),
    path('gameError/', views.gameError, name='gameError'),
]