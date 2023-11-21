import { MarkerArea } from '../../src/MarkerArea';
import { FrameMarker } from '../../src/core';
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
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public addMarker(markerType: string) {
    const newMarkerEditor = this.markerArea1?.createMarker(FrameMarker);
    if (newMarkerEditor && newMarkerEditor.is(ShapeOutlineMarkerEditor)) {
      newMarkerEditor.strokeColor = 'blue';
    }
  }
}
