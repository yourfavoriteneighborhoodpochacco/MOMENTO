import uuid
from datetime import datetime, timezone
from app.db.session import SessionLocal
from app.db.base import Base
from app.models.location import Location
from app.models.availability_pattern import AvailabilityPattern
from app.models.crowd_report import CrowdReport
from app.models.availability_score import AvailabilityScore
from app.models.saved_location import SavedLocation
from app.models.user import User

# Days of week: 0 = Monday, 6 = Sunday
WEEKDAYS = [0, 1, 2, 3, 4]
WEEKEND = [5, 6]

def seed_locations(db):
    locations = [
        Location(
            id=uuid.uuid4(),
            name="Langson Library",
            category="study",
            latitude=33.6471,
            longitude=-117.8411,
            capacity_estimate=400,
            parent_id=None,
            admin_tag="usually active"
        ),
        Location(
            id=uuid.uuid4(),
            name="Langson Library — Floor 2",
            category="study",
            latitude=33.6471,
            longitude=-117.8411,
            capacity_estimate=100,
            parent_id=None,
            admin_tag="usually active"
        ),
        Location(
            id=uuid.uuid4(),
            name="Langson Library — Floor 3 Quiet Zone",
            category="study",
            latitude=33.6471,
            longitude=-117.8411,
            capacity_estimate=60,
            parent_id=None,
            admin_tag="usually empty"
        ),
        Location(
            id=uuid.uuid4(),
            name="ARC Gym",
            category="gym",
            latitude=33.6436,
            longitude=-117.8288,
            capacity_estimate=200,
            parent_id=None,
            admin_tag="usually active"
        ),
        Location(
            id=uuid.uuid4(),
            name="Starbucks — Aldrich Park",
            category="cafe",
            latitude=33.6465,
            longitude=-117.8420,
            capacity_estimate=40,
            parent_id=None,
            admin_tag="usually active"
        ),
        Location(
            id=uuid.uuid4(),
            name="Peet's Coffee — UCI Student Center",
            category="cafe",
            latitude=33.6497,
            longitude=-117.8428,
            capacity_estimate=35,
            parent_id=None,
            admin_tag="usually active"
        ),
    ]

    for location in locations:
        db.add(location)

    db.commit()

    # Refresh to get generated IDs back
    for location in locations:
        db.refresh(location)

    print(f"Seeded {len(locations)} locations")
    return locations

def seed_patterns(db, locations):
    patterns = []

    for location in locations:
        if location.category == "study":
            # Libraries: busy midday on weekdays, moderate mornings and evenings
            for day in WEEKDAYS:
                for hour in range(0, 24):
                    if 11 <= hour <= 15:
                        base_score = 0.2   # busy midday
                    elif 8 <= hour <= 10 or 16 <= hour <= 20:
                        base_score = 0.5   # moderate mornings and evenings
                    elif 21 <= hour <= 23:
                        base_score = 0.7   # quieter late night
                    else:
                        base_score = 0.9   # very quiet early morning
                    patterns.append(AvailabilityPattern(
                        location_id=location.id,
                        day_of_week=day,
                        hour=hour,
                        base_score=base_score
                    ))
            for day in WEEKEND:
                for hour in range(0, 24):
                    if 12 <= hour <= 18:
                        base_score = 0.4
                    else:
                        base_score = 0.8
                    patterns.append(AvailabilityPattern(
                        location_id=location.id,
                        day_of_week=day,
                        hour=hour,
                        base_score=base_score
                    ))

        elif location.category == "gym":
            # Gyms: busy early morning and evenings on weekdays
            for day in WEEKDAYS:
                for hour in range(0, 24):
                    if 6 <= hour <= 8 or 17 <= hour <= 20:
                        base_score = 0.15  # very busy
                    elif 9 <= hour <= 11 or 14 <= hour <= 16:
                        base_score = 0.5
                    else:
                        base_score = 0.85
                    patterns.append(AvailabilityPattern(
                        location_id=location.id,
                        day_of_week=day,
                        hour=hour,
                        base_score=base_score
                    ))
            for day in WEEKEND:
                for hour in range(0, 24):
                    if 9 <= hour <= 13:
                        base_score = 0.25
                    else:
                        base_score = 0.75
                    patterns.append(AvailabilityPattern(
                        location_id=location.id,
                        day_of_week=day,
                        hour=hour,
                        base_score=base_score
                    ))

        elif location.category == "cafe":
            # Cafes: busy mornings and lunch
            for day in WEEKDAYS:
                for hour in range(0, 24):
                    if 8 <= hour <= 10:
                        base_score = 0.2   # morning rush
                    elif 11 <= hour <= 13:
                        base_score = 0.25  # lunch rush
                    elif 14 <= hour <= 16:
                        base_score = 0.55  # afternoon lull
                    elif 17 <= hour <= 19:
                        base_score = 0.4   # after class rush
                    else:
                        base_score = 0.8
                    patterns.append(AvailabilityPattern(
                        location_id=location.id,
                        day_of_week=day,
                        hour=hour,
                        base_score=base_score
                    ))
            for day in WEEKEND:
                for hour in range(0, 24):
                    if 10 <= hour <= 14:
                        base_score = 0.3
                    else:
                        base_score = 0.75
                    patterns.append(AvailabilityPattern(
                        location_id=location.id,
                        day_of_week=day,
                        hour=hour,
                        base_score=base_score
                    ))

    for pattern in patterns:
        db.add(pattern)

    db.commit()
    print(f"Seeded {len(patterns)} availability patterns")

def run_seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        existing = db.query(Location).first()
        if existing:
            print("Database already seeded, skipping")
            return
        locations = seed_locations(db)
        seed_patterns(db, locations)
        print("Seed complete")
    finally:
        db.close()

if __name__ == "__main__":
    run_seed()