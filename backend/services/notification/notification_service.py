from types import NotificationType, NotificationChannel
# from email.handlers import send_email_notification
# from websocket.handlers import send_ws_notification


# def notify_user(user, notification_type: NotificationType, context: dict, channel: NotificationChannel = NotificationChannel.BOTH):
#     """
#     Central function to notify user through email, websocket, or both.
#     """
#     if channel in [NotificationChannel.EMAIL, NotificationChannel.BOTH]:
#         send_email_notification(user, notification_type, context)

#     if channel in [NotificationChannel.WEBSOCKET, NotificationChannel.BOTH]:
#         send_ws_notification(user, notification_type, context)
