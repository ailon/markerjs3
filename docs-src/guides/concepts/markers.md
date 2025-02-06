---
title: Markers
---

# Concepts: Markers

Markers are the fundamental building blocks of annotations in marker.js 3. They define both the visual appearance and styling options for annotation elements that users can add to images.

## Overview

Markers represent different types of visual annotations like:

- Shapes (rectangles, ellipses)
- Lines and arrows
- Text and callout elements
- Freehand drawings
- Image-based markers
- And more

Each marker type defines:

- How it renders visually
- What styling properties it supports
- How it stores its state

## Marker Hierarchy

Markers in marker.js 3 follow a hierarchical structure starting with (abstract) base marker classes that provide common functionality:

- {@link Core!MarkerBase | MarkerBase} - The root **base class for all markers** specifying the core API all markers should implement.
  - {@link Core!RectangularBoxMarkerBase | RectangularBoxMarkerBase} - Base for markers contained in a rectangular box.
    - {@link Core!ShapeOutlineMarkerBase | ShapeOutlineMarkerBase} - Base for outline-only shapes like frames.
      - {@link Core!ShapeMarkerBase | ShapeMarkerBase} - Base for filled shape markers like filled rectangles and ellipsis.
  - {@link Core!LinearMarkerBase | LinearMarkerBase} - Base for line-based markers like arrows.
  - {@link Core!ImageMarkerBase | ImageMarkerBase} - Base for markers that display images.

## Built-in Marker Types

marker.js 3 includes these built-in marker types for common annotation needs:

### Basic Shapes

- {@link Core!FrameMarker | FrameMarker} - Rectangular outline
- {@link Core!CoverMarker | CoverMarker} - Filled rectangular shape
- {@link Core!HighlightMarker | HighlightMarker} - Semi-transparent highlight
- {@link Core!EllipseFrameMarker | EllipseFrameMarker} - Elliptical outline
- {@link Core!EllipseMarker | EllipseMarker} - Filled elliptical shape

### Lines and Arrows

- {@link Core!LineMarker | LineMarker} - Basic line
- {@link Core!ArrowMarker | ArrowMarker} - Line with arrow head(s)
- {@link Core!MeasurementMarker | MeasurementMarker} - Line with measurement indicators

### Text-Based Markers

- {@link Core!TextMarker | TextMarker} - Text annotation
- {@link Core!CalloutMarker | CalloutMarker} - Text with pointer
- {@link Core!CaptionFrameMarker | CaptionFrameMarker} - Frame with caption

### Advanced Markers

- {@link Core!FreehandMarker | FreehandMarker} - Freehand drawing
- {@link Core!PolygonMarker | PolygonMarker} - Multi-point polygon

### Image-based Markers

- {@link Core!CustomImageMarker | CustomImageMarker} - Custom image marker used to display user-set image
- {@link Core!CheckImageMarker | CheckImageMarker} - Checkmark image
- {@link Core!XImageMarker | XImageMarker} - X mark image

## Creating Markers

User-driven marker creation is initiated in the {@link Editor!MarkerArea | MarkerArea} editor component. To create a new marker, use the {@link Editor!MarkerArea.createMarker | createMarker()} method and specify the marker type:

```javascript
markerArea.createMarker(ArrowMarker);
// or
markerArea.createMarker('ArrowMarker');
```

## Marker State

Each marker maintains its own state including:

- Position and size
- Rotation
- Style properties (colors, stroke width, etc.)
- Type-specific properties

The marker states are included in the overall annotation state when saving/restoring annotations.

## Integration

Markers are part of the Core module in marker.js 3 since they are used by all main components:

- {@link Editor!MarkerArea | MarkerArea} (Editor) - For creating and editing markers
- {@link Viewer!MarkerView | MarkerView} (Viewer) - For displaying markers
- {@link Renderer!Renderer | Renderer} - For rendering markers to static images

## Custom Markers

When none of the built-in markers satisfy your needs you may want to create a custom marker. The marker should be a descendant of {@link Core!MarkerBase | MarkerBase} (quite likely one of the [base classes](#marker-hierarchy) above is a better candidate to inherit) and should be able to generate its visual as well as provide and restore its state.

For mor information on creating custom markers please check [this tutorial](./../tutorials/custom-marker-types.md).

## See also

- [Concepts overview](./../concepts.md)
- [Tutorial: Creating markers](./../tutorials/creating-markers.md)
- [Tutorial: Custom marker types](./../tutorials/custom-marker-types.md)
