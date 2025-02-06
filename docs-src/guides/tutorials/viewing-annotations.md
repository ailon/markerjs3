---
title: Viewing annotations
---

# Viewing annotations

The {@link Viewer!MarkerView | MarkerView} component allows you to display saved annotations on images without editing capabilities. This is useful when you want to show annotations to users who shouldn't modify them.

## Basic setup

```typescript
import { MarkerView } from '@markerjs/markerjs3';

// Create viewer instance
const markerView = new MarkerView();

// Set target image
const targetImage = document.createElement('img');
targetImage.src = 'image.jpg';
markerView.targetImage = targetImage;

// Add to page
document.getElementById('container').appendChild(markerView);
```

## Showing annotations

Display saved annotations by passing a state object to the `show()` method:

```ts
// Saved annotation state
const savedState = {
  version: 3,
  width: 800,
  height: 600,
  markers: [
    {
      strokeColor: 'blue',
      strokeWidth: 3,
      left: 100,
      top: 0,
      width: 100,
      height: 50,
      typeName: 'FrameMarker',
    },
  ],
};

// Show annotations
markerView.show(savedState);
```

## Events

MarkerView fires events you can listen for:

```ts
// Viewer initialized
markerView.addEventListener('viewinit', (ev) => {
  console.log('Viewer ready');
});

// State restored
markerView.addEventListener('viewrestorestate', (ev) => {
  console.log('Annotations displayed');
});
```

## See also

- {@link Editor!MarkerArea | MarkerArea} for creating and editing annotations
- {@link Core!AnnotationState | AnnotationState} interface for state object structure
