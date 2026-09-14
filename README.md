# B4TRACK

<p align="center">
  <img src="https://raw.githubusercontent.com/b4k3d/b4track/main/public/icon-512.png" alt="B4TRACK" width="120" height="120" />
</p>

<p align="center">
  <strong>Strip tracking parameters from any link — clean, private, open source.</strong>
</p>

<p align="center">
  <a href="https://b4track.app/">Website</a> ·
  <a href="https://zo.pub/b4k3d/b4track-release-1-0-0/B4TRACK-v1.0.0.apk">Download APK</a> ·
  <a href="https://buymeacoffee.com/b4k3d">Support the project</a>
</p>

[![Android CI](https://github.com/b4k3d/b4track/actions/workflows/android.yml/badge.svg)](https://github.com/b4k3d/b4track/actions)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](LICENSE)
[![Website](https://img.shields.io/badge/web-b4track.app-111827)](https://b4track.app/)

B4TRACK is a native Android privacy tool that removes tracking parameters from URLs before you share, copy, or save them.

Cleaning runs locally on the device. No account is required, and links are not sent to a server.

## Features

- Clean links from any app using the Android share menu
- Automatically clean copied URLs from other apps
- Automatically copy the cleaned link back to the clipboard
- Sanitize the current clipboard with one tap
- Aggressive mode for additional tracker and redirect parameters
- Bulk cleaning for multiple URLs or text containing links
- Built-in rules for major services and common tracking systems
- Local history with copy and share actions
- Quick Settings tile for instant clipboard cleaning
- Optional custom JavaScript cleaning rules
- Polished monochrome dark and light interface
- Frosted-glass inspired cards and UI elements
- No analytics and no account required

## Website

Use B4TRACK directly in your browser:

https://b4track.app/

## Download

Download the latest Android APK:

[Download B4TRACK v1.0.0](https://github.com/b4k3d/b4track/releases/download/v.1.0.0/B4TRACK-v1.0.0.apk)

## Build Locally

Requirements:

- Android Studio or JDK 17+
- Android SDK
- Internet connection for the first Gradle build

```bash
git clone https://github.com/b4k3d/b4track.git
cd b4track
./gradlew assembleStandardDebug
