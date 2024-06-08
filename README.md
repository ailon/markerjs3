# marker.js 3 &mdash; Add image annotation to your web apps

> **Note**: marker.js 3 is in the pre-release stage of its lifecycle and will have many additions and, potentially, breaking changes before the official 3.0 release.
>
> If you need a stable image annotation library, consider using [marker.js 2](https://markerjs.com) for now.

marker.js 3 is a JavaScript browser library to enable image annotation in your web applications. Add marker.js 3 to your web app and enable users to annotate and mark up images. You can save, share or otherwise process the results.

## Installation

```
npm install @markerjs/markerjs3
```

or

```
yarn add @markerjs/markerjs3
```

## Usage

Unlike the previous version, marker.js 3 is a "headless" (sort of) library. In this case "headless" means that it doesn't come with any toolbars, property editors, and placement preconceptions. This way the library focuses on the core features you need, and you can make it feel totally native in the application you are building without resorting to any tricks or hacks.

With that out of the way, here are the simplest usage scenarios...

### MarkerArea (The Editor)

Import `MarkerArea` from `@markerjs/markerjs3`:

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
document.querySelector("#addButton")!.addEventListener("click", () => {
  markerArea.createMarker("FrameMarker");
});
```

And whenever you want to save state (current annotation) you just call `getState()`:

```js
document.querySelector("#saveStateButton")!.addEventListener("click", () => {
  const state = markerArea.getState();
  console.log(state);
});
```

### Rendering static images

To render the annotation as a static image you use `Renderer`.

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

### MarkerView (The Viewer)

To show dynamic annotation overlays on top of the original image you use `MarkerView`.

```js
import { MarkerView } from '@markerjs/markerjs3';

const markerView = new MarkerView();
markerView.targetImage = targetImg;
viewerContainer.appendChild(markerView);

markerView.show(savedState);
```

## Demos

Check out the "work-in-progress" demo [here](https://github.com/ailon/markerjs3-wip-demo). It covers most of the available features with no extra bells or whistles.

While it's made with React it is purposefully light on React-specific stuff and "best practices" to just focus on marker.js 3 related things.

_more demos coming soon..._

## More docs and tutorials

_coming soon..._

## License

Linkware (see [LICENSE](https://github.com/ailon/markerjs3/blob/master/LICENSE) for details) - the UI displays a small link back to the marker.js 3 website which should be retained.

Alternative licenses are available through the [marker.js website](https://markerjs.com).
