#!/usr/bin/env python3
"""Build a standards-compatible, unencrypted SEB test configuration."""
import gzip
import plistlib
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SETTINGS = {
    "originatorVersion": "SEB_Windows_3.8.0",
    "startURL": "https://dalziel205.github.io/exam-watch/",
    "sebConfigPurpose": 0,
    "allowQuit": True,
    "ignoreQuitPassword": True,
    "enableJavaScript": True,
    "enablePlugIns": False,
    "allowSwitchToApplications": False,
    "allowBrowsingBackForward": False,
    "browserWindowAllowReload": True,
    "newBrowserWindowByLinkPolicy": 1,
    "newBrowserWindowByScriptPolicy": 1,
    "showTaskBar": False,
    "showMenuBar": False,
    "showReloadButton": True,
    "showTime": True,
    "browserWindowWebView": 3,
    "sendBrowserExamKey": False,
    "URLFilterEnable": False,
}

xml = plistlib.dumps(SETTINGS, fmt=plistlib.FMT_XML, sort_keys=True)
payload = gzip.compress(b"plnd" + gzip.compress(xml, mtime=0), mtime=0)
(ROOT / "exam-watch.seb").write_bytes(payload)
