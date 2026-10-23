import json
import os
import re
import secrets
import time

from flask import Blueprint, current_app, jsonify, request

from db import get_db

bp = Blueprint("admin", __name__, url_prefix="/api/admin")

SESSION_TTL_SECONDS = 12 * 60 * 60
_sessions: dict[str, float] = {}


def _admin_credentials():
    """Return (user, pass) from env, or (None, None) when not configured."""
    return os.environ.get("ADMIN_USER"), os.environ.get("ADMIN_PASS")


def _master_token():
    return os.environ.get("ADMIN_TOKEN")


def _issue_session():
    token = secrets.token_urlsafe(32)
    _sessions[token] = time.time() + SESSION_TTL_SECONDS
    return token


def _valid_session(token):
    expiry = _sessions.get(token)
    if expiry is None:
        return False
    if expiry < time.time():
        _sessions.pop(token, None)
        return False
    return True


def _authorized():
    provided = request.headers.get("X-Admin-Token") or request.args.get("token") or ""
    if not provided:
        return False

    master = _master_token()
    if master and secrets.compare_digest(provided, master):
        return True

    if _valid_session(provided):
        return True

    # No master token configured: allow admin routes only while debugging locally,
    # fail closed in production so submissions are never exposed.
    if not master and not _admin_credentials()[0]:
        return bool(current_app.debug)
    return False


@bp.post("/login")
def login():
    data = request.get_json(silent=True) or {}
    username = str(data.get("username", "")).strip()
    password = str(data.get("password", ""))

    user, pw = _admin_credentials()
    if user and pw:
        ok = secrets.compare_digest(username, user) and secrets.compare_digest(password, pw)
    else:
        # No credentials configured: allow only while debugging locally.
        ok = bool(current_app.debug) and bool(username)

    if not ok:
        return jsonify({"error": "Invalid username or password"}), 401

    return jsonify({"ok": True, "token": _issue_session()})


@bp.post("/logout")
def logout():
    provided = request.headers.get("X-Admin-Token") or request.args.get("token") or ""
    _sessions.pop(provided, None)
    return jsonify({"ok": True})


@bp.get("/check")
def check():
    return jsonify({"authenticated": _authorized()})


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


SITE_KEYS = {"brand", "showreel", "about", "contact", "hours", "socials"}


@bp.get("/site")
def get_site():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        payload = {}
        for key in SITE_KEYS:
            row = conn.execute("SELECT value FROM kv WHERE key = ?", (key,)).fetchone()
            if row is None:
                continue
            try:
                payload[key] = json.loads(row["value"])
            except (TypeError, ValueError):
                payload[key] = None
    finally:
        conn.close()
    return jsonify(payload)


@bp.put("/site")
def update_site():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json(silent=True) or {}
    if not isinstance(data, dict) or not data:
        return jsonify({"error": "Provide a JSON object of settings to update"}), 400
    unknown = set(data) - SITE_KEYS
    if unknown:
        return jsonify({"error": f"Unknown settings: {', '.join(sorted(unknown))}"}), 400
    conn = get_db()
    try:
        for key, value in data.items():
            conn.execute("DELETE FROM kv WHERE key = ?", (key,))
            conn.execute(
                "INSERT INTO kv (key, value) VALUES (?, ?)",
                (key, json.dumps(value, ensure_ascii=False)),
            )
        conn.commit()
    finally:
        conn.close()
    return jsonify({"ok": True, "keys": sorted(data)})


def _service_row(row):
    return {
        "id": row["idx"],
        "name": row["name"],
        "description": row["description"],
        "price": row["price"],
        "duration": row["detail"],
        "category": row["category"],
        "hotDeal": bool(row["hot_deal"]),
        "active": bool(row["active"]),
        "sortOrder": row["sort_order"],
    }


def _clean_service(data):
    name = str(data.get("name", "")).strip()
    description = str(data.get("description", "")).strip()
    price = str(data.get("price", "")).strip()
    duration = str(data.get("duration", data.get("detail", ""))).strip()
    category = str(data.get("category", "")).strip() or "editing"
    hot_deal = 1 if data.get("hotDeal") else 0
    active = 0 if data.get("active") is False else 1
    return name, description, price, duration, category, hot_deal, active


@bp.get("/services")
def list_services():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM services ORDER BY sort_order").fetchall()
    finally:
        conn.close()
    return jsonify([_service_row(r) for r in rows])


@bp.post("/services")
def create_service():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    name, description, price, duration, category, hot_deal, active = _clean_service(request.get_json(silent=True) or {})
    if not name:
        return jsonify({"error": "Name is required"}), 400
    conn = get_db()
    try:
        sid = _slugify(name)
        base = sid
        n = 2
        while conn.execute("SELECT 1 FROM services WHERE idx = ?", (sid,)).fetchone():
            sid = f"{base}-{n}"
            n += 1
        nxt = conn.execute("SELECT COALESCE(MAX(sort_order), -1) + 1 FROM services").fetchone()[0]
        conn.execute(
            "INSERT INTO services (idx, name, description, detail, price, category, hot_deal, active, sort_order) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (sid, name, description, duration, price, category, hot_deal, active, nxt),
        )
        conn.commit()
    finally:
        conn.close()
    return jsonify({"ok": True, "id": sid}), 201


@bp.put("/services/<string:service_id>")
def update_service(service_id):
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    name, description, price, duration, category, hot_deal, active = _clean_service(request.get_json(silent=True) or {})
    if not name:
        return jsonify({"error": "Name is required"}), 400
    conn = get_db()
    try:
        cur = conn.execute(
            "UPDATE services SET name = ?, description = ?, detail = ?, price = ?, "
            "category = ?, hot_deal = ?, active = ? WHERE idx = ?",
            (name, description, duration, price, category, hot_deal, active, service_id),
        )
        conn.commit()
        updated = cur.rowcount
    finally:
        conn.close()
    if not updated:
        return jsonify({"error": "Service not found"}), 404
    return jsonify({"ok": True, "id": service_id})


@bp.delete("/services/<string:service_id>")
def delete_service(service_id):
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        cur = conn.execute("DELETE FROM services WHERE idx = ?", (service_id,))
        conn.commit()
        deleted = cur.rowcount
    finally:
        conn.close()
    if not deleted:
        return jsonify({"error": "Service not found"}), 404
    return jsonify({"ok": True, "id": service_id})


def _post_row(row, full=True):
    data = {
        "id": row["id"],
        "slug": row["slug"],
        "title": row["title"],
        "excerpt": row["excerpt"],
        "cover": row["cover"],
        "tag": row["tag"],
        "author": row["author"],
        "status": row["status"],
        "publishedAt": row["published_at"],
    }
    if full:
        data["body"] = row["body"]
    return data


def _slugify(value):
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower()).strip("-")
    return slug or "post"


def _clean_post(data, existing_slug=None):
    title = str(data.get("title", "")).strip()
    body = str(data.get("body", "")).strip()
    excerpt = str(data.get("excerpt", "")).strip()
    cover = str(data.get("cover", "")).strip()
    tag = str(data.get("tag", "")).strip()
    author = str(data.get("author", "")).strip() or "Nathan Nkuma O."
    status = str(data.get("status", "draft")).strip()
    if status not in {"draft", "published"}:
        status = "draft"
    slug = str(data.get("slug", "")).strip() or existing_slug or _slugify(title)
    slug = _slugify(slug)
    return slug, title, excerpt, body, cover, tag, author, status


@bp.get("/posts")
def list_posts():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        rows = conn.execute("SELECT * FROM posts ORDER BY published_at DESC, id DESC").fetchall()
    finally:
        conn.close()
    return jsonify([_post_row(r) for r in rows])


@bp.post("/posts")
def create_post():
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    slug, title, excerpt, body, cover, tag, author, status = _clean_post(request.get_json(silent=True) or {})
    if not title or not body:
        return jsonify({"error": "Title and body are required"}), 400
    conn = get_db()
    try:
        exists = conn.execute("SELECT 1 FROM posts WHERE slug = ?", (slug,)).fetchone()
        if exists:
            return jsonify({"error": "A post with that slug already exists"}), 409
        cur = conn.execute(
            "INSERT INTO posts (slug, title, excerpt, body, cover, tag, author, status) "
            "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            (slug, title, excerpt, body, cover, tag, author, status),
        )
        conn.commit()
        new_id = cur.lastrowid
    finally:
        conn.close()
    return jsonify({"ok": True, "id": new_id, "slug": slug}), 201


@bp.put("/posts/<int:post_id>")
def update_post(post_id):
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        existing = conn.execute("SELECT slug, status FROM posts WHERE id = ?", (post_id,)).fetchone()
        if existing is None:
            return jsonify({"error": "Post not found"}), 404
        slug, title, excerpt, body, cover, tag, author, status = _clean_post(
            request.get_json(silent=True) or {}, existing_slug=existing["slug"]
        )
        if not title or not body:
            return jsonify({"error": "Title and body are required"}), 400
        clash = conn.execute(
            "SELECT 1 FROM posts WHERE slug = ? AND id <> ?", (slug, post_id)
        ).fetchone()
        if clash:
            return jsonify({"error": "A post with that slug already exists"}), 409
        if existing["status"] != "published" and status == "published":
            # First publish: stamp the real publish date so ordering and the
            # date shown on the site reflect when it went live, not creation.
            published_at = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
            conn.execute(
                "UPDATE posts SET slug = ?, title = ?, excerpt = ?, body = ?, cover = ?, "
                "tag = ?, author = ?, status = ?, published_at = ? WHERE id = ?",
                (slug, title, excerpt, body, cover, tag, author, status, published_at, post_id),
            )
        else:
            conn.execute(
                "UPDATE posts SET slug = ?, title = ?, excerpt = ?, body = ?, cover = ?, "
                "tag = ?, author = ?, status = ? WHERE id = ?",
                (slug, title, excerpt, body, cover, tag, author, status, post_id),
            )
        conn.commit()
    finally:
        conn.close()
    return jsonify({"ok": True, "id": post_id, "slug": slug})


@bp.delete("/posts/<int:post_id>")
def delete_post(post_id):
    if not _authorized():
        return jsonify({"error": "Unauthorized"}), 401
    conn = get_db()
    try:
        cur = conn.execute("DELETE FROM posts WHERE id = ?", (post_id,))
        conn.commit()
        deleted = cur.rowcount
    finally:
        conn.close()
    if not deleted:
        return jsonify({"error": "Post not found"}), 404
    return jsonify({"ok": True, "id": post_id})
