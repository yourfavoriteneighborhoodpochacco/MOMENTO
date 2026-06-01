from fastapi import WebSocket
from typing import Dict

class ConnectionManager:
    def __init__(self):
        # location_id → list of connected WebSocket clients viewing that location
        self.active_connections: Dict[str, list[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, location_id: str):
        await websocket.accept()
        if location_id not in self.active_connections:
            self.active_connections[location_id] = []
        self.active_connections[location_id].append(websocket)

    def disconnect(self, websocket: WebSocket, location_id: str):
        if location_id in self.active_connections:
            self.active_connections[location_id].remove(websocket)
            if not self.active_connections[location_id]:
                del self.active_connections[location_id]

    async def broadcast_to_location(self, location_id: str, message: dict):
        if location_id not in self.active_connections:
            return
        disconnected = []
        for websocket in self.active_connections[location_id]:
            try:
                await websocket.send_json(message)
            except Exception:
                disconnected.append(websocket)
        for websocket in disconnected:
            self.disconnect(websocket, location_id)

manager = ConnectionManager()