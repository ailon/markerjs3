import { MarkerArea, MarkerEditorEventData } from '../../src/MarkerArea';
import { Renderer } from '../../src/Renderer';
import { AnnotationState, ArrowType, CustomImageMarker } from '../../src/core';
import {
  ArrowMarkerEditor,
  CalloutMarkerEditor,
  CaptionFrameMarkerEditor,
  FreehandMarkerEditor,
  LinearMarkerEditor,
  PolygonMarkerEditor,
  ShapeMarkerEditor,
  ShapeOutlineMarkerEditor,
  TextMarkerEditor,
} from '../../src/editor';
import { MarkerView } from '../../src/viewer';
import { TriangleMarker } from './TriangleMarker';
import sampleState from './sample-state.json';

export * from './../../src/index';

export class Experiments {
  markerArea1?: MarkerArea;
  markerView1?: MarkerView;
  renderer?: Renderer;
  targetImg?: HTMLImageElement;
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  public setup(): void {
    // const targetImg = document.getElementById('testImg') as HTMLImageElement;
    this.targetImg = document.createElement('img');
    this.targetImg.src = './images/landscape_sm.jpg';

    this.markerArea1 = document.getElementById('markerArea1') as MarkerArea;

    // this.markerArea1.defaultFilter = 'drop-shadow(2px 2px 2px black)';
    this.markerArea1.defaultFilter = 'url(#dropShadow)';
    // this.markerArea1.defaultFilter = 'url(#outline)';
    // this.markerArea1.defaultFilter = 'url(#glow)';

    // register custom marker type
    this.markerArea1.registerMarkerType(
      TriangleMarker,
      ShapeOutlineMarkerEditor<TriangleMarker>,
    );

    // this.markerArea1.targetWidth = 1800;
    // this.markerArea1.targetHeight = 600;
    this.markerArea1.targetImage = this.targetImg;

    this.markerView1 = document.getElementById('markerView1') as MarkerView;

    //     this.markerView1.defaultFilter = `
    // drop-shadow(1px 0 0 white)
    // drop-shadow(-1px 0 0 white)
    // drop-shadow(0 1px 0 white)
    // drop-shadow(0 -1px 0 white)
    // drop-shadow(1px 1px 0 white)
    // drop-shadow(-1px -1px 0 white)
    // drop-shadow(1px -1px 0 white)
    // drop-shadow(-1px 1px 0 white)`;
    // register custom marker type
    this.markerView1.registerMarkerType(TriangleMarker);

    // this.markerView1.targetHeight = 600;
    this.markerView1.targetImage = this.targetImg;
    // this.markerView1.show(sampleState);

    this.markerView1.addEventListener('markerclick', (e) => {
      console.log('markerclick', e);
    });

    // doesn't fire when component is added in html (this call is already after init)
    this.markerArea1.addEventListener('areainit', (e) => {
      console.log('areainit', e);
    });
    this.markerArea1.addEventListener('markercreating', (e) => {
      console.log('markercreating', e);
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
      }

      const opacityPanel = document.getElementById('opacityPropertyPanel');
      if (opacityPanel) {
        opacityPanel.style.display = '';
      }

      const shapePanel = document.getElementById('shapePropertyPanel');
      if (shapePanel) {
        shapePanel.style.display = '';
      }

      if (e.detail.markerEditor.is(ArrowMarkerEditor)) {
        const arrowPanel = document.getElementById('arrowPropertyPanel');
        if (arrowPanel) {
          arrowPanel.style.display = '';
        }
      }
      setPropertyValues(e);

      console.log('markerselect', e);
      console.log('marker type:', e.detail.markerEditor.marker.typeName);
    });

    this.markerArea1.addEventListener('markerdeselect', (e) => {
      console.log(
        'markerdeselect editors:',
        e.detail.markerArea.selectedMarkerEditors.length,
      );

      const opacityPanel = document.getElementById('opacityPropertyPanel');
      if (opacityPanel) {
        opacityPanel.style.display = 'none';
      }
      const shapePanel = document.getElementById('shapePropertyPanel');
      if (shapePanel) {
        shapePanel.style.display = 'none';
      }
      const textPanel = document.getElementById('textPropertyPanel');
      if (textPanel) {
        textPanel.style.display = 'none';
      }
      const arrowPanel = document.getElementById('arrowPropertyPanel');
      if (arrowPanel) {
        arrowPanel.style.display = 'none';
      }
      console.log('markerdeselect', e);
    });

    this.markerArea1.addEventListener('markerdelete', (e) => {
      console.log('markerdelete', e);
      console.log(
        'Selected editors',
        this.markerArea1?.selectedMarkerEditors.length,
      );
    });

    const opacityInput = document.getElementById('opacity') as HTMLInputElement;
    opacityInput.addEventListener('change', (ev) => {
      this.setOpacity((ev.target as HTMLInputElement).value);
    });

    const strokeColorInput = document.getElementById(
      'strokeColor',
    ) as HTMLInputElement;
    strokeColorInput.addEventListener('change', (ev) => {
      this.setStrokeColor((ev.target as HTMLInputElement).value);
    });

    const fillColorInput = document.getElementById(
      'fillColor',
    ) as HTMLInputElement;
    fillColorInput.addEventListener('change', (ev) => {
      this.setFillColor((ev.target as HTMLInputElement).value);
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

    const arrowTypeSelect = document.getElementById(
      'arrowType',
    ) as HTMLSelectElement;
    arrowTypeSelect.addEventListener('change', (ev) => {
      const value = (ev.target as HTMLSelectElement).value;
      const editor = this.markerArea1?.currentMarkerEditor;
      if (editor && editor.is(ArrowMarkerEditor)) {
        editor.arrowType = value as ArrowType;
      }
    });

    function setPropertyValues(e: CustomEvent<MarkerEditorEventData>) {
      (document.getElementById('opacity') as HTMLInputElement).value =
        e.detail.markerEditor.opacity.toFixed(2);

      if (
        e.detail.markerEditor.is(ShapeOutlineMarkerEditor) ||
        e.detail.markerEditor.is(LinearMarkerEditor) ||
        e.detail.markerEditor.is(FreehandMarkerEditor) ||
        e.detail.markerEditor.is(PolygonMarkerEditor)
      ) {
        (document.getElementById('strokeColor') as HTMLInputElement).value =
          e.detail.markerEditor.strokeColor;
        (document.getElementById('fillColor') as HTMLInputElement).value =
          e.detail.markerEditor.fillColor;
        (document.getElementById('strokeWidth') as HTMLInputElement).value =
          e.detail.markerEditor.strokeWidth.toString();
        (document.getElementById('strokeDasharray') as HTMLInputElement).value =
          e.detail.markerEditor.strokeDasharray;
      }

      if (e.detail.markerEditor.is(ArrowMarkerEditor)) {
        (document.getElementById('arrowType') as HTMLSelectElement).value =
          e.detail.markerEditor.arrowType;
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
    const editor = this.markerArea1?.createMarker(markerType);

    // for custom image marker set a user-defined image
    if (editor && editor.marker instanceof CustomImageMarker) {
      editor.marker.svgString = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></g></svg>`;
    }

    // const newMarkerEditor = this.markerArea1?.createMarker(markerType);
    // if (
    //   newMarkerEditor &&
    //   (newMarkerEditor.is(ShapeOutlineMarkerEditor) ||
    //     newMarkerEditor.is(LinearMarkerEditor) ||
    //     newMarkerEditor.is(FreehandMarkerEditor) ||
    //     newMarkerEditor.is(PolygonMarkerEditor))
    // ) {
    //   newMarkerEditor.strokeColor = '#0000ff';
    // }
  }

  savedState?: AnnotationState = sampleState;
  // savedState?: AnnotationState = {
  //   version: 3,
  //   width: 867,
  //   height: 654,
  //   markers: [
  //     {
  //       strokeColor: 'blue',
  //       strokeWidth: 3,
  //       strokeDasharray: '',
  //       opacity: 1,
  //       left: 100,
  //       top: 0,
  //       width: 100,
  //       height: 50,
  //       rotationAngle: -45,
  //       typeName: 'FrameMarker',
  //     } as ShapeOutlineMarkerBaseState,
  //   ],
  // };

  public async saveState() {
    this.savedState = this.markerArea1?.getState();
    console.log('saved state:', this.savedState);
    console.log(JSON.stringify(this.savedState));

    if (this.markerView1 && this.savedState) {
      this.markerView1.show(this.savedState);

      // const extraMarkerArea = new MarkerArea();
      // extraMarkerArea.targetImage = this.targetImg;
      // document.body.appendChild(extraMarkerArea);
      // extraMarkerArea.restoreState(this.savedState);
      // const extraMarkerView = new MarkerView();
      // extraMarkerView.targetImage = this.targetImg;
      // document.body.appendChild(extraMarkerView);
      // extraMarkerView.show(this.savedState);
    }

    if (this.savedState && this.markerArea1?.targetImage) {
      const renderer = new Renderer();
      // register custom marker type
      renderer.registerMarkerType(TriangleMarker);

      renderer.naturalSize = true;
      //renderer.targetWidth = 467;
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
    if (this.markerArea1 && this.savedState) {
      //this.markerArea1.targetWidth = 400;
      //this.markerArea1.targetHeight = 300;
      this.markerArea1.restoreState(this.savedState);
    }
  }
  public undo() {
    if (this.markerArea1 && this.markerArea1.isUndoPossible) {
      this.markerArea1.undo();
    }
  }
  public redo() {
    this.markerArea1?.redo();
  }

  public setOpacity(opacity: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor) {
      editor.opacity = Number.parseFloat(opacity);
    }
    console.log('opacity', opacity);
  }

  public setStrokeColor(color: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (
      editor &&
      (editor.is(ShapeOutlineMarkerEditor) ||
        editor.is(LinearMarkerEditor) ||
        editor.is(FreehandMarkerEditor) ||
        editor.is(PolygonMarkerEditor) ||
        editor.is(CalloutMarkerEditor) ||
        editor.is(CaptionFrameMarkerEditor))
    ) {
      editor.strokeColor = color;
    }
    console.log('setStrokeColor', color);
  }

  public setFillColor(color: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (
      editor &&
      (editor.is(ShapeMarkerEditor) ||
        editor.is(PolygonMarkerEditor) ||
        editor.is(CalloutMarkerEditor) ||
        editor.is(CaptionFrameMarkerEditor))
    ) {
      editor.fillColor = color;
    }
    console.log('setFillColor', color);
  }

  public setStrokeWidth(width: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (
      editor &&
      (editor.is(ShapeOutlineMarkerEditor) ||
        editor.is(LinearMarkerEditor) ||
        editor.is(FreehandMarkerEditor) ||
        editor.is(PolygonMarkerEditor) ||
        editor.is(CalloutMarkerEditor) ||
        editor.is(CaptionFrameMarkerEditor))
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
        editor.is(PolygonMarkerEditor) ||
        editor.is(CalloutMarkerEditor) ||
        editor.is(CaptionFrameMarkerEditor))
    ) {
      editor.strokeDasharray = dashes;
    }
    console.log('setStrokeDasharray', dashes);
  }

  public setTextColor(color: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(TextMarkerEditor)) {
      editor.color = color;
    }
    console.log('setTextColor', color);
  }

  public setFontFamily(fontFamily: string) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(TextMarkerEditor)) {
      editor.fontFamily = fontFamily;
    }
    console.log('setFontFamily', fontFamily);
  }

  public setFontSize(sign: number) {
    const editor = this.markerArea1?.currentMarkerEditor;
    if (editor && editor.is(TextMarkerEditor)) {
      const fontSize = editor.fontSize;
      fontSize.value += fontSize.step * sign;
      editor.fontSize = fontSize;
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

  public viewerZoomOut() {
    if (this.markerView1) {
      this.markerView1.zoomLevel -= 0.1;
    }
  }
  public viewerZoomIn() {
    if (this.markerView1) {
      this.markerView1.zoomLevel += 0.1;
    }
  }

  public viewerZoomReset() {
    if (this.markerView1) {
      this.markerView1.zoomLevel = 1;
    }
  }

  public switchToSelectMode() {
    if (this.markerArea1) {
      this.markerArea1.switchToSelectMode();
    }
  }

  public deleteMarker() {
    if (this.markerArea1) {
      this.markerArea1.deleteSelectedMarkers();
    }
  }
}
