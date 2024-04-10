from django.http import HttpResponse, JsonResponse
from .models import *
from django.shortcuts import redirect
from datetime import datetime
from django.utils import timezone

def login_required(func):
	def wrapper(request, *args, **kwargs):
		if request.method == 'GET':
			res = redirect("/login")
		else:
			res = JsonResponse({"missingAuth": True, "user": False, "authenticated": False}, status=200)
		try:
			if 'token' not in request.COOKIES:
				return res
			cookie = request.COOKIES.get('token')
			if not cookie or not Token.objects.filter(token=cookie).exists():
				return res
			if Token.objects.get(token=cookie).is_valid == False:
				response = res
				response.delete_cookie('token')
				return response
			if Token.objects.get(token=cookie).expires_at < timezone.now():
				response = res
				response.delete_cookie('token')
				return response
			request.user = Token.objects.get(token=cookie).user
			return func(request, *args, **kwargs)
		except:
			return res
	return wrapper

def login_forbiden(func):
	def wrapper(request, *args, **kwargs):
		if request.method == 'GET':
			res = redirect("/")
		else:
			res = JsonResponse({"user": True, "authenticated": True}, status=200)
		try:
			if 'token' not in request.COOKIES:
				return func(request, *args, **kwargs)
			cookie = request.COOKIES.get('token')
			if cookie and Token.objects.filter(token=cookie).exists() and Token.objects.get(token=cookie).is_valid and Token.objects.get(token=cookie).expires_at > timezone.now():
				return res
			return func(request, *args, **kwargs)
		except:
			return res
	return wrapper
