import csv
from datetime import datetime
import os

LOG_FILE = os.path.join(os.path.dirname(__file__), "activity_log.csv")

PRODUCTIVE_APPS = ["Code", "VS Code", "PyCharm", "Terminal"]


def extract_base_app(title: str) -> str:
    """
    FIX: Extract base application name from window title.
    e.g. 'file.py - Project - Visual Studio Code' -> 'Visual Studio Code'
    Prevents tab/file switches from inflating app_switches count.
    Must match the same logic used in app.py.
    """
    if not title:
        return "Unknown"
    parts = [p.strip() for p in title.split(" - ")]
    return parts[-1] if parts else title


def extract_features():

    screen_time = 0
    night_usage = 0
    app_switches = 0
    breaks = 0
    productive_time = 0

    last_base_app = None  # FIX: compare base app, not full window title
    last_time = None
    continuous_usage = 0
    current_streak = 0

    with open(LOG_FILE, "r") as f:
        reader = csv.DictReader(f)

        for row in reader:
            timestamp = datetime.fromisoformat(row["timestamp"])
            app = row["app"]
            duration = int(row["duration_seconds"])
            base_app = extract_base_app(app)

            screen_time += duration

            # Night usage (10 PM to 6 AM)
            if timestamp.hour >= 22 or timestamp.hour <= 5:
                night_usage += duration

            # Productive apps
            if any(p in app for p in PRODUCTIVE_APPS):
                productive_time += duration

            # FIX: compare base_app to previous base_app (not full title),
            # and only count switch if last_base_app is set (skip first row)
            # to avoid the NaN phantom switch from the original code.
            if last_base_app is not None and last_base_app != base_app:
                app_switches += 1

            # Breaks and continuous streak tracking
            if last_time:
                # FIX: Use .total_seconds() — original used .seconds which
                # caps at 86400 and returns wrong values for gaps > 1 day.
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

    # Convert seconds to minutes to match the units used in app.py
    return [
        round(screen_time / 60, 2),
        round(continuous_usage / 60, 2),
        round(night_usage / 60, 2),
        app_switches,
        breaks,
        round(productive_ratio, 2)
    ]
