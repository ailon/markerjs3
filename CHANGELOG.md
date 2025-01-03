# marker.js 3 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.0-beta.1] - 2025-01-03

### Added

- Image markers: `ImageMarkerBase`, `CustomImageMarker` (for user-set images), `CheckImageMarker` (preset check mark), and `XImageMarker` (preset X).
- Caption frame marker (`CaptionFrameMarker`).

### Changed

- improved multi-select behavior (visible marque when selected, moving markers by moving marque, double-click marque to deselect)
- `getState()` to take `typeName` value via a constructor property so extending classes don't need to override `getState()` just to set the `typeName`

## [3.0.0-beta.0] - 2024-06-24

### Fixed

- `FontSize` interface isn't exported
- logo positioning
- last point in `PolygonMarker` is removed when closing the loop
- rasterizing the result causes a layout shift
- `fillColor` applied in incorrect way
- shape properties not applied to `CalloutMarker`
- `TextMarkerEditor` doesn't expose marker properties (`color`, `fontFamily`, `fontSize`)

### Misc

- Updated readme with usage basics and demo link

## [3.0.0-alpha.4] - 2024-05-11

### Added

- Ellipse frame marker
- Ellipse marker

## [3.0.0-alpha.3] - 2024-05-09

### Added

- Cover marker
- Highlight marker
- Arrow marker
- Measurement marker
- Callout marker
- Setting background, font size and family to text editor
- Multi-select (shift+click and marquee)
- Deleting markers

### Changed

- make text not selectable (messes up selections)

### Fixed

- scaling doesn't scale stroke width

## [3.0.0-alpha.2] - 2024-04-22

### Fixed

- missing exports

## 3.0.0-alpha.1 - 2024-04-20

### Added

- Initial public release.

[3.0.0-beta.1]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-beta.1
[3.0.0-beta.0]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-beta.0
[3.0.0-alpha.4]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-alpha.4
[3.0.0-alpha.3]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-alpha.3
[3.0.0-alpha.2]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-alpha.2
