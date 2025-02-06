---
title: Creating markers
---

# Creating markers from code

This tutorial shows how to programmatically create markers in marker.js 3 by handling UI events and calling the appropriate methods on {@link Editor!MarkerArea | MarkerArea}.

## Basic setup

First, you'll need a marker area instance and a target image:

```ts
import { MarkerArea } from '@markerjs/markerjs3';

const targetImg = document.createElement('img');
targetImg.src = './sample-image.png';

const markerArea = new MarkerArea();
markerArea.targetImage = targetImg;

document.body.appendChild(markerArea);
```

## Creating markers from click events

The most common way to initiate marker creation is by handling click events on UI elements like buttons. Use {@link Editor!MarkerArea.createMarker | createMarker()} to start creating a new marker:

```ts
// Using marker type name as string
document.querySelector('#addArrowButton').addEventListener('click', () => {
  markerArea.createMarker('ArrowMarker');
});
```

```ts
// Using marker type directly (requires import)
import { ArrowMarker } from '@markerjs/markerjs3';

document.querySelector('#addArrowButton').addEventListener('click', () => {
  markerArea.createMarker(ArrowMarker);
});
```

## Handling marker creation events

MarkerArea fires events during marker creation that you can handle:

```ts
// Marker creation started
markerArea.addEventListener('markercreating', (ev) => {
  console.log('Creating marker:', ev.detail.markerEditor.marker.typeName);
});

// Marker creation completed
markerArea.addEventListener('markercreate', (ev) => {
  console.log('Marker created:', ev.detail.markerEditor.marker.typeName);
});
```

## Complete example

Here's a complete example showing marker creation with different marker types:

```ts
import { MarkerArea, ArrowMarker, FrameMarker } from '@markerjs/markerjs3';

// Create marker area
const markerArea = new MarkerArea();
markerArea.targetImage = targetImg;
document.body.appendChild(markerArea);

// Add arrow marker button
document.querySelector('#addArrowButton').addEventListener('click', () => {
  markerArea.createMarker(ArrowMarker);
});

// Add frame marker button
document.querySelector('#addFrameButton').addEventListener('click', () => {
  markerArea.createMarker(FrameMarker);
});

// Handle marker creation
markerArea.addEventListener('markercreate', (ev) => {
  console.log('Created marker:', ev.detail.markerEditor.marker.typeName);
});
```

When a marker is created, the marker area switches to select mode automatically. Alternatively, you can initiate another marker creation when handling the `markercreate` event:

```ts
// create another marker of the same type
markerArea.addEventListener('markercreate', (ev) => {
  markerArea.createMarker(ev.detail.markerEditor.marker.typeName);
});
```

## See also

- [Concepts: Markers and available marker types](./../concepts/markers.md)
