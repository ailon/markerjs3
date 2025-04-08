/**
 * A shim implementation of HTMLElement for server-side rendering.
 * This class provides minimal implementations of HTMLElement methods
 * to prevent errors when running in a non-browser environment.
 */
class HTMLElementShimForServer {
  /** The shadow root of the element, always null in server environment */
  public shadowRoot: ShadowRoot | null = null;

  /**
   * No-op implementation of addEventListener for server-side
   * @param _type - The event type
   * @param _listener - The event listener function
   * @param _options - Optional event listener options
   */
  public addEventListener(_type: string, _listener: any, _options?: any) {
  }

  /**
   * No-op implementation of removeEventListener for server-side
   * @param _type - The event type
   * @param _listener - The event listener function
   * @param _options - Optional event listener options
   */
  public removeEventListener(_type: string, _listener: any, _options?: any) {
  }

  /**
   * No-op implementation of dispatchEvent for server-side
   * @param _event - The event to dispatch
   */
  public dispatchEvent(_event: Event) {
  }

  /**
   * No-op implementation of setAttribute for server-side
   * @param _name - The attribute name
   * @param _value - The attribute value
   */
  public setAttribute(_name: string, _value: string) {
  }

  /**
   * Always returns false for server-side implementation
   * @param _name - The attribute name to check
   * @returns Always returns false in server environment
   */
  public hasAttribute(_name: string): boolean {
    return false;
  }

  /**
   * No-op implementation of attachShadow for server-side
   * @param _options - Shadow root initialization options
   * @returns Always returns null in server environment
   */
  public attachShadow(_options: ShadowRootInit): ShadowRoot {
    return null as unknown as ShadowRoot;
  }

  /** Basic style object with empty string values */
  public style = {
    display: "",
    height: "",
    width: "",
    position: "",
  } as CSSStyleDeclaration;
}

/**
 * Checks if the code is running in a server-side environment
 * @returns true if running in server-side environment, false otherwise
 */
export const isServerSide = typeof window === "undefined";

/**
 * Returns the appropriate HTMLElement constructor based on the environment
 * @returns HTMLElement constructor for browser environment, HTMLElementShimForServer for server environment
 */
export const getHTMLElementConstructor = (): { new (): HTMLElement } => {
  if (isServerSide) {
    return HTMLElementShimForServer as unknown as { new (): HTMLElement };
  }

  return HTMLElement;
};
