from users.models import DirectMessage, Account
from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@receiver(post_save, sender=DirectMessage)
def announce_new_dm(sender, instance, created, **kwargs):
    if created:
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "gossip", {
                "type": "dm_gossip",
                "event": "new_dm",
                "dm_sender": instance.sender.username,
            }
        )