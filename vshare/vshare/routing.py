from channels.routing import ProtocolTypeRouter

application = ProtocolTypeRouter({
    # Empty for now (http->django views is added by default)
})

# from channels.routing import ProtocolTypeRouter, URLRouter
# from my_proj.game.routing import websocketsapplication = ProtocolTypeRouter({
#     "websocket": websockets,
# })