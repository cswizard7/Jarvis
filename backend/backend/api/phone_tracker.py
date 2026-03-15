"""
phone_tracker.py — Real-time Android phone usage tracker via ADB.

Requirements:
  - Android phone with USB Debugging enabled
    (Settings → Developer Options → USB Debugging)
  - ADB installed and on PATH:
      Windows: https://developer.android.com/tools/releases/platform-tools
      Mac:     brew install android-platform-tools
      Linux:   sudo apt install adb
  - Phone connected via USB (or Wi-Fi ADB — see bottom of file)

How it works:
  Every 5 seconds, polls `adb shell dumpsys window` to get the
  foreground app package name, then writes a row to activity_log.csv
  with source='phone'. The rest of the pipeline (feature extraction,
  stress prediction, dashboard) works unchanged.

Wi-Fi ADB (no USB cable after first setup):
  1. Connect phone via USB once and run:
       adb tcpip 5555
       adb connect <phone-ip>:5555
  2. Disconnect USB — ADB now works over Wi-Fi.
  3. Find phone IP: Settings -> About Phone -> Status -> IP address
"""

import subprocess
import csv
import os
import time
from datetime import datetime

LOG_FILE = os.path.join(os.path.dirname(__file__), "activity_log.csv")

PACKAGE_NAMES = {
    "com.google.android.youtube": "YouTube",
    "com.instagram.android": "Instagram",
    "com.whatsapp": "WhatsApp",
    "com.netflix.mediaclient": "Netflix",
    "com.twitter.android": "Twitter",
    "com.facebook.katana": "Facebook",
    "com.tiktok.android": "TikTok",
    "com.google.android.gm": "Gmail",
    "com.google.android.apps.maps": "Google Maps",
    "com.spotify.music": "Spotify",
    "com.google.android.apps.docs": "Google Docs",
    "com.microsoft.office.word": "Word",
    "com.google.android.chrome": "Chrome (Mobile)",
    "com.samsung.android.browser": "Samsung Browser",
    "com.android.settings": "Settings",
    "com.android.launcher3": "Home Screen",
    "com.nothing.launcher": "Home Screen",      # Nothing OS launcher
    "com.miui.home": "Home Screen",
    "com.oneplus.launcher": "Home Screen",
    "com.google.android.apps.messaging": "Messages",
    "com.google.android.dialer": "Phone",
    "com.nothing.dialer": "Phone",              # Nothing OS dialer
    "com.google.android.apps.photos": "Photos",
    "com.snapchat.android": "Snapchat",
    "com.reddit.frontpage": "Reddit",
    "com.linkedin.android": "LinkedIn",
    "com.amazon.mShop.android.shopping": "Amazon",
}


def check_adb_connected() -> bool:
    """Return True if at least one ADB device is connected."""
    try:
        result = subprocess.run(
            ["adb", "devices"],
            capture_output=True, text=True, timeout=5
        )
        lines = result.stdout.strip().splitlines()
        devices = [l for l in lines[1:] if l.strip().endswith("device")]
        return len(devices) > 0
    except (FileNotFoundError, subprocess.TimeoutExpired):
        return False


def get_foreground_app() -> str:
    """
    Query the foreground app on the connected Android device via ADB.

    Nothing OS 15 format:
      mFocusedApp=ActivityRecord{113784738 u0 com.nothing.launcher/...SearchLauncher t6}

    FIX: Use 'dumpsys window' (not 'dumpsys window windows') — Nothing OS 15
    only outputs mFocusedApp in the shorter command.
    FIX: Parse using ' u0 ' separator and split on '/' to get package name.
    """
    try:
        result = subprocess.run(
            ["adb", "shell", "dumpsys", "window"],
            capture_output=True, text=True, timeout=5
        )
        for line in result.stdout.splitlines():
            if "mFocusedApp" in line and " u0 " in line:
                after_u0 = line.split(" u0 ")[1]
                package = after_u0.split("/")[0].strip()
                return PACKAGE_NAMES.get(package, package.split(".")[-1].capitalize())
    except Exception:
        pass
    return "Unknown"


def ensure_log_headers():
    """Create log file with headers if it doesn't exist."""
    if not os.path.exists(LOG_FILE):
        with open(LOG_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow(["timestamp", "app", "duration_seconds", "source"])
        print(f"Created log file: {LOG_FILE}")


def run_phone_tracker():
    ensure_log_headers()

    print("Checking ADB connection...")
    if not check_adb_connected():
        print(
            "\nNo Android device found via ADB.\n"
            "   Steps to fix:\n"
            "   1. Enable USB Debugging on your phone\n"
            "   2. Connect via USB and accept the RSA key prompt\n"
            "   3. Verify with: adb devices\n"
        )
        return

    print("Android device connected. Starting phone tracker...")
    print(f"Logging to: {LOG_FILE}")
    print("Press Ctrl+C to stop.\n")

    while True:
        app = get_foreground_app()
        timestamp = datetime.now().isoformat()

        with open(LOG_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            writer.writerow([timestamp, app, 5, "phone"])

        print(f"{timestamp} | [phone] {app}")
        time.sleep(5)


if __name__ == "__main__":
    run_phone_tracker()
