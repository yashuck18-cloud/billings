import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import create_app, db
from app.models.festival_theme import FestivalTheme
from app.models.notification import Notification

app = create_app()

def test_backend_features():
    with app.app_context():
        print("Testing Festival Themes CRUD Backend...")
        # Test List
        themes = FestivalTheme.query.all()
        print(f"Initial festival themes count: {len(themes)}")

        # Test Create
        custom_id = "test_theme_pongal"
        existing = FestivalTheme.query.get(custom_id)
        if existing:
            db.session.delete(existing)
            db.session.commit()

        new_theme = FestivalTheme(
            id=custom_id,
            name="Pongal Harvest Festival 🌾",
            tagline="Golden Sugarcane & Sun",
            greeting="🌾 Happy Pongal & Sankranti! Wishing you abundance and happiness.",
            icon="🌾",
            badge="HARVEST OFFER",
            badge_bg="#D97706",
            gradient="from-[#0F172A] via-[#047857] to-[#D97706]",
            accent="#10B981",
            description="Traditional South Indian harvest festival theme.",
            is_default=False
        )
        db.session.add(new_theme)
        db.session.commit()
        print(f"Created festival theme: {new_theme.name}")

        # Test Read
        fetched = FestivalTheme.query.get(custom_id)
        assert fetched is not None
        assert fetched.name == "Pongal Harvest Festival 🌾"
        print(f"Read festival theme successfully: {fetched.to_dict()}")

        # Test Update
        fetched.greeting = "🌾 Happy Makar Sankranti & Pongal!"
        db.session.commit()
        print(f"Updated festival theme greeting: {fetched.greeting}")

        # Test Delete
        db.session.delete(fetched)
        db.session.commit()
        print("Deleted custom festival theme successfully.")

        print("\nTesting Targeted Notifications Backend...")
        new_notif = Notification(
            user_id=1001,
            title="Special Admin Alert",
            message="Hello Sharma Kirana! Your custom discount plan has been activated.",
            type="info",
            read=False
        )
        db.session.add(new_notif)
        db.session.commit()
        print(f"Created notification #{new_notif.id} for user #{new_notif.user_id}: {new_notif.title}")

        # Query notification for customer_id 1001
        user_notes = Notification.query.filter(
            (Notification.user_id == 1001) | (Notification.user_id == None)
        ).all()
        print(f"Notifications returned for user #1001: {len(user_notes)}")
        assert any(n.id == new_notif.id for n in user_notes)

        # Cleanup test notification
        db.session.delete(new_notif)
        db.session.commit()
        print("Backend test completed with 100% success!")

if __name__ == "__main__":
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    test_backend_features()
