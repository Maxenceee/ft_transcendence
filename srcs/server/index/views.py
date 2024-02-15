from django.http import HttpResponseForbidden
from django.shortcuts import render, get_object_or_404

# Create your views here.
def index(request):
    return render(request, 'views/index.html')

def game(request):
    return render(request, 'views/game.html')