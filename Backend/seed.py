import json

SITE_DEFAULTS = {
    "brand": {
        "name": "Nathan Nkuma O.",
        "role": "Video Editor & Post-Production",
        "positioning": "Video editor for YouTube creators",
    },
    "showreel": {
        "url": "",
        "caption": "A minute of edits, color and sound \u2014 the reel that says it faster than a bio.",
        "length": "01:20",
    },
    "about": {
        "bio": (
            "I edit video for YouTube creators who live or die by retention. Every edit, "
            "transition and beat of sound design is there to keep a viewer from leaving \u2014 "
            "then to make them hit subscribe. From raw footage to final upload, I handle the "
            "edit, color, sound and motion."
        ),
        "years": "5+",
        "tools": ["Premiere Pro", "DaVinci Resolve", "After Effects", "Audition"],
        "clients": ["Creator Studio", "Independent Channels", "Brand Campaigns"],
    },
    "contact": {
        "email": "nathannkuma@gmail.com",
        "phone": "+2349031445311",
        "location": "Remote \u00b7 Worldwide",
        "availability": "Booking new projects",
    },
    "hours": {
        "days": "Reply within 24 hours",
        "open": "Mon",
        "close": "Sat",
        "note": "Booking new projects",
    },
    "socials": [
        {"label": "YouTube", "href": "https://youtube.com/@Skidobanzz"},
        {"label": "TikTok", "href": "https://www.tiktok.com/@skidobanz.fx"},
    ],
}

# (idx, name, description, detail, price, category, hot_deal)
SERVICES = [
    ("01", "Video Editing", "Long-form edits paced for retention \u2014 story, rhythm and timing.", "YouTube / Podcast", "$150", "editing", 0),
    ("02", "Color Grading", "Consistent, cinematic looks that make footage feel premium.", "DaVinci Resolve", "$90", "finishing", 1),
    ("03", "Sound Design", "Clean dialogue, music beds and SFX that hit on the beat.", "Mix & Master", "$80", "finishing", 0),
    ("04", "Motion Graphics", "Titles, lower-thirds and animated hooks built in After Effects.", "AE / Templates", "$120", "motion", 0),
    ("05", "Shorts & Reels", "Vertical cutdowns repurposed for Shorts, Reels and TikTok.", "9:16 Formats", "$60", "social", 1),
    ("06", "Thumbnails", "Scroll-stopping thumbnail concepts that match the edit.", "Design Pass", "$40", "social", 0),
]

PROJECTS = [
    ("retention-edit", "The Retention Edit", "Creator Studio", "2025", "Long-Form", "Edit \u00b7 Color \u00b7 Sound", "",
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
# Format oe Syntax for Testinomials
# Testimonals.list() = Testimonial -> Name -> Roles
TESTIMONIALS = [
    ("Turnaround is fast and the retention on our edits went up immediately. Nathan just gets pacing.",
     "Alex Rivera", "YouTube Creator"),
    ("The color and sound work made a talking-head video feel like a production. Zero notes.",
     "Priya Raman", "Brand Content Lead"),
    ("Handed over raw footage, got back something better than I imagined. Now my default editor.",
     "Marcus Lee", "Podcast Host"),
     ("Nathan Cooks for real", "Omonire O. Great", "CEO, Atendex, CEO, Great Tech Solutions")
]

# (slug, title, excerpt, body, cover, tag, status)
POSTS = [
    (
        "retention-first-editing",
        "Retention-First Editing: How To Keep Viewers Past The First 30 Seconds",
        "Most drop-off happens in the first half-minute. Here is how I cut openings so viewers stay.",
        "The first 30 seconds decide everything. In this post I break down the pacing rules I use "
        "on every long-form edit \u2014 cutting dead air, front-loading the payoff, and reinforcing "
        "every hook with sound design so a viewer has a reason to keep watching.\n\n"
        "1. Open on motion, not on a talking head.\n"
        "2. Promise a specific payoff in the first line.\n"
        "3. Cut every breath that does not add meaning.\n"
        "4. Let the music carry the transition into the body.",
        "",
        "Editing",
        "published",
    ),
    (
        "color-that-feels-premium",
        "Color That Feels Premium On Any Budget",
        "A consistent, cinematic look is more about discipline than gear. My DaVinci workflow, start to finish.",
        "Great color is consistency, not novelty. I grade for a single look across a channel so every "
        "upload feels like part of the same world.\n\n"
        "Start with a clean primary balance, build a show LUT, then treat skin tones as sacred. "
        "The goal is that a viewer recognizes your channel before they read the title.",
        "",
        "Color",
        "published",
    ),
    (
        "shorts-repurposing-system",
        "One Long Video, Nine Shorts: A Repurposing System",
        "Turn a single long-form upload into a week of vertical content without burning out.",
        "Vertical clips are not cutdowns \u2014 they are re-opened stories. I map every long-form "
        "video for moments that stand alone, then rebuild each with a fresh hook, captions and a loop.\n\n"
        "Nine Shorts from one upload is a workflow, not a miracle. Here is the exact pipeline.",
        "",
        "Shorts",
        "draft",
    ),
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
        "INSERT INTO services (idx, name, description, detail, price, category, hot_deal, sort_order) "
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [(idx, name, desc, detail, price, cat, hot, i)
         for i, (idx, name, desc, detail, price, cat, hot) in enumerate(SERVICES)],
    )


def _backfill_services(conn):
    """Give pre-pricing rows their published rate so the public list isn't blank."""
    for _idx, name, _desc, _detail, price, category, hot in SERVICES:
        conn.execute(
            "UPDATE services SET price = ? WHERE name = ? AND (price = '' OR price IS NULL)",
            (price, name),
        )
        conn.execute(
            "UPDATE services SET category = ? WHERE name = ? AND (category = '' OR category IS NULL)",
            (category, name),
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


def _seed_posts(conn):
    if conn.execute("SELECT COUNT(*) FROM posts").fetchone()[0]:
        return
    conn.executemany(
        "INSERT INTO posts (slug, title, excerpt, body, cover, tag, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        POSTS,
    )


def seed_all(conn):
    _seed_kv(conn)
    _seed_services(conn)
    _backfill_services(conn)
    _seed_projects(conn)
    _seed_testimonials(conn)
    _seed_posts(conn)
    conn.commit()


def reset_all(conn):
    for table in ("kv", "services", "projects", "testimonials", "posts", "messages"):
        conn.execute(f"DELETE FROM {table}")
    conn.commit()
    seed_all(conn)
