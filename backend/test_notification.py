import os
import sys
import firebase_admin
from firebase_admin import credentials, messaging

_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_CRED_PATH = os.path.join(_BASE_DIR, "firebase_admin.json")

if not firebase_admin._apps:
    if os.path.exists(_CRED_PATH):
        cred = credentials.Certificate(_CRED_PATH)
        firebase_admin.initialize_app(cred)
        print("[Test] Firebase Admin initialized.")
    else:
        print(f"[Test] Error: Credentials file not found at {_CRED_PATH}")
        sys.exit(1)

token = sys.argv[1] if len(sys.argv) > 1 else "YOUR_FCM_TOKEN"

if token == "YOUR_FCM_TOKEN":
    print("Usage: python test_notification.py <YOUR_FCM_TOKEN>")
    print("Attempting test send with default placeholder token...")

message = messaging.Message(
    notification=messaging.Notification(
        title="POS Test",
        body="Hello from Flask!"
    ),
    token=token
)

try:
    response = messaging.send(message)
    print("Notification sent successfully! Response ID:", response)
except Exception as e:
    print("Error sending notification:", e)
