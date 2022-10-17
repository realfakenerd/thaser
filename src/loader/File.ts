import { BaseCache } from '@thaser/cache';
import CONST from './const';
import { FileConfig, XHRSettingsObject } from '../types/loader';
import { GetFastValue } from '@utils';
import LoaderPlugin from './LoaderPlugin';
import GetURL from './GetURL';
import XHRLoader from './XHRLoader';
import XHRSettings from './XHRSettings';
import MergeXHRSettings from './MergeXHRSettings';
import MultiFile from './Multifile';
/**
 * The base File class used by all File Types that the Loader can support.
 * You shouldn't create an instance of a File directly, but should extend it with your own class, setting a custom type and processing methods.
 */
export default class File {
  /**
   * @param loader The Loader that is going to load this File.
   * @param fileConfig The file configuration object, as created by the file type.
   */
  constructor(public loader: LoaderPlugin, fileConfig: FileConfig) {
    this.cache = GetFastValue(fileConfig, 'cache', false);
    this.type = GetFastValue(fileConfig, 'type', false);

    if (!this.type) {
      throw new Error('Invalid File type: ' + this.type);
    }

    this.key = GetFastValue(fileConfig, 'key', false);

    const loadKey = this.key;

    if (loader.prefix && loader.prefix !== '') {
      this.key = loader.prefix + loadKey;
    }

    if (!this.key) {
      throw new Error(`Invalide File key: ${this.key}`);
    }

    let url = GetFastValue(fileConfig, 'url');
    if (url === undefined) {
      url =
        loader.path + loadKey + '.' + GetFastValue(fileConfig, 'extension', '');
    } else if (
      typeof url === 'string' &&
      !url.match(/^(?:blob:|data:|capacitor:\/\/|http:\/\/|https:\/\/|\/\/)/)
    ) {
      url = loader.path + url;
    }

    this.url = url;

    this.xhrSettings = XHRSettings(
      GetFastValue(fileConfig, 'responseType', undefined)
    );
    if (GetFastValue(fileConfig, 'xhrSettings', false)) {
      this.xhrSettings = MergeXHRSettings(
        this.xhrSettings,
        GetFastValue(fileConfig, 'xhrSettings', {})
      );
    }

    this.state =
      typeof this.url === 'function'
        ? CONST.FILE_POPULATED
        : CONST.FILE_PENDING;
    this.config = GetFastValue(fileConfig, 'config', {});
  }

  /**
   * A reference to the Cache, or Texture Manager, that is going to store this file if it loads.
   */
  cache: BaseCache | TextureManager;

  /**
   * The file type string (image, json, etc) for sorting within the Loader.
   */
  type: string;

  /**
   * Unique cache key (unique within its file type)
   */
  key: string;

  /**
   * The URL of the file, not including baseURL.
   *
   * Automatically has Loader.path prepended to it if a string.
   *
   * Can also be a JavaScript Object, such as the results of parsing JSON data.
   */
  url: object | string;

  /**
   * The final URL this file will load from, including baseURL and path.
   * Set automatically when the Loader calls 'load' on this file.
   */
  src: string = '';

  /**
   * The merged XHRSettings for this file.
   */
  xhrSettings: XHRSettingsObject;

  /**
   * The XMLHttpRequest instance (as created by XHR Loader) that is loading this File.
   */
  xhrLoader: XMLHttpRequest | null = null;

  /**
   * The current state of the file. One of the FILE_CONST values.
   */
  state: number;

  /**
   * The total size of this file.
   * Set by onProgress and only if loading via XHR.
   */
  bytesTotal: number = 0;

  /**
   * Updated as the file loads.
   * Only set if loading via XHR.
   */
  bytesLoaded: number = -1;

  /**
   * A percentage value between 0 and 1 indicating how much of this file has loaded.
   * Only set if loading via XHR.
   */
  percentComplete: number = -1;

  /**
   * For CORs based loading.
   * If this is undefined then the File will check BaseLoader.crossOrigin and use that (if set)
   */
  crossOrigin: string | undefined = undefined;

  /**
   * The processed file data, stored here after the file has loaded.
   */
  data: any = undefined;

  /**
   * A config object that can be used by file types to store transitional data.
   */
  config: any;

  /**
   * If this is a multipart file, i.e. an atlas and its json together, then this is a reference
   * to the parent MultiFile. Set and used internally by the Loader or specific file types.
   */
  multiFile!: MultiFile;

  /**
   * Does this file have an associated linked file? Such as an image and a normal map.
   * Atlases and Bitmap Fonts use the multiFile, because those files need loading together but aren't
   * actually bound by data, where-as a linkFile is.
   */
  linkFile!: File;

  /**
   * Links this File with another, so they depend upon each other for loading and processing.
   * @param fileB The file to link to this one.
   */
  setLink(fileB: File): void {
    this.linkFile = fileB;
    fileB.linkFile = this;
  }

  /**
   * Resets the XHRLoader instance this file is using.
   */
  resetXHR(): void {
    if (this.xhrLoader) {
      this.xhrLoader.onload = undefined as any;
      this.xhrLoader.onerror = undefined as any;
      this.xhrLoader.onprogress = undefined as any;
    }
  }

  /**
   * Called by the Loader, starts the actual file downloading.
   * During the load the methods onLoad, onError and onProgress are called, based on the XHR events.
   * You shouldn't normally call this method directly, it's meant to be invoked by the Loader.
   */
  load(): void {
    if (this.state === CONST.FILE_POPULATED) {
      this.loader.nextFile(this, true);
    } else {
      this.state = CONST.FILE_LOADING;
      this.src = GetURL(this, this.loader.baseURL);
      if (this.src.indexOf('data:') === 0) {
        console.warn('Local data URIs are not supported: ' + this.key);
      } else {
        this.xhrLoader = XHRLoader(this, this.loader.xhr);
      }
    }
  }

  /**
   * Called when the file finishes loading, is sent a DOM ProgressEvent.
   * @param xhr The XMLHttpRequest that caused this onload event.
   * @param event The DOM ProgressEvent that resulted from this load.
   */
  onLoad(xhr: XMLHttpRequest, event: ProgressEvent): void {
    const isLocalFile =
      xhr.responseURL &&
      this.loader.localSchemes.some(
        scheme => xhr.responseURL.indexOf(scheme) === 0
      );

    const localFileOk = isLocalFile && (event.target as any).status === 0;
    let success =
      !(event.target && (event.target as any).status !== 200) || localFileOk;

    if (xhr.readyState === 4 && xhr.status >= 400 && xhr.status <= 599) {
      success = false;
    }

    this.state = CONST.FILE_LOADED;

    this.resetXHR();
    this.loader.nextFile(this, success as boolean);
  }

  /**
   * Called if the file errors while loading, is sent a DOM ProgressEvent.
   * @param xhr The XMLHttpRequest that caused this onload event.
   * @param event The DOM ProgressEvent that resulted from this error.
   */
  onError(xhr: XMLHttpRequest, event: ProgressEvent): void {
    this.resetXHR();
    this.loader.nextFile(this,false);
  }

  /**
   * Called during the file load progress. Is sent a DOM ProgressEvent.
   * @param event The DOM ProgressEvent.
   */
  onProgress(event: ProgressEvent): void {
    if(event.lengthComputable) {
      this.bytesLoaded = event.loaded;
      this.bytesTotal = event.total;

      this.percentComplete = Math.min((this.bytesLoaded / this.bytesTotal), 1);
      this.loader.emit(Events.FILe_PROGRESS, this, this.percentComplete);
    }
  }

  /**
   * Usually overridden by the FileTypes and is called by Loader.nextFile.
   * This method controls what extra work this File does with its loaded data, for example a JSON file will parse itself during this stage.
   */
  onProcess(): void {
    this.state = CONST.FILE_PROCESSING;
    this.onProcessComplete();
  }

  /**
   * Called when the File has completed processing.
   * Checks on the state of its multifile, if set.
   */
  onProcessComplete(): void {
    this.state = CONST.FILE_COMPLETE;
    if(this.multiFile) {
      this.multiFile.onFileComplete(this);
    }
    this.loader.fileProcessComplete(this);
  }

  /**
   * Called when the File has completed processing but it generated an error.
   * Checks on the state of its multifile, if set.
   */
  onProcessError(): void {
    console.error('Failed to process file: %s "%s"', this.type, this.key);
    
    this.state = CONST.FILE_ERRORED;

    if(this.multiFile) {
      this.multiFile.onFileFailed(this);
    }

    this.loader.fileProcessComplete(this);
  }

  /**
   * Checks if a key matching the one used by this file exists in the target Cache or not.
   * This is called automatically by the LoaderPlugin to decide if the file can be safely
   * loaded or will conflict.
   */
  hasCacheConflict(): boolean {
    return (this.cache && this.cache.exist(this.key));
  }

  /**
   * Adds this file to its target cache upon successful loading and processing.
   * This method is often overridden by specific file types.
   */
  addToCache(): void {
    if(this.cache && this.data) {
      this.cache.add(this.key, this.data);
    }
  }

  /**
   * Called once the file has been added to its cache and is now ready for deletion from the Loader.
   * It will emit a `filecomplete` event from the LoaderPlugin.
   */
  pendingDestroy(data = this.data): void {
    if(this.state === CONST.FILE_PENDING_DESTROY) return;

    const key = this.key;
    const type = this.type;

    this.loader.emit(Events.FILE_COMPLETE, key, type, data);
    this.loader.emit(Events.FILE_KEY_COMPLETE + type + '-' + key, key, type, data);

    this.loader.flagForRemoval(this);
    this.state = CONST.FILE_PENDING_DESTROY;
  }

  /**
   * Destroy this File and any references it holds.
   */
  destroy(): void {
    this.loader = null as any;
    this.cache = null;
    this.xhrSettings = null as any;
    this.multiFile = null as any;
    this.data = null;
  }

  /**
   * Static method for creating object URL using URL API and setting it as image 'src' attribute.
   * If URL API is not supported (usually on old browsers) it falls back to creating Base64 encoded url using FileReader.
   * @param image Image object which 'src' attribute should be set to object URL.
   * @param blob A Blob object to create an object URL for.
   * @param defaultType Default mime type used if blob type is not available.
   */
  static createObjectURL(
    image: HTMLImageElement,
    blob: Blob,
    defaultType: string
  ): void {
    if(typeof URL === 'function') {
      image.src = URL.createObjectURL(blob);
    } else {
      const reader = new FileReader();
      reader.onload = () => {
        image.removeAttribute('crossOrigin');
        image.src = 'data:' + (blob.type || defaultType) + ';base64,' + (reader.result as any).split(',')[1];
      }

      reader.onerror = image.onerror;
      reader.readAsDataURL(blob);
    }
  }

  /**
   * Static method for releasing an existing object URL which was previously created
   * by calling {@link File#createObjectURL} method.
   * @param image Image object which 'src' attribute should be revoked.
   */
  static revokeObjectURL(image: HTMLImageElement): void {
    if(typeof URL === 'function') {
      URL.revokeObjectURL(image.src);
    }
  }
}
