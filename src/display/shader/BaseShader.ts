/**
 * A BaseShader is a small resource class that contains the data required for a WebGL Shader to be created.
 *
 * It contains the raw source code to the fragment and vertex shader, as well as an object that defines
 * the uniforms the shader requires, if any.
 *
 * BaseShaders are stored in the Shader Cache, available in a Scene via `this.cache.shaders` and are referenced
 * by a unique key-based string. Retrieve them via `this.cache.shaders.get(key)`.
 *
 * BaseShaders are created automatically by the GLSL File Loader when loading an external shader resource.
 * They can also be created at runtime, allowing you to use dynamically generated shader source code.
 *
 * Default fragment and vertex source is used if not provided in the constructor, setting-up a basic shader,
 * suitable for debug rendering.
 */
export default class BaseShader {
  /**
   *
   * @param key The key of this shader. Must be unique within the shader cache.
   * @param fragmentSrc The fragment source for the shader.
   * @param vertexSrc The vertex source for the shader.
   * @param uniforms Optional object defining the uniforms the shader uses.
   */
  constructor(
    key: string,
    fragmentSrc?: string,
    vertexSrc?: string,
    uniforms: any = null
  ) {
    this.key = key;

    if (!fragmentSrc || fragmentSrc === '') {
      fragmentSrc = [
        'precision mediump float;',
        'uniform vec2 resolution;',
        'varying vec2 fragCoord;',
        'void main() {',
        '  vec2 uv = fragCoord / resolution.xy;',
        '  gl_FragColor = vec4(uv.xyx, 1.0);',
        '}'
      ].join('\n');
    }

    if (!vertexSrc || vertexSrc === '') {
      vertexSrc = [
        'precision mediump float;',

        'uniform mat4 uProjectionMatrix;',
        'uniform mat4 uViewMatrix;',
        'uniform vec2 uResolution;',

        'attribute vec2 inPosition;',

        'varying vec2 fragCoord;',
        'varying vec2 outTexCoord;',

        'void main() {',
        '  gl_Position = uProjectionMatrix * uViewMatrix * vec4(inPosition, 1.0, 1.0);',
        '  fragCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);',
        '  outTexCoord = vec2(inPosition.x / uResolution.x, fragCoord.y / uResolution.y);',
        '}'
      ].join('\n');
    }

    this.fragmentSrc = fragmentSrc;
    this.vertexSrc = vertexSrc;
    this.uniforms = uniforms;
  }

  /**
   * The key of this shader, unique within the shader cache of this Phaser game instance.
   */
  key: string;

  /**
   * The source code, as a string, of the fragment shader being used.
   */
  fragmentSrc: string;

  /**
   * The source code, as a string, of the vertex shader being used.
   */
  vertexSrc: string;

  /**
   * The default uniforms for this shader.
   */
  uniforms: any | null;
}
