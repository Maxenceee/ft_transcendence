from .models import *
from django.shortcuts import redirect
from datetime import datetime
from django.utils import timezone

def login_required(func):
    def wrapper(request, *args, **kwargs):
        if not request.COOKIES.get('token') or not Token.objects.filter(token=request.COOKIES.get('token')).exists():
            return redirect("/login")
        if Token.objects.get(token=request.COOKIES.get('token')).is_valid == False:
            response = redirect("/login")
            response.delete_cookie('token')
            return response
        if Token.objects.get(token=request.COOKIES.get('token')).expires_at < timezone.now():
            response = redirect("/login")
            response.delete_cookie('token')
            return response
        return func(request, *args, **kwargs)
    return wrapper

def login_forbiden(func):
    def wrapper(request, *args, **kwargs):
        cookie = request.COOKIES.get('token')
        if request.COOKIES.get('token') and Token.objects.filter(token=cookie).exists() and Token.objects.get(token=cookie).is_valid and Token.objects.get(token=cookie).expires_at > timezone.now():
            return redirect("/")
        return func(request, *args, **kwargs)
    return wrapper