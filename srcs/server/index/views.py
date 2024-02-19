from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
def index(request):
    return render(request, 'views/index.html')

def game(request):
    return render(request, 'views/game.html')

def game4(request):
    return render(request, 'views/game4.html')

def gameError(request):
    return render(request, 'views/gameError.html')

def gameWin(request):
    return render(request, 'views/gameWin.html')

  def get_user(request, id):
    return HttpResponse(f'user page {id}')

def get_lobies(request):
    return HttpResponse('lobies page')

def login(request):
    return render(request, 'views/connection.html')

def redirect(request, url):
    return render(request, 'views/index.html')

