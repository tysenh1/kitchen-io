import socketio
import asyncio
import keyboard

async def send_websocket_event():

    sio = socketio.Client(ssl_verify=False)
    try:
        async with websockets.connect('ws://localhost:5173') as websocket:
            def on_key_press(event):
                asyncio.create_task(send_event(websocket))

            keyboard.on_press(on_key_press)

            while True:
                await asyncio.sleep(1)

    except Exception as e:
        print(f"WebSocket error: {e}")

async def send_event(websocket):
    try:
        await websocket.send('keypress')
        print("Keypress event send!")
    except Exception as e:
        print(f"Event send error: {e}")

asyncio.run(send_websocket_event())
