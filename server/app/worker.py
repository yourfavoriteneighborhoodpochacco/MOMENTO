from celery import Celery

celery_app = Celery(
    "momento",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=["app.tasks.pattern_update"]
)

celery_app.conf.beat_schedule = {
    "update-patterns-every-6-hours": {
        "task": "app.tasks.pattern_update.update_all_patterns",
        "schedule": 21600.0  # 6 hours in seconds
    }
}

celery_app.conf.timezone = "UTC"