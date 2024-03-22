import random
from channels.generic.websocket import WebsocketConsumer
from django.http import HttpResponse
from index.models import *
import json
import logging
import time
import math
import threading
import queue

global matchmaker

def makeid(len):
	str = "abcdefghijklmnopqrstuvwxyz0123456789"
	res = ""
	for _ in range(len):
		res += str[random.randint(0, 35)]
	return res


def	check_type(type):
	return type == "2p" or type == "4p" or type == "ai" or type == "local" 


class Tinder: # Matchmaking
	def __init__(self) -> None:
		logging.info("matchmaker init")
		self.queue = queue.Queue()
		self.player_list = {
				"2p": {"list": [], "num": 2},
				"4p": {"list": [], "num": 4},
				"ai": {"list": [], "num": 1},
				"local": {"list": [], "num": 1}
			}
		self.games = []
		self.thread = threading.Thread(target=self.run, args=()).start()


	def find_game(self, id, socket, type): 
		logging.info(f"find game called : {id} {type}")
		if not check_type(type):
			socket.close(1003)
			return
		
		user = User.objects.get(id=id)
		if user.is_ingame == False:
			user.is_ingame = True
			user.save()
		else:
			logging.info("user connection rejected user already in game")
			socket.close()
			return

		self.queue.put(["join", id, socket, type])


	def lauch_games(self):
		for key in self.player_list.keys():
			while len(self.player_list[key]["list"]) >= self.player_list[key]["num"]:
				players = []
				for _ in range(self.player_list[key]["num"]):
					id, socket = self.player_list[key]["list"].pop(0)
					players.append(Player(id, socket))
				game = Game(key, players)
				logging.info(f"game created : {game}")
				self.games.append(game)
				game.start()


	def delete_game(self, id):
		self.queue.put(["end_game", id])


	def run(self):
		logging.info("matchmaker started")
		while True:
			while not self.queue.empty():
				action = self.queue.get()
				if action[0] == "join":
					id, socket, type = action[1:]
					self.player_list[type]["list"].append([id, socket])
				elif action[0] == "quit":
					id, type = action[1:]
					for client in self.player_list[type]["list"]:
						if client[0] == id:
							if self.player_list[type]["list"].count(client) > 0:
								user = User.objects.get(id=id)
								user.is_ingame = False
								user.save()

								self.player_list[type]["list"].remove(client)
								break

				elif action[0] == "end_game":
					for game in self.games:
						if game.id == action[1]:
							self.games.remove(game)
							del game
							break
			self.lauch_games()
			time.sleep(1)


	def	quit_game(self, id, type):
		logging.info(f"quit game called : {id} {type}")
		self.queue.put(["quit", id, type])


class Ball:
	def __init__(self) -> None:
		self.x = 0
		self.z = 0
		self.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
		self.direction_z = 1
		self.speed = 1.05


class Player:
	def __init__(self, id, socket) -> None:
		self.id = id
		self.index = -1
		self.socket = socket
		self.socket.player = self
		self.game = None
		self.score = 0
		self.pad_x = 0
		self.pad_z = 0

	def set_game(self, game, index):
		self.game = game
		self.index = index

	def push_to_game(self, action):
		# logging.info(f"push to game: {self.index} {action}")
		self.game.queue.put([self.index, action])

	def send(self, data):
		try:
			self.socket.send(json.dumps(data))
		except:
			logging.info(f"error send: {self.id}")

	def __str__(self) -> str:
		return f"player {self.id} index in game {self.index}"
	
class LocalPlayer:
	def __init__(self) -> None:
		self.id = "local_" + makeid(15)
		self.index = -1
		self.game = None
		self.score = 0
		self.pad_x = 0
		self.pad_z = 0

	def set_game(self, game, index):
		self.game = game
		self.index = index

	def push_to_game(self, action):
		self.game.queue.put([self.index, action])

	def send(self, data):
		pass

class AIPlayer:
	def __init__(self):
		self.id = "ai_"+makeid(15)
		self.index = -1
		self.running = False
		self.thread = None
		self.game = None
		self.queue = queue.Queue()
		self.score = 0
		self.pad_x = 0
		self.pad_z = 0


	def __del__(self):
		self.stop()


	def set_game(self, game, index):
		self.game = game
		self.index = index


	def start(self):
		self.running = True
		self.thread = threading.Thread(target=self.run)
		self.thread.start()


	def stop(self):
		self.running = False
		if self.thread is not None:
			self.thread.join()


	def push_to_game(self, action):
		self.game.queue.put([self.index, action])


	def send(self, data):
		try:
			self.queue.put(data)
		except:
			logging.info(f"error send: {self.id}")


	def run(self):
		data = None
		last_update = time.time()
		while self.running:
			while not self.queue.empty():
				action = self.queue.get()
				if action["type"] == "disconnect":
					self.stop()
					return
				elif action["type"] == "gameState":
					data = action["data"]

			if not data:
				continue

			if time.time() - last_update < 1: # seconde between each update
				continue
			last_update = time.time()

			i = 1
			ball = data["ball"]
			ball_x = ball["x"]
			ball_z = ball["z"]
			dir_x = ball["direction_x"]
			dir_z = ball["direction_z"]
			pad_x = self.pad_x
			future_ball_x = ball_x
			future_ball_z = ball_z
			if (dir_z == -1):
				i = 0
			if i == 0:
				tmp = 1
				while (future_ball_z >= -27):
					future_ball_x += data["moveSpeed"] * dir_x * tmp
					future_ball_z -= data["moveSpeed"]
					if future_ball_x > 18.5 or future_ball_x <  -18.5:
						tmp *=-1
					i += 1
				future_ball_x += random.uniform(-3.5, 3.5)
			dif = pad_x - future_ball_x
			if int(dif) >= 0 and dir_z == -1:
				for i in range(int(dif)):
					self.push_to_game("right_arrow_key")
					time.sleep(0.05)
			elif dir_z == -1:
				for i in range(int(-dif)):
					self.push_to_game("left_arrow_key")
					time.sleep(0.05)
			else:
				if int(pad_x) >= 0:
					for i in range(int(pad_x)):
						self.push_to_game("right_arrow_key")
						time.sleep(0.05)
				else:
					for i in range(int(-pad_x)):
						self.push_to_game("left_arrow_key")
						time.sleep(0.05)


class Game:
	id = ""
	players = []

	def __init__(self, game_type, players) -> None:
		logging.info("new game init")
		self.id = makeid(15)
		self.players = players
		self.ball = Ball()
		self.type = game_type
		self.queue = queue.Queue()
		self.thread = None
		if self.type == "ai":
			self.ai_player = AIPlayer()
			self.players.append(self.ai_player)
		if self.type == "local":
			self.players.append(LocalPlayer())
		for i, player in enumerate(self.players):
			player.set_game(self, i)


	def __str__(self) -> str:
		return f"game {self.id} ({self.type}): {format(self.players)}"

	
	def __del__(self):
		if self.thread is not None:
			self.thread.join()


	def end_game(self):
		logging.info(f"game ended called: {self.id}")
		for player in self.players:
			if User.objects.filter(id=player.id).exists():
				user = User.objects.get(id=player.id)
				user.is_ingame = False
				user.save()
			try:
				logging.info(f"close socket for player {player.id}")
				player.socket.close()
			except:
				# logging.error("error close socket")
				continue

		logging.info(f"game {self.id} ended")
		scores_all_zero = all(player.score == 0 for player in self.players)
		if not scores_all_zero and not self.type == "ai" and not self.type == "local":
			self.save_history()

		logging.info("destroying game " + self.id)
		matchmaker.delete_game(self.id)


	def save_history(self):
		resume_data = []
		for player in self.players:
			resume_data.append({"id": player.id, "score": player.score})
		resume_data = str(resume_data)
		resume_data = resume_data.replace("'", '"')
		Game_history.objects.create(type=self.type, data=resume_data)
		logging.info("history saved for game " + self.id)


	def send_all(self, type, data):
		for player in self.players:
			player.send({"type": type, "data": data})

	
	def send(self, player, type, data):
		self.players[player].send({"type": type, "data": data})


	def to_json(self):
		players = []
		for player in self.players:
			players.append({"id": self.players.index(player), "x": round(player.pad_x, 2), "z": round(player.pad_z, 2), "score": player.score})
		response = {
			"players": players,
			"ball": {"x": round(self.ball.x, 2), "z": round(self.ball.z, 2), "direction_x": round(self.ball.direction_x, 2), "direction_z": round(self.ball.direction_z, 2)},
			"moveSpeed": round(self.ball.speed, 2)
		}
		return response


	def start(self):
		logging.info("game type : " + self.type)
		match self.type:
			case "2p":
				self.thread = threading.Thread(target=self.game_master_2p, args=())
			case "4p":
				self.thread = threading.Thread(target=self.game_master_4p, args=())
			case "ai":
				self.thread = threading.Thread(target=self.game_master_ai, args=())
			case "local":
				self.thread = threading.Thread(target=self.game_master_local, args=())
			case _:
				logging.error("game type not found")
				return
		self.thread.start()


	def game_master_2p(self):
		logging.info("game master 2p")
		self.send_all("initGame", "")
		self.send_all("gameState", self.to_json())
		self.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
		self.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "-60"})
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				if action == "d_key" or action == "right_arrow_key":
					if self.players[player_idx].pad_x  < 16.5 and player_idx == 0:
						self.players[player_idx].pad_x += 0.8
						if self.players[player_idx].pad_x  > 16.0 :
								self.players[player_idx].pad_x = 16
					if self.players[player_idx].pad_x  > -16.5 and player_idx == 1:
						self.players[player_idx].pad_x -= 0.8
						if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
				elif action == "a_key" or action == "left_arrow_key":
					if self.players[player_idx].pad_x  > -16.5 and player_idx == 0:
						self.players[player_idx].pad_x -= 0.8
						if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
					if self.players[player_idx].pad_x  < 16.5 and player_idx == 1:
						self.players[player_idx].pad_x += 0.8
						if self.players[player_idx].pad_x  > 16.0 :
							self.players[player_idx].pad_x = 16
				elif action == "disconnect":
					logging.info(f"player disconnected : {self.players[player_idx].id} ({player_idx})")
					self.players[player_idx].score = 0
					self.end_game()
					return

			time.sleep(0.05)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_two_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.send_all("gameState", self.to_json())
			for player in self.players:
				if player.score  > 9 :
					self.end_game()
					return


	def game_master_4p(self):
		logging.info("game master 4p")
		self.send_all("initGame", "")
		self.send_all("gameState", self.to_json())
		self.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
		self.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "-60"})
		self.send(2, "setCam", {"x" : "60", "y" : "30", "z" : "30"})
		self.send(3, "setCam", {"x" : "-60", "y" : "30", "z" : "30"})
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				if action == "d_key" or action == "right_arrow_key":
					if self.players[player_idx].pad_x  < 27.5 and player_idx == 0:
						self.players[player_idx].pad_x += 0.8
						if self.players[player_idx].pad_x  > 27 :
								self.players[player_idx].pad_x = 27
					if self.players[player_idx].pad_x  > -27.5 and player_idx == 1:
						self.players[player_idx].pad_x -= 0.8
						if self.players[player_idx].pad_x  < -27:
								self.players[player_idx].pad_x = -27
					if  player_idx == 2:
						self.players[player_idx].pad_z += 0.8
						if self.players[player_idx].pad_z  > 27 :
								self.players[player_idx].pad_z = 27
					if  player_idx == 3:
						self.players[player_idx].pad_z -= 0.8
						if self.players[player_idx].pad_z  < -27:
								self.players[player_idx].pad_z = -27
				elif action == "a_key" or action == "left_arrow_key":
					if self.players[player_idx].pad_x  > -27.5 and player_idx == 0:
						self.players[player_idx].pad_x -= 0.8
						if self.players[player_idx].pad_x  < -27:
								self.players[player_idx].pad_x = -27
					if self.players[player_idx].pad_x  < 27.5 and player_idx == 1:
						self.players[player_idx].pad_x += 0.8
						if self.players[player_idx].pad_x  > 27 :
							self.players[player_idx].pad_x = 27
					if  player_idx == 2:
						self.players[player_idx].pad_z -= 0.8
						if self.players[player_idx].pad_z  < -27:
								self.players[player_idx].pad_z = -27
					if  player_idx == 3:
						self.players[player_idx].pad_z += 0.8
						if self.players[player_idx].pad_z  > 27 :
							self.players[player_idx].pad_z = 27
				elif action == "disconnect":
					self.players[player_idx].score = 0

			time.sleep(0.05)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_four_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.pad_collision_z(2)
			self.pad_collision_z(3)
			self.send_all("gameState", self.to_json())
			i = 0
			for player in self.players:
				if player.score  < 1 :
					i += 1
				if i >= 3 :
					self.end_game()
					return


	def game_master_local(self):
		logging.info("game master local")
		self.send(0, "initGame", "")
		self.send(0, "gameState", self.to_json())
		self.send(0, "setCam", {"x" : "10", "y" : "69", "z" : "0"})
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				if action == "d_key":
					if self.players[0].pad_x  < 16.5:
						self.players[0].pad_x += 0.8
						if self.players[0].pad_x  > 16.0 :
								self.players[0].pad_x = 16
				elif action == "a_key":
					if self.players[0].pad_x  > -16.5:
						self.players[0].pad_x -= 0.8
						if self.players[0].pad_x  < -16.0:
								self.players[0].pad_x = -16
				if action == "right_arrow_key":
					if self.players[1].pad_x  > -16.5:
						self.players[1].pad_x -= 0.8
						if self.players[1].pad_x  < -16.0:
								self.players[1].pad_x = -16
				elif action == "left_arrow_key":
					if self.players[1].pad_x  < 16.5:
						self.players[1].pad_x += 0.8
						if self.players[1].pad_x  > 16.0 :
							self.players[1].pad_x = 16
				elif action == "disconnect":
					logging.info(f"player disconnected : {self.players[player_idx].id} ({player_idx})")
					self.players[player_idx].score = 0
					self.end_game()
					return

			time.sleep(0.05)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_two_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.send(0, "gameState", self.to_json())
			for player in self.players:
				if player.score  > 9 :
					self.end_game()
					return

	
	def game_master_ai(self):
		logging.info("game master ai")
		self.ai_player.start()
		self.send_all("initGame", "")
		self.send_all("gameState", self.to_json())
		# TODO:
		# set la position de la camera proprement 
		# eviter les index fixes pour les joueurs
		self.send(0, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
		# self.send(1, "setCam", {"x" : "30", "y" : "30", "z" : "60"})
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				if action == "d_key" or action == "right_arrow_key":
					if self.players[0].pad_x  < 16.5 and player_idx == 0:
						self.players[0].pad_x += 0.8
						if self.players[0].pad_x  > 16.0 :
								self.players[0].pad_x = 16
					if self.players[1].pad_x  > -16.5 and player_idx == 1:
						self.players[1].pad_x -= 0.8
						if self.players[1].pad_x  < -16.0:
								self.players[1].pad_x = -16
				elif action == "a_key" or action == "left_arrow_key":
					if self.players[0].pad_x  > -16.5 and player_idx == 0:
						self.players[0].pad_x -= 0.8
						if self.players[0].pad_x  < -16.0:
								self.players[0].pad_x = -16
					if self.players[1].pad_x  < 16.5 and player_idx == 1:
						self.players[1].pad_x += 0.8
						if self.players[1].pad_x  > 16.0:
							self.players[1].pad_x = 16
				elif action == "disconnect":
					logging.info(f"player disconnected : {self.players[player_idx].id} ({player_idx})")
					self.ai_player.stop()
					self.end_game()
					return

			time.sleep(0.05)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_two_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.send_all("gameState", self.to_json())
			for player in self.players:
				if player.score > 9:
					self.ai_player.stop()
					self.end_game()
					return


	def wall_collide_two_player(self):
		if self.ball.x < -18.5 :
			self.ball.direction_x *= -1
		elif self.ball.x > 18.5 :
			self.ball.direction_x *= -1
		if self.ball.z < -29:
			self.players[0].score += 1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z *= -1
			self.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball.speed = 1.05

		elif self.ball.z > 29:
			self.players[1].score +=1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z *= -1
			self.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball.speed = 1.05
		if (self.ball.speed > 5):
			self.ball.speed = 5
		if (self.ball.speed > 5):
			self.ball.speed = 5
		if (self.ball.x < -18.5):
			self.ball.x = -18.49
		if (self.ball.x > 18.5):
			self.ball.x = 18.49


	def wall_collide_four_player(self):
		if self.ball.x < -29 :
			if self.players[2].score <= 0 :
				self.ball.direction_x *=-1
				return	
			self.players[2].score -=1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.05
			if self.players[2].score <= 0:
				self.send_all("deletePallet", {"n" : 2})
		elif self.ball.x > 29 :
			if self.players[3].score <= 0 :
				self.ball.direction_x *=-1
				return	
			self.players[3].score -= 1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.05
			if self.players[3].score <= 0:
				self.send_all("deletePallet", {"n" : 3})
		elif self.ball.z < -29:
			if self.players[1].score <= 0 :
				self.ball.direction_z *=-1
				return	
			self.players[1].score -= 1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.05
			if self.players[1].score <= 0:
				self.send_all("deletePallet", {"n" : 1})
		elif self.ball.z > 29:
			if self.players[0].score <= 0 :
				self.ball.direction_z *=-1
				return	
			self.players[0].score -=1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.05
			if self.players[0].score <= 0:
				self.send_all("deletePallet", {"n" : 0})
		if (self.ball.speed > 5) :
			self.ball.speed = 5


	def pad_collision_x(self, player_id):
		if ((self.ball.z < -27 and player_id == 1) or (self.ball.z > 27 and player_id == 0)) and (self.ball.x < (self.players[player_id].pad_x + 4.5)  and self.ball.x > (self.players[player_id].pad_x - 4.5)):
			if (player_id == 1) :
				self.ball.direction_x = (self.ball.x - self.players[player_id].pad_x)/4.5
				self.ball.direction_z = 1
			else :
				self.ball.direction_x = (self.ball.x - self.players[player_id].pad_x)/4.5
				self.ball.direction_z = -1
			self.ball.speed *= 1.1
		if (self.ball.speed > 5) :
			self.ball.speed = 5


	def pad_collision_z(self, player_id):
		if ((self.ball.x < -27 and player_id == 3) or (self.ball.x > 27 and player_id == 2)) and (self.ball.z < (self.players[player_id].pad_z + 4.5)  and self.ball.z > (self.players[player_id].pad_z - 4.5)):
			if (player_id == 3 and self.players[3].score >= 1) :
				self.ball.direction_z = (self.ball.z - self.players[player_id].pad_z)/4.5
				self.ball.direction_x = 1
			elif player_id == 2 and self.players[2].score >= 1 :
				self.ball.direction_z = (self.ball.z - self.players[player_id].pad_z)/4.5
				self.ball.direction_x = -1
			self.ball.speed *= 1.1
		if (self.ball.speed > 5) :
			self.ball.speed = 5


class WebsocketClient(WebsocketConsumer):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.id = None
		self.user = None
		self.type = None
		self.player = None

	def connect(self):
		logging.info("new player connected in new version <=============================")
		cookies = {}
		try:
			data = self.scope['headers']
		except:
			return
		for i in data:
			if b'cookie' in i:
				cookie = i[1].decode('utf-8')
				cookie = cookie.split(';')
				for j in cookie:
					j = j.strip()
					j = j.split('=')
					cookies[j[0]] = j[1]
		
		logging.info("new player connected")
		try:
			token = cookies['token']
		except:
			return logging.info("user connection rejected token not found")

		if not Token.objects.filter(token=token).exists():
			return logging.info("user connection rejected token not found")

		token = Token.objects.get(token=token)
		if token.is_valid == False:
			return logging.info("user connection rejected token not valid")

		self.accept()

		try:
			self.type = self.scope['url_route']['kwargs']['type']
		except:
			self.close(1003)
			return

		if not check_type(self.type):
			self.close(1003)
			return

		self.user = token.user
		self.id = self.user.id
		logging.info("user connected : " + str(self.id))
		matchmaker.find_game(self.id, self, self.type)


	def receive(self, text_data=None):
		receive_package = json.loads(text_data)

		if "PING" in receive_package:
			self.send(json.dumps({"PING": "PONG"}))
			return

		try:
			if receive_package['type'] == "keyCode":
				self.player.push_to_game(receive_package['move'])
				return
		except:
			pass


	def disconnect(self, code):
		logging.info(f"user disconnected : {code}")
		super().disconnect(code)
		matchmaker.quit_game(self.id, self.type)
		if self.player is not None:
			self.player.push_to_game("disconnect")


#####################################################
#													#
#													#
#													#
#				Matchmaking system					#
#													#
#													#
#													#
#####################################################

matchmaker = Tinder()

# Powered by: Tinder for code lovers
