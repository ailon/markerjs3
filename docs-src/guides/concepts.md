---
title: Concepts
group: Documents
category: Documentation
children:
  - ./concepts/markers.md
  - ./concepts/marker-types.md
  - ./concepts/editors.md
---

# marker.js 3 Concepts

There are several core concepts in marker.js that you need to be familiar with. Let's start with the top-level parts of the library and then drill down to the details.

## Top-level marker.js parts

There are three top-level parts of marker.js that you may use in your applications.

These parts are:

1. **{@link Editor!MarkerArea | MarkerArea}** also known as Editor. This is the annotation editor component you use to enable creation of image annotations.
2. **{@link Viewer!MarkerView | MarkerView}** (aka Viewer) is used for displaying previously saved annotations on top of images with no editing functionality.
3. **{@link Renderer!Renderer | Renderer}** enables you to embed annotations right into the images so that you can display or share them in any way you can share a regular image.

## Markers and Marker Editors

### Markers

Markers ar the main building blocks of annotations. Think rectangles, arrows, text, etc. Markers define how those elements look and what styling options they have. Markers are used by all top-level parts of marker.js and comprise the bulk of the {@link Core!AnnotationState | AnnotationState} used to share and store annotations between components and annotation sessions.

As core parts of the whole marker.js universe markers naturally reside in the {@link Core! | Core}.

We go into more details on markers in a [dedicated doc](./concepts/markers.md).

### Marker Editors

While Markers represent the look and feel of the annotation elements, Editors define their creation and editing experience.

In many cases, multiple marker types have identical sets of properties you can edit and the whole editing experience is identical, despite differences in rendering of such markers. For example, **{@link Core!CoverMarker | CoverMarker}** and **{@link Core!EllipseMarker | EllipseMarker}** look very differently (one is a rectangle and the other one is round), but they share all the same properties (fill and stroke colors, stroke width, etc.) and are defined by the same characteristics (width and height of their bounding rectangle, and a rotation angle). So, naturally, they can be edited using exactly the same **{@link Editor!ShapeMarkerEditor | ShapeMarkerEditor}**.

Marker editors are only meaningful in the context of the **{@link Editor!MarkerArea | MarkerArea}** so they live alongside it in the **{@link Editor! | Editor}** module.

[Click here](./concepts/editors.md) to learn more about Editors.

## Annotation State

Annotation state is what defines the annotation internally and is passed between the components. It's a simple JavaScript object, hence it can be serialized and stored anywhere you wish and then deserialized to further use with marker.js.

Its structure is defined by {@link Core!AnnotationState | AnnotationState} interface and consists of just some metadata and a list of markers.

To learn more about state, refer to the [Saving state](./tutorials/saving-state.md) tutorial.
