---
title: Editors
---

# Concepts: Editors

Marker editors define the creation and editing experience for annotation elements in marker.js 3. While markers represent the visual appearance, editors handle the interactive behaviors while creating and editing, as well as property customization.

## Overview

Editors control how users can:

- Create new markers through mouse/touch interactions
- Modify marker properties like position, size and rotation
- Configure styling options like colors and line widths
- Edit marker-specific attributes like text content

## Editor Hierarchy

The editor hierarchy parallels the marker hierarchy with base classes providing shared functionality:

- {@link Editor!MarkerBaseEditor | MarkerBaseEditor} - Base class for all marker editors
  - {@link Editor!ShapeOutlineMarkerEditor | ShapeOutlineMarkerEditor} - Editor for outline-only shapes
    - {@link Editor!ShapeMarkerEditor | ShapeMarkerEditor} - Editor for filled shapes
  - {@link Editor!LinearMarkerEditor | LinearMarkerEditor} - Editor for line-based markers
  - {@link Editor!TextMarkerEditor | TextMarkerEditor} - Editor for text markers
  - {@link Editor!ImageMarkerEditor | ImageMarkerEditor} - Editor for image-based markers

## Built-in Editors

marker.js 3 includes editors for all built-in marker types:

### Shape Editors

- {@link Editor!ShapeOutlineMarkerEditor | ShapeOutlineMarkerEditor} - For outline-only markers like frames
- {@link Editor!ShapeMarkerEditor | ShapeMarkerEditor} - For filled rectangles and ellipses

### Line Editors

- {@link Editor!LinearMarkerEditor | LinearMarkerEditor} - For basic lines
- {@link Editor!ArrowMarkerEditor | ArrowMarkerEditor} - For arrow markers

### Text Editors

- {@link Editor!TextMarkerEditor | TextMarkerEditor} - For text annotations
- {@link Editor!CalloutMarkerEditor | CalloutMarkerEditor} - For callouts
- {@link Editor!CaptionFrameMarkerEditor | CaptionFrameMarkerEditor} - For caption frames

### Advanced Editors

- {@link Editor!FreehandMarkerEditor | FreehandMarkerEditor} - For freehand drawing
- {@link Editor!PolygonMarkerEditor | PolygonMarkerEditor} - For polygons

## Editor Components

Editors compose several UI components for marker manipulation:

- Resize grips - Handle scaling operations
- Rotate grips - Enable rotation
- Text inputs - Edit text content
- Custom controls - For marker-specific features

## Integration

Editors are used exclusively by the {@link Editor!MarkerArea | MarkerArea} component to:

1. Handle marker creation interactions
2. Manage selected marker editing
3. Update marker properties
4. Maintain editor state

## Custom Editors

When creating custom marker types, corresponding custom editors may be needed. Custom editors should:

- Extend appropriate editor base class
- Implement creation/editing interactions (if needed)
- Add marker-specific property controls
- Handle state management

## See also

- [Tutorial: Creating markers](./../tutorials/creating-markers.md)
- [Tutorial: Custom marker types](./../tutorials/custom-marker-types.md)
