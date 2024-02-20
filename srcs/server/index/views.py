from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from .decorators import *
import logging

# Create your views here.
@login_required
def index(request):
    return render(request, 'views/index.html', {"username": request.user.username})

@login_required
def get_user(request, id):
    return HttpResponse(f'user page {id}')

@login_required
def get_lobies(request):
    return HttpResponse('lobies page')

@login_forbiden
def login(request):
    if request.method == "GET":
        return render(request, 'views/connection.html', {"login": "", "is_invalid": False})
    elif request.method == "POST":
        username = request.POST['login']
        password = request.POST['password']
        if not username or not password:
            return render(request, 'views/connection.html', {"login": username, "is_invalid": True})
        
        if User.objects.filter(username=username, password=password).exists():
            user = User.objects.get(username=username, password=password)
            for token in Token.objects.filter(user=user, is_valid=True):
                token.is_valid = False
                token.save()
            token=''.join(random.choices(string.ascii_letters + string.digits, k=100))
            response = redirect("/")
            response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
            Token.objects.create(token=token, user=user)
            return response
        return render(request, 'views/connection.html', {"login": username, "is_invalid": True})

@login_required
def not_found(request, url):
    return redirect("/")
