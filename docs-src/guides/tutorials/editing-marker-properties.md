---
title: Editing marker properties
---

# Editing marker properties

This tutorial shows how to implement UI for editing marker properties based on marker type in marker.js 3.

## Overview

marker.js supports different types of markers (shapes, text, arrows etc.) through specialized marker editors. Each marker type has its own set of editable properties - for example:

- Shape markers have stroke and fill colors
- Text markers have font properties
- Arrow markers have arrow type settings

The marker editor's {@link Editor!MarkerBaseEditor.is | is()} method lets us check the type of the current marker editor to show the appropriate property panel. For example:

```ts
// Check if current editor is a text marker
if (editor.is(TextMarkerEditor)) {
  // Show text properties panel
}
```

This pattern allows us to:

1. Show only relevant properties for each marker type
2. Update the correct properties when values change
3. Keep property panels in sync with marker state

The following sections demonstrate implementing this UI pattern with marker.js.

## Basic setup

First, create property panels for different marker types:

```html
<div id="shapePropertyPanel" style="display: none;">
  <label>Stroke color: <input type="color" id="strokeColor"></label>
  <label>Fill color: <input type="color" id="fillColor"></label>
  <label>Stroke width: <input type="number" id="strokeWidth"></label>
  <label>Stroke dash array: <input type="text" id="strokeDasharray"></label>
</div>

<div id="textPropertyPanel" style="display: none;">
  <label>Text color: <input type="color" id="textColor"></label>
  <label>Font family: <input type="text" id="fontFamily"></label>
  <button id="decreaseFontSize">-</button>
  <button id="increaseFontSize">+</button>
</div>

<div id="arrowPropertyPanel" style="display: none;">
  <label>Arrow type:
    <select id="arrowType">
      <option value="none">&mdash;</button>
      <option value="start">&lt;&mdash;</button>
      <option value="end">&mdash;&gt;</button>
      <option value="both">&lt;&mdash;&gt;</button>
    </select>
  </label>
</div>
```

## Handling marker selection

Add event listeners to {@link Editor!MarkerArea | MarkerArea} instance to show/hide appropriate property panels when markers are selected/deselected:

```ts
markerArea.addEventListener('markerselect', (e) => {
  // Show text marker properties
  if (e.detail.markerEditor.is(TextMarkerEditor)) {
    const panel = document.getElementById('textPropertyPanel');
    if (panel) {
      panel.style.display = '';
    }
    setTextPropertyValues(e);
  }

  // Show shape marker properties
  const panel = document.getElementById('shapePropertyPanel');
  if (panel) {
    panel.style.display = '';
  }

  // Show arrow marker properties
  if (e.detail.markerEditor.is(ArrowMarkerEditor)) {
    const arrowPanel = document.getElementById('arrowPropertyPanel');
    if (arrowPanel) {
      arrowPanel.style.display = '';
    }
  }
  setPropertyValues(e);
});

markerArea.addEventListener('markerdeselect', () => {
  // Hide all property panels
  const panels = [
    'shapePropertyPanel',
    'textPropertyPanel',
    'arrowPropertyPanel',
  ];
  panels.forEach((id) => {
    const panel = document.getElementById(id);
    if (panel) {
      panel.style.display = 'none';
    }
  });
});
```

## Setting property values

When a marker is selected, populate the property panels with current values:

```ts
function setPropertyValues(e: CustomEvent<MarkerEditorEventData>) {
  if (
    e.detail.markerEditor.is(ShapeOutlineMarkerEditor) ||
    e.detail.markerEditor.is(LinearMarkerEditor) ||
    e.detail.markerEditor.is(FreehandMarkerEditor) ||
    e.detail.markerEditor.is(PolygonMarkerEditor)
  ) {
    const editor = e.detail.markerEditor;
    document.getElementById('strokeColor').value = editor.strokeColor;
    document.getElementById('fillColor').value = editor.fillColor;
    document.getElementById('strokeWidth').value =
      editor.strokeWidth.toString();
    document.getElementById('strokeDasharray').value = editor.strokeDasharray;
  }

  if (e.detail.markerEditor.is(ArrowMarkerEditor)) {
    document.getElementById('arrowType').value =
      e.detail.markerEditor.arrowType;
  }
}

function setTextPropertyValues(e: CustomEvent<MarkerEditorEventData>) {
  if (e.detail.markerEditor.is(TextMarkerEditor)) {
    document.getElementById('textColor').value =
      e.detail.markerEditor.marker.color;
    document.getElementById('fontFamily').value =
      e.detail.markerEditor.marker.fontFamily;
  }
}
```

## Updating marker properties

Add event listeners to property inputs to update marker properties when changed:

```ts
const strokeColorInput = document.getElementById('strokeColor');
strokeColorInput.addEventListener('change', (ev) => {
  const editor = markerArea.currentMarkerEditor;
  if (
    editor &&
    (editor.is(ShapeOutlineMarkerEditor) ||
      editor.is(LinearMarkerEditor) ||
      editor.is(FreehandMarkerEditor) ||
      editor.is(PolygonMarkerEditor))
  ) {
    editor.strokeColor = ev.target.value;
  }
});

const fontFamilyInput = document.getElementById('fontFamily');
fontFamilyInput.addEventListener('change', (ev) => {
  const editor = markerArea.currentMarkerEditor;
  if (editor && editor.is(TextMarkerEditor)) {
    editor.fontFamily = ev.target.value;
  }
});

const arrowTypeSelect = document.getElementById('arrowType');
arrowTypeSelect.addEventListener('change', (ev) => {
  const editor = markerArea.currentMarkerEditor;
  if (editor && editor.is(ArrowMarkerEditor)) {
    editor.arrowType = ev.target.value;
  }
});
```

## Property updates on marker creation/change

Add event listeners for marker creation and changes to keep property panels in sync:

```ts
markerArea.addEventListener('markercreate', (e) => {
  setPropertyValues(e);
});

markerArea.addEventListener('markerchange', (e) => {
  setPropertyValues(e);
});
```

## See also

- {@link Editor!MarkerArea | MarkerArea} - Main marker area component
- {@link Editor!MarkerBaseEditor | MarkerBaseEditor} - Base class for marker editors
- {@link Editor!TextMarkerEditor | TextMarkerEditor} - Text marker editor
- {@link Editor!ShapeMarkerEditor | ShapeMarkerEditor} - Shape marker editor
- {@link Editor!ArrowMarkerEditor | ArrowMarkerEditor} - Arrow marker editor
