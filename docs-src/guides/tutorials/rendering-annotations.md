---
title: Rendering annotations
---

# Rendering annotations

The {@link Renderer!Renderer | Renderer} class in marker.js 3 allows you to rasterize annotations created with {@link Editor!MarkerArea | MarkerArea} into static images. The rendered output can include both the original image and annotations, or just the annotation layer.

## Basic usage

First import the required classes:

```ts
import { MarkerArea, Renderer } from '@markerjs/markerjs3';
```

To render annotations:

1. Create a new {@link Renderer!Renderer | Renderer} instance
2. Set the target image
3. Call {@link Renderer!Renderer.rasterize | rasterize} with the annotation state

```ts
const renderer = new Renderer();
// original image
renderer.targetImage = targetImage;

const renderedImageUrl = await renderer.rasterize(markerArea.getState());
// use the rendered image
const img = document.createElement('img');
img.src = renderedImageUrl;
document.body.appendChild(img);
```

## Customization

The {@link Renderer!Renderer} class provides several options to customize the output:

- {@link Renderer!Renderer.naturalSize | naturalSize} - render at original image size
- {@link Renderer!Renderer.imageType | imageType} - output format ('image/png', 'image/jpeg', etc)
- {@link Renderer!Renderer.imageQuality | imageQuality} - quality setting for JPEG (0-1)
- {@link Renderer!Renderer.markersOnly | markersOnly} - render only annotations without the image
- {@link Renderer!Renderer.width | width}/{@link Renderer!Renderer.height | height} - specify output dimensions

```ts
const renderer = new Renderer();
// configure renderer
renderer.naturalSize = true; // render at full image size
renderer.imageType = 'image/jpeg';
renderer.imageQuality = 0.8;
renderer.markersOnly = false;

// render
const renderedImage = await renderer.rasterize(state);
```

## See also

- {@link Renderer!Renderer | Renderer} for complete API reference.
