import CONST from './const';
import File from './File';
import LoaderPlugin from './LoaderPlugin';
/**
 * A MultiFile is a special kind of parent that contains two, or more, Files as children and looks after
 * the loading and processing of them all. It is commonly extended and used as a base class for file types such as AtlasJSON or BitmapFont.
 *
 * You shouldn't create an instance of a MultiFile directly, but should extend it with your own class, setting a custom type and processing methods.
 */
export default class MultiFile {
  /**
   *
   * @param loader The Loader that is going to load this File.
   * @param type The file type string for sorting within the Loader.
   * @param key The key of the file within the loader.
   * @param files An array of Files that make-up this MultiFile.
   */
  constructor(loader: LoaderPlugin, type: string, key: string, files: File[]) {
    const finalFiles: File[] = [];

    files.forEach(file => {
      if (file) {
        finalFiles.push(file);
      }
    });

    this.loader = loader;
    this.type = type;
    this.key = key;

    this.files = finalFiles;

    this.multiKeyIndex = loader.multiKeyIndex++;

    this.pending = finalFiles.length;

    this.baseURL = loader.baseURL;
    this.path = loader.path;
    this.prefix = loader.prefix;

    let i = 0;
    for (i; i < finalFiles.length; i++) {
      finalFiles[i].multiFile = this;
    }
  }

  /**
   * A reference to the Loader that is going to load this file.
   */
  loader: LoaderPlugin;

  /**
   * The file type string for sorting within the Loader.
   */
  type: string;

  /**
   * Unique cache key (unique within its file type)
   */
  key: string;

  /**
   * The current index being used by multi-file loaders to avoid key clashes.
   */
  private multiKeyIndex;

  /**
   * Array of files that make up this MultiFile.
   */
  files: File[];

  /**
   * The current state of the file. One of the FILE_CONST values.
   */
  state: number = CONST.FILE_PENDING;

  /**
   * The completion status of this MultiFile.
   */
  complete: boolean = false;

  /**
   * The number of files to load.
   */
  pending: number;

  /**
   * The number of files that failed to load.
   */
  failed: number = 0;

  /**
   * A storage container for transient data that the loading files need.
   */
  config: any = {};

  /**
   * A reference to the Loaders baseURL at the time this MultiFile was created.
   * Used to populate child-files.
   */
  baseURL: string;

  /**
   * A reference to the Loaders path at the time this MultiFile was created.
   * Used to populate child-files.
   */
  path: string;

  /**
   * A reference to the Loaders prefix at the time this MultiFile was created.
   * Used to populate child-files.
   */
  prefix: string;

  /**
   * Checks if this MultiFile is ready to process its children or not.
   */
  isReadyToProcess(): boolean {
    return this.pending === 0 && this.failed === 0 && !this.complete;
  }

  /**
   * Adds another child to this MultiFile, increases the pending count and resets the completion status.
   * @param file The File to add to this MultiFile.
   */
  addToMultiFile(file: File): MultiFile {
    this.files.push(file);
    file.multiFile = this;
    this.pending++;
    this.complete = false;
    return this;
  }

  /**
   * Called by each File when it finishes loading.
   * @param file The File that has completed processing.
   */
  onFileComplete(file: File): void {
    const index = this.files.indexOf(file);
    if (index !== -1) {
      this.pending--;
    }
  }

  /**
   * Called by each File that fails to load.
   * @param file The File that has failed to load.
   */
  onFileFailed(file: File): void {
    const index = this.files.indexOf(file);
    if (index !== -1) {
      this.failed++;
      console.error(
        `Filex failed: ${this.type} ${this.key} (via ${file.type} ${file.key})`
      );
    }
  }

  /**
   * Called once all children of this multi file have been added to their caches and is now
   * ready for deletion from the Loader.
   *
   * It will emit a `filecomplete` event from the LoaderPlugin.
   */
  pendingDestroy(): void {
    if (this.state === CONST.FILE_PENDING_DESTROY) return;

    const key = this.key;
    const type = this.type;

    this.loader.emit(Events.FILE_COMPLETE, key, type);
    this.loader.emit(Events.FILE_KEY_COMPLETE + type + '-' + key, key, type);

    this.loader.flagForRemoval(this);

    let i = 0;
    for (i; i < this.files.length; i++) {
      this.files[i].pendingDestroy();
    }
    this.state = CONST.FILE_PENDING_DESTROY;
  }

  /**
   * Destroy this Multi File and any references it holds.
   */
  destroy(): void{
    this.loader = null as any;
    this.files = null as any;
    this.config = null;
  }
}
