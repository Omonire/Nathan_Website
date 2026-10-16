import json

SITE_DEFAULTS = {
    "brand": {
        "name": "Nathan N.O",
        "role": "Video Editor & Post-Production",
        "positioning": "Video editor for YouTube creators",
    },
    "showreel": {
        "url": "",
        "caption": "A minute of cuts, color and sound \u2014 the reel that says it faster than a bio.",
        "length": "01:20",
    },
    "about": {
        "bio": (
            "I edit video for YouTube creators who live or die by retention. Every cut, "
            "transition and beat of sound design is there to keep a viewer from leaving \u2014 "
            "then to make them hit subscribe. From raw footage to final upload, I handle the "
            "edit, color, sound and motion."
        ),
        "years": "5+",
        "tools": ["Premiere Pro", "DaVinci Resolve", "After Effects", "Audition"],
        "clients": ["Creator Studio", "Independent Channels", "Brand Campaigns"],
    },
    "contact": {
        "email": "hello@nathanno.com",
        "location": "Remote \u00b7 Worldwide",
        "availability": "Booking new projects",
    },
    "socials": [
        {"label": "YouTube", "href": "#"},
        {"label": "Instagram", "href": "#"},
        {"label": "TikTok", "href": "#"},
        {"label": "LinkedIn", "href": "#"},
        {"label": "Behance", "href": "#"},
    ],
}

SERVICES = [
    ("01", "Video Editing", "Long-form edits paced for retention \u2014 story, rhythm and timing.", "YouTube / Podcast"),
    ("02", "Color Grading", "Consistent, cinematic looks that make footage feel premium.", "DaVinci Resolve"),
    ("03", "Sound Design", "Clean dialogue, music beds and SFX that hit on the beat.", "Mix & Master"),
    ("04", "Motion Graphics", "Titles, lower-thirds and animated hooks built in After Effects.", "AE / Templates"),
    ("05", "Shorts & Reels", "Vertical cutdowns repurposed for Shorts, Reels and TikTok.", "9:16 Formats"),
    ("06", "Thumbnails", "Scroll-stopping thumbnail concepts that match the edit.", "Design Pass"),
]

PROJECTS = [
    ("retention-edit", "The Retention Cut", "Creator Studio", "2025", "Long-Form", "Edit \u00b7 Color \u00b7 Sound", "",
     "A 14-minute documentary-style video rebuilt around retention, cutting dead air and reinforcing every hook.",
     "Avg. watch time +38%"),
    ("brand-film", "Brand Film \u2014 Northline", "Northline", "2025", "Brand", "Edit \u00b7 Motion", "",
     "A 60-second brand film with animated type and a graded look that carried a full campaign.",
     "1.2M organic views"),
    ("shorts-system", "Shorts Repurposing System", "Independent Channels", "2024", "Shorts", "Edit \u00b7 Sound", "",
     "A repeatable vertical workflow turning one long-form video into nine Shorts per week.",
     "9 shorts / week"),
    ("podcast-package", "Podcast Post Package", "The Long Game", "2024", "Podcast", "Edit \u00b7 Color \u00b7 Sound", "",
     "End-to-end post for a weekly podcast: multicam edit, cleanup, grade and clip delivery.",
     "Weekly, on time"),
    ("product-launch", "Product Launch Teaser", "Atlas Gear", "2024", "Commercial", "Edit \u00b7 Motion \u00b7 Sound", "",
     "A punchy 30-second teaser cut to a custom sound bed for a product drop.",
     "CTR 2.4x"),
    ("music-visual", "Music Visual", "Artist Collab", "2023", "Music", "Edit \u00b7 Color", "",
     "A stylized performance visual with beat-matched cuts and a heavy grade.",
     "Featured"),
]

TESTIMONIALS = [
    ("Turnaround is fast and the retention on our edits went up immediately. Nathan just gets pacing.",
     "Alex Rivera", "YouTube Creator"),
    ("The color and sound work made a talking-head video feel like a production. Zero notes.",
     "Priya Raman", "Brand Content Lead"),
    ("Handed over raw footage, got back something better than I imagined. Now my default editor.",
     "Marcus Lee", "Podcast Host"),
]


def _seed_kv(conn):
    for key, value in SITE_DEFAULTS.items():
        conn.execute(
            "INSERT OR IGNORE INTO kv (key, value) VALUES (?, ?)",
            (key, json.dumps(value, ensure_ascii=False)),
        )


def _seed_services(conn):
    if conn.execute("SELECT COUNT(*) FROM services").fetchone()[0]:
        return
    conn.executemany(
        "INSERT INTO services (idx, name, description, detail, sort_order) VALUES (?, ?, ?, ?, ?)",
        [(idx, name, desc, detail, i) for i, (idx, name, desc, detail) in enumerate(SERVICES)],
    )


def _seed_projects(conn):
    if conn.execute("SELECT COUNT(*) FROM projects").fetchone()[0]:
        return
    rows = []
    for i, (slug, title, client, year, tag, role, thumb, desc, result) in enumerate(PROJECTS):
        rows.append((slug, title, client, year, tag, role, "", thumb, desc, result, i))
    conn.executemany(
        """INSERT INTO projects
           (slug, title, client, year, tag, role, video_url, thumb, description, result, sort_order)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        rows,
    )


def _seed_testimonials(conn):
    if conn.execute("SELECT COUNT(*) FROM testimonials").fetchone()[0]:
        return
    conn.executemany(
        "INSERT INTO testimonials (quote, name, role, sort_order) VALUES (?, ?, ?, ?)",
        [(q, n, r, i) for i, (q, n, r) in enumerate(TESTIMONIALS)],
    )


def seed_all(conn):
    _seed_kv(conn)
    _seed_services(conn)
    _seed_projects(conn)
    _seed_testimonials(conn)
    conn.commit()


def reset_all(conn):
    for table in ("kv", "services", "projects", "testimonials", "messages"):
        conn.execute(f"DELETE FROM {table}")
    conn.commit()
    seed_all(conn)
