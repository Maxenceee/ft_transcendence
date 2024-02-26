from django.db import models
from datetime import datetime, timedelta
import random
import string
from datetime import datetime, timedelta

class User(models.Model):
    id = models.AutoField(primary_key=True)
    login_type = models.IntegerField(default=0)
    nickname = models.CharField(max_length=100)
    
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    intra_id = models.CharField(max_length=100)

    def __str__(self):
        return str(self.username)
    
    def set_in_game(self, in_game):
        self.in_game = in_game
        self.save()

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
