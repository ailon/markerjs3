---
title: Getting started with vanilla JavaScript
---

# Getting started with marker.js 3 and vanilla JavaScript

In this quick start guide we will create a very simple application that enables us to annotate an image with arrows and then both display the annotation as overlay and render the image with annotations embedded.

> Note: this quick start aims to demonstrate the core concepts in marker.js 3 and purposely ignores best practices and other considerations that would add to the bulk of code without contributing to helping you understand the main parts and principles.

## Prerequisites

### Pure JavaScript

This quick start is written in plain ES6/ES2015 and doesn't require any transpilers, bundlers or anything else to run. If you want a slightly more advanced quick start using Vite, refer to the [TypeScript Quick Start](./getting-started-typescript.md) and just ignore the TypeScript-specific code.

Keep in mind that just opening `index.html` from a file system would likely be blocked by your browser's security settings. You will need to open it through a local HTTP server. If you are using VS Code you can use [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for a quick and simple local server solution. Alternatively, you can install [http-server](https://www.npmjs.com/package/http-server) from npm or any other HTTP server of your choice.

### Target image

We will need a sample image to annotate. You can use any image you want, but if you don't have one handy, just use this one:

![Sample image](../../media/sample-image.png)

Save it in the `img` folder of the project. The rest of this tutorial assumes that you have a `sample-image.png` in your `img` directory.

## The HTML page

First let's create a simple HTML page to hold our components. Create an `index.html` file and add this HTML code to it:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <script src="https://unpkg.com/@markerjs/markerjs3/umd/markerjs3.js"></script>
    <link rel="stylesheet" href="./style.css" />
    <title>marker.js 3 JavaScript Quick Start</title>
  </head>
  <body>
    <div id="app">
      <button id="addArrowButton">Add Arrow</button>
      <button id="saveButton">Save</button>
    </div>
    <script type="module" src="./main.js"></script>
  </body>
</html>
```

The `script` tag in the `head` load marker.js 3 straight from npm via [unpkg](https://unpkg.com) and the `script` tag at the end of the `body` refers to our custom code for this tutorial.

The core element of our application is the `div` with `id="app"` and two buttons inside of it.

```html
<div id="app">
  <button id="addArrowButton">Add Arrow</button>
  <button id="saveButton">Save</button>
</div>
```

We are also referring a CSS file that can be anything (or nothing for that matter) but if you want to include the same CSS used in this demo, you can grab one from [GitHub](https://github.com/ailon/markerjs3-quick-starts/blob/main/mjs3-quickstart-js/style.css) for consistency.

## Adding annotation editor

### main.js

The core functionality will reside in the `main.js` file. Create it next to `index.html` and open in your code editor of choice.

#### marker.js 3 classes

First let's destructure the global `markerjs3` object for convenience.

```javascript
const { MarkerArea, ArrowMarker, MarkerView, Renderer } = markerjs3;
```

#### Create target image object

Let's create a target image object. We will need to pass it to the editor and later viewer and renderer.

```javascript
const targetImg = document.createElement('img');
targetImg.src = './img/sample-image.png';
```

#### Get the app div reference

Let's store the reference to the `app` div in the `app` constant:

```javascript
const app = document.querySelector('#app');
```

#### Add MarkerArea

Now it's finally time to add the main annotation editor element - {@link Editor!MarkerArea | MarkerArea} from the marker.js 3 package.

Create the `markerArea` instance, assign our sample image to it, and add it to the page:

```javascript
const markerArea = new MarkerArea();
markerArea.targetImage = targetImg;
app.appendChild(markerArea);
```

#### Check the progress so far

Now if you start the local server and navigate to the page you should see the sample image loaded. It doesn't do anything yet, though.

#### Connecting the "Add Arrow" button

When the user clicks the "Add Arrow" button we want to initiate creation of an arrow marker. So, let's implement this.

Let's add an event handler to the button's `click` event:

```javascript
document.querySelector('#addArrowButton').addEventListener('click', () => {
  markerArea.createMarker(ArrowMarker);
});
```

All it needs to do is call the {@link Editor!MarkerArea.createMarker | MarkerArea.createMarker()} method and pass a marker type to create.

`createMarker()` works with strings as well, so you can pass `"ArrowMarker"` in place of the type.

Now when you refresh the page and click on the "Add Arrow" button you should be able to draw arrows on the image.

## Adding annotation viewer

In addition to the "Add Arrow" we've added a "Save" button to the page. Let's hook it up to an event handler and display the state from the editor in an annotation viewer.

### main.js

#### Add MarkerView

For simplicity, let's add {@link Viewer!MarkerView | MarkerView} instance to the page when it loads and hide it initially:

```javascript
const markerView = new MarkerView();
markerView.targetImage = targetImg;
app.appendChild(markerView);
markerView.style.display = 'none';
```

Make sure you set its `targetImage` property to the same image we used in the editor.

#### Handle the "Save" click

We are going to add an event listener to the "Save" button's `click` event, get the state (annotation) from the editor, and show it in the viewer:

```javascript
document.querySelector('#saveButton').addEventListener('click', () => {
  // get marker area state (annotation)
  const state = markerArea.getState();

  // display the state in the viewer
  markerView.style.display = '';
  markerView.show(state);
});
```

Don't forget to make the viewer visible by resetting its `display` style.

## Rasterizing annotations

Saving and restoring annotation code is great when you work in an environment that includes marker.js. Oftentimes you'd need to export the annotations so you can share them with other people, archive, etc.

That's where the {@link Renderer!Renderer | Renderer} comes in. It takes the annotation state and renders it on top of the original target image. Let's add it to our code.

### main.js

#### Add an image element to the page

Again, for simplicity, let's pre-add an image element for the rendered annotation to the page and hide it initially:

```javascript
const rasterImage = document.createElement('img');
app.appendChild(rasterImage);
rasterImage.style.display = 'none';
```

#### Render the state

Now, we are going to extend our "Save" button click handler to render the image in addition to showing the viewer.

For this we will create an instance of the `Renderer` class, set its `targetImage` property to the same image we use everywhere and call its {@link Renderer!Renderer.rasterize | Renderer.rasterize()} method:

```javascript
const renderer = new Renderer();
renderer.targetImage = targetImg;
renderer.rasterize(state).then((dataUrl) => {
  rasterImage.src = dataUrl;
  rasterImage.style.display = '';
});
```

Note that `rasterize()` is an async method. You can call it using the async/await notation or you can just go the "classic" promises way like we did here. The `dataUrl` contains a base64 encoded rasterized image with annotations on top of the original. Now we just set it to the `src` attribute of our image element and make it visible.

And that's it. This concludes our quick walkthrough. Now when you draw some arrows and click save you should see a vector overlay of the annotation and a rendered version underneath.

## The complete code

Here's the complete content of our `main.js` file:

```javascript
// Use global markerjs3 object
const { MarkerArea, ArrowMarker, MarkerView, Renderer } = markerjs3;

// create the target image element
const targetImg = document.createElement('img');
targetImg.src = './img/sample-image.png';

// app div
const app = document.querySelector('#app');

// create the marker area, assign the target image and append it to the app div
const markerArea = new MarkerArea();
markerArea.targetImage = targetImg;
app.appendChild(markerArea);

// add arrow marker button action
document.querySelector('#addArrowButton').addEventListener('click', () => {
  markerArea.createMarker(ArrowMarker);
});

// add annotation viewer and hide it initially
const markerView = new MarkerView();
markerView.targetImage = targetImg;
app.appendChild(markerView);
markerView.style.display = 'none';

// add save button action
document.querySelector('#saveButton').addEventListener('click', () => {
  // get marker area state (annotation)
  const state = markerArea.getState();

  // display the state in the viewer
  markerView.style.display = '';
  markerView.show(state);

  // render the annotation to an image
  const renderer = new Renderer();
  renderer.targetImage = targetImg;
  renderer.rasterize(state).then((dataUrl) => {
    rasterImage.src = dataUrl;
    rasterImage.style.display = '';
  });
});

// image element for the rendered annotation
const rasterImage = document.createElement('img');
app.appendChild(rasterImage);
rasterImage.style.display = 'none';
```

And you can find this whole project on [GitHub](https://github.com/ailon/markerjs3-quick-starts/tree/main/mjs3-quickstart-js)

{@include ./next-steps.md}
