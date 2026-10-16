import os
import secrets

from flask import Blueprint, current_app, jsonify, request

from sqlite import get_db

bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def _authorized():
    token = os.environ.get("ADMIN_TOKEN")
    if not token:
        # No token configured: allow admin routes only while debugging locally,
        # fail closed in production so submissions are never exposed.
        return bool(current_app.debug)
    provided = request.headers.get("X-Admin-Token") or request.args.get("token") or ""
    return secrets.compare_digest(provided, token)


@bp.get("/messages")
def messages():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM messages ORDER BY id DESC").fetchall()
    finally:
        conn.close()
    return jsonify([dict(r) for r in rows])


@bp.post("/messages/<int:message_id>/status")
def set_status(message_id):
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json(silent=True) or {}
    status = str(data.get("status", "new")).strip()
    if status not in {"new", "read", "replied", "archived"}:
        return jsonify({"error": "Invalid status"}), 400
    conn = get_db()
    try:
        cur = conn.execute("UPDATE messages SET status = ? WHERE id = ?", (status, message_id))
        conn.commit()
        updated = cur.rowcount
    finally:
        conn.close()
    if not updated:
        return jsonify({"error": "Message not found"}), 404
    return jsonify({"ok": True, "id": message_id, "status": status})
