---
title: marker.js 3 Documentation
---

marker.js 3 is a JavaScript image annotation library and suite of web components for your web applications.
marker.js enables your users to add visual commentary, highlight, or tag information on images.
This all can be done with just a few lines of code. The resulting markups can be saved for future use,
modified as needed, displayed as interactive overlays, or rendered into static graphics.

marker.js suite consists of three core parts:

1. Markup editor represented by the {@link Editor!MarkerArea | MarkerArea} component.
2. Markup viewer in the {@link Viewer!MarkerView | MarkerView} component.
3. And markup rasterization tool - {@link Renderer!Renderer | Renderer}.

## marker.js 3 Overview

marker.js 3 is a suite of "headless" web components for image annotation and markup.
The core marker.js 3 library provides the tools to enable interactive drawing and editing of various markers but doesn't include any toolbars, property panels, or other UI elements. This way you get the best of both worlds &mdash; advanced annotation features and complete adaptability to your app's UI style and design system.

A separate marker.js UI package containing a pre-made editor and viewer UIs is coming soon. In the meantime, if you need a quick drop-in way to add a feature-complete editor to your app check [marker.js 2](https://v2.markerjs.com).

## Installation

```
npm install @markerjs/markerjs3
```

The library includes TypeScript type definitions out of the box.

## Usage

### MarkerArea (The Editor)

Import {@link Editor!MarkerArea | MarkerArea} from `@markerjs/markerjs3`:

```js
import { MarkerArea } from '@markerjs/markerjs3';
```

In the code below we assume that you have an `HTMLImageElement` as `targetImage`. It can be a reference to an image you already have on the page or you can simply create it with something like this:

```js
const targetImg = document.createElement('img');
targetImg.src = './sample.jpg';
```

Now you just need to create an instance of `MarkerArea`, set its `targetImage` property and add it to the page:

```js
const markerArea = new MarkerArea();
markerArea.targetImage = targetImg;
editorContainerDiv.appendChild(markerArea);
```

To initiate creation of a marker you just call `createMarker()` and pass it the name (or type) of the marker you want to create. So, if you have a button with id `addFrameButton` you can make it create a new `FrameMarker` with something like this:

```js
document.querySelector('#addButton')?.addEventListener('click', () => {
  markerArea.createMarker('FrameMarker');
});
```

And whenever you want to save state (current annotation) you just call `getState()`:

```js
document.querySelector('#saveStateButton')?.addEventListener('click', () => {
  const state = markerArea.getState();
  console.log(state);
});
```

### Rendering static images

To render the annotation as a static image you use {@link Renderer!Renderer | Renderer}.

```js
import { MarkerArea, Renderer } from '@markerjs/markerjs3';
```

Just create an instance of it and pass the annotation state to the `rasterize()` method:

```js
const renderer = new Renderer();
renderer.targetImage = targetImg;
const dataUrl = await renderer.rasterize(markerArea.getState());

const img = document.createElement('img');
img.src = dataUrl;

someDiv.appendChild(img);
```

Note that the `rasterize()` method is asynchronous and requires using async/await or Promise handling.

### MarkerView (The Viewer)

To show dynamic annotation overlays on top of the original image you use {@link Viewer!MarkerView | MarkerView}.

```js
import { MarkerView } from '@markerjs/markerjs3';

const markerView = new MarkerView();
markerView.targetImage = targetImg;
viewerContainer.appendChild(markerView);

markerView.show(savedState);
```

## Demos

Check out the "work-in-progress" demo [here](https://github.com/ailon/markerjs3-wip-demo). It covers most of the available features with no extra bells or whistles. While it's made with React it is purposefully light on React-specific stuff and "best practices" to just focus on marker.js 3 related things.

Find [more demos on markerjs.com](https://markerjs.com/demos).
