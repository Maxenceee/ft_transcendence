from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from .decorators import *
from passlib.hash import django_pbkdf2_sha256 as pbkdf2
import logging
import os
import requests
import urllib.parse

def makeid(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Create your views here.
@login_required
def index(request):
    return render(request, 'views/index.html', {"username": request.user.nickname})

@login_required
def user_page(request, id):
    return render(request, 'views/user.html', {"username": request.user.nickname})

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
            if pbkdf2.verify(password, user.password):
                token = makeid(100)
                response = redirect("/")
                Token.objects.create(token=token, user=user)
                response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
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
        
        password = pbkdf2.hash(password)
        user = User.objects.create(nickname=username, username=username, password=password)
        response = redirect("/")

        token = makeid(100)
        Token.objects.create(token=token, user=user)
        response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
        return response

@login_forbiden
def callback_intra(request):
    code = request.GET.get('code', '')
    INTRA_USER = os.environ.get('INTRA_USER')
    INTRA_SECRET = os.environ.get('INTRA_SECRET')
    IP_LOCAL = os.environ.get('IP_LOCAL')

    data = {
    'grant_type': 'authorization_code',
    'client_id': INTRA_USER,
    'client_secret': INTRA_SECRET,
    'code': code,
    'redirect_uri': f'http://{IP_LOCAL}:3000/callback/intra'
    }
    try:
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        response = response.json()
        access_token = response['access_token']
        intra_id = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
        intra_id = intra_id.json()
        intra_id = intra_id['login']
    except:
        return redirect("/login")
    if not User.objects.filter(intra_id=intra_id).exists():
        user = User.objects.create(nickname=intra_id, intra_id=intra_id)
    else:
        user = User.objects.get(intra_id=intra_id)
    response = redirect("/")
    token = makeid(100)
    Token.objects.create(token=token, user=user)
    response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
    return response

def callback_swivel(request):
    code = request.GET.get('code', '')
    SWIVEL_USER = os.environ.get('SWIVEL_USER')
    SWIVEL_SECRET = os.environ.get('SWIVEL_SECRET')

    data = {
        'client_id': SWIVEL_USER,
        'client_secret': SWIVEL_SECRET,
        'code': code,
    }
    try:
        query_string = urllib.parse.urlencode(data)
        response = requests.post(f"https://auth0.maxencegama.dev/o/auth/access_token?{query_string}")
        response = response.json()
        access_token = response['access_token']
        swivel_id = requests.get('https://api.maxencegama.dev/user/user.full', headers={'Authorization': f'Bearer {access_token}'})
        swivel_id = swivel_id.json()
        swivel_id = swivel_id['username']
    except:
        return redirect("/login")
    if not User.objects.filter(swivel_id=swivel_id).exists():
        user = User.objects.create(nickname=swivel_id, swivel_id=swivel_id)
    else:
        user = User.objects.get(swivel_id=swivel_id)
    response = redirect("/")
    token = makeid(100)
    Token.objects.create(token=token, user=user)
    response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
    return response




@login_required
def not_found(request, url):
    return redirect("/")