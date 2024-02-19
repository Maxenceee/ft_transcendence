from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('api/user/<int:id>/get', views.get_user, name='get_user'),
    path('api/home/get/lobbies', views.get_lobies, name='get_lobies'),
    path('login', views.login, name='login'),

    path('game/', views.game, name='game'),
    path('game4/', views.game4, name='game4'),
    path('gameError/', views.gameError, name='gameError'),
    path('gameWin/', views.gameWin, name='gameWin'),
    path('<path:url>', views.redirect, name='redirect'),

