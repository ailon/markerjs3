---
title: Migrate from marker.js 2
group: Documents
category: Documentation
---

# Migration from marker.js version 2.x

As a major version update marker.js 3 comes with a completely new architecture and multiple breaking changes.

## Main differences

The core conceptual differences from version 2 are:

1. marker.js 3 is "headless" meaning that there are no toolbars or property editing panels included. This allows for complete customization to perfectly fit your app's UI (the most requested "feature"). It also means that you'd need to put in more work to get started and it's not just a simple drop-in like marker.js 2 was. Having said that, if you require a quick and simple annotation editor, there's nothing wrong with continuing to use marker.js 2.

2. Markers and their editors are now separate entities allowing for complete separation between marker visuals and tooling for marker manipulation.

3. Some marker types were reimagined to behave differently than they did in v2. Namely, all of the text-based markers are now using user-set font-size and don't auto-scale to fill the marker's bounding box (another highly requested change).

## Migration path

While many concepts are similar to the ones found in marker.js 2, it's a brand new codebase, with many changes to the architecture and, unfortunately, **there's no direct migration path**.

### Loading v2 state in v3

While marker.js 3 uses the same state format as v2 did, due to some of the breaking changes outlined above, the v2 state will likely display incorrectly when loaded into v3 (if at all).

Having said that, writing a state converter is on the to-do list but the priority of the task is unclear at this point. If you strongly feel like upgrading to v3 and not being able to load the old state is the only thing stopping you, please [reach out](mailto:info@markerjs.com) to indicate the demand for this feature.

## Keep calm and continue using v2

While most of my attention is going to be focused on marker.js 3, there's nothing fundamentally broken about marker.js 2. Both versions serve slightly different scenarios and it's up to you to decide which one fits your bill the best.
