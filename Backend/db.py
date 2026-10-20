"""Database selector.

Set SQLITE=1 to use the local SQLite file (handy for offline dev). Any other
value (or unset) uses PostgreSQL, which requires DATABASE_URL. A missing or
unreachable PostgreSQL database is a hard error so misconfiguration never goes
unnoticed.
"""

import os

import postregsql

from sqlite import get_db as _sqlite_get_db
from sqlite import init_db as _sqlite_init_db


def _database_url():
    return os.environ.get("DATABASE_URL", "").strip()


def _use_sqlite():
    return os.environ.get("SQLITE", "").strip() in {"1", "true", "True", "yes"}


def get_db():
    if _use_sqlite():
        return _sqlite_get_db()

    url = _database_url()
    if not url:
        raise RuntimeError("DATABASE_URL is not set (set SQLITE=1 to use SQLite)")
    return postregsql.connect(url)


def init_db(conn):
    if isinstance(conn, postregsql.Connection):
        conn.executescript(postregsql.SCHEMA)
        conn.commit()
    else:
        _sqlite_init_db(conn)
