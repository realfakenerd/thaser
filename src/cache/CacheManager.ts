import BaseCache from './BaseCache';
import GameEvents from '@thaser/core/events';
/**
 * The Cache Manager is the global cache owned and maintained by the Game instance.
 *
 * Various systems, such as the file Loader, rely on this cache in order to store the files
 * it has loaded. The manager itself doesn't store any files, but instead owns multiple BaseCache
 * instances, one per type of file. You can also add your own custom caches.
 */
export default class CacheManager {
  /**
   *
   * @param game A reference to the Phaser.Game instance that owns this CacheManager.
   */
  constructor(protected game: any) {
    this.game.events.once(GameEvents.DESTROY, this.destroy, this);
  }
  /**
   * A Cache storing all binary files, typically added via the Loader.
   */
  binary = new BaseCache();

  /**
   * A Cache storing all bitmap font data files, typically added via the Loader.
   * Only the font data is stored in this cache, the textures are part of the Texture Manager.
   */
  bitmapFont = new BaseCache();

  /**
   * A Cache storing all JSON data files, typically added via the Loader.
   */
  json = new BaseCache();

  /**
   * A Cache storing all physics data files, typically added via the Loader.
   */
  physics = new BaseCache();

  /**
   * A Cache storing all shader source files, typically added via the Loader.
   */
  shader = new BaseCache();

  /**
   * A Cache storing all non-streaming audio files, typically added via the Loader.
   */
  audio = new BaseCache();

  /**
   * A Cache storing all non-streaming video files, typically added via the Loader.
   */
  video = new BaseCache();

  /**
   * A Cache storing all text files, typically added via the Loader.
   */
  text = new BaseCache();

  /**
   * A Cache storing all html files, typically added via the Loader.
   */
  html = new BaseCache();

  /**
   * A Cache storing all WaveFront OBJ files, typically added via the Loader.
   */
  obj = new BaseCache();

  /**
   * A Cache storing all tilemap data files, typically added via the Loader.
   * Only the data is stored in this cache, the textures are part of the Texture Manager.
   */
  tilemap = new BaseCache();

  /**
   * A Cache storing all xml data files, typically added via the Loader.
   */
  xml = new BaseCache();

  /**
   * An object that contains your own custom BaseCache entries.
   * Add to this via the `addCustom` method.
   */
  custom: Record<string, BaseCache> = {};

  /**
   * Add your own custom Cache for storing your own files.
   * The cache will be available under `Cache.custom.key`.
   * The cache will only be created if the key is not already in use.
   * @param key The unique key of your custom cache.
   */
  addCustom(key: string) {
    if (!this.custom.hasOwnProperty(key)) {
      this.custom[key] = new BaseCache();
    }
    return this.custom[key];
  }

  /**
   * Removes all entries from all BaseCaches and destroys all custom caches.
   */
  destroy(): void {
    const keys = [
      'binary',
      'bitmapFont',
      'json',
      'physics',
      'shader',
      'audio',
      'video',
      'text',
      'html',
      'obj',
      'tilemap',
      'xml'
    ];

    let i = 0;
    for (i; i < keys.length; i++) {
      (this[keys[i] as keyof CacheManager] as BaseCache).destroy();
      this[keys[i] as keyof CacheManager] = null as any;
    }
    for (const key in this.custom) {
      this.custom[key].destroy();
    }
    this.custom = null as any;
    this.game = null as any;
  }
}
