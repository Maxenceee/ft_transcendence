from django.db import models
from datetime import datetime, timedelta
import random
import json
from datetime import datetime, timedelta

class User(models.Model):
    index = models.AutoField(primary_key=True)
    id = models.CharField(max_length=10)
    nickname = models.CharField(max_length=100)
    game_history = models.ManyToManyField('Game_history', related_name='game_history')
    
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    intra_id = models.CharField(max_length=100)
    swivel_id = models.CharField(max_length=100)

    def __str__(self):
        return str(self.username)

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
    mode = models.IntegerField() # 0: 2v2, 1: 4v4, 2: tournament
    players = models.CharField(max_length=100)
    score = models.CharField(max_length=100)

    def get_players(self):
        return list(self.players)
    
    def get_score(self):
        return list(self.score)

    def __str__(self):
        return str(self.id)
    
    def update(self, *args, **kwargs):
        players = self.get_players()
        for player in players:
            user = User.objects.get(id=player)
            user.game_history.add(self)

    def save(self, *args, **kwargs):
        new = False
        if not self.pk:
            new = True
        super().save(*args, **kwargs)
        if new:
            players = self.get_players()
            for player in players:
                try:
                    user = User.objects.get(id=player)
                    user.game_history.add(self)
                except:
                    pass
                