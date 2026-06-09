# momento
**Real-Time Spatial Availability. On-Demand.**

> Warm Luxury. Creamy. Cozy.

Live at [join-momento.vercel.app](https://join-momento.vercel.app)

---

## What It Does

You've shown up to a packed library. A crowded gym. A cafe with no seats. And you just wasted a trip.

Google Maps tells you a place exists and the hours it tends to be busy. **momento** is a real-time spatial modeling engine designed to be community-reported, algorithmically scored, and built around one question:

**Is it worth going there right now? And if not, where should you go instead?**

Not just "the library is busy at this hour" — but "the third floor quiet zone has open seats."

---

## Philosophy

Momento is a web platform for checking real-time availability across physical locations — study workspaces, gyms, recreational centers, and cafes. Every contributor is a real person. Every score is earned, not assumed.

Momento is a tool users *reach for* when they need it — not a platform that monitors engagement. There is no activity tracking, no social graph, and no algorithmic pressure to return.

---

## How It Works

Each location has an **availability score from 0–100** computed by a scoring function that blends two signals:

### Heuristic Baseline
Seed data encodes time-of-day patterns for each location — libraries are busier at midday, gyms at 6pm, cafes at 9am. These patterns form the prior.

### Real-Time Crowd Reports
Approved contributors submit crowd reports — how many people are seated, how many are in line. Each report is weighted by how recent it is using **exponential decay**:

```
weight = e^(-λt)
```

Where `t` is minutes elapsed since the report and `λ = 0.05`. A report from 5 minutes ago carries ~78% of its original weight. A report from 60 minutes ago carries ~5%.

### Dynamic Pattern Trust
When recent crowd reports diverge significantly from historical patterns — like a location going viral — the algorithm automatically down-weights the heuristic and lets real-time signals dominate. This prevents stale baselines from misrepresenting locations that have recently changed.

### Final Score
```
final_score = (pattern_weight × base_score) + (report_weight × report_score)
```

Where `pattern_weight` is dynamic based on divergence between historical and real-time signals. Default blend is 30% heuristic / 70% real-time.

| Score | Label |
|---|---|
| 80–100 | Virtually empty |
| 60–80 | Plenty of space |
| 30–60 | Moderate |
| 20–30 | Filling up |
| 0–20 | Virtually full |

---

**Why exponential over linear decay:** A report from 2 hours ago tells you almost nothing about current crowd levels. Linear decay doesn't capture that curve. Exponential decay drops off sharply in the first 30 minutes — where crowd information is most perishable — and asymptotes toward zero, matching the intuition that old reports should have essentially no influence.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + React + TypeScript |
| Map | react-map-gl + MapLibre GL |
| Styling | TailwindCSS |
| Frontend Deployment | Vercel |
| Backend | FastAPI (Python) + Poetry |
| Backend Hosting | Railway |
| Database | PostgreSQL via Supabase |
| ORM | SQLAlchemy + Alembic |
| Realtime | WebSockets |
| Task Queue | Celery + Redis |
| SMS | Twilio |

---

## User System

| Type | Permissions |
|---|---|
| Visitor | View map, see scores, read availability |
| Contributor | Everything above + submit crowd reports |
| Admin | Everything above + manage locations, approve contributors |

Contributors apply through a lightweight form. Applications are reviewed manually and approved through the admin dashboard. This protects data integrity — bot submissions would corrupt the scoring model.

---

## Metrics

**Number of locations:**
```sql
SELECT COUNT(*) FROM locations;
```

**Number of crowd reports:**
```sql
SELECT COUNT(*) FROM crowd_reports;
```

**WebSocket broadcast latency:**
Measured from crowd report submission timestamp to client receipt timestamp. Last measured (5 samples minimum): 98ms.

---

## Branding

| Element | Value |
|---|---|
| Primary background | Cloud `#ECF0F1` |
| Primary text | Ash `#262626` |
| Accent | `#7A5F55` |
| Display font | Cormorant Garamond |
| Aesthetic | Warm luxury. Creamy. Cozy. |