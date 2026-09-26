from fastapi import APIRouter, WebSocket, WebSocketDisconnect

ws_router = APIRouter(prefix="/api/ws", tags=["websocket"])
connections = []


@ws_router.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    connections.append(websocket)

    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        connections.remove(websocket)


async def broadcast(data: dict):
    disconnected = []

    for ws in connections.copy():
        try:
            await ws.send_json(data)
        except WebSocketDisconnect:
            disconnected.append(ws)

    for ws in disconnected:
        connections.remove(ws)
