from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from index.models import *
from index.decorators import *

# Create your views here.
@login_required
def index(request):
	return render(request, 'views/index.html', {"username": request.user.nickname})

@login_required
def not_found(request, url):
	return render(request, 'views/index.html', {"username": request.user.nickname})