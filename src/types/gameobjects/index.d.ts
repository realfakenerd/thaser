interface GameObjectConfig {
  /**
   * The x position of the Game Object.
   */
  x?: number | object;
  /**
   * The y position of the Game Object.
   */
  y?: number | object;
  /**
   * The depth of the GameObject.
   */
  depth?: number;
  /**
   * The horizontally flipped state of the Game Object.
   */
  flipX?: boolean;
  /**
   * The vertically flipped state of the Game Object.
   */
  flipY?: boolean;
  /**
   * The scale of the GameObject.
   */
  scale?: number | object;
  /**
   * The scroll factor of the GameObject.
   */
  scrollFactor?: number | object;
  /**
   * The rotation angle of the Game Object, in radians.
   */
  rotation?: number | object;
  /**
   * The rotation angle of the Game Object, in degrees.
   */
  angle?: number | object;
  /**
   * The alpha (opacity) of the Game Object.
   */
  alpha?: number | object;
  /**
   * The origin of the Game Object.
   */
  origin?: number | object;
  /**
   * The scale mode of the GameObject.
   */
  scaleMode?: number;
  /**
   * The blend mode of the GameObject.
   */
  blendMode?: number;
  /**
   * The visible state of the Game Object.
   */
  visible?: boolean;
  /**
   * Add the GameObject to the scene.
   */
  add?: boolean;
}

interface JSONGameObject {
    /**
     * The name of this Game Object.
     */
    name: string;
    /**
     * A textual representation of this Game Object, i.e. `sprite`.
     */
    type: string;
    /**
     * The x position of this Game Object.
     */
    x: number;
    /**
     * The y position of this Game Object.
     */
    y: number;
    /**
     * The scale of this Game Object
     */
    scale: object;
    /**
     * The horizontal scale of this Game Object.
     */
    "scale.x": number;
    /**
     * The vertical scale of this Game Object.
     */
    "scale.y": number;
    /**
     * The origin of this Game Object.
     */
    origin: object;
    /**
     * The horizontal origin of this Game Object.
     */
    "origin.x": number;
    /**
     * The vertical origin of this Game Object.
     */
    "origin.y": number;
    /**
     * The horizontally flipped state of the Game Object.
     */
    flipX: boolean;
    /**
     * The vertically flipped state of the Game Object.
     */
    flipY: boolean;
    /**
     * The angle of this Game Object in radians.
     */
    rotation: number;
    /**
     * The alpha value of the Game Object.
     */
    alpha: number;
    /**
     * The visible state of the Game Object.
     */
    visible: boolean;
    /**
     * The Scale Mode being used by this Game Object.
     */
    scaleMode: number;
    /**
     * Sets the Blend Mode being used by this Game Object.
     */
    blendMode: number | string;
    /**
     * The texture key of this Game Object.
     */
    textureKey: string;
    /**
     * The frame key of this Game Object.
     */
    frameKey: string;
    /**
     * The data of this Game Object.
     */
    data: object;
};