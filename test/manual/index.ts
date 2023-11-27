import { MarkerArea } from '../../src/MarkerArea';
import { AnnotationState, FrameMarker, ShapeOutlineMarkerBaseState } from '../../src/core';
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
      console.log('markercreated', e);
    });
    this.markerArea1.addEventListener('markerchange', (e) => {
      console.log('markerchange', e);
    });
    this.markerArea1.addEventListener('markerselect', (e) => {
      console.log('markerselect', e);
      console.log('marker type:', e.detail.markerEditor.marker.typeName);
    });
    this.markerArea1.addEventListener('markerdeselect', (e) => {
      console.log('markerdeselect', e);
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public addMarker(markerType: string) {
    const newMarkerEditor = this.markerArea1?.createMarker(FrameMarker);
    if (newMarkerEditor && newMarkerEditor.is(ShapeOutlineMarkerEditor)) {
      newMarkerEditor.strokeColor = 'blue';
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
}
