from app.worker import celery_app
from app.db.session import SessionLocal
from app.models.crowd_report import CrowdReport
from app.models.availability_pattern import AvailabilityPattern
from datetime import datetime, timezone, timedelta
from sqlalchemy import func

@celery_app.task
def update_all_patterns():
    db = SessionLocal()
    try:
        patterns = db.query(AvailabilityPattern).all()
        for pattern in patterns:
            _update_single_pattern(db, pattern)
    finally:
        db.close()

def _update_single_pattern(db, pattern):
    thirty_days_ago = datetime.now(timezone.utc) - timedelta(days=30)

    reports = (
        db.query(CrowdReport)
        .filter(
            CrowdReport.location_id == pattern.location_id,
            CrowdReport.created_at >= thirty_days_ago,
            func.extract("dow", CrowdReport.created_at) == pattern.day_of_week,
            func.extract("hour", CrowdReport.created_at) == pattern.hour
        )
        .all()
    )

    if len(reports) < 5:
        return

    avg_availability = sum(
        1.0 - min((r.seated_count + r.line_count) / 100, 1.0)
        for r in reports
    ) / len(reports)

    pattern.base_score = round(avg_availability, 4)
    db.commit()