from django.db import models

# Create your models here. 

# class Game(models.Model):
#     id = models.AutoField(primary_key=True)
#     player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_player1')
#     player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game_player2')
#     score1 = models.IntegerField(default=0)
#     score2 = models.IntegerField(default=0)
#     ball_x = models.FloatField(default=0)
#     ball_y = models.FloatField(default=0)
#     ball_z = models.FloatField(default=0)
#     status = models.IntegerField(default=0)

#     def __str__(self):
#         return str(self.id)
    
#     def add_score(self, player, amount):
#         if (player == 0):
#             self.score1 += amount
#             self.score2 += amount
#         if (player == 1):
#             self.score1 += amount
#         if (player == 2):
#             self.score2 += amount
#         self.save()

#     def set_score(self, player, amount):
#         if (player == 0):
#             self.score1 = amount
#             self.score2 = amount
#         if (player == 1):
#             self.score1 = amount
#         if (player == 2):
#             self.score2 = amount
#         self.save()

#     def get_score(self, player):
#         if (player == 0):
#             return [self.score1, self.score2]
#         if (player == 1):
#             return self.score1
#         if (player == 2):
#             return self.score2
    
#     def set_ball(self, x, y, z):
#         self.ball_x = x
#         self.ball_y = y
#         self.ball_z = z
#         self.save()
    
#     def get_ball(self):
#         return [self.ball_x, self.ball_y, self.ball_z]
    
# class game4(models.Model):
#     id = models.AutoField(primary_key=True)
#     player1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game4_player1')
#     player2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game4_player2')
#     player3 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game4_player3')
#     player4 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='game4_player4')
#     score1 = models.IntegerField(default=0)
#     score2 = models.IntegerField(default=0)
#     score3 = models.IntegerField(default=0)
#     score4 = models.IntegerField(default=0)
#     status = models.IntegerField(default=0)

#     def __str__(self):
#         return str(self.id)

#     def add_score(self, player, amount):
#         if (player == 0):
#             self.score1 += amount
#             self.score2 += amount
#             self.score3 += amount
#             self.score4 += amount
#         if (player == 1):
#             self.score1 += amount
#         if (player == 2):
#             self.score2 += amount
#         if (player == 3):
#             self.score3 += amount
#         if (player == 4):
#             self.score4 += amount
#         self.save()

#     def set_score(self, player, amount):
#         if (player == 0):
#             self.score1 = amount
#             self.score2 = amount
#             self.score3 = amount
#             self.score4 = amount
#         if (player == 1):
#             self.score1 = amount
#         if (player == 2):
#             self.score2 = amount
#         if (player == 3):
#             self.score3 = amount
#         if (player == 4):
#             self.score4 = amount
#         self.save()

#     def get_score(self, player):
#         if (player == 0):
#             return [self.score1, self.score2, self.score3, self.score4]
#         if (player == 1):
#             return self.score1
#         if (player == 2):
#             return self.score2
#         if (player == 3):
#             return self.score3
#         if (player == 4):
#             return self.score4