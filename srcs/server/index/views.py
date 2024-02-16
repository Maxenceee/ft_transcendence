from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404

# Create your views here.
def index(request):
    return render(request, 'views/index.html')

def game(request):
    return render(request, 'views/game.html')

def get_user(request, id):
    return HttpResponse(f'user page {id}')

def get_lobies(request):
    return HttpResponse('lobies page')

def login(request):
    return HttpResponse('login page')

def redirect(request, url):
    return render(request, 'views/index.html')