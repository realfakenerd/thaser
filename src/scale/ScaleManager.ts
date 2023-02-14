import { Events as GameEvents, Game } from '@thaser/core';
import { Fullscreen } from '@thaser/device';
import { GetInnerHeight, GetScreenOrientation, GetTarget } from '@thaser/dom';
import { EventEmitter } from '@thaser/events';
import { Rectangle } from '@thaser/geom';
import { SnapFloor, Vector2 } from '@thaser/math';
import { Size } from '@thaser/structs';
import { GameConfig } from '@thaser/types/core';
import { NOOP } from '@utils';
import { CENTER, ORIENTATION, SCALE_MODE, ZOOM } from './const';
import Events from './events';

/**
 * The Scale Manager handles the scaling, resizing and alignment of the game canvas.
 *
 * The way scaling is handled is by setting the game canvas to a fixed size, which is defined in the
 * game configuration. You also define the parent container in the game config. If no parent is given,
 * it will default to using the document body. The Scale Manager will then look at the available space
 * within the _parent_ and scale the canvas accordingly. Scaling is handled by setting the canvas CSS
 * width and height properties, leaving the width and height of the canvas element itself untouched.
 * Scaling is therefore achieved by keeping the core canvas the same size and 'stretching'
 * it via its CSS properties. This gives the same result and speed as using the `transform-scale` CSS
 * property, without the need for browser prefix handling.
 *
 * The calculations for the scale are heavily influenced by the bounding parent size, which is the computed
 * dimensions of the canvas's parent. The CSS rules of the parent element play an important role in the
 * operation of the Scale Manager. For example, if the parent has no defined width or height, then actions
 * like auto-centering will fail to achieve the required result. The Scale Manager works in tandem with the
 * CSS you set-up on the page hosting your game, rather than taking control of it.
 *
 * #### Parent and Display canvas containment guidelines:
 *
 * - Style the Parent element (of the game canvas) to control the Parent size and thus the games size and layout.
 *
 * - The Parent element's CSS styles should _effectively_ apply maximum (and minimum) bounding behavior.
 *
 * - The Parent element should _not_ apply a padding as this is not accounted for.
 *   If a padding is required apply it to the Parent's parent or apply a margin to the Parent.
 *   If you need to add a border, margin or any other CSS around your game container, then use a parent element and
 *   apply the CSS to this instead, otherwise you'll be constantly resizing the shape of the game container.
 *
 * - The Display canvas layout CSS styles (i.e. margins, size) should not be altered / specified as
 *   they may be updated by the Scale Manager.
 *
 * #### Scale Modes
 *
 * The way the scaling is handled is determined by the `scaleMode` property. The default is `NONE`,
 * which prevents Phaser from scaling or touching the canvas, or its parent, at all. In this mode, you are
 * responsible for all scaling. The other scaling modes afford you automatic scaling.
 *
 * If you wish to scale your game so that it always fits into the available space within the parent, you
 * should use the scale mode `FIT`. Look at the documentation for other scale modes to see what options are
 * available. Here is a basic config showing how to set this scale mode:
 *
 * ```javascript
 * scale: {
 *     parent: 'yourgamediv',
 *     mode: Phaser.Scale.FIT,
 *     width: 800,
 *     height: 600
 * }
 * ```
 *
 * Place the `scale` config object within your game config.
 *
 * If you wish for the canvas to be resized directly, so that the canvas itself fills the available space
 * (i.e. it isn't scaled, it's resized) then use the `RESIZE` scale mode. This will give you a 1:1 mapping
 * of canvas pixels to game size. In this mode CSS isn't used to scale the canvas, it's literally adjusted
 * to fill all available space within the parent. You should be extremely careful about the size of the
 * canvas you're creating when doing this, as the larger the area, the more work the GPU has to do and it's
 * very easy to hit fill-rate limits quickly.
 *
 * For complex, custom-scaling requirements, you should probably consider using the `RESIZE` scale mode,
 * with your own limitations in place re: canvas dimensions and managing the scaling with the game scenes
 * yourself. For the vast majority of games, however, the `FIT` mode is likely to be the most used.
 *
 * Please appreciate that the Scale Manager cannot perform miracles. All it does is scale your game canvas
 * as best it can, based on what it can infer from its surrounding area. There are all kinds of environments
 * where it's up to you to guide and help the canvas position itself, especially when built into rendering
 * frameworks like React and Vue. If your page requires meta tags to prevent user scaling gestures, or such
 * like, then it's up to you to ensure they are present in the html.
 *
 * #### Centering
 *
 * You can also have the game canvas automatically centered. Again, this relies heavily on the parent being
 * properly configured and styled, as the centering offsets are based entirely on the available space
 * within the parent element. Centering is disabled by default, or can be applied horizontally, vertically,
 * or both. Here's an example:
 *
 * ```javascript
 * scale: {
 *     parent: 'yourgamediv',
 *     autoCenter: Phaser.Scale.CENTER_BOTH,
 *     width: 800,
 *     height: 600
 * }
 * ```
 *
 * #### Fullscreen API
 *
 * If the browser supports it, you can send your game into fullscreen mode. In this mode, the game will fill
 * the entire display, removing all browser UI and anything else present on the screen. It will remain in this
 * mode until your game either disables it, or until the user tabs out or presses ESCape if on desktop. It's a
 * great way to achieve a desktop-game like experience from the browser, but it does require a modern browser
 * to handle it. Some mobile browsers also support this.
 */
export default class ScaleManager extends EventEmitter {
  /**
   *
   * @param game A reference to the Phaser.Game instance.
   */
  constructor(game: Game) {
    super();
    this.game = game;
    this.fullscreen = {
      available: false,
      keyboard: false,
      active: false,
      cancel: '',
      request: ''
    };
  }

  /**
   * A reference to the Phaser.Game instance.
   */
  game: Game;

  /**
   * A reference to the HTML Canvas Element that Phaser uses to render the game.
   */
  canvas!: HTMLCanvasElement;

  /**
   * The DOM bounds of the canvas element.
   */
  canvasBounds = new Rectangle();

  /**
   * The parent object of the Canvas. Often a div, or the browser window, or nothing in non-browser environments.
   *
   * This is set in the Game Config as the `parent` property. If undefined (or just not present), it will default
   * to use the document body. If specifically set to `null` Phaser will ignore all parent operations.
   */
  parent: any | null = null;

  /**
   * Is the parent element the browser window?
   */
  parentIsWindow: boolean = false;

  /**
   * The Parent Size component.
   */
  parentSize = new Size();

  /**
   * The Game Size component.
   *
   * The un-modified game size, as requested in the game config (the raw width / height),
   * as used for world bounds, cameras, etc
   */
  gameSize = new Size();

  /**
   * The Base Size component.
   *
   * The modified game size, which is the auto-rounded gameSize, used to set the canvas width and height
   * (but not the CSS style)
   */
  baseSize = new Size();

  /**
   * The Display Size component.
   *
   * The size used for the canvas style, factoring in the scale mode, parent and other values.
   */
  displaySize = new Size();

  /**
   * The game scale mode.
   */
  scaleMode = SCALE_MODE.NONE;

  /**
   * The game zoom factor.
   *
   * This value allows you to multiply your games base size by the given zoom factor.
   * This is then used when calculating the display size, even in `NONE` situations.
   * If you don't want Phaser to touch the canvas style at all, this value should be 1.
   *
   * Can also be set to `MAX_ZOOM` in which case the zoom value will be derived based
   * on the game size and available space within the parent.
   */
  zoom = 1;

  /**
   * Internal flag set when the game zoom factor is modified.
   */
  private _resetZoom = false;

  /**
   * The scale factor between the baseSize and the canvasBounds.
   */
  displayScale = new Vector2(1, 1);

  /**
   * If set, the canvas sizes will be automatically passed through Math.floor.
   * This results in rounded pixel display values, which is important for performance on legacy
   * and low powered devices, but at the cost of not achieving a 'perfect' fit in some browser windows.
   */
  autoRound = false;

  /**
   * Automatically center the canvas within the parent? The different centering modes are:
   *
   * 1. No centering.
   * 2. Center both horizontally and vertically.
   * 3. Center horizontally.
   * 4. Center vertically.
   *
   * Please be aware that in order to center the game canvas, you must have specified a parent
   * that has a size set, or the canvas parent is the document.body.
   */
  autoCenter = CENTER.NO_CENTER;

  /**
   * The current device orientation.
   *
   * Orientation events are dispatched via the Device Orientation API, typically only on mobile browsers.
   */
  orientation = ORIENTATION.LANDSCAPE;

  /**
   * A reference to the Device.Fullscreen object.
   */
  fullscreen: typeof Fullscreen;

  /**
   * The DOM Element which is sent into fullscreen mode.
   */
  fullscreenTarget: any | null = null;

  /**
   * Did Phaser create the fullscreen target div, or was it provided in the game config?
   */
  private _createdFullscreenTarget = false;

  /**
   * The dirty state of the Scale Manager.
   * Set if there is a change between the parent size and the current size.
   */
  dirty = false;

  /**
   * How many milliseconds should elapse before checking if the browser size has changed?
   *
   * Most modern browsers dispatch a 'resize' event, which the Scale Manager will listen for.
   * However, older browsers fail to do this, or do it consistently, so we fall back to a
   * more traditional 'size check' based on a time interval. You can control how often it is
   * checked here.
   */
  resizeInterval = 500;

  /**
   * Internal size interval tracker.
   */
  private _lastCheck = 0;

  /**
   * Internal flag to check orientation state.
   */
  private _checkOrientation = false;

  /**
   * Internal object containing our defined event listeners.
   */
  //@ts-ignore
  private listeners = {
    orientationChange: NOOP,
    windowResize: NOOP,
    fullScreenChange: NOOP as (event: any) => void,
    fullScreenError: NOOP as (event: any) => void,
  };

  /**
   * Called _before_ the canvas object is created and added to the DOM.
   */
  protected preBoot() {
    this.parseConfig(this.game.config);
    this.game.events.once(GameEvents.BOOT, this.boot, this);
  }

  /**
   * The Boot handler is called by Phaser.Game when it first starts up.
   * The renderer is available by now and the canvas has been added to the DOM.
   */
  protected boot() {
    const game = this.game;
    this.canvas = game.canvas;

    this.fullscreen = game.device.fullscreen;

    if (this.scaleMode !== SCALE_MODE.RESIZE)
      this.displaySize.setAspectMode(this.scaleMode);
    else {
      this.getParentBounds();
      if (this.parentSize.width > 0 && this.parentSize.height > 0)
        this.displaySize.setParentSize(this.parentSize);

      this.refresh();
    }

    game.events.on(GameEvents.PRE_STEP, this.step, this);
    game.events.once(GameEvents.READY, this.refresh, this);
    game.events.once(GameEvents.DESTROY, this.destroy, this);

    this.startListeners();
  }

  /**
   * Parses the game configuration to set-up the scale defaults.
   * @param config The Game configuration object.
   */
  protected parseConfig(config: GameConfig) {
    this.getParent(config);
    this.getParentBounds();

    let width = config.width!;
    let height = config.height!;
    let zoom = config.zoom!;
    const scaleMode = config.scaleMode;
    const autoRound = config.autoRound!;

    if (typeof width === 'string') {
      let parentWidth = this.parentSize.width;
      if (parentWidth === 0) parentWidth = window.innerWidth;

      const parentScaleX = parseInt(width, 10) / 100;

      width = Math.floor(parentWidth * parentScaleX);
    }

    if (typeof height === 'string') {
      let parentHeight = this.parentSize.height;
      if (parentHeight === 0) parentHeight = window.innerHeight;

      const parentScaleY = parseInt(height, 10) / 100;
      height = Math.floor(parentHeight * parentScaleY);
    }

    this.scaleMode = scaleMode;
    this.autoRound = autoRound;
    this.resizeInterval = config.autoCenter;

    if (autoRound) {
      width = Math.floor(width!);
      height = Math.floor(height!);
    }

    this.gameSize.setSize(width, height);

    if (zoom === ZOOM.MAX_ZOOM) zoom = this.getMaxZoom();

    this.zoom = zoom;

    if (zoom !== 1) this._resetZoom = true;

    this.baseSize.setSize(width, height);

    if (autoRound) {
      this.baseSize.width = Math.floor(this.baseSize.width);
      this.baseSize.height = Math.floor(this.baseSize.height);
    }

    if (config.minWidth > 0)
      this.displaySize.setMin(config.minWidth * zoom, config.minHeight * zoom);
    if (config.maxWidth > 0)
      this.displaySize.setMax(config.maxWidth * zoom, config.maxHeight * zoom);

    this.displaySize.setSize(width, height);

    this.orientation = GetScreenOrientation(width, height) as ORIENTATION;
  }

  /**
   * Determines the parent element of the game canvas, if any, based on the game configuration.
   * @param config The Game configuration object.
   */
  getParent(config: GameConfig) {
    const parent = config.parent;
    if (parent === null || parent === undefined) return;

    this.parent = GetTarget(parent);
    this.parentIsWindow = this.parent === document.body;

    if (config.expandParent && config.scaleMode !== SCALE_MODE.NONE) {
      let DOMRect = this.parent.getBoundingClientRect();
      if (this.parentIsWindow || DOMRect.height === 0) {
        document.documentElement.style.height = '100%';
        document.body.style.height = '100%';

        DOMRect = this.parent.getBoundingClientRect();

        if (!this.parentIsWindow && DOMRect.height === 0) {
          this.parent.style.overflow = 'hidden';
          this.parent.style.width = '100%';
          this.parent.style.height = '100%';
        }
      }
    }

    if (config.fullscreenTarget && !this.fullscreenTarget)
      this.fullscreenTarget = GetTarget(config.fullscreenTarget);
  }

  /**
   * Calculates the size of the parent bounds and updates the `parentSize`
   * properties, only if the canvas has a dom parent.
   */
  getParentBounds() {
    if (!this.parent) return false;

    const parentSize = this.parentSize;

    const DOMRect = this.parent.getBoundingClientRect();
    if (this.parentIsWindow && this.game.device.os.iOS)
      DOMRect.height = GetInnerHeight(true);

    const newWidth = DOMRect.width;
    const newHeight = DOMRect.height;

    if (parentSize.width !== newWidth || parentSize.height !== newHeight) {
      parentSize.setSize(newWidth, newHeight);
      return true;
    } else if (this.canvas) {
      const canvasBounds = this.canvasBounds;
      const canvasRect = this.canvas.getBoundingClientRect();

      if (canvasRect.x !== canvasBounds.x || canvasRect.y !== canvasBounds.y)
        return true;
    }
    return false;
  }

  /**
   * Attempts to lock the orientation of the web browser using the Screen Orientation API.
   *
   * This API is only available on modern mobile browsers.
   * See https://developer.mozilla.org/en-US/docs/Web/API/Screen/lockOrientation for details.
   * @param orientation The orientation you'd like to lock the browser in. Should be an API string such as 'landscape', 'landscape-primary', 'portrait', etc.
   */
  lockOrientation(orientation: string) {
    const lock =
      screen.lockOrientation ||
      screen.mozLockOrientation ||
      screen.msLockOrientation ||
      screen.webkitLockOrientation;
    if (lock) return lock.call(screen, orientation);

    return false;
  }

  /**
   * This method will set the size of the Parent Size component, which is used in scaling
   * and centering calculations. You only need to call this method if you have explicitly
   * disabled the use of a parent in your game config, but still wish to take advantage of
   * other Scale Manager features.
   * @param width The new width of the parent.
   * @param height The new height of the parent.
   */
  setParentSize(width: number, height: number) {
    this.parentSize.setSize(width, height);
    return this.refresh();
  }

  /**
   * This method will set a new size for your game.
   *
   * It should only be used if you're looking to change the base size of your game and are using
   * one of the Scale Manager scaling modes, i.e. `FIT`. If you're using `NONE` and wish to
   * change the game and canvas size directly, then please use the `resize` method instead.
   * @param width The new width of the game.
   * @param height The new height of the game.
   */
  setGameSize(width: number, height: number) {
    const autoRound = this.autoRound;
    if (autoRound) {
      width = Math.floor(width);
      height = Math.floor(height);
    }

    const previousWidth = this.width;
    const previousHeight = this.height;

    this.gameSize.resize(width, height);
    this.baseSize.resize(width, height);

    if (autoRound) {
      this.baseSize.width = Math.floor(this.baseSize.width);
      this.baseSize.height = Math.floor(this.baseSize.height);
    }

    this.displaySize.setAspectRatio(width / height);

    this.canvas.width = this.baseSize.width;
    this.canvas.height = this.baseSize.height;

    return this.refresh(previousWidth, previousHeight);
  }

  /**
   * Call this to modify the size of the Phaser canvas element directly.
   * You should only use this if you are using the `NONE` scale mode,
   * it will update all internal components completely.
   *
   * If all you want to do is change the size of the parent, see the `setParentSize` method.
   *
   * If all you want is to change the base size of the game, but still have the Scale Manager
   * manage all the scaling (i.e. you're **not** using `NONE`), then see the `setGameSize` method.
   *
   * This method will set the `gameSize`, `baseSize` and `displaySize` components to the given
   * dimensions. It will then resize the canvas width and height to the values given, by
   * directly setting the properties. Finally, if you have set the Scale Manager zoom value
   * to anything other than 1 (the default), it will set the canvas CSS width and height to
   * be the given size multiplied by the zoom factor (the canvas pixel size remains untouched).
   *
   * If you have enabled `autoCenter`, it is then passed to the `updateCenter` method and
   * the margins are set, allowing the canvas to be centered based on its parent element
   * alone. Finally, the `displayScale` is adjusted and the RESIZE event dispatched.
   * @param width The new width of the game.
   * @param height The new height of the game.
   */
  resize(width: number, height: number) {
    const zoom = this.zoom;
    const autoRound = this.autoRound;

    if (autoRound) {
      width = Math.floor(width);
      height = Math.floor(height);
    }

    const previousWidth = this.width;
    const previousHeight = this.height;

    this.gameSize.resize(width, height);
    this.baseSize.resize(width, height);

    if (autoRound) {
      this.baseSize.width = Math.floor(this.baseSize.width);
      this.baseSize.height = Math.floor(this.baseSize.height);
    }

    this.displaySize.setSize(width, height);

    this.canvas.width = this.baseSize.width;
    this.canvas.height = this.baseSize.height;

    const style = this.canvas.style;

    let styleWidth = width * zoom;
    let styleHeight = height * zoom;

    if (autoRound) {
      styleWidth = Math.floor(styleWidth);
      styleHeight = Math.floor(styleHeight);
    }

    if (styleWidth !== width || styleHeight !== height) {
      style.width = styleWidth + 'px';
      style.height = styleHeight + 'px';
    }

    return this.refresh(previousWidth, previousHeight);
  }

  /**
   * Sets the zoom value of the Scale Manager.
   * @param value The new zoom value of the game.
   */
  setZoom(value: number) {
    this.zoom = value;
    this._resetZoom = true;
    return this.refresh();
  }

  /**
   * Sets the zoom to be the maximum possible based on the _current_ parent size.
   */
  setMaxZoom() {
    this.zoom = this.getMaxZoom();
    this._resetZoom = true;
    return this.refresh();
  }

  /**
   * Refreshes the internal scale values, bounds sizes and orientation checks.
   *
   * Once finished, dispatches the resize event.
   *
   * This is called automatically by the Scale Manager when the browser window size changes,
   * as long as it is using a Scale Mode other than 'NONE'.
   * @param previousWidth The previous width of the game. Only set if the gameSize has changed.
   * @param previousHeight The previous height of the game. Only set if the gameSize has changed.
   */
  refresh(previousWidth = this.width, previousHeight = this.height) {
    this.updateScale();
    this.updateBounds();
    this.updateOrientation();

    this.displayScale.set(
      this.baseSize.width / this.canvasBounds.width,
      this.baseSize.height / this.canvasBounds.height
    );

    const domContainer = this.game.domContainer;
    if (domContainer) {
      this.baseSize.setCSS(domContainer);
      const canvasStyle = this.canvas.style;
      const domStyle = domContainer.style;

      domStyle.transform = `scale(${
        this.displaySize.width / this.baseSize.width
      },${this.displaySize.height / this.baseSize.height})`;

      domStyle.marginLeft = canvasStyle.marginLeft;
      domStyle.marginTop = canvasStyle.marginTop;
    }

    this.emit(
      Events.RESIZE,
      this.gameSize,
      this.baseSize,
      this.displaySize,
      previousWidth,
      previousHeight
    );
    return this;
  }

  /**
   * Internal method that checks the current screen orientation, only if the internal check flag is set.
   *
   * If the orientation has changed it updates the orientation property and then dispatches the orientation change event.
   */
  updateOrientation() {
    if (this._checkOrientation) {
      this._checkOrientation = false;
      const newOrientation = GetScreenOrientation(
        this.width,
        this.height
      ) as ORIENTATION;
      if (newOrientation !== this.orientation) {
        this.orientation = newOrientation;
        this.emit(Events.ORIENTATION_CHANGE, newOrientation);
      }
    }
  }

  /**
   * Internal method that manages updating the size components based on the scale mode.
   */
  updateScale() {
    const style = this.canvas.style;
    const width = this.gameSize.width;
    const height = this.gameSize.height;

    let styleWidth: number;
    let styleHeight: number;

    const zoom = this.zoom;
    const autoRound = this.autoRound;

    if (this.scaleMode === SCALE_MODE.NONE) {
      this.displaySize.setSize(width * zoom, height * zoom);
      styleWidth = this.displaySize.width;
      styleHeight = this.displaySize.height;

      if (autoRound) {
        styleWidth = Math.floor(styleWidth);
        styleHeight = Math.floor(styleHeight);
      }

      if (this._resetZoom) {
        style.width = styleWidth + 'px';
        style.height = styleHeight + 'px';
        this._resetZoom = false;
      }
    } else if (this.scaleMode === SCALE_MODE.RESIZE) {
      this.gameSize.setSize(this.parentSize.width, this.parentSize.height);
      this.baseSize.setSize(this.parentSize.width, this.parentSize.height);

      styleWidth = this.displaySize.width;
      styleHeight = this.displaySize.height;

      if (autoRound) {
        styleWidth = Math.floor(styleWidth);
        styleHeight = Math.floor(styleHeight);
      }

      this.canvas.width = styleWidth;
      this.canvas.height = styleHeight;
    } else {
      this.displaySize.setSize(this.parentSize.width, this.parentSize.height);

      styleWidth = this.displaySize.width;
      styleHeight = this.displaySize.height;

      if (autoRound) {
        styleWidth = Math.floor(styleWidth);
        styleHeight = Math.floor(styleHeight);
      }

      style.width = styleWidth + 'px';
      style.height = styleHeight + 'px';
    }

    this.getParentBounds();
    this.updateCenter();
  }

  /**
   * Calculates and returns the largest possible zoom factor, based on the current
   * parent and game sizes. If the parent has no dimensions (i.e. an unstyled div),
   * or is smaller than the un-zoomed game, then this will return a value of 1 (no zoom)
   */
  getMaxZoom() {
    const zoomH = SnapFloor(
      this.parentSize.width,
      this.gameSize.width,
      0,
      true
    );
    const zoomV = SnapFloor(
      this.parentSize.height,
      this.gameSize.height,
      0,
      true
    );

    return Math.max(Math.min(zoomH, zoomV), 1);
  }

  /**
   * Calculates and updates the canvas CSS style in order to center it within the
   * bounds of its parent. If you have explicitly set parent to be `null` in your
   * game config then this method will likely give incorrect results unless you have called the
   * `setParentSize` method first.
   *
   * It works by modifying the canvas CSS `marginLeft` and `marginTop` properties.
   *
   * If they have already been set by your own style sheet, or code, this will overwrite them.
   *
   * To prevent the Scale Manager from centering the canvas, either do not set the
   * `autoCenter` property in your game config, or make sure it is set to `NO_CENTER`.
   */
  updateCenter() {
    const autoCenter = this.autoCenter;

    if (autoCenter === CENTER.NO_CENTER) return;

    const canvas = this.canvas;
    const style = canvas.style;
    const bounds = canvas.getBoundingClientRect();

    const width = bounds.width;
    const height = bounds.height;

    let offsetX = Math.floor((this.parentSize.width - width) / 2);
    let offsetY = Math.floor((this.parentSize.height - height) / 2);

    if (autoCenter === CENTER.CENTER_HORIZONTALLY) offsetX = 0;
    else if (autoCenter === CENTER.CENTER_VERTICALLY) offsetY = 0;

    style.marginLeft = offsetX + 'px';
    style.marginTop = offsetY + 'px';
  }

  /**
   * Updates the `canvasBounds` rectangle to match the bounding client rectangle of the
   * canvas element being used to track input events.
   */
  updateBounds() {
    const bounds = this.canvasBounds;
    const clientRect = this.canvas.getBoundingClientRect();

    bounds.x =
      clientRect.left +
      (window.pageXOffset || 0) -
      (document.documentElement.clientLeft || 0);
    bounds.y =
      clientRect.top +
      (window.pageYOffset || 0) -
      (document.documentElement.clientTop || 0);

    bounds.width = clientRect.width;
    bounds.height = clientRect.height;
  }

  /**
   * Transforms the pageX value into the scaled coordinate space of the Scale Manager.
   * @param pageX The DOM pageX value.
   */
  transformX(pageX: number) {
    return (pageX - this.canvasBounds.left) * this.displayScale.x;
  }

  /**
   * Transforms the pageY value into the scaled coordinate space of the Scale Manager.
   * @param pageY The DOM pageY value.
   */
  transformY(pageY: number) {
    return (pageY - this.canvasBounds.top) * this.displayScale.y;
  }

  /**
   * Sends a request to the browser to ask it to go in to full screen mode, using the {@link https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API Fullscreen API}.
   *
   * If the browser does not support this, a `FULLSCREEN_UNSUPPORTED` event will be emitted.
   *
   * This method _must_ be called from a `pointerup` user-input gesture (**not** `pointerdown`). You cannot launch
   * games fullscreen without this, as most browsers block it. Games within an iframe will also be blocked
   * from fullscreen unless the iframe has the `allowfullscreen` attribute.
   *
   * On touch devices, such as Android and iOS Safari, you should always use `pointerup` and NOT `pointerdown`,
   * otherwise the request will fail unless the document in which your game is embedded has already received
   * some form of touch input, which you cannot guarantee. Activating fullscreen via `pointerup` circumvents
   * this issue.
   *
   * Performing an action that navigates to another page, or opens another tab, will automatically cancel
   * fullscreen mode, as will the user pressing the ESC key. To cancel fullscreen mode directly from your game,
   * i.e. by clicking an icon, call the `stopFullscreen` method.
   *
   * A browser can only send one DOM element into fullscreen. You can control which element this is by
   * setting the `fullscreenTarget` property in your game config, or changing the property in the Scale Manager.
   * Note that the game canvas _must_ be a child of the target. If you do not give a target, Phaser will
   * automatically create a blank `<div>` element and move the canvas into it, before going fullscreen.
   * When it leaves fullscreen, the div will be removed.
   * @param fullscreenOptions The FullscreenOptions dictionary is used to provide configuration options when entering full screen.
   */
  startFullscreen(fullscreenOptions = { navigationUI: 'hide' }) {
    const fullscreen = this.fullscreen;
    if (!fullscreen.available) {
      this.emit(Events.FULLSCREEN_UNSUPPORTED);
      return;
    }

    if (!fullscreen.active) {
      const fsTarget = this.getFullscreenTarget();
      if (fullscreen.keyboard)
        //@ts-ignore
        fsTarget[fullscreen.request](Element.ALLOW_KEYBOARD_INPUT);
      else fsTarget[fullscreen.request](fullscreenOptions);
    }
  }

  /**
   * The browser has successfully entered fullscreen mode.
   */
  private fullscreenSuccessHandler() {
    this.getParentBounds();
    this.refresh();
    this.emit(Events.ENTER_FULLSCREEN);
  }

  /**
   * The browser failed to enter fullscreen mode.
   * @param error - The DOM error event
   */
  private fullscreenErrorHandler(error: any) {
    this.removeFullscreenTarget();
    this.emit(Events.FULLSCREEN_FAILED, error);
  }

  /**
   * An internal method that gets the target element that is used when entering fullscreen mode.
   */
  getFullscreenTarget() {
    if (!this.fullscreenTarget) {
      const fsTarget = document.createElement('div');

      fsTarget.style.margin = '0';
      fsTarget.style.padding = '0';
      fsTarget.style.width = '100%';
      fsTarget.style.height = '100%';

      this.fullscreenTarget = fsTarget;

      this._createdFullscreenTarget = true;
    }

    if (this._createdFullscreenTarget) {
      const canvasParent = this.canvas.parentNode;
      canvasParent?.insertBefore(this.fullscreenTarget, this.canvas);
      this.fullscreenTarget.appendChild(this.canvas);
    }

    return this.fullscreenTarget;
  }

  /**
   * Removes the fullscreen target that was added to the DOM.
   */
  removeFullscreenTarget() {
    if (this._createdFullscreenTarget) {
      const fsTarget = this.fullscreenTarget as HTMLElement;
      if (fsTarget && fsTarget.parentNode) {
        const parent = fsTarget.parentNode;
        parent.insertBefore(this.canvas, fsTarget);
        parent.removeChild(fsTarget);
      }
    }
  }

  /**
   * Calling this method will cancel fullscreen mode, if the browser has entered it.
   */
  stopFullscreen() {
    const fullscreen = this.fullscreen;
    if (!fullscreen.available) {
      this.emit(Events.FULLSCREEN_UNSUPPORTED);
      return false;
    }
    // @ts-ignore
    if (fullscreen.active) document[fullscreen.cancel]();

    this.removeFullscreenTarget();
    this.getParentBounds();

    this.emit(Events.LEAVE_FULLSCREEN);
    this.refresh();
  }

  /**
   * Toggles the fullscreen mode. If already in fullscreen, calling this will cancel it.
   * If not in fullscreen, this will request the browser to enter fullscreen mode.
   *
   * If the browser does not support this, a `FULLSCREEN_UNSUPPORTED` event will be emitted.
   *
   * This method _must_ be called from a user-input gesture, such as `pointerdown`. You cannot launch
   * games fullscreen without this, as most browsers block it. Games within an iframe will also be blocked
   * from fullscreen unless the iframe has the `allowfullscreen` attribute.
   * @param fullscreenOptions The FullscreenOptions dictionary is used to provide configuration options when entering full screen.
   */
  toggleFullscreen(fullscreenOptions?: { navigationUI: 'hide' }) {
    if (this.fullscreen.active) this.stopFullscreen();
    else this.startFullscreen(fullscreenOptions);
  }

  /**
   * An internal method that starts the different DOM event listeners running.
   */
  startListeners() {
    const _this = this;
    const listeners = this.listeners;

    listeners.orientationChange = () => {
      _this.updateBounds();

      _this._checkOrientation = true;
      _this.dirty = true;
    };

    listeners.windowResize = () => {
      _this.updateBounds();
      _this.dirty = true;
    };

    if (this.fullscreen.available) {
      listeners.fullScreenChange = event => _this.onFullScreenChange(event);
      listeners.fullScreenError = event => _this.onFullScreenError(event);

      const vendors = ['webkit', 'moz', 'o', ''];
      vendors.forEach(prefix => {
        document.addEventListener(
          `${prefix}fullscreenchange`,
          listeners.fullScreenChange,
          false
        );
        document.addEventListener(
          `${prefix}fullscreenerror`,
          listeners.fullScreenError,
          false
        );
      });

      document.addEventListener(
        'MSFullscreenChange',
        listeners.fullScreenChange,
        false
      );
      document.addEventListener(
        'MSFullscreenError',
        listeners.fullScreenError,
        false
      );
    }
  }

  /**
   * Triggered when a fullscreenchange event is dispatched by the DOM.
   */
  protected onFullScreenChange() {
    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement
    ) {
      this.emit(Events.ENTER_FULLSCREEN);
    } else {
      this.emit(Events.LEAVE_FULLSCREEN);
    }
  }

  /**
   * Triggered when a fullscreenerror event is dispatched by the DOM.
   */
  onFullScreenError() {
    this.removeFullscreenTarget();
  }

  /**
   * Get Rectange of visible area, this Rectange does NOT factor in camera scroll.
   * @param out The Rectangle of visible area.
   */
  getViewPort(out = new Rectangle()) {
    const baseSize = this.baseSize;
    const parentSize = this.parentSize;
    const canvasBounds = this.canvasBounds;
    const displayScale = this.displayScale;

    const x = canvasBounds.x >= 0 ? 0 : -(canvasBounds.x * displayScale.x);
    const y = canvasBounds.y >= 0 ? 0 : -(canvasBounds.y * displayScale.y);

    let width: number;
    if (parentSize.width >= canvasBounds.width) width = baseSize.width;
    else
      width =
        baseSize.width -
        (canvasBounds.width - parentSize.width) * displayScale.x;

    let height: number;
    if (parentSize.height >= canvasBounds.height) height = baseSize.height;
    else
      height =
        baseSize.height -
        (canvasBounds.height - parentSize.height) * displayScale.y;

    out.setTo(x, y, width, height);
    return out;
  }

  /**
   * Internal method, called automatically by the game step.
   * Monitors the elapsed time and resize interval to see if a parent bounds check needs to take place.
   * @param time The time value from the most recent Game step. Typically a high-resolution timer value, or Date.now().
   * @param delta The delta value since the last frame. This is smoothed to avoid delta spikes by the TimeStep class.
   */
  step(time: number, delta: number) {
    if (!this.dirty) return;

    this._lastCheck += delta;

    if (this.dirty || this._lastCheck > this.resizeInterval) {
      if (this.getParentBounds()) this.refresh();

      this.dirty = false;
      this._lastCheck = 0;
    }
  }

  /**
   * Stops all DOM event listeners.
   */
  stopListeners() {
    const listeners = this.listeners;

    window.removeEventListener(
      'orientationchange',
      listeners.orientationChange,
      false
    );
    window.removeEventListener('resize', listeners.windowResize, false);

    const vendors = ['webkit', 'moz', ''];

    vendors.forEach(function (prefix) {
      document.removeEventListener(
        prefix + 'fullscreenchange',
        listeners.fullScreenChange,
        false
      );
      document.removeEventListener(
        prefix + 'fullscreenerror',
        listeners.fullScreenError,
        false
      );
    });

    //  MS Specific
    document.removeEventListener(
      'MSFullscreenChange',
      listeners.fullScreenChange,
      false
    );
    document.removeEventListener(
      'MSFullscreenError',
      listeners.fullScreenError,
      false
    );
  }

  /**
   * Destroys this Scale Manager, releasing all references to external resources.
   * Once destroyed, the Scale Manager cannot be used again.
   */
  destroy() {
    this.removeAllListeners();

    this.stopListeners();

    this.game = null as any;
    this.canvas = null as any;
    this.canvasBounds = null as any;
    this.parent = null;
    this.fullscreenTarget = null;

    this.parentSize.destroy();
    this.gameSize.destroy();
    this.baseSize.destroy();
    this.displaySize.destroy();
  }

  /**
   * Is the browser currently in fullscreen mode or not?
   */
  get isFullscreen() {
    return this.fullscreen.active;
  }

  /**
   * The game width.
   *
   * This is typically the size given in the game configuration.
   */
  get width() {
    return this.gameSize.width;
  }

  /**
   * The game height.
   *
   * This is typically the size given in the game configuration.
   */
  get height() {
    return this.gameSize.height;
  }

  /**
   * Is the device in a portrait orientation as reported by the Orientation API?
   * This value is usually only available on mobile devices.
   */
  get isPortrait() {
    return this.orientation === ORIENTATION.PORTRAIT;
  }

  /**
   * Is the device in a landscape orientation as reported by the Orientation API?
   * This value is usually only available on mobile devices.
   */
  get isLandscape() {
    return this.orientation === ORIENTATION.LANDSCAPE;
  }

  /**
   * Are the game dimensions portrait? (i.e. taller than they are wide)
   *
   * This is different to the device itself being in a portrait orientation.
   */
  get isPortraitGame() {
    return this.height > this.width;
  }

  /**
   * Are the game dimensions landscape? (i.e. wider than they are tall)
   *
   * This is different to the device itself being in a landscape orientation.
   */
  get isLandscapeGame() {
    return this.width > this.height;
  }
}
