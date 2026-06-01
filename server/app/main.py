from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth, locations, reports, applications, users, availability
from app.services.websocket import manager
from app.services.scoring import recompute_score
from app.db.session import SessionLocal

app = FastAPI(title="momento API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://momento.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router)
app.include_router(locations.router)
app.include_router(reports.router)
app.include_router(applications.router)
app.include_router(users.router)
app.include_router(availability.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.websocket("/ws/{location_id}")
async def websocket_endpoint(websocket: WebSocket, location_id: str):
    await manager.connect(websocket, location_id)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket, location_id)