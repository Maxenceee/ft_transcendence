from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from index.models import *
from index.decorators import *

# Create your views here.
@login_required
def index(request):
	if request.method != 'GET':
		return JsonResponse({'error': 'Method not allowed'}, status=405)
	return render(request, 'views/index.html')