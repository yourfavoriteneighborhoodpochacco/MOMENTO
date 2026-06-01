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

def recompute_score(db: Session, location_id: str) -> float:
    now = datetime.now(timezone.utc)
    day_of_week = now.weekday()
    hour = now.hour

    pattern = get_pattern_for_time(
        db=db,
        location_id=location_id,
        day_of_week=day_of_week,
        hour=hour
    )
    base_score = (pattern.base_score * 100) if pattern else 50.0

    recent_reports = get_recent_reports(db=db, location_id=location_id)

    if not recent_reports:
        final_score = base_score
    else:
        total_weight = 0.0
        weighted_occupancy = 0.0

        for report in recent_reports:
            weight = compute_decay_weight(report.created_at)
            occupancy = min(
                (report.seated_count + report.line_count) / 100,
                1.0
            )
            availability = (1.0 - occupancy) * 100
            weighted_occupancy += availability * weight
            total_weight += weight

        report_score = weighted_occupancy / total_weight

        pattern_weight = compute_pattern_trust(base_score, recent_reports)
        report_weight = 1.0 - pattern_weight

        final_score = (pattern_weight * base_score) + (report_weight * report_score)

    final_score = round(max(0.0, min(100.0, final_score)), 2)
    label = score_to_label(final_score)

    upsert_availability_score(
        db=db,
        location_id=location_id,
        score=final_score,
        label=label
    )

    return final_score

def compute_pattern_trust(
    base_score: float,
    recent_reports: list
) -> float:
    if not recent_reports:
        return 0.3

    avg_report_availability = sum(
        (1.0 - min((r.seated_count + r.line_count) / 100, 1.0)) * 100
        for r in recent_reports
    ) / len(recent_reports)

    divergence = abs(base_score - avg_report_availability)

    pattern_weight = max(0.05, 0.3 - (divergence / 50) * 0.25)
    return pattern_weight