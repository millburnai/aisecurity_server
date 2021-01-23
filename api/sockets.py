from django.conf.urls import url
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
import json
import weakref 
import time

class NanoSocket(AsyncWebsocketConsumer):
    _instances = set()

    @classmethod
    def get_instances(cls):
        dead = set()
        for ref in cls._instances:
            if ref() is not None:
                yield ref()
            else:
                dead.add(ref)
        cls._instances -= dead

    async def connect(self):
        await self.channel_layer.group_add("security", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("security", self.channel_name)

    async def receive(self, text_data):

        print(json.loads(text_data))
        print("reciveing data")
        data = json.loads(text_data)
        if 'id' in data: 
            self.kiosk_id = data['id']
        elif 'best_match' in data:
            for obj in PiSocket.get_instances():
                if self.kiosk_id == obj.kiosk_id:
                    await obj.message({"message":data['best_match']})
        elif 'signal' in data:
            await self.message({"message":"break"})

    async def message(self, event):
        print("sending data")
        await self.send(text_data=json.dumps(event['message']))

class PiSocket(AsyncWebsocketConsumer):

    _instances = set()

    @classmethod
    def get_instances(cls):
        dead = set()
        for ref in cls._instances:
            if ref() is not None:
                yield ref()
            else:
                dead.add(ref)
        cls._instances -= dead


    async def connect(self):

        await self.channel_layer.group_add("pi", self.channel_name)
        await self.accept() 
        self._instances.add(weakref.ref(self))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("pi", self.channel_name)
        self.kiosk_id = None

    async def message(self, event):
        print("sending data")
        await self.send(text_data=json.dumps(event['message']))

    async def receive(self, text_data):
        print("reciveing data")
        data = json.loads(text_data)
        if 'id' in data: 
            self.kiosk_id = data['id']
        elif 'signal' in data:
            for obj in NanoSocket.get_instances():
                if self.kiosk_id == obj.kiosk_id:
                    await obj.message({"message":data['signal']})

        #await self.message({"message":"kiosk_id: "+str(self.kiosk_id)})

class SecuritySocket(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("security", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("security", self.channel_name)

    async def receive(self, text_data):
        print("reciveing data")

    async def message(self, event):
        print("sending data")
        await self.send(text_data=json.dumps(event['message']))


application = ProtocolTypeRouter({
    "websocket": URLRouter([
        url("v1/nano", NanoSocket.as_asgi()),
        url("v1/pi", PiSocket.as_asgi()),
        url("v1/guard/live", SecuritySocket.as_asgi())
    ]),
})

