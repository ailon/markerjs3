# marker.js 3 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.1.0] - 2025-03-20

### Added

- `CurveMarker` for curved lines

### Fixed

- stroke color changes not applied to line-type markers

## [3.0.1] - 2025-03-19

### Changed

- image marker editor to have only corner resize grips for better UX

### Fixed

- stroke dash array is applied to arrow heads and it shouldn't be
- grip manipulation area is too large and interferes with moving of smaller markers (eg. emojis)

## [3.0.0] - 2025-03-14

### Fixed

- selection marquee not visible after restoring state
- missing getter/setter for marker's notes in the `MarkerBaseEditor`
- missing exports for `MarkerEventData` from `MarkerView`

## [3.0.0-rc.4] - 2025-02-18

### Added

- public `selectedMarkerEditors` property to access multi-selected editors
- marker events to `MarkerView`

### Changed

- improved text rendering flow

### Fixed

- text markers scaled twice on restoring state
- opacity not applied to image markers
- text based markers incorrectly react to opacity changes
- line based markers don't respond to opacity changes
- polygon marker incorrectly responds to opacity changes
- scrollbars not centered when zooming out below 100% (both `MarkerArea` and `MarkerView`)
- after editing and clicking out text markers stay visually selected while internally unselected

## [3.0.0-rc.3] - 2025-02-10

### Fixed

- wrong marker type is passed to `ShapeMarkerEditor` for `EllipseMarker`
- text markers can't be edited in Safari

## [3.0.0-rc.2] - 2025-02-03

### Added

- ability to set only the `targetWidth` or `targetHeight` and the other being calculated proportionally
- scrolling to the center of image if the target is larger than component container on load

### Changed

- updated logo

### Fixed

- missing `fillColor` in `CalloutMarker` state and incomplete scaling
- text wrongly positioned in renders when padding is scaled
- scrolling to image center on zoom doesn't work

## [3.0.0-rc.1] - 2025-01-30

### Fixed

- attempt to fix the release GA workflow
- missing imports

### Misc

- typedoc configuration updates

## [3.0.0-rc.0] - 2025-01-29

### Added

- tsdoc reference comments and quick start guides

### Fixed

- previously saved state didn't load if restored right after adding components to DOM
- removed unnecessary `getState()` overrides in some markers
- removed unused types
- added missing exports
- attempt to fix the release GA workflow
- minor syntax fixes

## [3.0.0-beta.3] - 2025-01-08

### Added

- `registerMarkerType()` methods in `MarkerArea`, `MarkerView`, and `Renderer` to register custom marker types and editors.

## [3.0.0-beta.2] - 2025-01-06

### Changed

- if marquee-select results in single element being selected revert to simple selection

### Fixed

- the whole image gets selected as if it was text when dragging the mouse out of image bounds
- multi-selecting by holding shift and clicking doesn't show marquee outline
- attempt to fix the release GA workflow

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

[3.1.0]: https://github.com/ailon/markerjs3/releases/tag/v3.1.0
[3.0.1]: https://github.com/ailon/markerjs3/releases/tag/v3.0.1
[3.0.0]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0
[3.0.0-rc.4]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-rc.4
[3.0.0-rc.3]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-rc.3
[3.0.0-rc.2]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-rc.2
[3.0.0-rc.1]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-rc.1
[3.0.0-rc.0]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-rc.0
[3.0.0-beta.3]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-beta.3
[3.0.0-beta.2]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-beta.2
[3.0.0-beta.1]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-beta.1
[3.0.0-beta.0]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-beta.0
[3.0.0-alpha.4]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-alpha.4
[3.0.0-alpha.3]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-alpha.3
[3.0.0-alpha.2]: https://github.com/ailon/markerjs3/releases/tag/v3.0.0-alpha.2
