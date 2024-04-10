from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from index.models import *
from index.decorators import *
import logging
from PIL import Image
from django.http import HttpResponse
from django.core.files.storage import default_storage

@login_required
def api_get_user(request, id):
	try:
		if request.method != 'GET':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		if id == "me":
			id = request.COOKIES.get('token')
			user = Token.objects.get(token=id).user
		else:
			user = get_object_or_404(User, id=id)
		response = user.to_json()
		
		return JsonResponse(response)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def api_get_user_following(request, id):
	try:
		if request.method != 'GET':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		if id == "me":
			id = request.COOKIES.get('token')
			user = Token.objects.get(token=id).user
		else:
			user = get_object_or_404(User, id=id)
		following = []
		for user in user.following.all():
			following.append(user.resume_to_json())
		response = {
			"following": following,
		}

		return JsonResponse(response)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def api_update_user(request):
	try:
		if request.method != 'POST':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		id = request.COOKIES.get('token')
		user = Token.objects.get(token=id).user

		try :
			data = json.loads(request.body)
		except:
			return JsonResponse({'error': 'Invalid JSON'}, status=400)

		if 'nickname' not in data:
			return JsonResponse({'error': 'Missing nickname'}, status=400)
		if len(data['nickname']) < 3:
			return JsonResponse({'error': 'Nickname too short'}, status=400)
		if len(data['nickname']) > 20:
			return JsonResponse({'error': 'Nickname too long'}, status=400)
		user.nickname = data['nickname']
		user.save()
		return JsonResponse({'message': 'Succes'}, status=200)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def api_update_picture(request):
	try:
		if request.method != 'POST':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		id = request.COOKIES.get('token')
		user = Token.objects.get(token=id).user
		profile_picture = request.FILES['profile_picture']
		content_type = profile_picture.content_type

		if content_type not in ['image/jpeg', 'image/png']:
			return JsonResponse({'error': 'Format de fichier non supporté. Seuls les fichiers JPEG et PNG sont acceptés.'}, status=400)

		user.profile_picture_image = profile_picture
		user.save()
		return JsonResponse({'message': 'Photo de profil mise à jour avec succès.'})
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def api_delete_picture(request):
	try:
		if request.method != 'POST':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		id = request.COOKIES.get('token')
		user = Token.objects.get(token=id).user
		user.profile_picture_image = None
		user.save()
		return JsonResponse({'message': 'Photo de profil supprimée avec succès.'})
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)
		

@login_required
def api_avatar(request, id):
	try:
		if request.method != 'GET':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		try:
			with default_storage.open(f"avatar/{id}", 'rb') as img_file:
				image = Image.open(img_file).convert("RGB")
				response = HttpResponse(content_type="image/jpeg")
				image.save(response, "JPEG")
				return response
		except FileNotFoundError:
			return JsonResponse({'error': 'Image not found.'}, status=404)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def api_search_user(request, id):
	try:
		if request.method != 'GET':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		consumer = Token.objects.get(token=request.COOKIES.get('token')).user
		users = User.objects.filter(nickname__contains=id)
		response = []
		for user in users:
			if user.id != consumer.id:
				response.append(user.resume_to_json())
		return JsonResponse(response, safe=False)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def api_follow(request, id):
	try:
		if request.method != 'POST':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		user = Token.objects.get(token=request.COOKIES.get('token')).user
		user_to_follow = get_object_or_404(User, id=id)
		if user == user_to_follow:
			return JsonResponse({'error': 'You cannot follow yourself'}, status=400)
		user.following.add(user_to_follow)
		following = []
		for user in user.following.all():
			following.append(user.resume_to_json())
		response = {
			"following": following,
		}
		return JsonResponse(response, safe=False)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)

@login_required
def api_unfollow(request, id):
	try:
		if request.method != 'POST':
			return JsonResponse({'error': 'Method not allowed'}, status=405)
		user = Token.objects.get(token=request.COOKIES.get('token')).user
		user_to_unfollow = get_object_or_404(User, id=id)
		if user == user_to_unfollow:
			return JsonResponse({'error': 'You cannot unfollow yourself'}, status=400)
		user.following.remove(user_to_unfollow)
		following = []
		for user in user.following.all():
			following.append(user.resume_to_json())
		response = {
			"following": following,
		}
		return JsonResponse(response, safe=False)
	except:
		return JsonResponse({'error': 'Bad request'}, status=400)