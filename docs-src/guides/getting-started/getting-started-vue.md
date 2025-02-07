---
title: Getting started with Vue.js
category: Documentation
---

# Getting started with marker.js 3 and Vue.js (and TypeScript)

In this quick start guide we will create a very simple application that enables us to annotate an image with arrows and then both display the annotation as overlay and render the image with annotations embedded.

> Note: this quick start aims to demonstrate the core concepts in marker.js 3 and purposely ignores best practices and other considerations that would add to the bulk of code without contributing to helping you understand the main parts and principles.

## Setup

### Vite

We will use [Vite](https://vite.dev/) to scaffold the project and avoid covering the boilerplate code. To generate our initial project we will use the `vue-ts` template.

To get started create a directory of your choice and run this command in the terminal to create our project:

```bash
npm create vite@latest mjs3-quickstart-vue-ts -- --template vue-ts
```

Follow the instructions on the screen to install dependencies. In case you need help with Vite, check out their [getting started guide](https://vite.dev/guide/).

### Add marker.js 3 dependency

To add marker.js 3 to the project run this command:

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

We will try to make as few changes to the generated boilerplate as needed, so we are going to leave most of the files as they are.

### App.vue

The main component of our app is located in `src/App.vue`. Let's start by setting up our component:

```ts
<script setup lang="ts">
import { ref } from 'vue'
import type { AnnotationState } from '@markerjs/markerjs3'
import Editor from './components/Editor.vue'
import Viewer from './components/Viewer.vue'
import Render from './components/Render.vue'

// Path to our sample image
const sampleImage = '/sample-image.png'

// State to store the current annotation
const annotation = ref<AnnotationState | null>(null)

// Handler for when editor saves an annotation
const handleSave = (newAnnotation: AnnotationState) => {
  annotation.value = newAnnotation
}
</script>

<template>
  <Editor :targetImage="sampleImage" @save="handleSave" />
  <template v-if="annotation">
    <Viewer :targetImage="sampleImage" :annotation="annotation" />
    <Render :targetImage="sampleImage" :annotation="annotation" />
  </template>
</template>
```

### Editor.vue

The editor component will handle the marker.js editor initialization and marker creation.

Create `src/components/Editor.vue`:

```ts
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { type AnnotationState, ArrowMarker, MarkerArea } from '@markerjs/markerjs3'

// Define component props
const props = defineProps<{
  targetImage: string
}>()

// Define emitted events
const emit = defineEmits<{
  (e: 'save', annotation: AnnotationState): void
}>()

// References to DOM and MarkerArea
const editorContainer = ref<HTMLDivElement | null>(null)
const editor = ref<MarkerArea | null>(null)

// Initialize MarkerArea on component mount
onMounted(() => {
  if (editorContainer.value) {
    const targetImg = document.createElement('img')
    targetImg.src = props.targetImage

    editor.value = new MarkerArea()
    editor.value.targetImage = targetImg

    editorContainer.value.appendChild(editor.value)
  }
})

// Add arrow marker handler
const addArrow = () => {
  editor.value?.createMarker(ArrowMarker)
}

// Save annotation handler
const saveAnnotation = () => {
  if (editor.value) {
    emit('save', editor.value.getState())
  }
}
</script>

<template>
  <button @click="addArrow">Add Arrow</button>
  <button @click="saveAnnotation">Save</button>
  <div ref="editorContainer"></div>
</template>
```

### Viewer.vue

The viewer component displays annotations as an overlay.

Create `src/components/Viewer.vue`:

```ts
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { type AnnotationState, MarkerView } from '@markerjs/markerjs3'

const props = defineProps<{
  targetImage: string
  annotation: AnnotationState
}>()

const viewerContainer = ref<HTMLDivElement | null>(null)
const viewer = ref<MarkerView | null>(null)

// Initialize MarkerView on mount
onMounted(() => {
  if (viewerContainer.value) {
    const targetImg = document.createElement('img')
    targetImg.src = props.targetImage

    viewer.value = new MarkerView()
    viewer.value.targetImage = targetImg

    viewerContainer.value.appendChild(viewer.value)

    viewer.value.show(props.annotation)
  }
})

// Update view when annotation changes
watch(() => props.annotation, (newAnnotation) => {
  viewer.value?.show(newAnnotation)
})
</script>

<template>
  <div ref="viewerContainer"></div>
</template>
```

### Render.vue

Finally, the render component handles rasterization.

Create `src/components/Render.vue`:

```ts
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { AnnotationState, Renderer } from '@markerjs/markerjs3'

const props = defineProps<{
  targetImage: string
  annotation: AnnotationState
}>()

const renderedImage = ref<HTMLImageElement | null>(null)

// Render the annotation when either image or annotation changes
const renderAnnotation = () => {
  const targetImg = document.createElement('img')
  targetImg.src = props.targetImage

  const renderer = new Renderer()
  renderer.targetImage = targetImg

  renderer.rasterize(props.annotation).then((dataUrl) => {
    if (renderedImage.value) {
      renderedImage.value.src = dataUrl
    }
  })
}

onMounted(renderAnnotation)

watch([() => props.targetImage, () => props.annotation], renderAnnotation)
</script>

<template>
  <img ref="renderedImage" alt="Rendered Image" />
</template>
```

You can find this whole project on [GitHub](https://github.com/ailon/markerjs3-quick-starts/tree/main/mjs3-quickstart-vue-ts)

{@include ./next-steps.md}
