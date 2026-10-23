"""Database selector.

Set DB=1 to use PostgreSQL, which requires DATABASE_URL. Any other value (or
unset) falls back to the local SQLite file (handy for offline dev). When DB=1 is
requested but DATABASE_URL is missing, the selector raises so misconfiguration
never goes unnoticed.
"""

import os

import postregsql

from sqlite import get_db as _sqlite_get_db
from sqlite import init_db as _sqlite_init_db


def _database_url():
    return os.environ.get("DATABASE_URL", "").strip()


def _use_postgres():
    return os.environ.get("DB", "").strip() in {"1", "true", "True", "yes"}


def get_db():
    if _use_postgres():
        url = _database_url()
        if not url:
            raise RuntimeError("DB=1 requires DATABASE_URL to be set")
        return postregsql.connect(url)

    return _sqlite_get_db()


def init_db(conn):
    if isinstance(conn, postregsql.Connection):
        conn.executescript(postregsql.SCHEMA)
        conn.executescript(postregsql.MIGRATION)
        conn.commit()
    else:
        _sqlite_init_db(conn)
