---
title: Custom marker types
---

# Custom marker types

One of the most powerful features of marker.js 3 is its extensibility through custom marker types. This tutorial will show you how to create your own marker types - a triangle marker, in this case.

## Base classes

To create a custom marker type, you need to extend one of the base marker classes:

- {@link Core!ShapeMarkerBase | ShapeMarkerBase}: For filled shape markers
- {@link Core!ShapeOutlineMarkerBase | ShapeOutlineMarkerBase}: For outline-only shape markers
- {@link Core!LinearMarkerBase | LinearMarkerBase}: For line-based markers
- {@link Core!TextMarker | TextMarker}: For text-based markers

If none of these fit the bill, you may need to start from something else or all the way down (or is it up?) to {@link Core!MarkerBase | MarkerBase}.

## Creating a Triangle marker

Let's create a simple triangle marker by extending {@link Core!ShapeOutlineMarkerBase | ShapeOutlineMarkerBase}:

```ts
import { ShapeOutlineMarkerBase } from 'markerjs3';

export class TriangleMarker extends ShapeOutlineMarkerBase {
  // Required: unique type name for registration
  public static typeName = 'TriangleMarker';
  // Required: display title for the toolbar
  public static title = 'Triangle marker';

  constructor(container: SVGGElement) {
    super(container);
    // Set default styles
    this.strokeColor = '#ff0000';
    this.strokeWidth = 3;
  }

  // Required: implement path generation
  protected getPath(
    width: number = this.width,
    height: number = this.height,
  ): string {
    return `M ${width / 2} 0 L ${width} ${height} L 0 ${height} Z`;
  }
}
```

## Registering custom markers

To use your custom marker, register it with {@link Editor!MarkerArea | MarkerArea}:

```ts
// Create MarkerArea instance
const markerArea = new MarkerArea(target);

// Register the custom marker type
markerArea.registerMarkerType(
  TriangleMarker,
  ShapeOutlineMarkerEditor<TriangleMarker>,
);
```

> **Note:**
>
> Here we are using a built-in {@link Editor!ShapeOutlineMarkerEditor | ShapeOutlineMarkerEditor} editor, but if you are building something that can't be handled by one of the [included editors](./../concepts/editors.md), you may need to implement a custom editor as well.

You also need to register it with {@link Viewer!MarkerView} if you plan to display saved annotations:

```ts
const markerView = new MarkerView(target);
markerView.registerMarkerType(TriangleMarker);
```

## Working example

Here's a complete example showing how to implement and use a custom triangle marker:

```ts
// Import required types
import { MarkerArea, MarkerView } from 'markerjs3';
import { TriangleMarker } from './TriangleMarker';

// Create marker area
const markerArea = new MarkerArea(document.getElementById('myImage'));

// Register triangle marker
markerArea.registerMarkerType(
  TriangleMarker,
  ShapeOutlineMarkerEditor<TriangleMarker>,
);

// Show marker area
markerArea.show();

// Later, to display saved annotations:
const markerView = new MarkerView(document.getElementById('myImage'));
markerView.registerMarkerType(TriangleMarker);
markerView.show(savedState);
```

Your custom marker will now function just like built-in markers, with full support for:

- Resizing
- Rotation
- Style customization
- State persistence
- Undo/redo

## More advanced scenarios

The key in this example is implementing the `getPath()` method to define your marker's shape using SVG path syntax. But that is only enough in cases where you just want to redefine the shape of a shape-style marker.

In other cases you may need to implement additional properties, custom state, custom editors, etc. For examples on how to do this analyze implementations of the built-in markers in the [source code](https://github.com/ailon/markerjs3).

The only extra step you need to do is [register your custom marker](#registering-custom-markers) before you can use it.
