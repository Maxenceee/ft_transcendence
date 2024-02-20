from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
import logging

# Create your views here.
def index(request):
    return render(request, 'views/index.html')

def get_user(request, id):
    return HttpResponse(f'user page {id}')

def get_lobies(request):
    return HttpResponse('lobies page')

def login(request):
    if request.method == "GET":
        return render(request, 'views/connection.html', {"login": "", "is_invalid": False})
    elif request.method == "POST":
        username = request.POST['login']
        password = request.POST['password']
        if not username or not password:
            return render(request, 'views/connection.html', {"login": username, "is_invalid": True})
        if User.objects.filter(username=username, password=password).exists():
            return redirect("/")
        return render(request, 'views/connection.html', {"login": username, "is_invalid": True})

def not_found(request, url):
    return render(request, 'views/index.html')
