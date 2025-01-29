---
title: Getting started with React
category: Documentation
---

# Getting started with marker.js 3 and React (and TypeScript)

In this quick start guide we will create a very simple application that enables us to annotate an image with arrows and then both display the annotation as overlay and render the image with annotations embedded.

> Note: this quick start aims to demonstrate the core concepts in marker.js 3 and purposely ignores best practices and other considerations that would add to the bulk of code without contributing to helping you understand the main parts and principles.

## Setup

### Vite

We will use [Vite](https://vite.dev/) to scaffold the project and avoid covering the boilerplate code. To generate our initial project we will use the `react-ts` template.

To get started create a directory of your choice and run this command in the terminal to create our project:

```bash
npm create vite@latest mjs3-quickstart-react-ts -- --template react-ts
```

Follow the instructions on the screen to install dependencies. In case you need help with Vite, check out their [getting started guide](https://vite.dev/guide/).

### Add marker.js 3 dependency

To add marker.js 3 to the project run this command:

```bash
npm install @markerjs/markerjs3
```

### Target image

We will need a sample image to annotate. You can use any image you want, but if you don't have one handy, just use this one:

![Sample image](../../media/sample-image.png)

Save it in the `public` folder of the project. The rest of this tutorial assumes that you have a `sample-image.png` in your `public` directory.

## Adding annotation editor

We will try to make as few changes to the generated boilerplate as needed, so we are going to leave the HTML and CSS files as they are.

### App.tsx

The main component of our boilerplate app is located in `src/App.tsx`. Let's start by adding an import for our sample image:

```typescript
import sampleImage from '/sample-image.png';
```

We can delete everything from the `App()` function body and add our own code there.

First of all, let's add a state variable where we will store our annotation:

```typescript
const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
```

You should already have an import for the `useState` hook from React (if not &mdash; add it). And important `AnnotationState` class from marker.js:

```typescript
import { AnnotationState } from '@markerjs/markerjs3';
```

Let's also define a handler for our editor's save event. We will use it later and it will just set the `annotation` state.

```typescript
const handleSave = (annotation: AnnotationState) => {
  setAnnotation(annotation);
};
```

Our function should return our whole UI. We will split three parts of it into separate components starting with the editor component. So, for now our return will look like this:

```tsx
return (
  <>
    <Editor targetImage={sampleImage} onSave={handleSave} />
  </>
);
```

We will create our editor component in the `Editor.tsx` file. We can preemptively add an import for it so we are done with the `App.tsx` for now.

#### The code so far

The complete `App.tsx` at this stage should look something like this:

```typescript
import { useState } from "react";
import "./App.css";
import sampleImage from "/sample-image.png";
import { AnnotationState } from "@markerjs/markerjs3";
import Editor from "./Editor";

function App() {
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  const handleSave = (annotation: AnnotationState) => {
    setAnnotation(annotation);
  };

  return (
    <>
      <Editor targetImage={sampleImage} onSave={handleSave} />
    </>
  );
}

export default App;
```

### Editor.tsx

We will put our annotation creation code into `Editor.tsx` file next to `App.tsx`. Create the file and let's start building it out.

Let's start by scaffolding the basic layout of our editor:

```tsx
const Editor = () => {
  return (
    <>
      <button>Add Arrow</button>
      <button>Save</button>

      <div></div>
    </>
  );
};

export default Editor;
```

What we are going to have in the editor is a button to add an arrow marker, a save button, and a container div where we will add our main component &mdash; {@link Editor!MarkerArea | MarkerArea} from the marker.js 3 package.

We will pass the target image source and an event handler for the save event. Let's define those and add them to our function's signature:

```tsx
type Props = {
  targetImage: string;
  onSave: (annotation: AnnotationState) => void;
};

const Editor = ({ targetImage, onSave }: Props) => {
  ...
}
```

Remember to import the `AnnotationState` class:

```typescript
import { AnnotationState } from '@markerjs/markerjs3';
```

To access the div where we are going to place our `MarkerArea` we will need to use a `useRef` hook and add a `ref` attribute to that div.

```tsx
const editorContainer = useRef<HTMLDivElement | null>(null);
```

```tsx
<div ref={editorContainer}></div>
```

We should also create a ref for our `MarkerArea`:

```tsx
const editor = useRef<MarkerArea | null>(null);
```

Now we are ready to add the main marker.js functionality. We will do this in the `useEffect` hook:

```tsx
useEffect(() => {
  if (!editor.current && editorContainer.current) {
    const targetImg = document.createElement('img');
    targetImg.src = targetImage;

    editor.current = new MarkerArea();
    editor.current.targetImage = targetImg;

    editorContainer.current.appendChild(editor.current);
  }
}, [targetImage]);
```

Here we are making sure that `MarkerArea` object wasn't setup yet (we only need one), create a `HTMLImageElement` for our target image, create a new `MarkerArea`, assign the image, and append the marker editor to the container div.

Now, the only thing left to do is make our buttons do what they say on the label.

The "Add Arrow" button will call the {@link Editor!MarkerArea.createMarker | MarkerArea.createMarker()} method and pass a marker type to create.

```tsx
<button
  onClick={() => {
    editor.current?.createMarker(ArrowMarker);
  }}
>
  Add Arrow
</button>
```

`createMarker()` works with strings as well, so you can pass `"ArrowMarker"` in place of the type, but we are in the TypeScript world so let's stick to the strongly typed code. For this code to work we would just need to add `ArrowMarker` to our marker.js import line.

The "Save" button should just call the handler passed to our component and supply the current editor state as an argument:

```tsx
<button
  onClick={() => {
    if (editor.current) {
      onSave(editor.current.getState());
    }
  }}
>
  Save
</button>
```

And that's it for our editor. If you lunch the app with `npm run dev` you should be able to see the editor and draw line markers by clicking the "Add Arrow" button.

#### The complete `Editor.tsx` code

The whole `Editor.tsx` should look something like this:

```tsx
import { AnnotationState, ArrowMarker, MarkerArea } from '@markerjs/markerjs3';
import { useEffect, useRef } from 'react';

type Props = {
  targetImage: string;
  onSave: (annotation: AnnotationState) => void;
};

const Editor = ({ targetImage, onSave }: Props) => {
  const editorContainer = useRef<HTMLDivElement | null>(null);
  const editor = useRef<MarkerArea | null>(null);

  useEffect(() => {
    if (!editor.current && editorContainer.current) {
      const targetImg = document.createElement('img');
      targetImg.src = targetImage;

      editor.current = new MarkerArea();
      editor.current.targetImage = targetImg;

      editorContainer.current.appendChild(editor.current);
    }
  }, [targetImage]);

  return (
    <>
      <button
        onClick={() => {
          editor.current?.createMarker(ArrowMarker);
        }}
      >
        Add Arrow
      </button>
      <button
        onClick={() => {
          if (editor.current) {
            onSave(editor.current.getState());
          }
        }}
      >
        Save
      </button>

      <div ref={editorContainer}></div>
    </>
  );
};

export default Editor;
```

## Adding annotation viewer

In the previous section we've added a "Save" button to the editor component. It sets the state in our root component but we are doing nothing with it so far. Let's address that.

### Viewer.tsx

The code for the annotation viewer represented by {@link Viewer!MarkerView | MarkerView} will reside in the `Viewer.tsx` file.

The props we will pass to the component are our target image and annotation state:

```tsx
type Props = {
  targetImage: string;
  annotation: AnnotationState;
};
```

Adding and hooking up the viewer component is exactly the same as it was for the [Editor](#editortsx):

```tsx
const Viewer = ({ targetImage, annotation }: Props) => {
  const viewerContainer = useRef<HTMLDivElement | null>(null);
  const viewer = useRef<MarkerView | null>(null);

  useEffect(() => {
    if (!viewer.current && viewerContainer.current) {
      const targetImg = document.createElement('img');
      targetImg.src = targetImage;

      viewer.current = new MarkerView();
      viewer.current.targetImage = targetImg;

      viewerContainer.current.appendChild(viewer.current);
    }
  }, [targetImage]);

  return (
    <>
      <div ref={viewerContainer}></div>
    </>
  );
};

export default Viewer;
```

The only additional thing we need to do is actually showing the annotation. Let's add another `useEffect` for that:

```tsx
useEffect(() => {
  viewer.current?.show(annotation);
}, [annotation]);
```

### Add Viewer to App.tsx

Now let's import the viewer into our main component in `App.tsx`:

```tsx
import Viewer from './Viewer';
```

And show it only when our `annotation` is not null:

```tsx
{
  annotation && <Viewer targetImage={sampleImage} annotation={annotation} />;
}
```

Now when you run the app, draw some arrows, and click "Save" the annotation should show up in another component below the editor.

#### The complete Viewer.tsx code

```tsx
import { AnnotationState, MarkerView } from '@markerjs/markerjs3';
import { useEffect, useRef } from 'react';

type Props = {
  targetImage: string;
  annotation: AnnotationState;
};

const Viewer = ({ targetImage, annotation }: Props) => {
  const viewerContainer = useRef<HTMLDivElement | null>(null);
  const viewer = useRef<MarkerView | null>(null);

  useEffect(() => {
    if (!viewer.current && viewerContainer.current) {
      const targetImg = document.createElement('img');
      targetImg.src = targetImage;

      viewer.current = new MarkerView();
      viewer.current.targetImage = targetImg;

      viewerContainer.current.appendChild(viewer.current);
    }
  }, [targetImage]);

  useEffect(() => {
    viewer.current?.show(annotation);
  }, [annotation]);

  return (
    <>
      <div ref={viewerContainer}></div>
    </>
  );
};

export default Viewer;
```

## Rasterizing annotations

Finally, let's create a `Render` component to rasterize our markers on top of the target image.

### Render.tsx

Let's create a `Render.tsx` file and add that will use {@link Renderer!Renderer | Renderer} to create the image. It will accept the same props as our [Viewer](#viewertsx) and follow the same process of instantiating the object with its `targetImage` set to our sample image.

The core of this component is calling the {@link Renderer!Renderer.rasterize | Renderer.rasterize()} method to initiate the rendering.

```tsx
renderer.rasterize(annotation).then((dataUrl) => {
  if (renderedImage.current) {
    renderedImage.current.src = dataUrl;
  }
});
```

Note that `rasterize()` is an async method. You can call it using the async/await notation or you can just go the "classic" promises way like we did here. The `dataUrl` contains a base64 encoded rasterized image with annotations on top of the original. Now we just set it to the `src` attribute of our `renderedImage` image element.

#### The complete Render.tsx

```tsx
import { AnnotationState, Renderer } from '@markerjs/markerjs3';
import { useEffect, useRef } from 'react';

type Props = {
  targetImage: string;
  annotation: AnnotationState;
};

const Render = ({ targetImage, annotation }: Props) => {
  const renderedImage = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const targetImg = document.createElement('img');
    targetImg.src = targetImage;

    const renderer = new Renderer();
    renderer.targetImage = targetImg;

    renderer.rasterize(annotation).then((dataUrl) => {
      if (renderedImage.current) {
        renderedImage.current.src = dataUrl;
      }
    });
  }, [targetImage, annotation]);

  return <img ref={renderedImage} alt="Rendered Image" />;
};

export default Render;
```

### Add Render to App.tsx

Now, the only thing left is to add the `Render` component to our main app.

We just import it and modify our viewer block to include the renderer as well:

```tsx
{
  annotation && (
    <>
      <Viewer targetImage={sampleImage} annotation={annotation} />
      <Render targetImage={sampleImage} annotation={annotation} />
    </>
  );
}
```

#### Final App.tsx

The final App.tsx should look something like this:

```tsx
import { useState } from 'react';
import './App.css';
import sampleImage from '/sample-image.png';
import { AnnotationState } from '@markerjs/markerjs3';
import Editor from './Editor';
import Viewer from './Viewer';
import Render from './Render';

function App() {
  const [annotation, setAnnotation] = useState<AnnotationState | null>(null);
  const handleSave = (annotation: AnnotationState) => {
    setAnnotation(annotation);
  };

  return (
    <>
      <Editor targetImage={sampleImage} onSave={handleSave} />
      {annotation && (
        <>
          <Viewer targetImage={sampleImage} annotation={annotation} />
          <Render targetImage={sampleImage} annotation={annotation} />
        </>
      )}
    </>
  );
}

export default App;
```

And you can find this whole project on [GitHub](https://github.com/ailon/markerjs3-quick-starts/tree/main/mjs3-quickstart-react-ts)

{@include ./next-steps.md}
