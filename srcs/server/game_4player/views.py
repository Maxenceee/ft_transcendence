from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404
from index.decorators import *

# Create your views here.

@login_required
def game_4player(request):
	return render(request, 'views/game4.html')

@login_required
def not_found(request, url):
	return redirect("/")
