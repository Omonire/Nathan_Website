import os
import sqlite3

DB_PATH = os.environ.get(
    "DATABASE_PATH",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "portfolio.db"),
)

SCHEMA = """
CREATE TABLE IF NOT EXISTS kv (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    idx         TEXT    NOT NULL,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL,
    detail      TEXT    NOT NULL,
    price       TEXT    NOT NULL DEFAULT '',
    category    TEXT    NOT NULL DEFAULT 'editing',
    hot_deal    INTEGER NOT NULL DEFAULT 0,
    active      INTEGER NOT NULL DEFAULT 1,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
    slug        TEXT PRIMARY KEY,
    title       TEXT    NOT NULL,
    client      TEXT    NOT NULL,
    year        TEXT    NOT NULL,
    tag         TEXT    NOT NULL,
    role        TEXT    NOT NULL,
    video_url   TEXT    NOT NULL DEFAULT '',
    thumb       TEXT    NOT NULL DEFAULT '',
    description TEXT    NOT NULL DEFAULT '',
    result      TEXT    NOT NULL DEFAULT '',
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS testimonials (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    quote      TEXT    NOT NULL,
    name       TEXT    NOT NULL,
    role       TEXT    NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS posts (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    slug         TEXT    NOT NULL UNIQUE,
    title        TEXT    NOT NULL,
    excerpt      TEXT    NOT NULL DEFAULT '',
    body         TEXT    NOT NULL DEFAULT '',
    cover        TEXT    NOT NULL DEFAULT '',
    tag          TEXT    NOT NULL DEFAULT '',
    author       TEXT    NOT NULL DEFAULT 'Nathan Nkuma O.',
    status       TEXT    NOT NULL DEFAULT 'draft',
    published_at TEXT    NOT NULL DEFAULT (datetime('now')),
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    email      TEXT    NOT NULL,
    message    TEXT    NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'new',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS bookings (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    reference    TEXT    NOT NULL UNIQUE,
    service_id   TEXT,
    service_name TEXT,
    barber_id    TEXT,
    barber_name  TEXT,
    booking_date TEXT,
    booking_time TEXT,
    client_name  TEXT    NOT NULL,
    contact      TEXT    NOT NULL,
    notes        TEXT    NOT NULL DEFAULT '',
    status       TEXT    NOT NULL DEFAULT 'pending',
    created_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS bookings_date_idx   ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
"""


# Columns added after the first release; applied on boot to older DB files.
MIGRATION = (
    "ALTER TABLE services ADD COLUMN price TEXT NOT NULL DEFAULT ''",
    "ALTER TABLE services ADD COLUMN category TEXT NOT NULL DEFAULT 'editing'",
    "ALTER TABLE services ADD COLUMN hot_deal INTEGER NOT NULL DEFAULT 0",
    "ALTER TABLE services ADD COLUMN active INTEGER NOT NULL DEFAULT 1",
)


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db(conn):
    conn.executescript(SCHEMA)
    for stmt in MIGRATION:
        try:
            conn.execute(stmt)
        except sqlite3.OperationalError:
            # Column already exists on this DB.
            pass
    conn.commit()
