import csv
from datetime import datetime
import os

LOG_FILE = os.path.join(os.path.dirname(__file__), "activity_log.csv")

PRODUCTIVE_APPS = ["Code", "VS Code", "PyCharm", "Terminal"]


def extract_base_app(title: str) -> str:
    """
    Extract base application name from window title.
    e.g. 'file.py - Project - Visual Studio Code' -> 'Visual Studio Code'

    FIX: Normalise terminal and noisy system windows to stable names
    to prevent app_switches inflating when cmd title changes each poll.
    """
    if not title or not title.strip():
        return "Unknown"

    title_lower = title.lower()

    if any(x in title_lower for x in [
        "cmd.exe", "powershell", "windows powershell",
        "command prompt", "terminal", "bash", "wsl"
    ]):
        return "Terminal"

    if any(x in title_lower for x in [
        "task switching", "snipping tool", "57% complete",
        "cortana", "start menu",
    ]):
        return "System"

    parts = [p.strip() for p in title.split(" - ")]
    clean_parts = [p for p in parts if p and not (len(p) > 2 and p[1] == ":")]
    return clean_parts[-1] if clean_parts else "Unknown"


def extract_features(source_filter: str | None = None):
    """
    Extract features from the activity log.

    Args:
        source_filter: If 'pc' or 'phone', only process rows from that source.
                       If None, process all rows (combined).

    Returns list of: [screen_time, continuous_usage, night_usage,
                      app_switches, breaks, productive_ratio]  (all in minutes)
    """
    screen_time = 0
    night_usage = 0
    app_switches = 0
    breaks = 0
    productive_time = 0

    last_base_app = None
    last_time = None
    continuous_usage = 0
    current_streak = 0

    with open(LOG_FILE, "r", encoding="utf-8", errors="ignore") as f:
        reader = csv.DictReader(f)

        for row in reader:
            # FIX: Filter by source if requested.
            # Old logs without a 'source' column are treated as 'pc'.
            row_source = row.get("source") or "pc"
            if source_filter is not None and row_source != source_filter:
                continue

            timestamp = datetime.fromisoformat(row["timestamp"])
            app = row["app"]
            duration = int(row["duration_seconds"])
            base_app = extract_base_app(app)

            screen_time += duration

            if timestamp.hour >= 22 or timestamp.hour <= 5:
                night_usage += duration

            if any(p in app for p in PRODUCTIVE_APPS):
                productive_time += duration

            # FIX: Compare base app, skip first row (last_base_app is None)
            if last_base_app is not None and last_base_app != base_app:
                app_switches += 1

            if last_time:
                # FIX: Use .total_seconds() not .seconds
                diff = (timestamp - last_time).total_seconds()
                if diff > 300:
                    breaks += 1
                    current_streak = duration
                else:
                    current_streak += duration
            else:
                current_streak = duration

            if current_streak > continuous_usage:
                continuous_usage = current_streak

            last_base_app = base_app
            last_time = timestamp

    productive_ratio = productive_time / screen_time if screen_time else 0

    return [
        round(screen_time / 60, 2),
        round(continuous_usage / 60, 2),
        round(night_usage / 60, 2),
        app_switches,
        breaks,
        round(productive_ratio, 2)
    ]
