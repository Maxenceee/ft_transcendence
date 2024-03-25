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
	if id == "me":
		id = request.COOKIES.get('token')
		user = Token.objects.get(token=id).user
	else:
		user = get_object_or_404(User, id=id)
	response = user.to_json()

	return JsonResponse(response)

@login_required
def api_update_user(request):
	id = request.COOKIES.get('token')
	user = Token.objects.get(token=id).user
	user.nickname = request.POST['nickname']
	user.save()
	return JsonResponse({'message': 'Succes'}, status=200)

@login_required
def api_update_picture(request):
	if request.method == 'POST':
		id = request.COOKIES.get('token')
		user = Token.objects.get(token=id).user

		if 'file' in request.FILES:
			profile_picture = request.FILES['file']
			content_type = profile_picture.content_type

			if content_type not in ['image/jpeg', 'image/png']:
				return JsonResponse({'error': 'Format de fichier non supporté. Seuls les fichiers JPEG et PNG sont acceptés.'}, status=400)

			user.profile_picture_image = profile_picture
			user.save()
			return JsonResponse({'message': 'Photo de profil mise à jour avec succès.'})
		else:
			return JsonResponse({'error': 'Aucun fichier téléchargé.'}, status=400)
		

@login_required
def api_avatar(request, id):
	try:
		logging.info(id)
		with default_storage.open(f"avatar/{id}", 'rb') as img_file:
			image = Image.open(img_file).convert("RGB")
			response = HttpResponse(content_type="image/jpeg")
			image.save(response, "JPEG")
			return response
	except FileNotFoundError:
		return JsonResponse({'error': 'Image not found.'}, status=404)
	
@login_required
def api_search_user(request, id):
	users = User.objects.filter(nickname__contains=id)
	response = []
	for user in users:
		response.append(user.resume_to_json())
	return JsonResponse(response)

@login_required
def api_follow(request, id):
	user = Token.objects.get(token=request.COOKIES.get('token')).user
	user_to_follow = get_object_or_404(User, id=id)
	user.following.add(user_to_follow)
	return HttpResponse({'message': 'Succes'}, status=200)

@login_required
def api_unfollow(request, id):
	user = Token.objects.get(token=request.COOKIES.get('token')).user
	user_to_unfollow = get_object_or_404(User, id=id)
	user.following.remove(user_to_unfollow)
	return HttpResponse({'message': 'Succes'}, status=200)