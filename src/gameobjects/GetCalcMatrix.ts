import GameObject from './GameObject';
import { TransformMatrix } from './components';

const tempMatrix1 = new TransformMatrix();
const tempMatrix2 = new TransformMatrix();
const tempMatrix3 = new TransformMatrix();

const result = {
  camera: tempMatrix1,
  sprite: tempMatrix2,
  calc: tempMatrix3
};

/**
 * Calculates the Transform Matrix of the given Game Object and Camera, factoring in
 * the parent matrix if provided.
 *
 * Note that the object this results contains _references_ to the Transform Matrices,
 * not new instances of them. Therefore, you should use their values immediately, or
 * copy them to your own matrix, as they will be replaced as soon as another Game
 * Object is rendered.
 * @param src The Game Object to calculate the transform matrix for.
 * @param camera The camera being used to render the Game Object.
 * @param parentMatrix The transform matrix of the parent container, if any.
 */
function GetCalcMatrix(
  src: GameObject,
  camera: Phaser.Cameras.Scene2D.Camera,
  parentMatrix?: TransformMatrix
) {
  const camMatrix = tempMatrix1;
  const spriteMatrix = tempMatrix2;
  const calcMatrix = tempMatrix3;

  spriteMatrix.applyITRS(src.x, src.y, src.rotation, src.scaleX, src.scaleY);

  camMatrix.copyFrom(camera.matrix);

  if (parentMatrix) {
    //  Multiply the camera by the parent matrix
    camMatrix.multiplyWithOffset(
      parentMatrix,
      -camera.scrollX * src.scrollFactorX,
      -camera.scrollY * src.scrollFactorY
    );

    //  Undo the camera scroll
    spriteMatrix.e = src.x;
    spriteMatrix.f = src.y;
  } else {
    spriteMatrix.e -= camera.scrollX * src.scrollFactorX;
    spriteMatrix.f -= camera.scrollY * src.scrollFactorY;
  }

  //  Multiply by the Sprite matrix, store result in calcMatrix
  camMatrix.multiply(spriteMatrix, calcMatrix);

  return result;
}

export default GetCalcMatrix;
