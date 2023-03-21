export interface SinCosTable {
  /**
   * The sine value.
   */
  sin: number;
  /**
   * The cosine value.
   */
  cos: number;
  /**
   * The length.
   */
  length: number;
}

export interface Vector2Like {
  /**
   * The x component.
   */
  x?: number;
  /**
   * The y component.
   */
  y?: number;
}

export interface Vector3Like {
  /**
   * The x component.
   */
  x?: number;
  /**
   * The y component.
   */
  y?: number;
  /**
   * The z component.
   */
  z?: number;
}

export interface Vector4Like {
  /**
   * The x component.
   */
  x?: number;
  /**
   * The y component.
   */
  y?: number;
  /**
   * The z component.
   */
  z?: number;
  /**
   * The w component.
   */
  w?: number;
}