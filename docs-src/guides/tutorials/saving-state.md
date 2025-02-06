---
title: Saving state
---

# Saving state

marker.js 3 allows you to save and restore annotation states, enabling features like:

- Saving work in progress
- Loading previously created annotations
- Sharing annotations between users

## Getting the current state

To get the current annotation state, call the {@link Editor!MarkerArea.getState | getState()} method on your {@link Editor!MarkerArea | MarkerArea} instance:

```ts
const markerArea = new MarkerArea();
// ... setup marker area ...

// Get the current state
const state = markerArea.getState();
```

The returned state object contains:

- Version number
- Canvas dimensions
- Array of all marker states

You can store this state object as JSON or keep it in memory.

## Restoring state

To restore a previously saved state, use the {@link Editor!MarkerArea.restoreState | restoreState()} method:

```ts
// Restore from saved state
markerArea.restoreState(savedState);
```

## Complete example

Here's a complete example showing how to save and restore state:

```ts
// Create marker area
const markerArea = new MarkerArea();
markerArea.targetImage = document.getElementById('imageToMark');

// Add save button handler
document.getElementById('saveButton').addEventListener('click', () => {
  // Get current state
  const state = markerArea.getState();

  // Save state as JSON
  localStorage.setItem('savedAnnotation', JSON.stringify(state));
});

// Add restore button handler
document.getElementById('restoreButton').addEventListener('click', () => {
  // Get saved state
  const savedState = JSON.parse(localStorage.getItem('savedAnnotation'));

  // Restore state
  if (savedState) {
    markerArea.restoreState(savedState);
  }
});
```
