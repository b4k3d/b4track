# B4 TRACK

[![Android CI status](https://github.com/b4k3d/b4track/workflows/Android%20CI/badge.svg)](https://github.com/b4k3d/b4track/actions) [![GitHub release](https://img.shields.io/github/v/release/b4k3d/b4track)](https://github.com/b4k3d/b4track/releases) [![License](https://img.shields.io/github/license/b4k3d/b4track?color=blue)](LICENSE)

**B4 TRACK** — A privacy tool that removes tracking parameters from URLs before you share them.

Forked from [Untracker](https://github.com/zhanghai/Untracker) by Hai Zhang.

## Features

- **Polished dark UI**: Home, Bulk, History, and Settings screens with a night-friendly theme
- **Clean Link card**: Paste a URL and get the cleaned result in an Android bottom-sheet card
- **Bulk cleaning**: Clean multiple URLs or any text containing links in one pass
- **Clipboard sanitize**: Clean the current clipboard and copy the result back instantly
- **Clipboard auto-clean**: Optional foreground service watches copied text from any app and replaces tracking links automatically
- **Auto-copy**: Optional automatic copying after normal and shared-link cleaning
- **Aggressive mode**: Removes additional redirect, campaign, and tracking parameters
- **Clean when sharing**: Share links to B4 TRACK from any app to remove tracking info
- **History**: View recently cleaned links with one-tap copy/share
- **Quick Settings Tile**: Clean clipboard URLs instantly from quick settings
- **Customizable rules**: Add your own JavaScript-based cleaning rules

## Download

- [GitHub Releases](https://github.com/b4k3d/b4track/releases/latest)
- [F-Droid](https://f-droid.org/packages/com.b4k3d.b4track/) (coming soon)

## Build

```bash
./gradlew assembleRelease
```

## License

    Copyright 2023 Google LLC
    Copyright 2025 b4k3d

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        https://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
