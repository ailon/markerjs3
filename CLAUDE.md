# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

marker.js 3 is a JavaScript browser library for image annotation. It's a "headless" library focused on core functionality without bundled UI, allowing developers to build custom annotation interfaces.

## Commands

```bash
# Development - starts dev server at http://0.0.0.0:8088 with live reload
yarn dev

# Production build (runs lint first, then rollup)
yarn build

# Lint only
yarn lint
```

## Architecture

### Core Components

- **MarkerArea** (`src/MarkerArea.ts`) - Main editor component, a web component (`<mjs-marker-area>`) that manages marker creation, selection, and state
- **MarkerView** (`src/MarkerView.ts`) - Read-only viewer for displaying annotations
- **Renderer** (`src/Renderer.ts`) - Rasterizes annotations to static images (data URLs)

### Marker System

Markers follow a class hierarchy extending `MarkerBase`. Each marker type has:

1. A marker class in `src/core/` (e.g., `ArrowMarker.ts`)
2. A corresponding editor class in `src/editor/` (e.g., `ArrowMarkerEditor.ts`)
3. A state interface for serialization (e.g., `ArrowMarkerState.ts`)
4. Some markers that are based on the same base class share editor implementations. (eg. `ShapeMarkerEditor.ts` is used for ellipse, highlight, and cover markers)

Key base classes:

- `MarkerBase` - Abstract base for all markers
- `ShapeMarkerBase` - Filled shapes (ellipse, cover, highlight)
- `ShapeOutlineMarkerBase` - Outline-only shapes (frames)
- `LinearMarkerBase` - Lines, arrows, measurements
- `RectangularBoxMarkerBase` - Box-based markers

### Marker Registration Pattern

```typescript
class MyMarker extends MarkerBase {
  public static typeName = 'MyMarker';
  public static title = 'My Marker';
}
// Registered via markerArea.markerEditors.set(MyMarker, MyMarkerEditor)
```

### State Serialization

All markers serialize to JSON-compatible state objects via `markerArea.getState()` and restore via `markerArea.restoreState(state)`.

### Event System

MarkerArea emits custom events with `area` prefix (areashow, areastatechange) and `marker` prefix (markercreate, markerchange, markerdelete). Event data accessed via `event.detail`.

## Key Utilities

- **SvgHelper** (`src/core/SvgHelper.ts`) - SVG element creation utilities
- **TransformMatrix** (`src/core/TransformMatrix.ts`) - Matrix transformation utilities
- **UndoRedoManager** (`src/editor/UndoRedoManager.ts`) - History management

## Testing

No automated test suite. Manual testing via `yarn dev` which serves the test page at `:8088`. Test harness is in `/test/manual/index.ts`.

## Build System

- Rollup bundler with TypeScript
- Outputs: UMD bundle (`dist/umd/`), ESM bundle (`dist/`), type declarations (`dist/markerjs3.d.ts`)
- SVG files auto-optimized via SVGO
- Lint must pass before build completes

## Important Notes

- External PRs not accepted (see CONTRIBUTING.md)
- Strict TypeScript enabled
- All markers render within SVG GElement containers
- Control grips scale inversely to zoom level for consistent UX
