from django.conf.urls import url
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
import json
import weakref 

boolean = False

class SecuritySocket(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("security", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("security", self.channel_name)

    async def receive(self, text_data):
        print("reciveing data")
        self.kiosk_id = text_data
        print(self.kiosk_id)

    async def message(self, event):
        print("sending data")
        await self.send(text_data=json.dumps(event['message']))

class PiSocket(AsyncWebsocketConsumer):

    _instances = set()

    @classmethod
    def get_instances(cls):
        for ref in cls._instances:
            obj = ref()
            if obj is not None:
                yield obj
            else:
                dead.add(ref)
        cls._instances -= dead


    async def connect(self):
        await self.channel_layer.group_add("pi", self.channel_name)
        await self.accept()
        await self._instances.add(weakref.ref(self))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("pi", self.channel_name)

    async def message(self, event):
        print("sending data")
        await self.send(text_data=json.dumps(event['message']))

    async def receive(self, text_data):
        print("reciveing data")
        self.kiosk_id = text_data
        for obj in self.get_instances():
            print(obj.kiosk_id)
        await self.message({"message":boolean})


application = ProtocolTypeRouter({
    "websocket": URLRouter([
        url("v1/guard/live", SecuritySocket),
	url("v1/pi", PiSocket),
    ]),
})

