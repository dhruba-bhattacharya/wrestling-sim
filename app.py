from __future__ import annotations

import json
from http import HTTPStatus
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

from simulator import WrestlingSimulator

ROOT = Path(__file__).parent
STATIC_DIR = ROOT / "web"
SIM = WrestlingSimulator(ROOT / "data", seed=42)


class GameHandler(BaseHTTPRequestHandler):
    def _send_json(self, payload: dict, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_json_body(self) -> dict:
        content_length = int(self.headers.get("Content-Length", "0"))
        raw = self.rfile.read(content_length) if content_length else b"{}"
        try:
            return json.loads(raw.decode("utf-8"))
        except json.JSONDecodeError:
            return {}

    def do_GET(self) -> None:
        if self.path == "/" or self.path == "/home.html":
            body = (STATIC_DIR / "home.html").read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        static_routes = {
            "/game.html": ("game.html", "text/html; charset=utf-8"),
            "/styles.css": ("styles.css", "text/css; charset=utf-8"),
            "/home.js": ("home.js", "application/javascript; charset=utf-8"),
            "/game.js": ("game.js", "application/javascript; charset=utf-8"),
        }
        if self.path in static_routes:
            file_name, content_type = static_routes[self.path]
            body = (STATIC_DIR / file_name).read_bytes()
            self.send_response(HTTPStatus.OK)
            self.send_header("Content-Type", content_type)
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            self.wfile.write(body)
            return

        if self.path == "/api/state":
            self._send_json(SIM.to_state())
            return

        if self.path == "/api/feud-options":
            self._send_json({"options": SIM.feud_options_with_names()})
            return

        self._send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)

    def do_POST(self) -> None:
        global SIM

        if self.path == "/api/create-rivalry":
            body = self._read_json_body()
            rivalry_type = body.get("rivalry_type")
            ids = body.get("ids", [])
            if not rivalry_type or not isinstance(ids, list) or len(ids) < 2:
                self._send_json({"error": "Invalid rivalry payload"}, HTTPStatus.BAD_REQUEST)
                return
            SIM.create_rivalry(rivalry_type, ids)
            self._send_json({"ok": True, "state": SIM.to_state()})
            return

        if self.path == "/api/play-week":
            result = SIM.auto_book_weekly_show()
            self._send_json({"result": result, "state": SIM.to_state()})
            return

        if self.path == "/api/reset":
            SIM = WrestlingSimulator(ROOT / "data", seed=42)
            self._send_json({"ok": True, "state": SIM.to_state()})
            return

        self._send_json({"error": "Not found"}, HTTPStatus.NOT_FOUND)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("0.0.0.0", 8000), GameHandler)
    print("Ultimate Wrestling Simulator UI running at http://localhost:8000")
    server.serve_forever()
