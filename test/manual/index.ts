import { MarkerArea } from '../../src/MarkerArea';

export * from './../../src/index';

export class Experiments {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setup(): void {
    // const targetImg = document.getElementById('testImg') as HTMLImageElement;
    const targetImg = document.createElement('img');
    targetImg.src = './images/image1.jpg';
    
    const markerArea1 = document.getElementById('markerArea1') as MarkerArea;
    // markerArea1.targetWidth = 400;
    // markerArea1.targetHeight = 300;
    markerArea1.targetImage = targetImg;
  }
}
