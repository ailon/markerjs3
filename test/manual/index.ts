import { MarkerArea, MarkerEditorEventData } from '../../src/MarkerArea';
import { Renderer } from '../../src/Renderer';
import { AnnotationState, ShapeOutlineMarkerBaseState } from '../../src/core';
import {
  FreehandMarkerEditor,
  LinearMarkerEditor,
  PolygonMarkerEditor,
  ShapeOutlineMarkerEditor,
  TextMarkerEditor,
} from '../../src/editor';
import { MarkerView } from '../../src/viewer';

export * from './../../src/index';

export class Experiments {
  markerArea1?: MarkerArea;
  markerView1?: MarkerView;
  renderer?: Renderer;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setup(): void {
    // const targetImg = document.getElementById('testImg') as HTMLImageElement;
    const targetImg = document.createElement('img');
    targetImg.src = './images/landscape.jpg';

    this.markerArea1 = document.getElementById('markerArea1') as MarkerArea;
    this.markerArea1.targetWidth = 400;
    this.markerArea1.targetHeight = 300;
    this.markerArea1.targetImage = targetImg;

    this.markerView1 = document.getElementById('markerView1') as MarkerView;
    this.markerView1.targetImage = targetImg;

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
      if (e.detail.markerEditor.is(TextMarkerEditor)) {
        const panel = document.getElementById('textPropertyPanel');
        if (panel) {
          panel.style.display = '';
        }
        setTextPropertyValues(e);
      } else {
        const panel = document.getElementById('shapePropertyPanel');
        if (panel) {
          panel.style.display = '';
        }
        setPropertyValues(e);
      }
      console.log('markerselect', e);
      console.log('marker type:', e.detail.markerEditor.marker.typeName);
    });

    this.markerArea1.addEventListener('markerdeselect', (e) => {
      const shapePanel = document.getElementById('shapePropertyPanel');
      if (shapePanel) {
        shapePanel.style.display = 'none';
      }
      const textPanel = document.getElementById('textPropertyPanel');
      if (textPanel) {
        textPanel.style.display = 'none';
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

    const textColorInput = document.getElementById(
      'textColor',
    ) as HTMLInputElement;
    textColorInput.addEventListener('change', (ev) => {
      this.setTextColor((ev.target as HTMLInputElement).value);
    });

    const fontFamilyInput = document.getElementById(
      'fontFamily',
    ) as HTMLInputElement;
    fontFamilyInput.addEventListener('change', (ev) => {
      this.setFontFamily((ev.target as HTMLInputElement).value);
    });

    const decreaseFontSizeButton = document.getElementById(
      'decreaseFontSize',
    ) as HTMLButtonElement;
    decreaseFontSizeButton.addEventListener('click', () => {
      this.setFontSize(-1);
    });
    const increaseFontSizeButton = document.getElementById(
      'increaseFontSize',
    ) as HTMLButtonElement;
    increaseFontSizeButton.addEventListener('click', () => {
      this.setFontSize(1);
    });

    function setPropertyValues(e: CustomEvent<MarkerEditorEventData>) {
      if (
        e.detail.markerEditor.is(ShapeOutlineMarkerEditor) ||
        e.detail.markerEditor.is(LinearMarkerEditor) ||
        e.detail.markerEditor.is(FreehandMarkerEditor) ||
        e.detail.markerEditor.is(PolygonMarkerEditor)
      ) {
        (document.getElementById('strokeColor') as HTMLInputElement).value =
          e.detail.markerEditor.strokeColor;
        (document.getElementById('strokeWidth') as HTMLInputElement).value =
          e.detail.markerEditor.strokeWidth.toString();
        (document.getElementById('strokeDasharray') as HTMLInputElement).value =
          e.detail.markerEditor.strokeDasharray;
      }
    }
    function setTextPropertyValues(e: CustomEvent<MarkerEditorEventData>) {
      if (e.detail.markerEditor.is(TextMarkerEditor)) {
        (document.getElementById('textColor') as HTMLInputElement).value =
          e.detail.markerEditor.marker.color;
        (document.getElementById('fontFamily') as HTMLInputElement).value =
          e.detail.markerEditor.marker.fontFamily;
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public addMarker(markerType: string) {
    const newMarkerEditor = this.markerArea1?.createMarker(markerType);
    if (
      newMarkerEditor &&
      (newMarkerEditor.is(ShapeOutlineMarkerEditor) ||
        newMarkerEditor.is(LinearMarkerEditor) ||
        newMarkerEditor.is(FreehandMarkerEditor) ||
        newMarkerEditor.is(PolygonMarkerEditor))
    ) {
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
  public async saveState() {
    this.savedState = this.markerArea1?.getState();
    console.log('saved state:', this.savedState);
    console.log(JSON.stringify(this.savedState));

    if (this.markerView1 && this.savedState) {
      this.markerView1.show(this.savedState);
    }

    if (this.savedState && this.markerArea1?.targetImage) {
      const renderer = new Renderer();
      renderer.naturalSize = true;
      // renderer.markersOnly = true;
      renderer.targetImage = this.markerArea1.targetImage;
      const renderedSrc = await renderer.rasterize(this.savedState);

      const renderedImg = document.createElement('img');
      renderedImg.src = renderedSrc;
      renderedImg.style.alignSelf = 'center';
      document.body.appendChild(renderedImg);
    }
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
    if (
      editor &&
      (editor.is(ShapeOutlineMarkerEditor) ||
        editor.is(LinearMarkerEditor) ||
        editor.is(FreehandMarkerEditor) ||
        editor.is(PolygonMarkerEditor))
    ) {
      editor.strokeColor = color;
    }
    console.log('setStrokeColor', color);
  }

  public setStrokeWidth(width: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (
      editor &&
      (editor.is(ShapeOutlineMarkerEditor) ||
        editor.is(LinearMarkerEditor) ||
        editor.is(FreehandMarkerEditor) ||
        editor.is(PolygonMarkerEditor))
    ) {
      editor.strokeWidth = Number.parseInt(width);
    }
    console.log('setStrokeWidth', width);
  }

  public setStrokeDasharray(dashes: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (
      editor &&
      (editor.is(ShapeOutlineMarkerEditor) ||
        editor.is(LinearMarkerEditor) ||
        editor.is(FreehandMarkerEditor) ||
        editor.is(PolygonMarkerEditor))
    ) {
      editor.strokeDasharray = dashes;
    }
    console.log('setStrokeDasharray', dashes);
  }

  public setTextColor(color: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(TextMarkerEditor)) {
      editor.marker.color = color;
    }
    console.log('setTextColor', color);
  }

  public setFontFamily(fontFamily: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(TextMarkerEditor)) {
      editor.marker.fontFamily = fontFamily;
    }
    console.log('setFontFamily', fontFamily);
  }

  public setFontSize(sign: number) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(TextMarkerEditor)) {
      const fontSize = editor.marker.fontSize;
      fontSize.value += fontSize.step * sign;
      editor.marker.fontSize = fontSize;
    }
    console.log('setFontSize', sign);
  }

  public zoomOut() {
    if (this.markerArea1) {
      this.markerArea1.zoomLevel -= 0.1;
    }
  }
  public zoomIn() {
    if (this.markerArea1) {
      this.markerArea1.zoomLevel += 0.1;
    }
  }

  public zoomReset() {
    if (this.markerArea1) {
      this.markerArea1.zoomLevel = 1;
    }
  }

  public switchToSelectMode() {
    if (this.markerArea1) {
      this.markerArea1.switchToSelectMode();
    }
  }
}
