from .models import *
from django.shortcuts import redirect
from datetime import datetime
from django.utils import timezone

def login_required(func):
	def wrapper(request, *args, **kwargs):
		if 'token' not in request.COOKIES:
			return redirect("/login")
		cookie = request.COOKIES.get('token')
		if not cookie or not Token.objects.filter(token=cookie).exists():
			return redirect("/login")
		if Token.objects.get(token=cookie).is_valid == False:
			response = redirect("/login")
			response.delete_cookie('token')
			return response
		if Token.objects.get(token=cookie).expires_at < timezone.now():
			response = redirect("/login")
			response.delete_cookie('token')
			return response
		request.user = Token.objects.get(token=cookie).user
		return func(request, *args, **kwargs)
	return wrapper

def login_forbiden(func):
	def wrapper(request, *args, **kwargs):
		if 'token' not in request.COOKIES:
			return func(request, *args, **kwargs)
		cookie = request.COOKIES.get('token')
		if cookie and Token.objects.filter(token=cookie).exists() and Token.objects.get(token=cookie).is_valid and Token.objects.get(token=cookie).expires_at > timezone.now():
			return redirect("/")
		return func(request, *args, **kwargs)
	return wrapper