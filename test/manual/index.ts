import { MarkerArea } from '../../src/MarkerArea';
import {
  AnnotationState,
  FrameMarker,
  ShapeOutlineMarkerBaseState,
} from '../../src/core';
import { ShapeOutlineMarkerEditor } from '../../src/editor';

export * from './../../src/index';

export class Experiments {
  markerArea1?: MarkerArea;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setup(): void {
    // const targetImg = document.getElementById('testImg') as HTMLImageElement;
    const targetImg = document.createElement('img');
    targetImg.src = './images/landscape_sm.jpg';

    this.markerArea1 = document.getElementById('markerArea1') as MarkerArea;
    // markerArea1.targetWidth = 400;
    // markerArea1.targetHeight = 300;
    this.markerArea1.targetImage = targetImg;

    // doesn't fire when component is added in html (this call is already after init)
    this.markerArea1.addEventListener('areainit', (e) => {
      console.log('areainit', e);
    });
    this.markerArea1.addEventListener('markercreate', (e) => {
      setPropertyValues(e);
      console.log('markercreated', e);
    });
    this.markerArea1.addEventListener('markerchange', (e) => {
      setPropertyValues(e);
      console.log('markerchange', e);
    });
    this.markerArea1.addEventListener('markerselect', (e) => {
      const panel = document.getElementById('shapePropertyPanel');
      if (panel) {
        panel.style.display = '';
      }
      setPropertyValues(e);
      console.log('markerselect', e);
      console.log('marker type:', e.detail.markerEditor.marker.typeName);
    });

    this.markerArea1.addEventListener('markerdeselect', (e) => {
      const panel = document.getElementById('shapePropertyPanel');
      if (panel) {
        panel.style.display = 'none';
      }
      console.log('markerdeselect', e);
    });

    const strokeColorInput = document.getElementById(
      'strokeColor',
    ) as HTMLInputElement;
    strokeColorInput.addEventListener('change', (ev) => {
      this.setStrokeColor((ev.target as HTMLInputElement).value);
    });

    const strokeWidthInput = document.getElementById(
      'strokeWidth',
    ) as HTMLInputElement;
    strokeWidthInput.addEventListener('change', (ev) => {
      this.setStrokeWidth((ev.target as HTMLInputElement).value);
    });

    const strokeDasharrayInput = document.getElementById(
      'strokeDasharray',
    ) as HTMLInputElement;
    strokeDasharrayInput.addEventListener('change', (ev) => {
      this.setStrokeDasharray((ev.target as HTMLInputElement).value);
    });

    function setPropertyValues(
      e: CustomEvent<
        import('c:/Work/dev/markerjs/markerjs3/markerjs3/src/MarkerArea').MarkerEditorEventData
      >,
    ) {
      if (e.detail.markerEditor.is(ShapeOutlineMarkerEditor)) {
        (document.getElementById('strokeColor') as HTMLInputElement).value =
          e.detail.markerEditor.marker.strokeColor;
        (document.getElementById('strokeWidth') as HTMLInputElement).value =
          e.detail.markerEditor.marker.strokeWidth.toString();
        (document.getElementById('strokeDasharray') as HTMLInputElement).value =
          e.detail.markerEditor.marker.strokeDasharray;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public addMarker(markerType: string) {
    const newMarkerEditor = this.markerArea1?.createMarker(FrameMarker);
    if (newMarkerEditor && newMarkerEditor.is(ShapeOutlineMarkerEditor)) {
      newMarkerEditor.strokeColor = '#0000ff';
    }
  }

  savedState?: AnnotationState = {
    version: 3,
    width: 867,
    height: 654,
    markers: [
      {
        strokeColor: 'blue',
        strokeWidth: 3,
        strokeDasharray: '',
        opacity: 1,
        left: 100,
        top: 0,
        width: 100,
        height: 50,
        rotationAngle: -45,
        typeName: 'FrameMarker',
      } as ShapeOutlineMarkerBaseState,
    ],
  };
  public saveState() {
    this.savedState = this.markerArea1?.getState();
    console.log('saved state:', this.savedState);
    console.log(JSON.stringify(this.savedState));
  }
  public restoreState() {
    if (this.savedState) {
      this.markerArea1?.restoreState(this.savedState);
    }
  }
  public undo() {
    this.markerArea1?.undo();
  }
  public redo() {
    this.markerArea1?.redo();
  }

  public setStrokeColor(color: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(ShapeOutlineMarkerEditor)) {
      editor.marker.strokeColor = color;
    }
    console.log('setStrokeColor', color);
  }

  public setStrokeWidth(width: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(ShapeOutlineMarkerEditor)) {
      editor.marker.strokeWidth = Number.parseInt(width);
    }
    console.log('setStrokeWidth', width);
  }

  public setStrokeDasharray(dashes: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(ShapeOutlineMarkerEditor)) {
      editor.marker.strokeDasharray = dashes;
    }
    console.log('setStrokeDasharray', dashes);
  }
}
