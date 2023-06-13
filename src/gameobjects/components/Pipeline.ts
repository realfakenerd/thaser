import {
  PIPELINE_CONST,
  PostFXPipeline,
  WebGLPipeline,
  WebGLRenderer
} from '@thaser/renderer/webgl';
import { Scene } from '@thaser/scene';
import { DeepCopy, SpliceOne } from '@thaser/utils';

/**
 * Provides methods used for setting the WebGL rendering pipeline of a Game Object.
 */
export default class Pipeline {
  /**
   * The initial WebGL pipeline of this Game Object.
   *
   * If you call `resetPipeline` on this Game Object, the pipeline is reset to this default.
   */
  static defaultPipeline: WebGLPipeline | null = null;
  /**
   * The current WebGL pipeline of this Game Object.
   */
  static pipeline: WebGLPipeline | null = null;
  /**
   * Does this Game Object have any Post Pipelines set?
   */
  static hasPostPipeline = false;
  /**
   * The WebGL Post FX Pipelines this Game Object uses for post-render effects.
   *
   * The pipelines are processed in the order in which they appear in this array.
   *
   * If you modify this array directly, be sure to set the
   * `hasPostPipeline` property accordingly.
   */
  static postPipelines: PostFXPipeline[] | null = null;
  /**
   * An object to store pipeline specific data in, to be read by the pipelines this Game Object uses.
   */
  static pipelineData: Record<any, any> | null = null;

  private static scene: Scene;

  /**
   * Sets the initial WebGL Pipeline of this Game Object.
   *
   * This should only be called during the instantiation of the Game Object. After that, use `setPipeline`.
   * @param pipeline Either the string-based name of the pipeline, or a pipeline instance to set.
   */
  static initPipeline(
    pipeline = PIPELINE_CONST.MULTI_PIPELINE as string | WebGLPipeline
  ) {
    const renderer = this.scene.sys.renderer;
    if (!renderer) return false;

    const pipelines = (renderer as WebGLRenderer).pipelines;

    this.postPipelines = [];
    this.pipelineData = {};

    if (pipelines) {
      const instance = pipelines.get(pipeline);
      if (instance) {
        this.defaultPipeline = instance;
        this.pipeline = instance;
        return true;
      }
    }

    return false;
  }
  /**
   * Sets the main WebGL Pipeline of this Game Object.
   *
   * Also sets the `pipelineData` property, if the parameter is given.
   *
   * Both the pipeline and post pipelines share the same pipeline data object.
   * @param pipeline Either the string-based name of the pipeline, or a pipeline instance to set.
   * @param pipelineData Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
   * @param copyData Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead. Default true.
   */
  static setPipeline(
    pipeline: string | WebGLPipeline,
    pipelineData?: Record<any, any>,
    copyData?: boolean
  ) {
    const renderer = this.scene.sys.renderer;
    if (!renderer) return this;
    const pipelines = (renderer as WebGLRenderer).pipelines;
    if (pipelines) {
      const instance = pipelines.get(pipeline);
      if (instance) {
        this.pipeline = instance;
      }
      if (pipelineData) {
        this.pipelineData = copyData
          ? DeepCopy(pipelineData)
          : this.pipelineData;
      }
    }

    return this;
  }
  /**
   * Sets one, or more, Post Pipelines on this Game Object.
   *
   * Post Pipelines are invoked after this Game Object has rendered to its target and
   * are commonly used for post-fx.
   *
   * The post pipelines are appended to the `postPipelines` array belonging to this
   * Game Object. When the renderer processes this Game Object, it iterates through the post
   * pipelines in the order in which they appear in the array. If you are stacking together
   * multiple effects, be aware that the order is important.
   *
   * If you call this method multiple times, the new pipelines will be appended to any existing
   * post pipelines already set. Use the `resetPostPipeline` method to clear them first, if required.
   *
   * You can optionally also set the `pipelineData` property, if the parameter is given.
   *
   * Both the pipeline and post pipelines share the pipeline data object together.
   * @param pipelines Either the string-based name of the pipeline, or a pipeline instance, or class, or an array of them.
   * @param pipelineData Optional pipeline data object that is _deep copied_ into the `pipelineData` property of this Game Object.
   * @param copyData Should the pipeline data object be _deep copied_ into the `pipelineData` property of this Game Object? If `false` it will be set by reference instead. Default true.
   */
  static setPostPipeline(
    pipelines:
      | string
      | string[]
      | Function
      | Function[]
      | PostFXPipeline
      | PostFXPipeline[],
    pipelineData?: Record<any, any>,
    copyData?: boolean
  ) {
    const renderer = this.scene.sys.renderer;

    if (!renderer) return this;

    const pipelineManager = (renderer as WebGLRenderer).pipelines;

    if (pipelineManager) {
      if (!Array.isArray(pipelines)) {
        pipelines = [pipelines as PostFXPipeline];
      }

      let i = 0;
      for (i; i < pipelines.length; i++) {
        const instance = pipelineManager.getPostPipeline(pipelines[i], this);
        if (instance) {
          this.postPipelines?.push(instance);
        }
      }

      if (pipelineData) {
        this.pipelineData = copyData ? DeepCopy(pipelineData) : pipelineData;
      }
    }

    this.hasPostPipeline = this.postPipelines!.length > 0;
    return this;
  }
  /**
   * Adds an entry to the `pipelineData` object belonging to this Game Object.
   *
   * If the 'key' already exists, its value is updated. If it doesn't exist, it is created.
   *
   * If `value` is undefined, and `key` exists, `key` is removed from the data object.
   *
   * Both the pipeline and post pipelines share the pipeline data object together.
   * @param key The key of the pipeline data to set, update, or delete.
   * @param value The value to be set with the key. If `undefined` then `key` will be deleted from the object.
   */
  static setPipelineData(key: string, value?: any) {
    const data = this.pipelineData!;

    if (value === undefined) {
      delete data[key];
    } else {
      data[key] = value;
    }

    return this;
  }
  /**
   * Gets a Post Pipeline instance from this Game Object, based on the given name, and returns it.
   * @param pipeline The string-based name of the pipeline, or a pipeline class.
   */
  static getPostPipeline(
    pipeline: string | Function | PostFXPipeline
  ): PostFXPipeline | PostFXPipeline[] {
    const pipelines = this.postPipelines!;

    const results = [];
    let i = 0;
    for (i; i < pipelines.length; i++) {
      const instance = pipelines[i];

      if (
        (typeof pipeline === 'string' && instance.name === pipeline) ||
        instance instanceof (pipeline as Function)
      ) {
        results.push(instance);
      }
    }

    return results.length === 1 ? results[0] : results;
  }
  /**
   * Resets the WebGL Pipeline of this Game Object back to the default it was created with.
   * @param resetPostPipelines Reset all of the post pipelines? Default false.
   * @param resetData Reset the `pipelineData` object to being an empty object? Default false.
   */
  static resetPipeline(resetPostPipelines = false, resetData = false) {
    this.pipeline = this.defaultPipeline!;

    if (resetPostPipelines) {
      this.postPipelines = [];
      this.hasPostPipeline = false;
    }

    if (resetData) {
      this.pipelineData = {};
    }

    return this.pipeline !== null;
  }
  /**
   * Resets the WebGL Post Pipelines of this Game Object. It does this by calling
   * the `destroy` method on each post pipeline and then clearing the local array.
   * @param resetData Reset the `pipelineData` object to being an empty object? Default false.
   */
  static resetPostPipeline(resetData = false) {
    const pipelines = this.postPipelines!;

    let i = 0;
    for (i; i < pipelines.length; i++) {
      pipelines[i].destroy();
    }

    this.postPipelines = [];
    this.hasPostPipeline = false;

    if (resetData) {
      this.pipelineData = {};
    }
  }
  /**
   * Removes a type of Post Pipeline instances from this Game Object, based on the given name, and destroys them.
   *
   * If you wish to remove all Post Pipelines use the `resetPostPipeline` method instead.
   * @param pipeline The string-based name of the pipeline, or a pipeline class.
   */
  static removePostPipeline(pipeline: string | PostFXPipeline) {
    const pipelines = this.postPipelines!;

    let i = pipelines.length - 1;
    for (i; i >= 0; i--) {
      const instance = pipelines[i];

      if (
        (typeof pipeline === 'string' && instance.name === pipeline) ||
        (typeof pipeline !== 'string' &&
          instance instanceof (pipeline as unknown as Function))
      ) {
        instance.destroy();

        SpliceOne(pipelines, i);
      }
    }

    this.hasPostPipeline = this.postPipelines!.length > 0;

    return this;
  }
  /**
   * Gets the name of the WebGL Pipeline this Game Object is currently using.
   */
  static getPipelineName() {
    return this.pipeline?.name;
  }
}
