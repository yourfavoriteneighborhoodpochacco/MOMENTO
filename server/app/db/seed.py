import uuid
from datetime import datetime, timezone
from app.db.session import SessionLocal
from app.models.location import Location
from app.models.availability_pattern import AvailabilityPattern

WEEKDAYS = [0, 1, 2, 3, 4]
WEEKEND = [5, 6]

def seed_locations(db):
    # Parent locations first
    langson = Location(
        id=uuid.uuid4(),
        name="Langson Library",
        category="study",
        latitude=33.6471,
        longitude=-117.8411,
        capacity_estimate=400,
        parent_id=None,
        admin_tag="usually active"
    )
    arc = Location(
        id=uuid.uuid4(),
        name="ARC Gym",
        category="gym",
        latitude=33.6436,
        longitude=-117.8288,
        capacity_estimate=200,
        parent_id=None,
        admin_tag="usually active"
    )
    starbucks = Location(
        id=uuid.uuid4(),
        name="Starbucks — Aldrich Park",
        category="cafe",
        latitude=33.6465,
        longitude=-117.8420,
        capacity_estimate=40,
        parent_id=None,
        admin_tag="usually active"
    )
    peets = Location(
        id=uuid.uuid4(),
        name="Peet's Coffee — UCI Student Center",
        category="cafe",
        latitude=33.6497,
        longitude=-117.8428,
        capacity_estimate=35,
        parent_id=None,
        admin_tag="usually active"
    )

    # Insert parents first so their IDs exist before children reference them
    for loc in [langson, arc, starbucks, peets]:
        db.add(loc)
    db.commit()
    for loc in [langson, arc, starbucks, peets]:
        db.refresh(loc)

    # Sub-locations — now langson.id exists
    floor2 = Location(
        id=uuid.uuid4(),
        name="Langson Library — Floor 2",
        category="study",
        latitude=33.6471,
        longitude=-117.8411,
        capacity_estimate=100,
        parent_id=langson.id,
        admin_tag="usually active"
    )
    floor3 = Location(
        id=uuid.uuid4(),
        name="Langson Library — Floor 3 Quiet Zone",
        category="study",
        latitude=33.6471,
        longitude=-117.8411,
        capacity_estimate=60,
        parent_id=langson.id,
        admin_tag="usually empty"
    )

    for loc in [floor2, floor3]:
        db.add(loc)
    db.commit()
    for loc in [floor2, floor3]:
        db.refresh(loc)

    all_locations = [langson, arc, starbucks, peets, floor2, floor3]
    print(f"Seeded {len(all_locations)} locations")
    return all_locations

def seed_patterns(db, locations):
    patterns = []

    for location in locations:
        if location.category == "study":
            for day in WEEKDAYS:
                for hour in range(0, 24):
                    if 11 <= hour <= 15:
                        base_score = 0.2
                    elif 8 <= hour <= 10 or 16 <= hour <= 20:
                        base_score = 0.5
                    elif 21 <= hour <= 23:
                        base_score = 0.7
                    else:
                        base_score = 0.9
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
            for day in WEEKDAYS:
                for hour in range(0, 24):
                    if 6 <= hour <= 8 or 17 <= hour <= 20:
                        base_score = 0.15
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
            for day in WEEKDAYS:
                for hour in range(0, 24):
                    if 8 <= hour <= 10:
                        base_score = 0.2
                    elif 11 <= hour <= 13:
                        base_score = 0.25
                    elif 14 <= hour <= 16:
                        base_score = 0.55
                    elif 17 <= hour <= 19:
                        base_score = 0.4
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