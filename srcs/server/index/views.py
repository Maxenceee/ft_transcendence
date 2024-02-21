from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from .decorators import *
from passlib.hash import django_pbkdf2_sha256 as encrypting
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
        return render(request, 'views/connection.html')
    elif request.method == "POST":
        username = request.POST['login']
        password = request.POST['password']
        if not username or not password:
            return render(request, 'views/connection.html', {"login": username, "is_invalid": True})
        
        if User.objects.filter(username=username).exists():
            user = User.objects.get(username=username)
            if encrypting.verify(password, user.password):
                for token in Token.objects.filter(user=user, is_valid=True):
                    token.is_valid = False
                    token.save()
                token=''.join(random.choices(string.ascii_letters + string.digits, k=100))
                response = redirect("/")
                response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
                Token.objects.create(token=token, user=user)
                return response
        return render(request, 'views/connection.html', {"login": username, "is_invalid": True})

@login_forbiden
def signup(request):
    if request.method == "GET":
        return render(request, 'views/connection.html', { "is_signup": True, "action_url": "/signup"})
    elif request.method == "POST":
        username = request.POST['login']
        password = request.POST['password']
        if not username or not password:
            return render(request, 'views/connection.html', {"login": username, "is_invalid": True, "is_signup": True, "action_url": "/signup"})
        
        if User.objects.filter(username=username).exists():
            return render(request, 'views/connection.html', {"login": username, "is_signup": True, "action_url": "/signup", "exists": True})
        
        password = encrypting.hash(password)
        user = User.objects.create(username=username, password=password)
        response = redirect("/")

        token=''.join(random.choices(string.ascii_letters + string.digits, k=100))
        response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
        Token.objects.create(token=token, user=user)
        return response

@login_required
def not_found(request, url):
    return redirect("/")
