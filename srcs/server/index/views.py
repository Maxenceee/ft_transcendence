from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from .decorators import *
from passlib.hash import django_pbkdf2_sha256 as pbkdf2
import logging
import os
import requests

def makeid(length):
    return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Create your views here.
@login_required
def index(request):
    return render(request, 'views/index.html', {"username": request.user.nickname})

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
        user = User.objects.create(login_type=0, nickname=username, username=username, password=password)
        response = redirect("/")

        token = makeid(100)
        Token.objects.create(token=token, user=user)
        response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
        return response

def callback_intra(request):
    #debug
    code = request.GET.get('code', '')
    INTRA_USER = os.environ.get('INTRA_USER')
    INTRA_SECRET = os.environ.get('INTRA_SECRET')

    data = {
    'grant_type': 'authorization_code',
    'client_id': INTRA_USER,
    'client_secret': INTRA_SECRET,
    'code': code,
    'redirect_uri': 'https://localhost:3000'
    }

    response = requests.post('https://api.intra.42.fr/oauth/token', data=data)

    logging.info(response.json())

    return redirect("/login")
    #end of debug


    intra_id = "ngennaro"

    if not User.objects.filter(intra_id=intra_id).exists():
        user = User.objects.create(login_type=1, nickname=intra_id, intra_id=intra_id)
    else:
        user = User.objects.get(intra_id=intra_id)
    response = redirect("/")
    token = makeid(100)
    Token.objects.create(token=token, user=user)
    response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
    return response

@login_required
def not_found(request, url):
    return redirect("/")


# curl -F grant_type=authorization_code \
# -F client_id=u-s4t2ud-dd8dc19aefc610dce6179858323eb56cf27424f87b499071cfd0e3b59165c4c6 \
# -F client_secret=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 \
# -F code=dfa0e809d941ab076ac04451d9d9b1417235f61644c49dfb92bc1ceb51f57e9b \
# -F redirect_uri=http://localhost:3000 \
# -X POST https://api.intra.42.fr/oauth/token