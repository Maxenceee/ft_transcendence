from django.http import HttpResponse
from django.shortcuts import render, get_object_or_404, redirect
from .models import *
from .decorators import *
from passlib.hash import django_pbkdf2_sha256 as pbkdf2
import logging
import string
import os
import requests
import urllib.parse

def get_new_default_profile_picture():
	try:
		response = requests.get("https://cdn.maxencegama.dev/placeholder/u/pl/static/profile/new")
		response = response.json()
		return response['content']
	except:
		return None

def makeid(length):
	return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

# Create your views here.
@login_required
def index(request):
	return render(request, 'views/index.html', {"username": request.user.nickname})

@login_required
def user_page(request, id):
	return render(request, 'views/user.html', {"username": request.user.nickname, "user_profile_picture": request.user.default_profile_picture})

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
		id = makeid(10)
		while User.objects.filter(id=id).exists():
			id = makeid(10)

		default_profile_picture = get_new_default_profile_picture()
		if (default_profile_picture == None):
			logging.error("Failed to get default profile picture")
			default_profile_picture = ""
		user = User.objects.create(id=id, nickname=username, username=username, password=password, default_profile_picture=default_profile_picture)
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
	REDIRECT_URI = os.environ.get('REDIRECT_URI')

	data = {
		'grant_type': 'authorization_code',
		'client_id': INTRA_USER,
		'client_secret': INTRA_SECRET,
		'code': code,
		'redirect_uri': f'{REDIRECT_URI}/callback/intra'
	}
	logging.info(data)
	try:
		response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
		response = response.json()
		access_token = response['access_token']
		intra_data = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
		intra_data = intra_data.json()
		logging.info(intra_data)
		intra_id = intra_data['login']
		default_profile_picture = intra_data['image']['versions']['medium']
	except:
		return redirect("/login")
	if not User.objects.filter(intra_id=intra_id).exists():
		id = makeid(10)
		while User.objects.filter(id=id).exists():
			id = makeid(10)

		user = User.objects.create(id=id, nickname=intra_id, intra_id=intra_id, default_profile_picture=default_profile_picture)
	else:
		user = User.objects.get(intra_id=intra_id)

	response = redirect("/")
	token = makeid(100)
	while Token.objects.filter(token=token).exists():
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
		swivel_data = requests.get('https://api.maxencegama.dev/user/user.full', headers={'Authorization': f'Bearer {access_token}'})
		swivel_data = swivel_data.json()
		swivel_id = swivel_data['username']
		default_profile_picture = swivel_data['account_default_picture_url']
	except:
		return redirect("/login")
	if not User.objects.filter(swivel_id=swivel_id).exists():
		id = makeid(10)
		while User.objects.filter(id=id).exists():
			id = makeid(10)

		user = User.objects.create(id=id, nickname=swivel_id, swivel_id=swivel_id, default_profile_picture=default_profile_picture)
	else:
		user = User.objects.get(swivel_id=swivel_id)

	response = redirect("/")
	token = makeid(100)
	while Token.objects.filter(token=token).exists():
		token = makeid(100)
	Token.objects.create(token=token, user=user)
	response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
	return response


@login_required
def not_found(request, url):
	return redirect("/")

@login_required
def logout(request):
	cookie = request.COOKIES.get('token')
	response = redirect("/")
	if not cookie or not Token.objects.filter(token=cookie).exists():
		return response
	if Token.objects.get(token=cookie).is_valid:
		token = Token.objects.get(token=cookie)
		token.is_valid = False
		token.save()
	return response

@login_required
def api_get_user(request, id):
	if id == "me":
		id = request.COOKIES.get('token')
		user = Token.objects.get(token=id).user
	else:
		user = get_object_or_404(User, id=id)
	response = user.to_json()
	return HttpResponse(json.dumps(response), content_type="application/json")

def api_update_user(request, id, type):
	cookie = request.COOKIES.get('token')
	if not cookie or not Token.objects.filter(token=cookie).exists():
		return HttpResponse("Forbidden", status=403)
	if not Token.objects.get(token=cookie).is_valid:
		return HttpResponse("Forbidden", status=403)
	if Token.objects.get(token=cookie).user.id != id:
		return HttpResponse("Forbidden", status=403)
	user = get_object_or_404(User, id=id)
	if type == "nickname":
		user.nickname = request.POST['nickname']
	elif type == "password":
		user.password = pbkdf2.hash(request.POST['password'])
	user.save()
	return HttpResponse("success")