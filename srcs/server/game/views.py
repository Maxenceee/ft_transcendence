from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from index.decorators import *

# Create your views here.

@login_required
def game(request):
    return render(request, 'views/game.html')

@login_required
def game4(request):
    return render(request, 'views/game4.html')

@login_required
def gameError(request):
    return render(request, 'views/gameError.html')

@login_required
def gameWin(request):
    return render(request, 'views/gameWin.html')

@login_required
def not_found(request, url):
    return render(request, 'views/index.html')
