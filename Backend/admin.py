import os
import secrets

from flask import Blueprint, current_app, jsonify, request

from db import get_db

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


def _testimonial_row(row):
    return {
        "id": row["id"],
        "quote": row["quote"],
        "name": row["name"],
        "role": row["role"],
        "sort_order": row["sort_order"],
        "rating": 5,
    }


def _clean_testimonial(data):
    quote = str(data.get("quote", "")).strip()
    name = str(data.get("name", "")).strip()
    role = str(data.get("role", "")).strip()
    return quote, name, role


@bp.get("/testimonials")
def list_testimonials():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM testimonials ORDER BY sort_order, id").fetchall()
    finally:
        conn.close()
    return jsonify([_testimonial_row(r) for r in rows])


@bp.post("/testimonials")
def create_testimonial():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    quote, name, role = _clean_testimonial(request.get_json(silent=True) or {})
    if not quote or not name:
        return jsonify({"error": "Quote and name are required"}), 400
    conn = get_db()
    try:
        nxt = conn.execute("SELECT COALESCE(MAX(sort_order), -1) + 1 FROM testimonials").fetchone()[0]
        cur = conn.execute(
            "INSERT INTO testimonials (quote, name, role, sort_order) VALUES (?, ?, ?, ?)",
            (quote, name, role, nxt),
        )
        conn.commit()
        new_id = cur.lastrowid
    finally:
        conn.close()
    return jsonify({"ok": True, "id": new_id}), 201


@bp.put("/testimonials/<int:testimonial_id>")
def update_testimonial(testimonial_id):
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    quote, name, role = _clean_testimonial(request.get_json(silent=True) or {})
    if not quote or not name:
        return jsonify({"error": "Quote and name are required"}), 400
    conn = get_db()
    try:
        cur = conn.execute(
            "UPDATE testimonials SET quote = ?, name = ?, role = ? WHERE id = ?",
            (quote, name, role, testimonial_id),
        )
        conn.commit()
        updated = cur.rowcount
    finally:
        conn.close()
    if not updated:
        return jsonify({"error": "Testimonial not found"}), 404
    return jsonify({"ok": True, "id": testimonial_id})


@bp.delete("/testimonials/<int:testimonial_id>")
def delete_testimonial(testimonial_id):
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        cur = conn.execute("DELETE FROM testimonials WHERE id = ?", (testimonial_id,))
        conn.commit()
        deleted = cur.rowcount
    finally:
        conn.close()
    if not deleted:
        return jsonify({"error": "Testimonial not found"}), 404
    return jsonify({"ok": True, "id": testimonial_id})
