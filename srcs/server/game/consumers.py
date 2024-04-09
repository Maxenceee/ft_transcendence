import random
from channels.generic.websocket import WebsocketConsumer
from django.http import HttpResponse
from django.conf import settings
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
	return type == "2p" or type == "4p" or type == "ai" or type == "local" or type == "tournament"


class Tinder: # Matchmaking
	def __init__(self) -> None:
		logging.info("matchmaker init")
		self.queue = queue.Queue()
		self.player_list = {
				"2p": {"list": [], "num": 2},
				"4p": {"list": [], "num": 4},
				"ai": {"list": [], "num": 1},
				"local": {"list": [], "num": 1},
				"tournament": {"list": [], "num": 8},
			}
		self.games = []
		self.thread = threading.Thread(target=self.run, args=()).start()


	def find_game(self, id, socket, type): 
		logging.info(f"find game called : {id} {type}")
		if not check_type(type):
			socket.close(1003)
			return
		
		user = User.objects.get(id=id)
		if user.is_ingame == False or user.is_dev == True:
			user.is_ingame = True
			user.save()
		else:
			logging.info("user connection rejected user already in game")
			socket.send(json.dumps({"type": "connectionRefused", "data": "You are already ingame !"}))
			socket.close()
			return

		self.queue.put(["join", id, socket, type])


	def lauch_games(self):
		for key in self.player_list.keys():
			while len(self.player_list[key]["list"]) >= self.player_list[key]["num"]:
				players = []
				for _ in range(self.player_list[key]["num"]):
					id, socket = self.player_list[key]["list"].pop(0)
					players.append(Player(id, socket, key))
				game = Game(key, players)
				logging.info(f"game created : {game}")
				self.games.append(game)
				game.run()


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
					logging.info(f"player {id} added to game, they are {len(self.player_list[type]['list'])} players int the {type} queue")
				elif action[0] == "quit":
					socket, type = action[1:]
					for client in self.player_list[type]["list"]:
						if client[1] == socket:
							user = User.objects.get(id=client[0])
							user.is_ingame = False
							user.save()
							self.player_list[type]["list"].remove(client)
							logging.info(f"player {client[0]} removed from queue, they are {len(self.player_list[type]['list'])} players int the {type} queue")
							break
				elif action[0] == "end_game":
					for game in self.games:
						if game.id == action[1]:
							self.games.remove(game)
							del game
							break
			self.lauch_games()
			time.sleep(1)


	def	quit_game(self, socket, type):
		logging.info(f"quit game called : {id} {type}")
		self.queue.put(["quit", socket, type])


class Ball:
	def __init__(self) -> None:
		self.x = 0
		self.z = 0
		self.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
		self.direction_z = 1
		self.speed = 1.05


class Player:
	def __init__(self, id, socket, type) -> None:
		self.id = id
		self.index = -1
		self.socket = socket
		self.socket.player = self
		self.game = None
		self.score = 0
		self.pad_x = 0
		self.pad_z = 0
		self.ready = False
		if type == "Tournament":
			self.gameNumber = None


	def set_game(self, game, index):
		self.game = game
		self.index = index


	def push_to_game(self, action):
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
		self.ready = False


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
		self.ready = False


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
				if future_ball_x + 3.4 > 18.5:
					future_ball_x - 3.4
				elif future_ball_x - 3.4 < -18.5:
					future_ball_x + 3.4
				else:
					future_ball_x += random.choice([-3.4, 3.4])
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
			time.sleep(1)


class Game:
	id = ""
	players = []

	def __init__(self, game_type, players) -> None:
		logging.info("new game init")
		self.id = makeid(15)
		self.players = players
		if game_type == "tournament":
			self.ball = [Ball() for _ in range(7)]
		else:
			self.ball = Ball()
		self.type = game_type
		self.queue = queue.Queue()
		self.thread = None
		self.players_ready = 0
		self.active_players = len(players)
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

	def send_end_game(self):
		if self.type == "tournament":
			for player in self.players:
				if player.gameNumber == 0 or player.gameNumber == 1 or player.gameNumber == 2 or player.gameNumber == 3:
					player.score = 1
				elif player.gameNumber == 4 or player.gameNumber == 5:
					player.score = 2
				elif player.gameNumber == 6:
					player.score = 3
				elif player.gameNumber == 7:
					player.score = 4
		players = []
		for player in self.players:
			id = None
			if isinstance(player, AIPlayer):
				nickname = "Marvin (AI)"
				profile_picture = "https://cdn.maxencegama.dev/placeholder/u/pl/random/sorry/placeholder?seed=1564823102"
			if isinstance(player, LocalPlayer):
				nickname = "Invité"
				profile_picture = "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=9856120325"
			if isinstance(player, Player):
				user = User.objects.get(id=player.id)
				id = player.id
				nickname = user.nickname
				profile_picture = user.default_profile_picture
				if user.profile_picture_image:
					profile_picture = settings.BASE_URL + "/api" + user.profile_pictulauch_games
				user.is_ingame = False
				user.save()
			players.append({"id": id, "nickname": nickname, "profile_picture": profile_picture, "score": player.score})
		self.send_all("endGame", {"players": players, "type": self.type})

	def end_game(self):
		logging.info(f"game ended called: {self.id}")
		self.send_end_game()
		for player in self.players:
			try:
				logging.info(f"close socket for player {player.id}")
				player.socket.close()
			except:
				continue
		logging.info(f"game {self.id} ended")
		scores_all_zero = all(player.score == 0 for player in self.players)
		if not scores_all_zero and not self.type == "ai" and not self.type == "local" and not self.type == "tournament":
			self.save_history()
		elif self.type == "tournament":
			self.save_history_tournament()

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

	def save_history_tournament(self):
		resume_data = []
		for player in self.players:
			if player.gameNumber == 0 or player.gameNumber == 1 or player.gameNumber == 2 or player.gameNumber == 3:
				resume_data.append({"id": player.id, "score": 1})
			elif player.gameNumber == 4 or player.gameNumber == 5:
				resume_data.append({"id": player.id, "score": 2})
			elif player.gameNumber == 6:
				resume_data.append({"id": player.id, "score": 3})
			elif player.gameNumber == 7:
				resume_data.append({"id": player.id, "score": 4})
		resume_data = str(resume_data)
		resume_data = resume_data.replace("'", '"')
		Game_history.objects.create(type=self.type, data=resume_data)


	def send_all(self, type, data):
		for player in self.players:
			player.send({"type": type, "data": data})

	
	def send_text(self, text, size=10):
		for player in self.players:
			player.send({"type": "text", "data": {"text": text, "size": size}})

	
	def send(self, player, type, data):
		self.players[player].send({"type": type, "data": data})


	def init_players(self):
		players = []
		for player in self.players:
			if isinstance(player, Player):
				players.append(User.objects.get(id=player.id).resume_to_json())
			if isinstance(player, AIPlayer):
				id = player.id
				nickname = "Marvin (AI)"
				profile_picture = "https://cdn.maxencegama.dev/placeholder/u/pl/random/sorry/placeholder?seed=1564823102"
				players.append({
					"id": id,
					"nickname": nickname,
					"status": "En Jeu",
					"is_online": True,
					"profile_picture": profile_picture,
				})
			if isinstance(player, LocalPlayer):
				id = player.id
				nickname = "Invité"
				profile_picture = "https://cdn.maxencegama.dev/placeholder/u/pl/random/profile/placeholder?seed=9856120325"
				players.append({
					"id": id,
					"nickname": nickname,
					"status": "En Jeu",
					"is_online": True,
					"profile_picture": profile_picture,
				})
		return players


	def to_json(self):
		players = []
		for player in self.players:
			players.append({"id": self.players.index(player), "x": round(player.pad_x, 2), "z": round(player.pad_z, 2), "score": player.score})
		return {
			"players": players,
			"ball": {"x": round(self.ball.x, 2), "z": round(self.ball.z, 2), "direction_x": round(self.ball.direction_x, 2), "direction_z": round(self.ball.direction_z, 2)},
			"moveSpeed": round(self.ball.speed, 2)
		}

	def send_start_message(self):
		self.send_text("Prêt !", 5)
		time.sleep(2)
		if self.type != "local":
			self.send(0, "moveCam", {"x" : "0", "y" : "30", "z" : "60", "duration" : "3000"})
			self.send(1, "moveCam", {"x" : "0", "y" : "30", "z" : "-60", "duration" : "3000"})
			if self.type == "4p":
				self.send(2, "moveCam", {"x" : "60", "y" : "30", "z" : "0", "duration" : "3000"})
				self.send(3, "moveCam", {"x" : "-60", "y" : "30", "z" : "0", "duration" : "3000"})
		for i in range(3, 0, -1):
			self.send_text(str(i))
			time.sleep(1)
		self.send_text("GO !", 8)
		time.sleep(0.5)
		self.send_text("")

	def run(self):
		self.thread = threading.Thread(target=self.start, args=())
		self.thread.start()

	def start(self):
		logging.info("game type : " + self.type)

		logging.info("active players in game : " + str(self.active_players))
		start = time.time()
		# wait for all players to be ready or 30 seconds
		while self.players_ready != self.active_players and time.time() - start < 30:
			for player in self.players:
				if not isinstance(player, Player):
					continue
				if player.socket.ready:
					self.players_ready = self.active_players

		# kick all players if not all players are ready in 30 seconds
		if self.players_ready != self.active_players:
			logging.info("not all players ready")
			self.end_game()
			return

		self.send_all("initPlayers", self.init_players())
		if self.type != "tournament":
			self.send_start_message()

		logging.info("all players ready")
		match self.type:
			case "2p":
				self.game_master_2p()
			case "4p":
				self.game_master_4p()
			case "ai":
				self.game_master_ai()
			case "local":
				self.game_master_local()
			case "tournament":
				self.game_master_tournament()
			case _:
				logging.error("game type not found")
				return


	def game_master_2p(self):
		logging.info("game master 2p")
		self.send_all("initGame", self.to_json())
		t = 0
		l = time.time()
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				if action == "right_arrow_key":
					if self.players[player_idx].pad_x  < 16.5 and player_idx == 0:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x  > 16.0:
								self.players[player_idx].pad_x = 16
					if self.players[player_idx].pad_x  > -16.5 and player_idx == 1:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
					self.send_all("updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})
				elif action == "left_arrow_key":
					if self.players[player_idx].pad_x  > -16.5 and player_idx == 0:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
					if self.players[player_idx].pad_x  < 16.5 and player_idx == 1:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x  > 16.0:
							self.players[player_idx].pad_x = 16
					self.send_all("updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})	
				elif action == "down_arrow_key":
					if self.players[player_idx].pad_x  < 16.5:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x  > 16.0:
								self.players[player_idx].pad_x = 16
					self.send_all("updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})
				elif action == "up_arrow_key":
					if self.players[player_idx].pad_x  > -16.5:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
					self.send_all("updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})
				elif action == "e_key":
					if player_idx == 0:
						self.send(0, "setCam", {"x" : "0", "y" : "30", "z" : "60"})
					elif player_idx == 1:
						self.send(1, "setCam", {"x" : "0", "y" : "30", "z" : "-60"})
				elif action == "disconnect":
					logging.info(f"player disconnected : {self.players[player_idx].id} ({player_idx})")
					self.players[player_idx].score = 0
					self.end_game()
					return

			t += 1
			if time.time() - l > 1:
				logging.info(f"game {self.id} => {l} tps: {t}")
				t = 0
				l = time.time()

			time.sleep(0.04)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_two_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.send_all("updateBall", {"x": round(self.ball.x, 2), "z": round(self.ball.z, 2), "direction_x": round(self.ball.direction_x, 2), "direction_z": round(self.ball.direction_z, 2)})
			for player in self.players:
				if player.score  > 4 :
					self.end_game()
					return


	def game_master_4p(self):
		logging.info("game master 4p")
		for player in self.players:
			player.score = 5
		self.send_all("initGame", self.to_json())
		for i in range(len(self.players)):
			self.send_all("updateScore", {"n": i, "score": 5})
		t = 0
		l = time.time()
		classement = []
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				logging.info(f"action: {action} {player_idx} {self.players[player_idx].pad_x} {self.players[player_idx].pad_z}")
				if action == "right_arrow_key":
					if self.players[player_idx].pad_x < 27 and player_idx == 0:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x > 27:
								self.players[player_idx].pad_x = 27
					if self.players[player_idx].pad_x > -27 and player_idx == 1:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x < -27:
								self.players[player_idx].pad_x = -27
					if player_idx == 3:
						self.players[player_idx].pad_z += 1
						if self.players[player_idx].pad_z > 27:
								self.players[player_idx].pad_z = 27
					if player_idx == 2:
						self.players[player_idx].pad_z -= 1
						if self.players[player_idx].pad_z < -27:
								self.players[player_idx].pad_z = -27
					self.send_all("updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x), "z": round(self.players[player_idx].pad_z, 2)})
				elif action == "left_arrow_key":
					if self.players[player_idx].pad_x  > -27 and player_idx == 0:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -27:
								self.players[player_idx].pad_x = -27
					if self.players[player_idx].pad_x < 27 and player_idx == 1:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x > 27:
							self.players[player_idx].pad_x = 27
					if player_idx == 3:
						self.players[player_idx].pad_z -= 1
						if self.players[player_idx].pad_z < -27:
								self.players[player_idx].pad_z = -27
					if player_idx == 2:
						self.players[player_idx].pad_z += 1
						if self.players[player_idx].pad_z > 27:
							self.players[player_idx].pad_z = 27
					self.send_all("updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x), "z": round(self.players[player_idx].pad_z, 2)})
					logging.info(f"After : action: {action} {player_idx} {self.players[player_idx].pad_x} {self.players[player_idx].pad_z}")
				elif action == "e_key":
					if player_idx == 0:
						self.send(0, "setCam", {"x" : "0", "y" : "40", "z" : "70"})
					elif player_idx == 1:
						self.send(1, "setCam", {"x" : "0", "y" : "40", "z" : "-70"})
					elif player_idx == 2:
						self.send(2, "setCam", {"x" : "70", "y" : "40", "z" : "0"})
					elif player_idx == 3:
						self.send(3, "setCam", {"x" : "-70", "y" : "40", "z" : "0"})
				elif action == "disconnect":
					logging.info(f"player disconnected : {self.players[player_idx].id} ({player_idx})")
					if player_idx == 0:
						self.send_all("updateScore", {"n": 0, "score": 0})
						self.send_all("deletePallet", {"n" : 0})
						self.players[player_idx].score = 0
					elif player_idx == 1:
						self.send_all("updateScore", {"n": 1, "score": 0})
						self.send_all("deletePallet", {"n" : 1})
						self.players[player_idx].score = 0
					elif player_idx == 2:
						self.send_all("updateScore", {"n": 3, "score": 0})
						self.send_all("deletePallet", {"n" : 2})
						self.players[3].score = 0
					elif player_idx == 3:
						self.send_all("updateScore", {"n": 2, "score": 0})
						self.send_all("deletePallet", {"n" : 3})
						self.players[2].score = 0

			t += 1
			if time.time() - l > 1:
				logging.info(f"game {self.id} => {l} tps: {t}")
				t = 0
				l = time.time()

			time.sleep(0.04)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_four_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.pad_collision_z(2)
			self.pad_collision_z(3)
			self.send_all("updateBall", {"x": round(self.ball.x, 2), "z": round(self.ball.z, 2), "direction_x": round(self.ball.direction_x, 2), "direction_z": round(self.ball.direction_z, 2)})
			i = 0
			for player in self.players:
				if player.score < 1:
					i += 1
					if player not in classement and player.index != 2 and player.index != 3:
						classement.append(player)
					elif player.index == 2 and self.players[3] not in classement:
						classement.append(self.players[3])
					elif player.index == 3 and self.players[2] not in classement:
						classement.append(self.players[2])
				if i >= 3:
					classement[0].score = -3
					classement[1].score = -2
					classement[2].score = -1
					self.end_game()
					return


	def game_master_local(self):
		logging.info("game master local")
		self.send_all("initGame", self.to_json())
		t = 0
		l = time.time()
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				if action == "s_key":
					if self.players[0].pad_x  < 16.5:
						self.players[0].pad_x += 1
						if self.players[0].pad_x  > 16.0:
								self.players[0].pad_x = 16
					self.send_all("updatePlayer", {"n": 0, "x": round(self.players[0].pad_x, 2)})
				elif action == "w_key":
					if self.players[0].pad_x  > -16.5:
						self.players[0].pad_x -= 1
						if self.players[0].pad_x  < -16.0:
								self.players[0].pad_x = -16
					self.send_all("updatePlayer", {"n": 0, "x": round(self.players[0].pad_x, 2)})
				if action == "up_arrow_key":
					if self.players[1].pad_x  > -16.5:
						self.players[1].pad_x -= 1
						if self.players[1].pad_x  < -16.0:
								self.players[1].pad_x = -16
					self.send_all("updatePlayer", {"n": 1, "x": round(self.players[1].pad_x, 2)})
				elif action == "down_arrow_key":
					if self.players[1].pad_x  < 16.5:
						self.players[1].pad_x += 1
						if self.players[1].pad_x  > 16.0:
							self.players[1].pad_x = 16
					self.send_all("updatePlayer", {"n": 1, "x": round(self.players[1].pad_x, 2)})
				elif action == "disconnect":
					logging.info(f"player disconnected : {self.players[player_idx].id} ({player_idx})")
					self.players[player_idx].score = 0
					self.end_game()
					return
				
			t += 1
			if time.time() - l > 1:
				logging.info(f"game {self.id} => {l} tps: {t}")
				t = 0
				l = time.time()

			time.sleep(0.04)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_two_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.send_all("updateBall", {"x": round(self.ball.x, 2), "z": round(self.ball.z, 2), "direction_x": round(self.ball.direction_x, 2), "direction_z": round(self.ball.direction_z, 2)})
			for player in self.players:
				if player.score  > 4 :
					self.end_game()
					return


	def game_master_ai(self):
		logging.info("game master ai")
		self.ai_player.start()
		self.send_all("initGame", self.to_json())
		t = 0
		l = time.time()
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				if action == "right_arrow_key":
					if self.players[player_idx].pad_x  < 16.5 and player_idx == 0:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x  > 16.0 :
							self.players[player_idx].pad_x = 16
					if self.players[player_idx].pad_x  > -16.5 and player_idx == 1:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -16.0:
							self.players[player_idx].pad_x = -16
					self.send(0, "updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})
				elif action == "left_arrow_key":
					if self.players[player_idx].pad_x  > -16.5 and player_idx == 0:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -16.0:
							self.players[player_idx].pad_x = -16
					if self.players[player_idx].pad_x  < 16.5 and player_idx == 1:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x  > 16.0:
							self.players[player_idx].pad_x = 16
					self.send(0, "updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})
				elif action == "down_arrow_key":
					if self.players[player_idx].pad_x  < 16.5:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x  > 16.0:
								self.players[player_idx].pad_x = 16
					self.send(0, "updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})
				elif action == "up_arrow_key":
					if self.players[player_idx].pad_x  > -16.5:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
					self.send(0, "updatePlayer", {"n": player_idx, "x": round(self.players[player_idx].pad_x, 2)})
				elif action == "e_key":
					self.send(player_idx, "setCam", {"x" : "0", "y" : "30", "z" : "60"})
				elif action == "disconnect":
					logging.info(f"player disconnected : {self.players[player_idx].id} ({player_idx})")
					self.ai_player.stop()
					self.end_game()
					return

			t += 1
			if time.time() - l > 1:
				logging.info(f"game {self.id} => {l} tps: {t}")
				t = 0
				l = time.time()

			time.sleep(0.04)
			self.ball.x += self.ball.direction_x * 0.4 * self.ball.speed
			self.ball.z += self.ball.direction_z * 0.4 * self.ball.speed
			self.wall_collide_two_player()
			self.pad_collision_x(0)
			self.pad_collision_x(1)
			self.send(0, "updateBall", {"x": round(self.ball.x, 2), "z": round(self.ball.z, 2), "direction_x": round(self.ball.direction_x, 2), "direction_z": round(self.ball.direction_z, 2)})
			self.send(1, "gameState", self.to_json())
			for player in self.players:
				if player.score > 4:
					self.ai_player.stop()
					self.end_game()
					return


	def game_master_tournament(self):
		i = 0
		tmp = 0
		for player in self.players:
			player.gameNumber = tmp
			i += 1
			if i == 2:
				i = 0
				tmp += 1
		logging.info("game master tournament")
		t = 0
		l = time.time()
		is_init = [False, False, False, False, False, False, False]
		while True:
			while not self.queue.empty():
				player_idx, action = self.queue.get()
				players = []
				for current in self.players:
					if current.gameNumber == self.players[player_idx].gameNumber and current.gameNumber != -1:
						players.append(current)
				if len(players) != 2:
					continue

				if action == "right_arrow_key":
					if players[0].socket == self.players[player_idx].socket:
						if self.players[player_idx].pad_x  < 16.5:
							self.players[player_idx].pad_x += 1
							if self.players[player_idx].pad_x  > 16.0:
								self.players[player_idx].pad_x = 16
					else:
						if self.players[player_idx].pad_x  > -16.5:
							self.players[player_idx].pad_x -= 1
							if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
				elif action == "left_arrow_key":
					if players[0].socket == self.players[player_idx].socket:
						if self.players[player_idx].pad_x  > -16.5:
							self.players[player_idx].pad_x -= 1
							if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
					else:
						if self.players[player_idx].pad_x  < 16.5:
							self.players[player_idx].pad_x += 1
							if self.players[player_idx].pad_x  > 16.0:
								self.players[player_idx].pad_x = 16
				elif action == "down_arrow_key":
					if self.players[player_idx].pad_x  < 16.5:
						self.players[player_idx].pad_x += 1
						if self.players[player_idx].pad_x  > 16.0:
								self.players[player_idx].pad_x = 16
				elif action == "up_arrow_key":
					if self.players[player_idx].pad_x  > -16.5:
						self.players[player_idx].pad_x -= 1
						if self.players[player_idx].pad_x  < -16.0:
								self.players[player_idx].pad_x = -16
				elif action == "e_key":
					players = []
					for player in self.players:
						if player.gameNumber == self.players[player_idx].gameNumber:
							players.append(player)
					if len(players) != 2:
						continue
					index = 0
					if  self.players[player_idx].socket == players[1].socket:
						index = 1
					if players[index].gameNumber == 0:
						if index == 0:
							self.send(self.players.index(players[0]), "setCam", {"x" : "0", "y" : "30", "z" : "60" , "camx" :"0", "camy" :"0", "camz" :"0"})
						else:
							self.send(self.players.index(players[1]), "setCam", {"x" : "0", "y" : "30", "z" : "-60", "camx" :"0", "camy" :"0", "camz" :"0"})
					elif players[index].gameNumber == 1:
						if index == 0:
							self.send(self.players.index(players[0]), "setCam", {"x" : "80", "y" : "30", "z" : "60" , "camx" :"80.0", "camy" :"0", "camz" :"0"})
						else:
							self.send(self.players.index(players[1]), "setCam", {"x" : "80", "y" : "30", "z" : "-60", "camx" :"80.0", "camy" :"0", "camz" :"0"})
					elif players[index].gameNumber == 2:
						if index == 0:
							self.send(self.players.index(players[0]), "setCam", {"x" : "160", "y" : "30", "z" : "60" , "camx" :"160.0", "camy" :"0", "camz" :"0"})
						else:
							self.send(self.players.index(players[1]), "setCam", {"x" : "160", "y" : "30", "z" : "-60", "camx" :"160.0", "camy" :"0", "camz" :"0"})
					elif players[index].gameNumber == 3:
						if index == 0:
							self.send(self.players.index(players[0]), "setCam", {"x" : "240", "y" : "30", "z" : "60" , "camx" :"240.0", "camy" :"0", "camz" :"0"})
						else:
							self.send(self.players.index(players[1]), "setCam", {"x" : "240", "y" : "30", "z" : "-60", "camx" :"240.0", "camy" :"0", "camz" :"0"})
					elif players[index].gameNumber == 4:
						if index == 0:
							self.send(self.players.index(players[0]), "setCam", {"x" : "80", "y" : "30", "z" : "160" , "camx" :"80.0", "camy" :"0", "camz" :"100.0"})
						else:
							self.send(self.players.index(players[1]), "setCam", {"x" : "80", "y" : "30", "z" : "40", "camx" :"80.0", "camy" :"0", "camz" :"100.0"})
					elif players[index].gameNumber == 5:
						if index == 0:
							self.send(self.players.index(players[0]), "setCam", {"x" : "160", "y" : "30", "z" : "160" , "camx" :"160.0", "camy" :"0", "camz" :"100.0"})
						else:
							self.send(self.players.index(players[1]), "setCam", {"x" : "160", "y" : "30", "z" : "40" , "camx" :"160.0", "camy" :"0", "camz" :"100.0"})
					elif players[index].gameNumber == 6:
						if index == 0:
							self.send(self.players.index(players[0]), "setCam", {"x" : "120", "y" : "30", "z" : "260" , "camx" :"120.0", "camy" :"0", "camz" :"200.0"})
						else:
							self.send(self.players.index(players[1]), "setCam", {"x" : "120", "y" : "30", "z" : "140" , "camx" :"120.0", "camy" :"0", "camz" :"200.0"})
				elif action == "t_key":
					self.send(player_idx, "setCam", {"x" : "120", "y" : "295", "z" : "-139" , "camx" :"120.0", "camy" :"213.0", "camz" :"-82.0"})
				elif action == "r_key":
					if self.players[player_idx].gameNumber == 0:
						self.send(player_idx, "setCam", {"x" : "10", "y" : "80", "z" : "0" , "camx" :"0", "camy" :"0", "camz" :"0"})
					elif self.players[player_idx].gameNumber == 1:
						self.send(player_idx, "setCam", {"x" : "90", "y" : "80", "z" : "0" , "camx" :"80.0", "camy" :"0", "camz" :"0"})
					elif self.players[player_idx].gameNumber == 2:
						self.send(player_idx, "setCam", {"x" : "170", "y" : "80", "z" : "0" , "camx" :"160.0", "camy" :"0", "camz" :"0"})
					elif self.players[player_idx].gameNumber == 3:
						self.send(player_idx, "setCam", {"x" : "250", "y" : "80", "z" : "0" , "camx" :"240.0", "camy" :"0", "camz" :"0"})
					elif self.players[player_idx].gameNumber == 4:
						self.send(player_idx, "setCam", {"x" : "90", "y" : "80", "z" : "100" , "camx" :"80.0", "camy" :"0", "camz" :"100.0"})
					elif self.players[player_idx].gameNumber == 5:
						self.send(player_idx, "setCam", {"x" : "170", "y" : "80", "z" : "100" , "camx" :"160.0", "camy" :"0", "camz" :"100.0"})
					elif self.players[player_idx].gameNumber == 6:
						self.send(player_idx, "setCam", {"x" : "130", "y" : "80", "z" : "200" , "camx" :"120.0", "camy" :"0", "camz" :"200.0"})
				elif action == "disconnect":
					if players[0].socket == self.players[player_idx].socket:
						self.players[player_idx].score = 0
						for current in self.players:
							if players[1].socket == current.socket:
								current.score = 5
								break
					else:
						self.players[player_idx].score = 0
						for current in self.players:
							if players[0].socket == current.socket:
								current.score = 5
								break

			for currentGameId in range(7):
				players = []
				for player in self.players:
					if player.gameNumber == currentGameId:
						players.append(player)
				if len(players) != 2:
					continue

				if not is_init[currentGameId]:
					# set camera
					if currentGameId == 0:
						self.send(self.players.index(players[0]), "setCam", {"x" : "0", "y" : "30", "z" : "60" , "camx" :"0", "camy" :"0", "camz" :"0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "0", "y" : "30", "z" : "-60", "camx" :"0", "camy" :"0", "camz" :"0"})
					elif currentGameId == 1:
						self.send(self.players.index(players[0]), "setCam", {"x" : "80", "y" : "30", "z" : "60" , "camx" :"80.0", "camy" :"0", "camz" :"0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "80", "y" : "30", "z" : "-60", "camx" :"80.0", "camy" :"0", "camz" :"0"})
					elif currentGameId == 2:
						self.send(self.players.index(players[0]), "setCam", {"x" : "160", "y" : "30", "z" : "60" , "camx" :"160.0", "camy" :"0", "camz" :"0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "160", "y" : "30", "z" : "-60", "camx" :"160.0", "camy" :"0", "camz" :"0"})
					elif currentGameId == 3:
						self.send(self.players.index(players[0]), "setCam", {"x" : "240", "y" : "30", "z" : "60" , "camx" :"240.0", "camy" :"0", "camz" :"0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "240", "y" : "30", "z" : "-60", "camx" :"240.0", "camy" :"0", "camz" :"0"})
					elif currentGameId == 4:
						self.send(self.players.index(players[0]), "setCam", {"x" : "80", "y" : "30", "z" : "160" , "camx" :"80.0", "camy" :"0", "camz" :"100.0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "80", "y" : "30", "z" : "40", "camx" :"80.0", "camy" :"0", "camz" :"100.0"})
					elif currentGameId == 5:
						self.send(self.players.index(players[0]), "setCam", {"x" : "160", "y" : "30", "z" : "160" , "camx" :"160.0", "camy" :"0", "camz" :"100.0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "160", "y" : "30", "z" : "40" , "camx" :"160.0", "camy" :"0", "camz" :"100.0"})
					elif currentGameId == 6:
						self.send(self.players.index(players[0]), "setCam", {"x" : "120", "y" : "30", "z" : "260" , "camx" :"120.0", "camy" :"0", "camz" :"200.0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "120", "y" : "30", "z" : "140" , "camx" :"120.0", "camy" :"0", "camz" :"200.0"})
					is_init[currentGameId] = True

				self.ball[currentGameId].x += self.ball[currentGameId].direction_x * 0.4 * self.ball[currentGameId].speed
				self.ball[currentGameId].z += self.ball[currentGameId].direction_z * 0.4 * self.ball[currentGameId].speed
				self.wall_collide_tournament(currentGameId)
				self.pad_collision_tournament(currentGameId, 0)
				self.pad_collision_tournament(currentGameId, 1)
				for player in players:
					if player.score  > 4 :
						logging.info(f"player {player.id} won the match {currentGameId}")
						self.send(self.players.index(players[0]), "setCam", {"x" : "120", "y" : "295", "z" : "-139" , "camx" :"120.0", "camy" :"213.0", "camz" :"-82.0"})
						self.send(self.players.index(players[1]), "setCam", {"x" : "120", "y" : "295", "z" : "-139", "camx" :"120.0", "camy" :"213.0", "camz" :"-82.0"})
						self.send_all("gameState", self.tournament_state())
						if player.gameNumber == 0 or player.gameNumber == 1:
							for current in self.players:
								if player.socket == current.socket:
									current.gameNumber = 4
									current.score = 0
									break
						elif player.gameNumber == 2 or player.gameNumber == 3:
							for current in self.players:
								if player.socket == current.socket:
									current.gameNumber = 5
									current.score = 0
									break
						elif player.gameNumber == 4 or player.gameNumber == 5:
							for current in self.players:
								if player.socket == current.socket:
									current.gameNumber = 6
									current.score = 0
									break
						elif player.gameNumber == 6:
							for current in self.players:
								if player.socket == current.socket:
									current.gameNumber = 7
									logging.info(f"player {current.id} won the tournament")
									self.end_game()
									return

			t += 1
			if time.time() - l > 1:
				logging.info(f"tounament {self.id} => {l} tps: {t}")
				t = 0
				l = time.time()
			self.send_all("gameState", self.tournament_state())
			time.sleep(0.04)


	def tournament_state(self):
		players = []
		for player in self.players:
			players.append({"x": player.pad_x, "z": player.pad_z, "score": player.score, "gameNumber" : player.gameNumber})
		response = {
			"player": players,
			"ball" : {"x": self.ball[0].x, "z": self.ball[0].z},
			"ball2": {"x": self.ball[1].x, "z": self.ball[1].z},
			"ball3": {"x": self.ball[2].x, "z": self.ball[2].z},
			"ball4": {"x": self.ball[3].x, "z": self.ball[3].z},
			"ball5": {"x": self.ball[4].x, "z": self.ball[4].z},
			"ball6": {"x": self.ball[5].x, "z": self.ball[5].z},
			"ball7": {"x": self.ball[6].x, "z": self.ball[6].z},
		}
		return response
	
	def wall_collide_two_player(self):
		if self.ball.x < -18.5 :
			self.ball.direction_x *= -1
		elif self.ball.x > 18.5 :
			self.ball.direction_x *= -1
		if self.ball.z < -29:
			self.players[0].score += 1
			self.send_all("updateScore", {"n": 0, "score": self.players[0].score})
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z *= -1
			self.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball.speed = 1.75

		elif self.ball.z > 29:
			self.players[1].score +=1
			self.send_all("updateScore", {"n": 1, "score": self.players[1].score})
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z *= -1
			self.ball.direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball.speed = 1.75
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
			if self.players[2].score <= 0:
				self.ball.direction_x *=-1
				return
			self.players[2].score -= 1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.75
			self.send_all("updateScore", {"n": 2, "score": self.players[2].score})
			if self.players[2].score <= 0:
				self.send_all("deletePallet", {"n" : 3})
		elif self.ball.x > 29 :
			if self.players[3].score <= 0:
				self.ball.direction_x *= -1
				return
			self.players[3].score -= 1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.75
			self.send_all("updateScore", {"n": 3, "score": self.players[3].score})
			if self.players[3].score <= 0:
				self.send_all("deletePallet", {"n" : 2})
		elif self.ball.z < -29:
			if self.players[1].score <= 0:
				self.ball.direction_z *= -1
				return
			self.players[1].score -= 1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.75
			self.send_all("updateScore", {"n": 1, "score": self.players[1].score})
			if self.players[1].score <= 0:
				self.send_all("deletePallet", {"n" : 1})
		elif self.ball.z > 29:
			if self.players[0].score <= 0:
				self.ball.direction_z *= -1
				return
			self.players[0].score -=1
			self.ball.x = 0
			self.ball.z = 0 
			self.ball.y = 0
			self.ball.direction_z = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.direction_x = random.uniform((math.pi * -1 + 1) * 0.666, (math.pi - 1) * 0.666)
			self.ball.speed = 1.75
			self.send_all("updateScore", {"n": 0, "score": self.players[0].score})
			if self.players[0].score <= 0:
				self.send_all("deletePallet", {"n" : 0})
		if (self.ball.speed > 5) :
			self.ball.speed = 5

	def wall_collide_tournament(self, gameNum):
		gameplayer = []
		for current in self.players:
			if current.gameNumber == gameNum:
				gameplayer.append(current)
		if len(gameplayer) != 2:
			return
		if self.ball[gameNum].x < -18.5 :
			self.ball[gameNum].direction_x *= -1
		elif self.ball[gameNum].x > 18.5 :
			self.ball[gameNum].direction_x *= -1
		if self.ball[gameNum].z < -29:
			gameplayer[0].score += 1
			self.ball[gameNum].x = 0
			self.ball[gameNum].z = 0 
			self.ball[gameNum].y = 0
			self.ball[gameNum].direction_z *= -1
			self.ball[gameNum].direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball[gameNum].speed = 1.05
		elif self.ball[gameNum].z > 29:
			gameplayer[1].score += 1
			self.ball[gameNum].x = 0
			self.ball[gameNum].z = 0 
			self.ball[gameNum].y = 0
			self.ball[gameNum].direction_z *= -1
			self.ball[gameNum].direction_x = random.uniform(math.pi * -1 + 1, math.pi - 1)
			self.ball[gameNum].speed = 1.05
		if (self.ball[gameNum].speed > 5) :
			self.ball[gameNum].speed = 5
		if (self.ball[gameNum].x < -18.5):
			self.ball[gameNum].x = -18.49
		if (self.ball[gameNum].x > 18.5):
			self.ball[gameNum].x = 18.49

	def pad_collision_x(self, player_id):
		if ((self.ball.z < -27 and player_id == 1) or (self.ball.z > 27 and player_id == 0)) and (self.ball.x < (self.players[player_id].pad_x + 4.5)  and self.ball.x > (self.players[player_id].pad_x - 4.5)):
			if  self.type == "4p" and self.players[player_id].score <= 0 :
				return
			if (player_id == 1) :
				self.ball.direction_x = (self.ball.x - self.players[player_id].pad_x)/4.5
				self.ball.direction_z = 1
			else :
				self.ball.direction_x = (self.ball.x - self.players[player_id].pad_x)/4.5
				self.ball.direction_z = -1
			if self.type == "4p":
				self.ball.speed *= 1.2
			else :
				self.ball.speed *= 1.1
		if (self.ball.speed > 5) :
			self.ball.speed = 5

	def pad_collision_z(self, player_id):
		if ((self.ball.x < -27 and player_id == 3) or (self.ball.x > 27 and player_id == 2)) and (self.ball.z < (self.players[player_id].pad_z + 4.5)  and self.ball.z > (self.players[player_id].pad_z - 4.5)):
			if (player_id == 3 and self.players[2].score >= 1) :
				self.ball.direction_z = (self.ball.z - self.players[player_id].pad_z)/4.5
				self.ball.direction_x = 1
			elif player_id == 2 and self.players[3].score >= 1 :
				self.ball.direction_z = (self.ball.z - self.players[player_id].pad_z)/4.5
				self.ball.direction_x = -1
			self.ball.speed *= 1.2
		if (self.ball.speed > 5) :
			self.ball.speed = 5

	def pad_collision_tournament(self, gameNum, playerPos):
		gameplayer = []
		for current in self.players:
			if current.gameNumber == gameNum:
				gameplayer.append(current)
		if len(gameplayer) != 2:
			return

		if ((self.ball[gameNum].z < -27 and playerPos == 1) or (self.ball[gameNum].z > 27 and playerPos == 0)) and (self.ball[gameNum].x < (gameplayer[playerPos].pad_x + 4.5)  
				and self.ball[gameNum].x > (gameplayer[playerPos].pad_x - 4.5)):
			
			if (playerPos== 1) :
				self.ball[gameNum].direction_x = (self.ball[gameNum].x - gameplayer[playerPos].pad_x)/4.5
				self.ball[gameNum].direction_z = 1
			else :
				self.ball[gameNum].direction_x = (self.ball[gameNum].x - gameplayer[playerPos].pad_x)/4.5
				self.ball[gameNum].direction_z = -1

			self.ball[gameNum].speed *= 1.1
		if (self.ball[gameNum].speed > 5) :
			self.ball[gameNum].speed = 5

class WebsocketClient(WebsocketConsumer):
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.id = None
		self.user = None
		self.type = None
		self.player = None
		self.ready = False
		self.oldmove = time.time()

	def connect(self):
		logging.info("new player connected")
		cookies = {}
		try:
			data = self.scope['headers']
		except:
			self.close()
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
			self.close()
			return logging.info("user connection rejected token not found")

		if not Token.objects.filter(token=token).exists():
			self.close()
			return logging.info("user connection rejected token not found")

		token = Token.objects.get(token=token)
		if token.is_valid == False:
			self.close()
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
				if (time.time() - self.oldmove) > 0.005 and self.type != "local":
					self.oldmove = time.time()
					self.player.push_to_game(receive_package['move'])
				elif self.type == "local":
					self.player.push_to_game(receive_package['move'])
				return
			elif receive_package['type'] == "ready":
				self.ready = True
				return
		except:
			pass


	def disconnect(self, code):
		logging.info(f"user disconnected : {code}")
		super().disconnect(code)
		if self.user is not None:
			matchmaker.quit_game(self, self.type)
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
