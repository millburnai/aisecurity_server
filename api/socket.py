from django.conf.urls import url
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.routing import ProtocolTypeRouter, URLRouter
import json


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
        url("v1/guard/live", SecuritySocket),
    ])
})