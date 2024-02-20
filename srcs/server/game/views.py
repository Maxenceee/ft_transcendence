from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.

def game(request):
    return render(request, 'views/game.html')

def game4(request):
    return render(request, 'views/game4.html')

def gameError(request):
    return render(request, 'views/gameError.html')

def gameWin(request):
    return render(request, 'views/gameWin.html')

def not_found(request, url):
    return render(request, 'views/index.html')
