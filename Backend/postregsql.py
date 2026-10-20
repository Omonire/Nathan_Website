"""PostgreSQL backend for the portfolio API.

Used automatically when DATABASE_URL is set and reachable (see db.py). The
connection wrapper presents the same interface as the sqlite3 connection the
rest of the app already expects, translating `?` placeholders to `%s` and
`INSERT OR IGNORE` to `ON CONFLICT DO NOTHING`.
"""

import psycopg2
import psycopg2.extras

SCHEMA = """
CREATE TABLE IF NOT EXISTS kv (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
    id          SERIAL  PRIMARY KEY,
    idx         TEXT    NOT NULL,
    name        TEXT    NOT NULL,
    description TEXT    NOT NULL,
    detail      TEXT    NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS projects (
    slug        TEXT    PRIMARY KEY,
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
    id         SERIAL  PRIMARY KEY,
    quote      TEXT    NOT NULL,
    name       TEXT    NOT NULL,
    role       TEXT    NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS messages (
    id         SERIAL    PRIMARY KEY,
    name       TEXT      NOT NULL,
    email      TEXT      NOT NULL,
    message    TEXT      NOT NULL,
    status     TEXT      NOT NULL DEFAULT 'new',
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
    id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    reference    TEXT      NOT NULL UNIQUE,
    service_id   TEXT,
    service_name TEXT,
    barber_id    TEXT,
    barber_name  TEXT,
    booking_date TEXT,
    booking_time TEXT,
    client_name  TEXT      NOT NULL,
    contact      TEXT      NOT NULL,
    notes        TEXT      NOT NULL DEFAULT '',
    status       TEXT      NOT NULL DEFAULT 'pending',
    created_at   TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS bookings_date_idx   ON bookings (booking_date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings (status);
"""


class Row:
    """Mimics sqlite3.Row: supports both row[0] and row['column']."""

    __slots__ = ("_data",)

    def __init__(self, data):
        self._data = data

    def __getitem__(self, key):
        if isinstance(key, int):
            return list(self._data.values())[key]
        return self._data[key]

    def keys(self):
        return list(self._data.keys())

    def values(self):
        return list(self._data.values())

    def items(self):
        return list(self._data.items())

    def get(self, key, default=None):
        return self._data.get(key, default)

    def __iter__(self):
        return iter(self._data.values())


class Cursor:
    def __init__(self, cur, connection):
        self._cur = cur
        self._connection = connection

    @property
    def rowcount(self):
        return self._cur.rowcount

    @property
    def lastrowid(self):
        # Postgres has no cursor.lastrowid; mirror SQLite with lastval().
        try:
            cur = self._connection._conn.cursor()
            cur.execute("SELECT lastval()")
            value = cur.fetchone()[0]
            cur.close()
            return value
        except Exception:
            return None

    def fetchone(self):
        row = self._cur.fetchone()
        return Row(row) if row is not None else None

    def fetchall(self):
        return [Row(r) for r in self._cur.fetchall()]

    def __iter__(self):
        for row in self._cur:
            yield Row(row)


class Connection:
    def __init__(self, conn):
        self._conn = conn

    @staticmethod
    def _translate(sql):
        ignore = "INSERT OR IGNORE" in sql.upper()
        out = sql.replace("INSERT OR IGNORE", "INSERT")
        out = out.replace("?", "%s")
        if ignore:
            out = out.rstrip().rstrip(";") + " ON CONFLICT DO NOTHING"
        return out

    def execute(self, sql, params=()):
        cur = self._conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(self._translate(sql), params)
        return Cursor(cur, self)

    def executemany(self, sql, seq):
        cur = self._conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.executemany(self._translate(sql), seq)
        return Cursor(cur, self)

    def executescript(self, script):
        cur = self._conn.cursor()
        cur.execute(script)
        cur.close()

    def commit(self):
        self._conn.commit()

    def rollback(self):
        self._conn.rollback()

    def close(self):
        self._conn.close()


def connect(url):
    return Connection(psycopg2.connect(url))
