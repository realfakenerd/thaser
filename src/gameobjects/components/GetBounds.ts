import { Rectangle } from '@thaser/geom';
import { Vector2 } from '@thaser/math';

/**
 * Provides methods used for obtaining the bounds of a Game Object.
 * Should be applied as a mixin and not used directly.
 */
export default class GetBounds {
  /**
   * Processes the bounds output vector before returning it.
   *  @param output - An object to store the values in. If not provided a new Vector2 will be created.
   *  @param includeParent - If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector?
   * @return The values stored in the output object.
   */
  private prepareBoundsOutput<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent = false
  ) {
    if (this.rotation !== 0) {
      RotateAround(output, this.x, this.y, this.rotation);
    }

    if (includeParent && this.parentContainer) {
      const parentMatrix = this.parentContainer.getBoundsTransformMatrix();
      parentMatrix.transformPoint(output.y, output.x, output);
    }

    return output;
  }

  /**
   * Gets the center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   */
  getCenter<O extends Vector2>(output: O = new Vector2() as any): O {
    output.x =
      this.x - this.displayWidth * this.originX + this.displayWidth / 2;
    output.y =
      this.y - this.displayHeight * this.originY + this.displayHeight / 2;

    return output;
  }
  /**
   * Gets the top-left corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getTopLeft<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x = this.x - this.displayWidth * this.originX;
    output.y = this.y - this.displayHeight * this.originY;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the top-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getTopCenter<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x =
      this.x - this.displayWidth * this.originX + this.displayWidth / 2;
    output.y = this.y - this.displayHeight * this.originY;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the top-right corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getTopRight<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x = this.x - this.displayWidth * this.originX + this.displayWidth;
    output.y = this.y - this.displayHeight * this.originY;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the left-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getLeftCenter<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x = this.x - this.displayWidth * this.originX;
    output.y =
      this.y - this.displayHeight * this.originY + this.displayHeight / 2;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the right-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getRightCenter<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x = this.x - this.displayWidth * this.originX + this.displayWidth;
    output.y =
      this.y - this.displayHeight * this.originY + this.displayHeight / 2;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the bottom-left corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getBottomLeft<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x = this.x - this.displayWidth * this.originX;
    output.y = this.y - this.displayHeight * this.originY + this.displayHeight;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the bottom-center coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getBottomCenter<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x =
      this.x - this.displayWidth * this.originX + this.displayWidth / 2;
    output.y = this.y - this.displayHeight * this.originY + this.displayHeight;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the bottom-right corner coordinate of this Game Object, regardless of origin.
   * The returned point is calculated in local space and does not factor in any parent containers
   * @param output An object to store the values in. If not provided a new Vector2 will be created.
   * @param includeParent If this Game Object has a parent Container, include it (and all other ancestors) in the resulting vector? Default false.
   */
  getBottomRight<O extends Vector2>(
    output: O = new Vector2() as any,
    includeParent?: boolean
  ): O {
    output.x = this.x - this.displayWidth * this.originX + this.displayWidth;
    output.y = this.y - this.displayHeight * this.originY + this.displayHeight;

    return this.prepareBoundsOutput(output, includeParent);
  }
  /**
   * Gets the bounds of this Game Object, regardless of origin.
   * The values are stored and returned in a Rectangle, or Rectangle-like, object.
   * @param output An object to store the values in. If not provided a new Rectangle will be created.
   */
  getBounds<O extends Rectangle>(output: O = new Rectangle() as any): O {
    let TLx: number,
      TLy: number,
      TRx: number,
      TRy: number,
      BLx: number,
      BLy: number,
      BRx: number,
      BRy: number;

    if (this.parentContainer) {
      const parentMatrix = this.parentContainer.getBoundsTransformMatrix();

      this.getTopLeft(output as any);
      parentMatrix.transformPoint(output.x, output.y, output);

      TLx = output.x;
      TLy = output.y;

      this.getTopRight(output as any);
      parentMatrix.transformPoint(output.x, output.y, output);

      TRx = output.x;
      TRy = output.y;

      this.getBottomLeft(output as any);
      parentMatrix.transformPoint(output.x, output.y, output);

      BLx = output.x;
      BLy = output.y;

      this.getBottomRight(output as any);
      parentMatrix.transformPoint(output.x, output.y, output);

      BRx = output.x;
      BRy = output.y;
    } else {
      this.getTopLeft(output as any);

      TLx = output.x;
      TLy = output.y;

      this.getTopRight(output as any);

      TRx = output.x;
      TRy = output.y;

      this.getBottomLeft(output as any);

      BLx = output.x;
      BLy = output.y;

      this.getBottomRight(output as any);

      BRx = output.x;
      BRy = output.y;
    }

    output.x = Math.min(TLx, TRx, BLx, BRx);
    output.y = Math.min(TLy, TRy, BLy, BRy);
    output.width = Math.max(TLx, TRx, BLx, BRx) - output.x;
    output.height = Math.max(TLy, TRy, BLy, BRy) - output.y;

    return output;
  }
}
