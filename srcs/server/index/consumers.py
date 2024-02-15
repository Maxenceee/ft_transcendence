from channels.generic.websocket import WebsocketConsumer
import json
import logging

class websocket_client(WebsocketConsumer):
    def connect(self):
        print("server says connected")
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        logging.info("server says client message received: " + text_data)
        # json.load(text_data)
        tmp = json.loads(text_data)
        logging.info(tmp)
        self.send(json.dumps(tmp))
    
    def disconnect(self, code):
        print("server says disconnected")