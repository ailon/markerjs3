---
title: Deleting markers
---

# Deleting markers

This tutorial shows how to implement marker deletion functionality in marker.js 3 using {@link Editor!MarkerArea | MarkerArea}.

## Basic deletion methods

The {@link Editor!MarkerArea | MarkerArea} component provides two main methods for deleting markers:

- {@link Editor!MarkerArea.deleteMarker | deleteMarker()} - Deletes a specific marker
- {@link Editor!MarkerArea.deleteSelectedMarkers | deleteSelectedMarkers()} - Deletes all currently selected markers

## Implementing a delete button

Here's how to implement a delete button that removes selected markers:

```ts
// Assume you have a button element with id="deleteButton"
const deleteButton = document.querySelector('#deleteButton');
deleteButton?.addEventListener('click', () => {
  markerArea.deleteSelectedMarkers();
});
```

## Handling deletion events

MarkerArea fires events during marker deletion that you can handle:

```ts
// Marker about to be deleted
markerArea.addEventListener('markerbeforedelete', (ev) => {
  console.log('Deleting marker:', ev.detail.markerEditor.marker.typeName);
});

// Marker deleted
markerArea.addEventListener('markerdelete', (ev) => {
  console.log('Marker deleted:', ev.detail.markerEditor.marker.typeName);
});
```

## Complete example

Here's a complete example showing marker deletion with event handling:

```ts
import { MarkerArea } from '@markerjs/markerjs3';

// Create marker area
const markerArea = new MarkerArea();
markerArea.targetImage = targetImg;
document.body.appendChild(markerArea);

// Add delete button
const deleteButton = document.querySelector('#deleteButton');
deleteButton?.addEventListener('click', () => {
  markerArea.deleteSelectedMarkers();
});

// Handle deletion events
markerArea.addEventListener('markerbeforedelete', (ev) => {
  console.log('About to delete:', ev.detail.markerEditor.marker.typeName);
});

markerArea.addEventListener('markerdelete', (ev) => {
  console.log('Deleted marker:', ev.detail.markerEditor.marker.typeName);
});
```

## See also

- {@link Editor!MarkerArea.deleteMarker | deleteMarker()} method
- {@link Editor!MarkerArea.deleteSelectedMarkers | deleteSelectedMarkers()} method
- {@link Editor!MarkerAreaEventMap | MarkerAreaEventMap} interface for event types
