import { CanvasPool } from '../display/canvas';

/**
 * Determines the canvas features of the browser running this Phaser Game instance.
 * These values are read-only and populated during the boot sequence of the game.
 * They are then referenced by internal game systems and are available for you to access
 * via `this.sys.game.device.canvasFeatures` from within any Scene.
 */
interface CanvasFeatures {
  /**
   * Set to true if the browser supports inversed alpha.
   */
  supportInverseAlpha: boolean;
  /**
   * Set to true if the browser supports new canvas blend modes.
   */
  supportNewBlendModes: boolean;
}

const canvasFeatures: CanvasFeatures = {
  supportInverseAlpha: false,
  supportNewBlendModes: false
};

function checkBlendMode() {
  const pngHead =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAABAQMAAADD8p2OAAAAA1BMVEX/';
  const pngEnd = 'AAAACklEQVQI12NgAAAAAgAB4iG8MwAAAABJRU5ErkJggg==';

  const magenta = new Image();

  magenta.onload = () => {
    const yellow = new Image();
    yellow.onload = () => {
      const canvas = CanvasPool.create(yellow, 6, 1);
      const context = canvas.getContext('2d')!;

      context.globalCompositeOperation = 'multiply';

      context.drawImage(magenta, 0, 0);
      context.drawImage(yellow, 2, 0);

      if (!context.getImageData(2, 0, 1, 1)) return false;

      const data = context.getImageData(2, 0, 1, 1).data;
      CanvasPool.remove(yellow);
      canvasFeatures.supportNewBlendModes =
        data[0] === 255 && data[1] === 0 && data[2] === 0;
    };
    yellow.src = pngHead + '/wCKxvRF' + pngEnd;
  };
  magenta.src = pngHead + 'AP8040a6' + pngEnd;
  return false;
}

function checkInverseAlpha(this: any) {
  const canvas = CanvasPool.create(this, 2, 1);
  const context = canvas.getContext('2d')!;

  context.fillStyle = 'rgba(10,20,30,0.5)';

  const s1 = context.getImageData(0, 0, 1, 1);
  if (s1 === null) return false;

  context.putImageData(s1, 1, 0);

  const s2 = context.getImageData(1, 0, 1, 1);
  return (
    s2.data[0] === s1.data[0] &&
    s2.data[1] === s1.data[1] &&
    s2.data[2] === s1.data[2] &&
    s2.data[3] === s1.data[3]
  );
}

function init(){
    // @ts-ignore
    if(typeof importScripts === 'function' && document !==undefined) {
        canvasFeatures.supportNewBlendModes = checkBlendMode();
        canvasFeatures.supportInverseAlpha = checkInverseAlpha();
    }

    return canvasFeatures;
}

export default init();