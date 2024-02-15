from channels.generic.websocket import WebsocketConsumer

class websocket_client(WebsocketConsumer):
    def connect(self):
        print("server says connected")
        self.accept()

    def receive(self, text_data=None, bytes_data=None):
        print("server says client message received: ", text_data)
        self.send(f"Server sends Welcome,  recive :\"{text_data}\"")
    
    def disconnect(self, code):
        print("server says disconnected")