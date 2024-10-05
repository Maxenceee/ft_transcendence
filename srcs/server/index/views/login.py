from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from index.models import *
from index.decorators import *
from passlib.hash import django_pbkdf2_sha256 as pbkdf2
import logging
import string
import os
import requests
import urllib.parse

def get_new_default_profile_picture():
	try:
		response = requests.get("https://cdn.mgama.me/placeholder/u/pl/static/profile/new")
		response = response.json()
		return response['content']
	except:
		return None

def makeid(length):
	return ''.join(random.choices(string.ascii_letters + string.digits, k=length))

@login_forbiden
def login(request):
	try:
		if request.method == "GET":
			return render(request, 'views/connection.html')
		elif request.method == "POST":
			if 'login' not in request.POST or 'password' not in request.POST:
				return render(request, 'views/connection.html', {"is_invalid": True})
			username = request.POST['login']
			password = request.POST['password']
			if not username or not password:
				return render(request, 'views/connection.html', {"login": username, "is_invalid": True})
			
			if User.objects.filter(username=username).exists():
				user = User.objects.get(username=username)
				try :
					if pbkdf2.verify(password, user.password):
						token = makeid(100)
						response = redirect("/")
						Token.objects.create(token=token, user=user)
						response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
						return response
				except:
					return render(request, 'views/connection.html', {"login": username, "is_invalid": True})
			return render(request, 'views/connection.html', {"login": username, "is_invalid": True})
		else :
			return JsonResponse({'error': 'Method not allowed'}, status=405)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_forbiden
def signup(request):
	try:
		if request.method == "GET":
			return render(request, 'views/connection.html', { "is_signup": True, "action_url": "/signup"})
		elif request.method == "POST":
			if 'login' not in request.POST or 'password' not in request.POST:
				return render(request, 'views/connection.html', {"is_invalid": True, "is_signup": True, "action_url": "/signup"})
			username = request.POST['login']
			password = request.POST['password']
			if not username or not password:
				return render(request, 'views/connection.html', {"login": username, "is_invalid": True, "is_signup": True, "action_url": "/signup"})
			
			if len(username) < 3 or len(username) > 10 or len(password) < 3 or len(password) > 20:
				return render(request, 'views/connection.html', {"login": username, "is_signup": True, "action_url": "/signup", "is_invalid": True})
			
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

			nickname = username
			while User.objects.filter(nickname=nickname).exists():
				nickname = f"{nickname}_{makeid(5)}"		

			user = User.objects.create(id=id, nickname=nickname, username=username, password=password, default_profile_picture=default_profile_picture)
			response = redirect("/")

			token = makeid(100)
			Token.objects.create(token=token, user=user)
			response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
			return response
		else:
			return JsonResponse({'error': 'Method not allowed'}, status=405)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_forbiden
def callback_intra(request):
	try:
		code = request.GET.get('code', '')
		INTRA_USER = os.environ.get('INTRA_USER')
		INTRA_SECRET = os.environ.get('INTRA_SECRET')
		BASE_URI = os.environ.get('BASE_URI')

		data = {
			'grant_type': 'authorization_code',
			'client_id': INTRA_USER,
			'client_secret': INTRA_SECRET,
			'code': code,
			'redirect_uri': f'{BASE_URI}/callback/intra'
		}
		try:
			response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
			response = response.json()
			access_token = response['access_token']
			logging.info(f'Bearer {access_token}')
			intra_data = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {access_token}'})
			intra_data = intra_data.json()
			intra_id = intra_data['login']

			if intra_id == "mbrement":
				default_profile_picture = "/static/images/teapot.gif"
			elif intra_id == "elamadon":
				default_profile_picture = "/static/images/bh_elisa.gif"
			elif intra_id == "ngennaro":
				default_profile_picture = "/static/images/tkt_matrix.gif"
			elif "image" in intra_data and "versions" in intra_data['image'] and "medium" in intra_data['image']['versions']:
				default_profile_picture = intra_data['image']['versions']['medium']
			else:
				default_profile_picture = get_new_default_profile_picture()
				if (default_profile_picture == None):
					logging.error("Failed to get default profile picture")
					default_profile_picture = ""
		except:
			return redirect("/login")

		if not User.objects.filter(intra_id=intra_id).exists():
			id = makeid(10)
			while User.objects.filter(id=id).exists():
				id = makeid(10)

			nickname = intra_id
			while User.objects.filter(nickname=nickname).exists():
				nickname = f"{nickname}_{makeid(5)}"

			user = User.objects.create(id=id, nickname=nickname, intra_id=intra_id, default_profile_picture=default_profile_picture)
		else:
			user = User.objects.get(intra_id=intra_id)

		response = redirect("/")
		token = makeid(100)
		while Token.objects.filter(token=token).exists():
			token = makeid(100)

		Token.objects.create(token=token, user=user)
		response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
		return response
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

def callback_swivel(request):
	try:
		code = request.GET.get('code', '')
		SWIVEL_CLIENT_ID = os.environ.get('SWIVEL_CLIENT_ID')
		SWIVEL_CLIENT_SECRET = os.environ.get('SWIVEL_CLIENT_SECRET')
		id = None

		data = {
			'client_id': SWIVEL_CLIENT_ID,
			'client_secret': SWIVEL_CLIENT_SECRET,
			'code': code,
		}
		try:
			query_string = urllib.parse.urlencode(data)
			response = requests.post(f"https://auth0.mgama.me/o/auth/access_token?{query_string}")
			response = response.json()
			access_token = response['access_token']
			swivel_data = requests.get('https://api.mgama.me/user/user.profile', headers={'Authorization': f'Bearer {access_token}'})
			swivel_data = swivel_data.json()
			swivel_id = swivel_data['id']
			if swivel_id == "sVHs1WArJ9lk1Y4J9kbk":
				id = "maxence"
			swivel_username = swivel_data['username']
			default_profile_picture = swivel_data['profile_picture']
			if default_profile_picture == None:
				default_profile_picture = get_new_default_profile_picture()
				if (default_profile_picture == None):
					logging.error("Failed to get default profile picture")
					default_profile_picture = ""
		except:
			return redirect("/login")

		if not User.objects.filter(swivel_id=swivel_id).exists():
			if id is None:
				id = makeid(10)
			while User.objects.filter(id=id).exists():
				id = makeid(10)

			nickname = swivel_username
			while User.objects.filter(nickname=nickname).exists():
				nickname = f"{nickname}_{makeid(5)}"

			user = User.objects.create(id=id, nickname=nickname, swivel_id=swivel_id, default_profile_picture=default_profile_picture)
		else:
			user = User.objects.get(swivel_id=swivel_id)

		response = redirect("/")
		token = makeid(100)
		while Token.objects.filter(token=token).exists():
			token = makeid(100)

		Token.objects.create(token=token, user=user)
		response.set_cookie(key='token', value=token, httponly=True, expires=7*24*60*60, samesite='Lax')
		return response
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def logout(request):
	try:
		cookie = request.COOKIES.get('token')
		response = redirect("/")
		if not cookie or not Token.objects.filter(token=cookie).exists():
			return response

		if Token.objects.get(token=cookie).is_valid:
			token = Token.objects.get(token=cookie)
			token.is_valid = False
			token.save()
		return response
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)
