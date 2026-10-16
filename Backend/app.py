import json
import os
import re
import secrets

from flask import Flask, jsonify, request

import admin
from seed import seed_all
from sqlite import get_db, init_db

EMAIL_RE = re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$")


def _project_row(row):
    return {
        "slug": row["slug"],
        "title": row["title"],
        "client": row["client"],
        "year": row["year"],
        "tag": row["tag"],
        "role": row["role"],
        "videoUrl": row["video_url"],
        "thumb": row["thumb"],
        "description": row["description"],
        "result": row["result"],
    }


def _kv(conn, key, default=None):
    row = conn.execute("SELECT value FROM kv WHERE key = ?", (key,)).fetchone()
    if row is None:
        return default
    try:
        return json.loads(row["value"])
    except (TypeError, ValueError):
        return default


def _services(conn):
    rows = conn.execute("SELECT * FROM services ORDER BY sort_order").fetchall()
    return [
        {"index": r["idx"], "name": r["name"], "description": r["description"], "detail": r["detail"]}
        for r in rows
    ]


def _projects(conn):
    rows = conn.execute("SELECT * FROM projects ORDER BY sort_order").fetchall()
    return [_project_row(r) for r in rows]


def _testimonials(conn):
    rows = conn.execute("SELECT * FROM testimonials ORDER BY sort_order").fetchall()
    return [{"quote": r["quote"], "name": r["name"], "role": r["role"]} for r in rows]


def create_app():
    app = Flask(__name__)
    app.config["JSON_SORT_KEYS"] = False

    try:
        from flask_cors import CORS

        CORS(app, resources={r"/api/*": {"origins": "*"}})
    except ImportError:
        pass

    with app.app_context():
        conn = get_db()
        init_db(conn)
        seed_all(conn)
        conn.close()

    @app.get("/api/health")
    def health():
        return jsonify({"ok": True})

    @app.get("/api/site")
    def site():
        conn = get_db()
        try:
            payload = {
                "brand": _kv(conn, "brand", {}),
                "showreel": _kv(conn, "showreel", {}),
                "about": _kv(conn, "about", {}),
                "contact": _kv(conn, "contact", {}),
                "socials": _kv(conn, "socials", []),
                "services": _services(conn),
                "testimonials": _testimonials(conn),
            }
        finally:
            conn.close()
        return jsonify(payload)

    @app.get("/api/projects")
    def projects():
        conn = get_db()
        try:
            data = _projects(conn)
        finally:
            conn.close()
        return jsonify(data)

    @app.get("/api/projects/<slug>")
    def project(slug):
        conn = get_db()
        try:
            row = conn.execute("SELECT * FROM projects WHERE slug = ?", (slug,)).fetchone()
        finally:
            conn.close()
        if row is None:
            return jsonify({"error": "Project not found"}), 404
        return jsonify(_project_row(row))

    @app.post("/api/contact")
    def contact():
        data = request.get_json(silent=True) or {}
        name = str(data.get("name", "")).strip()
        email = str(data.get("email", "")).strip()
        message = str(data.get("message", "")).strip()
        # honeypot: bots fill hidden fields
        if data.get("website"):
            return jsonify({"ok": True, "reference": f"NNO-{secrets.token_hex(3).upper()}"})

        errors = {}
        if not name:
            errors["name"] = "Name is required"
        if not EMAIL_RE.match(email):
            errors["email"] = "Enter a valid email"
        if len(message) < 10:
            errors["message"] = "Tell me a bit more (10+ characters)"
        if errors:
            return jsonify({"ok": False, "errors": errors}), 400

        conn = get_db()
        try:
            cur = conn.execute(
                "INSERT INTO messages (name, email, message) VALUES (?, ?, ?)",
                (name, email, message),
            )
            conn.commit()
            message_id = cur.lastrowid
        finally:
            conn.close()

        reference = f"NNO-{secrets.token_hex(3).upper()}"
        return jsonify({"ok": True, "id": message_id, "reference": reference})

    app.register_blueprint(admin.bp)

    return app


app = create_app()


if __name__ == "__main__":
    app.run(
        host=os.environ.get("HOST", "127.0.0.1"),
        port=int(os.environ.get("PORT", "5000")),
        debug=os.environ.get("FLASK_DEBUG", "1") == "1",
    )
