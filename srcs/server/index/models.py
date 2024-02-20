from django.db import models

class User(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)

    def __str__(self):
        return str(self.username)
    
    def set_in_game(self, in_game):
        self.in_game = in_game
        self.save()