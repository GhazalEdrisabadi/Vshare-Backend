from channels.db import database_sync_to_async
from .exceptions import ClientError
from .models import *

@database_sync_to_async
def get_room_or_error(room_id, user):


    if not user.is_authenticated:
        raise ClientError("USER_HAS_TO_LOGIN")

# Find the room they requested (by ID)
    try:
        room = Group.objects.get(groupid=groupid)
    except Group.DoesNotExist:
        raise ClientError("ROOM_INVALID")

    return room