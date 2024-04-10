from django.http import HttpResponse, JsonResponse
from .models import *
from django.shortcuts import redirect
from datetime import datetime
from django.utils import timezone

def login_required(func):
	def wrapper(request, *args, **kwargs):
		try:
			if 'token' not in request.COOKIES:
				return JsonResponse({"missingAuth": True, "user": False, "authenticated": False}, status=200)
			cookie = request.COOKIES.get('token')
			if not cookie or not Token.objects.filter(token=cookie).exists():
				return JsonResponse({"missingAuth": True, "user": False, "authenticated": False}, status=200)
			if Token.objects.get(token=cookie).is_valid == False:
				response = JsonResponse({"missingAuth": True, "user": False, "authenticated": False}, status=200)
				response.delete_cookie('token')
				return response
			if Token.objects.get(token=cookie).expires_at < timezone.now():
				response = JsonResponse({"missingAuth": True, "user": False, "authenticated": False}, status=200)
				response.delete_cookie('token')
				return response
			request.user = Token.objects.get(token=cookie).user
			return func(request, *args, **kwargs)
		except:
			return JsonResponse({"missingAuth": True, "user": False, "authenticated": False}, status=200)
	return wrapper

def login_forbiden(func):
	def wrapper(request, *args, **kwargs):
		try:
			if 'token' not in request.COOKIES:
				return func(request, *args, **kwargs)
			cookie = request.COOKIES.get('token')
			if cookie and Token.objects.filter(token=cookie).exists() and Token.objects.get(token=cookie).is_valid and Token.objects.get(token=cookie).expires_at > timezone.now():
				return redirect("/")
			return func(request, *args, **kwargs)
		except:
			return redirect("/")
	return wrapper