import math
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from app.services.crowd_report import get_recent_reports
from app.services.availability_pattern import get_pattern_for_time
from app.services.availability_score import upsert_availability_score

LAMBDA = 0.05  # decay constant controls report inflation/deflation

def compute_decay_weight(report_created_at: datetime) -> float:
    now = datetime.now(timezone.utc)
    minutes_elapsed = (now - report_created_at).total_seconds() / 60
    return math.exp(-LAMBDA * minutes_elapsed)

def score_to_label(score: float) -> str:
    if score >= 80:
        return "virtually empty"
    elif score >= 60:
        return "plenty of space"
    elif score >= 30:
        return "moderate"
    elif score >= 20:
        return "filling up"
    else:
        return "virtually full"

def recompute_score(
    db: Session,
    location_id: str
) -> float:
    now = datetime.now(timezone.utc)
    day_of_week = now.weekday()  # 0 = Monday, 6 = Sunday
    hour = now.hour

    pattern = get_pattern_for_time(
        db=db,
        location_id=location_id,
        day_of_week=day_of_week,
        hour=hour
    )
    base_score = (pattern.base_score * 100) if pattern else 50.0

    # Pull recent crowd reports and apply decay weighting
    recent_reports = get_recent_reports(db=db, location_id=location_id)

    if not recent_reports:
        final_score = base_score
    else:
        total_weight = 0.0
        weighted_occupancy = 0.0

        for report in recent_reports:
            weight = compute_decay_weight(report.created_at)
            # Estimate occupancy ratio from this report
            # seated + line as a fraction of capacity (capped at 1.0)
            occupancy = min(
                (report.seated_count + report.line_count) / 100,
                1.0
            )
            # Convert to availability aka inverse of occupancy
            availability = (1.0 - occupancy) * 100
            weighted_occupancy += availability * weight
            total_weight += weight

        report_score = weighted_occupancy / total_weight
        # Blend heuristic and real-time reports 30/70
        final_score = (0.3 * base_score) + (0.7 * report_score)

    final_score = round(max(0.0, min(100.0, final_score)), 2)
    label = score_to_label(final_score)

    upsert_availability_score(
        db=db,
        location_id=location_id,
        score=final_score,
        label=label
    )

    return final_score