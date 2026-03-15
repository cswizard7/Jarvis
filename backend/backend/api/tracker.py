import time
import csv
import os
import pandas as pd
from datetime import datetime, timedelta

LOG_FILE = os.path.join(os.path.dirname(__file__), "activity_log.csv")

# How many days of history to keep in the log
KEEP_DAYS = 5


def trim_log():
    """Remove entries older than KEEP_DAYS from the log file."""
    if not os.path.exists(LOG_FILE):
        return
    try:
        df = pd.read_csv(LOG_FILE, encoding='utf-8', encoding_errors='ignore')
        if df.empty:
            return
        # FIX: Use format='mixed' to handle varying timestamp formats
        # (with/without microseconds) without raising ValueError.
        df["timestamp"] = pd.to_datetime(df["timestamp"], format='mixed')
        cutoff = datetime.now() - timedelta(days=KEEP_DAYS)
        before = len(df)
        df = df[df["timestamp"] >= cutoff]
        after = len(df)
        df.to_csv(LOG_FILE, index=False, encoding='utf-8')
        if before != after:
            print(f"Trimmed {before - after} old entries (keeping last {KEEP_DAYS} days)")
    except Exception as e:
        print(f"Warning: could not trim log: {e}")


def get_active_window():
    try:
        import pygetwindow as gw
        win = gw.getActiveWindow()
        if win and win.title:
            # Replace any Unicode characters that can't be ASCII-encoded (e.g. emoji)
            safe_title = win.title.encode('ascii', errors='replace').decode('ascii')
            return safe_title
        return "Unknown"
    except Exception:
        return "Unknown"


def log_activity():
    # Create file with headers if it doesn't exist
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w", newline="", encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "app", "duration_seconds"])
        print(f"Created log file: {LOG_FILE}")

    # Trim old data on startup
    trim_log()

    print(f"Tracker running... keeping last {KEEP_DAYS} days of data.")
    print(f"Logging to: {LOG_FILE}")
    print("Press Ctrl+C to stop.")

    entry_count = 0

    while True:
        app = get_active_window()
        timestamp = datetime.now().isoformat()

        with open(LOG_FILE, "a", newline="", encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow([timestamp, app, 5])

        print(f"{timestamp} | {app}")

        # Trim once per day
        entry_count += 1
        if entry_count % 17280 == 0:
            trim_log()

        time.sleep(5)


if __name__ == "__main__":
    log_activity()
