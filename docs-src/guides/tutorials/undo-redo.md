---
title: Undo/redo
---

# Undo/Redo

This tutorial shows how to implement undo/redo functionality in marker.js 3.

## Overview

marker.js provides built-in undo/redo functionality through the {@link Editor!MarkerArea | MarkerArea} component. The key concepts we'll use are:

- `isUndoPossible` and `isRedoPossible` properties to check state
- `undo()` and `redo()` methods to perform operations
- `areastatechange` event to track changes
- Button state management to enable/disable UI

We'll build a complete implementation that includes:

1. Basic marker.js setup
2. Undo/redo button UI
3. Event handlers for operations
4. State management for button enabling/disabling

## Setup

First, create a basic marker.js setup:

```ts
import { MarkerArea } from '@markerjs/markerjs3';

const targetImage = document.getElementById('imageToMark') as HTMLImageElement;
const markerArea = new MarkerArea();
markerArea.targetImage = targetImage;
document.body.appendChild(markerArea);
```

## Adding Undo/Redo UI

Add buttons to your HTML:

```html
<button id="undoButton" disabled>Undo</button>
<button id="redoButton" disabled>Redo</button>
```

## Implementing Undo/Redo

Connect the buttons to MarkerArea's undo/redo functionality:

```ts
const undoButton = document.getElementById('undoButton') as HTMLButtonElement;
const redoButton = document.getElementById('redoButton') as HTMLButtonElement;

// Undo handler
undoButton.addEventListener('click', () => {
  if (markerArea.isUndoPossible) {
    markerArea.undo();
  }
});

// Redo handler
redoButton.addEventListener('click', () => {
  if (markerArea.isRedoPossible) {
    markerArea.redo();
  }
});
```

## Managing Button States

Update button states based on undo/redo availability:

```ts
function updateUndoRedoButtons() {
  undoButton.disabled = !markerArea.isUndoPossible;
  redoButton.disabled = !markerArea.isRedoPossible;
}

// Listen for state changes
markerArea.addEventListener('areastatechange', updateUndoRedoButtons);
```

## Complete Example

Here's a full working implementation:

```ts
import { MarkerArea } from '@markerjs/markerjs3';

// Setup marker.js
const targetImage = document.getElementById('imageToMark') as HTMLImageElement;
const markerArea = new MarkerArea();
markerArea.targetImage = targetImage;
document.body.appendChild(markerArea);

// Get UI elements
const undoButton = document.getElementById('undoButton') as HTMLButtonElement;
const redoButton = document.getElementById('redoButton') as HTMLButtonElement;

// Implement undo/redo
undoButton.addEventListener('click', () => {
  if (markerArea.isUndoPossible) {
    markerArea.undo();
  }
});

redoButton.addEventListener('click', () => {
  if (markerArea.isRedoPossible) {
    markerArea.redo();
  }
});

// Update button states
function updateUndoRedoButtons() {
  undoButton.disabled = !markerArea.isUndoPossible;
  redoButton.disabled = !markerArea.isRedoPossible;
}

// Listen for state changes
markerArea.addEventListener('areastatechange', updateUndoRedoButtons);
```
