import os

_BASE_DIR = os.path.dirname(os.path.abspath(__file__))
_CRED_PATH = os.path.join(_BASE_DIR, "firebase_admin.json")

_firebase_admin_available = False
try:
    import firebase_admin
    from firebase_admin import credentials, messaging
    _firebase_admin_available = True
except (ImportError, ModuleNotFoundError) as e:
    print(f"[Firebase] Warning: firebase-admin package not found ({e}). FCM notifications will be disabled.")

# Initialize Firebase Admin SDK safely (only once)
if _firebase_admin_available and not firebase_admin._apps:
    if os.path.exists(_CRED_PATH):
        try:
            cred = credentials.Certificate(_CRED_PATH)
            firebase_admin.initialize_app(cred)
            print("[Firebase] Firebase Admin SDK initialized successfully.")
        except Exception as e:
            print(f"[Firebase] Error initializing Firebase Admin SDK: {e}")
    else:
        print(f"[Firebase] Warning: Credential file not found at {_CRED_PATH}")

def send_fcm_notification(fcm_token: str, title: str, body: str, data: dict = None):
    """
    Sends an FCM push notification to a specified device token.
    Safe against exceptions so calling routes or database operations are never interrupted.
    """
    if not _firebase_admin_available:
        print("[Firebase] send_fcm_notification skipped: firebase_admin is not installed.")
        return None

    if not fcm_token or not isinstance(fcm_token, str) or not fcm_token.strip():
        print("[Firebase] send_fcm_notification skipped: empty token.")
        return None

    try:
        data_payload = {str(k): str(v) for k, v in (data or {}).items()} if data else None
        
        message = messaging.Message(
            notification=messaging.Notification(
                title=title,
                body=body,
            ),
            data=data_payload,
            token=fcm_token.strip()
        )
        response = messaging.send(message)
        print(f"[Firebase] FCM notification sent successfully. ID: {response}")
        return response
    except Exception as e:
        print(f"[Firebase] Error sending FCM notification: {e}")
        return None

