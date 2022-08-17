import LoaderPlugin from './LoaderPlugin';

let types = {};

export default class FileTypesManager {
  /**
   * Static method called when a LoaderPlugin is created.
   *
   * Loops through the local types object and injects all of them as
   * properties into the LoaderPlugin instance.
   * @param loader The LoaderPlugin to install the types into.
   */
  static install(loader: LoaderPlugin): void {
    for (const key in types) {
      loader[key as keyof LoaderPlugin] = types[key as any];
    }
  }

  /**
   * Static method called directly by the File Types.
   *
   * The key is a reference to the function used to load the files via the Loader, i.e. `image`.
   * @param key The key that will be used as the method name in the LoaderPlugin.
   * @param factoryFunction The function that will be called when LoaderPlugin.key is invoked.
   */
  static register(key: string, factoryFunction: Function): void {
    types[key as any] = factoryFunction;
  }

  /**
   * Removed all associated file types.
   */
  static destroy(): void {
    types = {};
  }
}
