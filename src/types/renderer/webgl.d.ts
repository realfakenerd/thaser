import { Game } from "@thaser/core";

interface RenderTargetConfig {
  /**
   * A value between 0 and 1. Controls the size of this Render Target in relation to the Renderer. A value of 1 matches it. 0.5 makes the Render Target half the size of the renderer, etc.
   */
  scale?: number;
  /**
   * The minFilter mode of the texture. 0 is `LINEAR`, 1 is `NEAREST`.
   */
  minFilter?: number;
  /**
   * Controls if this Render Target is automatically cleared (via `gl.COLOR_BUFFER_BIT`) during the bind.
   */
  autoClear?: boolean;
  /**
   * The width of the Render Target. This is optional. If given it overrides the `scale` property.
   */
  width?: number;
  /**
   * The height of the Render Target. This is optional. If not given, it will be set to the same as the `width` value.
   */
  height?: number;
}

interface WebGLConst {
  /**
   * The data type of the attribute, i.e. `gl.BYTE`, `gl.SHORT`, `gl.UNSIGNED_BYTE`, `gl.FLOAT`, etc.
   */
  enum: GLenum;
  /**
   * The size, in bytes, of the data type.
   */
  size: number;
}

interface WebGLPipelineAttribute {
  /**
   * The name of the attribute as defined in the vertex shader.
   */
  name: string;
  /**
   * The number of components in the attribute, i.e. 1 for a float, 2 for a vec2, 3 for a vec3, etc.
   */
  size: number;
  /**
   * The data type of the attribute. Either `gl.BYTE`, `gl.SHORT`, `gl.UNSIGNED_BYTE`, `gl.UNSIGNED_SHORT` or `gl.FLOAT`.
   */
  type: GLenum;
  /**
   * The offset, in bytes, of this attribute data in the vertex array. Equivalent to `offsetof(vertex, attrib)` in C.
   */
  offset: number;
  /**
   * Should the attribute data be normalized?
   */
  normalized: boolean;
  /**
   * You should set this to `false` by default. The pipeline will enable it on boot.
   */
  enabled: boolean;
  /**
   * You should set this to `-1` by default. The pipeline will set it on boot.
   */
  location: number;
}

interface WebGLPipelineAttributeConfig {
  /**
   * The name of the attribute as defined in the vertex shader.
   */
  name: string;
  /**
   * The number of components in the attribute, i.e. 1 for a float, 2 for a vec2, 3 for a vec3, etc.
   */
  size: number;
  /**
   * The data type of the attribute, one of the `WEBGL_CONST` values, i.e. `WEBGL_CONST.FLOAT`, `WEBGL_CONST.UNSIGNED_BYTE`, etc.
   */
  type: WebGLConst;
  /**
   * Should the attribute data be normalized?
   */
  normalized?: boolean;
}

interface WebGLPipelineConfig {
  /**
   * The Phaser.Game instance that owns this pipeline.
   */
  game: Game;
  /**
   * The name of the pipeline.
   */
  name?: string;
  /**
   * How the primitives are rendered. The default value is GL_TRIANGLES. Here is the full list of rendering primitives: (https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/Constants).
   */
  topology?: GLenum;
  /**
   * The source code, as a string, for the vertex shader. If you need to assign multiple shaders, see the `shaders` property.
   */
  vertShader?: string;
  /**
   * The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support. If you need to assign multiple shaders, see the `shaders` property.
   */
  fragShader?: string;
  /**
   * The number of quads to hold in the batch. Defaults to `RenderConfig.batchSize`. This amount * 6 gives the vertex capacity.
   */
  batchSize?: number;
  /**
   * The size, in bytes, of a single entry in the vertex buffer. Defaults to Float32Array.BYTES_PER_ELEMENT * 6 + Uint8Array.BYTES_PER_ELEMENT * 4.
   */
  vertexSize?: number;
  /**
   * An optional Array or Typed Array of pre-calculated vertices data that is copied into the vertex data.
   */
  vertices?: number[] | Float32Array;
  /**
   * An array of shader attribute data. All shaders bound to this pipeline must use the same attributes.
   */
  attributes?: WebGLPipelineAttributeConfig[];
  /**
   * An array of shaders, all of which are created for this one pipeline. Uses the `vertShader`, `fragShader`, `attributes` and `uniforms` properties of this object as defaults.
   */
  shaders?: WebGLPipelineShaderConfig[];
  /**
   * Force the shader to use just a single sampler2d? Set for anything that extends the Single Pipeline.
   */
  forceZero?: boolean;
  /**
   * Create Render Targets for this pipeline. Can be a number, which determines the quantity, a boolean (sets quantity to 1), or an array of Render Target configuration objects.
   */
  renderTarget?:
    | boolean
    | number
    | RenderTargetConfig[];
}

interface WebGLPipelineShaderConfig {
  /**
   * The name of the shader. Doesn't have to be unique, but makes shader look-up easier if it is.
   */
  name?: string;
  /**
   * The source code, as a string, for the vertex shader. If not given, uses the `WebGLPipelineConfig.vertShader` property instead.
   */
  vertShader?: string;
  /**
   * The source code, as a string, for the fragment shader. Can include `%count%` and `%forloop%` declarations for multi-texture support. If not given, uses the `WebGLPipelineConfig.fragShader` property instead.
   */
  fragShader?: string;
  /**
   * An array of shader attribute data. All shaders bound to this pipeline must use the same attributes.
   */
  attributes?: WebGLPipelineAttributeConfig[];
}

interface WebGLPipelineUniformsConfig {
  /**
   * The name of the uniform as defined in the shader.
   */
  name: string;
  /**
   * The location of the uniform.
   */
  location: number;
  /**
   * The first cached value of the uniform.
   */
  value1?: number;
  /**
   * The first cached value of the uniform.
   */
  value2?: number;
  /**
   * The first cached value of the uniform.
   */
  value3?: number;
  /**
   * The first cached value of the uniform.
   */
  value4?: number;
}

interface WebGLTextureCompression {
  /**
   * Indicates if ASTC compression is supported (mostly iOS).
   */
  ASTC: object | undefined;
  /**
   * Indicates if ATC compression is supported.
   */
  ATC: object | undefined;
  /**
   * Indicates if BPTC compression is supported.
   */
  BPTC: object | undefined;
  /**
   * Indicates if ETC compression is supported (mostly Android).
   */
  ETC: object | undefined;
  /**
   * Indicates if ETC1 compression is supported (mostly Android).
   */
  ETC1: object | undefined;
  /**
   * Indicates the browser supports true color images (all browsers).
   */
  IMG: object | undefined;
  /**
   * Indicates if PVRTC compression is supported (mostly iOS).
   */
  PVRTC: object | undefined;
  /**
   * Indicates if RGTC compression is supported (mostly iOS).
   */
  RGTC: object | undefined;
  /**
   * Indicates if S3TC compression is supported on current device (mostly Windows).
   */
  S3TC: object | undefined;
  /**
   * Indicates if S3TCRGB compression is supported on current device (mostly Windows).
   */
  S3TCRGB: object | undefined;
}
