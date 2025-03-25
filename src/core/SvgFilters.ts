import { SvgHelper } from './SvgHelper';

/**
 * A set of common SVG filters that can be used to make markers more legible
 * or just for visual effect.
 */
export class SvgFilters {
  /**
   * Returns a set of default filters that can be used to make markers more legible.
   * @returns array of SVG filters.
   */
  public static getDefaultFilterSet(): SVGFilterElement[] {
    const dsFilter = SvgHelper.createFilter(
      'dropShadow',
      [
        ['x', '-20%'],
        ['y', '-20%'],
        ['width', '140%'],
        ['height', '140%'],
      ],
      `<feDropShadow dx="2" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.8)"/>`,
    );

    const outlineFilter = SvgHelper.createFilter(
      'outline',
      [
        ['x', '-5%'],
        ['y', '-5%'],
        ['width', '110%'],
        ['height', '110%'],
      ],
      `<feMorphology operator="dilate" radius="2" in="SourceAlpha" result="expanded"/>
      <feFlood flood-color="white" flood-opacity="1"/>
      <feComposite in2="expanded" operator="in"/>
      <feComposite in="SourceGraphic" operator="over"/>`,
    );

    const glowFilter = SvgHelper.createFilter(
      'glow',
      [
        ['x', '-50%'],
        ['y', '-50%'],
        ['width', '200%'],
        ['height', '200%'],
      ],
      `<feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur"/>
      <feFlood flood-color="#ffffff" flood-opacity="1"/>
      <feComposite in2="blur" operator="in"/>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>`,
    );

    return [dsFilter, outlineFilter, glowFilter];
  }
}
