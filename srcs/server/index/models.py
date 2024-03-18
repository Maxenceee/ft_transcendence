from django.db import models
from datetime import datetime, timedelta
import random
import json
from datetime import datetime, timedelta
import logging

class User(models.Model):
	index = models.AutoField(primary_key=True)
	id = models.CharField(max_length=10)
	nickname = models.CharField(max_length=100)
	is_online = models.BooleanField(default=False)
	is_ingame = models.BooleanField(default=False)
	game_history = models.ManyToManyField('Game_history', related_name='game_history')
	
	username = models.CharField(max_length=100)
	password = models.CharField(max_length=100)

	intra_id = models.CharField(max_length=100)
	swivel_id = models.CharField(max_length=100)

	default_profile_picture = models.CharField(max_length=100)

	def __str__(self):
		return str(self.username)
	
	def to_json(self):
		game_history = []
		for game in self.game_history.all():
			json_game = {
				"id": game.id,
				"date": int(game.date.timestamp()),
				"type": game.type,
				"data": json.loads(game.data),
			}
			game_history.append(json_game)
		response = {
			"id": self.id,
			"nickname": self.nickname,
			"is_online": self.is_online,
			"game_history": game_history,
			"profile_picture": self.default_profile_picture,
		}
		return response

class Token(models.Model):
	id = models.AutoField(primary_key=True)
	token = models.CharField(max_length=100)
	user = models.ForeignKey(User, on_delete=models.CASCADE)
	created_at = models.DateTimeField(auto_now_add=True)
	expires_at = models.DateTimeField()
	expires_in = models.IntegerField(default=7 * 24 * 60) # 7 days in minutes
	is_valid = models.BooleanField(default=True)

	def __str__(self):
		return str(self.token)
	
	def save(self, *args, **kwargs):
		if not self.pk:
			self.expires_at = datetime.now() + timedelta(minutes=self.expires_in)
		super().save(*args, **kwargs)

class Game_history(models.Model):
	id = models.AutoField(primary_key=True)
	date = models.DateTimeField(auto_now_add=True)
	type = models.CharField(max_length=100) #2v2, 4v4, tournament
	data = models.CharField(max_length=1000) #[{"id": ",lkfvjl", "score": 12}, {"id": ",lkfvjl", "score": 12}]

	def __str__(self):
		return str(self.id)

	def save(self, *args, **kwargs):
		new = False
		if not self.pk:
			new = True
		super().save(*args, **kwargs)
		if new:
			data = self.data
			data = json.loads(data)
			for player in data:
				player = player['id']
				try:
					user = User.objects.get(id=player)
					user.game_history.add(self)
				except:
					pass