from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone, timedelta

from app.models.crowd_report import CrowdReport
from app.schemas.crowd_report import CrowdReportCreate

def create_crowd_report(
    db: Session,
    report_data: CrowdReportCreate,
    user_id: str
) -> CrowdReport:
    report = CrowdReport(
        location_id=report.data.location_id,
        submitted_by=user_id,
        seated_count=report_data.seated_count,
        line_count=report_data.line_count
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report

def get_recent_report(
    db: Session,
    location_id: str,
    within_minutes: int = 60
) -> list[CrowdReport]:
    cutoff = datetime.now(timezone.utc) - timedelta(minutes=within_minutes)
    return(
        db.query(CrowdReport)
        .filter(
            CrowdReport.location_id == location_id,
            CrowdReport.created_at >= cutoff
        )
        .order_by(desc(CrowdReport.created_at))
        .all()
    )