/**
 * Manages commercial licenses.
 * @ignore
 */
export class Activator {
  private static keys: Map<string, string> = new Map<string, string>();
  private static keyAddListeners: Array<() => void> = new Array<() => void>();

  /**
   * Add a license key
   * @param product product identifier.
   * @param key license key sent to you after purchase.
   */
  public static addKey(product: string, key: string): void {
    Activator.keys.set(product, key);
    Activator.keyAddListeners.forEach((listener) => {
      listener();
    });
  }

  /**
   * Add a function to be called when license key is added.
   * @param listener
   */
  public static addKeyAddListener(listener: () => void) {
    Activator.keyAddListeners.push(listener);
  }

  /**
   * Remove a function called when key is added.
   * @param listener
   */
  public static removeKeyAddListener(listener: () => void) {
    const li = Activator.keyAddListeners.indexOf(listener);
    if (li > -1) {
      Activator.keyAddListeners.splice(li, 1);
    }
  }

  /**
   * Returns true if the product is commercially licensed.
   * @param product product identifier.
   */
  public static isLicensed(product: string): boolean {
    // NOTE:
    // before removing or modifying this please consider supporting marker.js development
    // by visiting https://markerjs.com/ for details
    // thank you!
    if (Activator.keys.has(product)) {
      const keyRegex = new RegExp(
        `${product}-[A-Z][0-9]{3}-[A-Z][0-9]{3}-[0-9]{4}`,
        'i',
      );
      const key = Activator.keys.get(product);
      return key === undefined ? false : keyRegex.test(key);
    } else {
      return false;
    }
  }
}
