# marker.js 3 Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.6.4] - 2025-06-11

### Fixed

- text editing quirks (pasting, Safari issues, etc.)

## [3.6.3] - 2025-05-30

### Fixed

- `HighlighterMarker` type name saved as `FreehandMarker` in state

## [3.6.2] - 2025-05-28

### Fixed

- polygon fill is not persisted in state

## [3.6.1] - 2025-05-27

### Chores

- update dev dependencies and resolve new linting issues.

## [3.6.0] - 2025-05-27

### Added

- scaling control grips (resizing, rotation, etc.) inversely proportionally to zoom level for easier manipulation. Grips stay the same size regardless of zoom level.

## [3.5.8] - 2025-04-28

### Fixed

- `isUndoPossible` always `true` after the first operation

## [3.5.7] - 2025-04-22

### Fixed

- polygon control box visible while not selected and restoring state
- switching to other activities while creating a polygon with just one point results in an unmanageable single-point "polygon"

## [3.5.6] - 2025-04-17

### Fixed

- freehand marker editor trying to adjust control box for an empty marker resulting in JavaScript errors
- callout opacity applied incorrectly in some scenarios
- polygon marker gets stuck in the creating state if user switches to something else before finishing the polygon
- curve marker scaled incorrectly when restoring state in a different size
- fix text and callout incorrect scaling issue (added padding to text marker state)

## [3.5.5] - 2025-04-11

### Fixed

- freehand marker editor control box visible by default when marker is not selected

## [3.5.4] - 2025-04-09

### Fixed

- opacity applied inconsistently in line-based (line, arrow, curve) and caption frame markers

## [3.5.3] - 2025-04-07

### Fixed

- selection marquee stays visible when undoing/redoing
- `selectedMarkerEditors` is not updated at the time of `markerdelete` event

## [3.5.2] - 2025-04-04

### Fixed

- multi-selection marquee stays visible after markers are deleted
- undo/redo not working or wonky in some scenarios
- `markercreating` event is never fired

## [3.5.1] - 2025-03-31

### Fixed

- `markerselect` and `markerdeselect` events fire incorrectly in multi-select context

## [3.5.0] - 2025-03-28

### Added

- proportional resizing while holding `shift` in rectangular editor markers (rectangles, ellipses, etc). Including creating perfect squares, circles, etc. when you hold `shift` during marker creation.

## [3.4.0] - 2025-03-26

### Added

- panning when zoomed in. In the editor use alt/option + mouse drag or middle mouse button drag, or touch with 2 fingers. In the viewer just click/touch and drag.

### Fixed

- inconsistent opacity editing in Freehand and Highlighter markers

## [3.3.0] - 2025-03-25

### Added

- ability to add SVG defs to the main canvas (`addDefs()` method)
- a set of predefined SVG filters that work cross-browser (CSS filters don't work in Safari)

## [3.2.0] - 2025-03-24

### Added

- `HighlighterMarker` - a freeform highlighter pen
- `defaultFilter` property across `MarkerArea`, `MarkerView`, and `Renderer`. marker types now have a `applyDefaultFilter` static property that specifies if this type wants the `defaultFilter` to be applied to markers. Defaults to `true` and set to `false` where it generally doesn't make sense (like Highlight, etc.)

### Fixed

- `fill` doesn't work for polygons

### Chores

- move docs to a separate repository

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

[3.6.4]: https://github.com/ailon/markerjs3/releases/tag/v3.6.4
[3.6.3]: https://github.com/ailon/markerjs3/releases/tag/v3.6.3
[3.6.2]: https://github.com/ailon/markerjs3/releases/tag/v3.6.2
[3.6.1]: https://github.com/ailon/markerjs3/releases/tag/v3.6.1
[3.6.0]: https://github.com/ailon/markerjs3/releases/tag/v3.6.0
[3.5.8]: https://github.com/ailon/markerjs3/releases/tag/v3.5.8
[3.5.7]: https://github.com/ailon/markerjs3/releases/tag/v3.5.7
[3.5.6]: https://github.com/ailon/markerjs3/releases/tag/v3.5.6
[3.5.5]: https://github.com/ailon/markerjs3/releases/tag/v3.5.5
[3.5.4]: https://github.com/ailon/markerjs3/releases/tag/v3.5.4
[3.5.3]: https://github.com/ailon/markerjs3/releases/tag/v3.5.3
[3.5.2]: https://github.com/ailon/markerjs3/releases/tag/v3.5.2
[3.5.1]: https://github.com/ailon/markerjs3/releases/tag/v3.5.1
[3.5.0]: https://github.com/ailon/markerjs3/releases/tag/v3.5.0
[3.4.0]: https://github.com/ailon/markerjs3/releases/tag/v3.4.0
[3.3.0]: https://github.com/ailon/markerjs3/releases/tag/v3.3.0
[3.2.0]: https://github.com/ailon/markerjs3/releases/tag/v3.2.0
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
