export interface Animation {
  /**
   * The key that the animation will be associated with. i.e. sprite.animations.play(key)
   */
  key?: string;
  /**
   * Either a string, in which case it will use all frames from a texture with the matching key, or an array of Animation Frame configuration objects.
   */
  frames?: string | AnimationFrame[];
  /**
   * If you provide a string for `frames` you can optionally have the frame names numerically sorted.
   */
  sortFrames?: boolean;
  /**
   * The key of the texture all frames of the animation will use. Can be overridden on a per frame basis.
   */
  defaultTextureKey?: string;
  /**
   * The frame rate of playback in frames per second (default 24 if duration is null)
   */
  frameRate?: number;
  /**
   * How long the animation should play for in milliseconds. If not given its derived from frameRate.
   */
  duration?: number;
  /**
   * Skip frames if the time lags, or always advanced anyway?
   */
  skipMissedFrames?: boolean;
  /**
   * Delay before starting playback. Value given in milliseconds.
   */
  delay?: number;
  /**
   * Number of times to repeat the animation (-1 for infinity)
   */
  repeat?: number;
  /**
   * Delay before the animation repeats. Value given in milliseconds.
   */
  repeatDelay?: number;
  /**
   * Should the animation yoyo? (reverse back down to the start) before repeating?
   */
  yoyo?: boolean;
  /**
   * Should sprite.visible = true when the animation starts to play?
   */
  showOnStart?: boolean;
  /**
   * Should sprite.visible = false when the animation finishes?
   */
  hideOnComplete?: boolean;
}

export interface AnimationFrame {
  /**
   * The key of the texture within the Texture Manager to use for this Animation Frame.
   */
  key?: string;
  /**
   * The key, or index number, of the frame within the texture to use for this Animation Frame.
   */
  frame?: string | number;
  /**
   * The duration, in ms, of this frame of the animation.
   */
  duration?: number;
  /**
   * Should the parent Game Object be visible during this frame of the animation?
   */
  visible?: boolean;
}

export interface GenerateFrameNames {
  /**
   * The string to append to every resulting frame name if using a range or an array of `frames`.
   */
  prefix?: string;
  /**
   * If `frames` is not provided, the number of the first frame to return.
   */
  start?: number;
  /**
   * If `frames` is not provided, the number of the last frame to return.
   */
  end?: number;
  /**
   * The string to append to every resulting frame name if using a range or an array of `frames`.
   */
  suffix?: string;
  /**
   * The minimum expected lengths of each resulting frame's number. Numbers will be left-padded with zeroes until they are this long, then prepended and appended to create the resulting frame name.
   */
  zeroPad?: number;
  /**
   * The array to append the created configuration objects to.
   */
  outputArray?: AnimationFrame[];
  /**
   * If provided as an array, the range defined by `start` and `end` will be ignored and these frame numbers will be used.
   */
  frames?: boolean | number[];
}

export interface GenerateFrameNumbers {
  /**
   * The starting frame of the animation.
   */
  start?: number;
  /**
   * The ending frame of the animation.
   */
  end?: number;
  /**
   * A frame to put at the beginning of the animation, before `start` or `outputArray` or `frames`.
   */
  first?: boolean | number;
  /**
   * An array to concatenate the output onto.
   */
  outputArray?: AnimationFrame[];
  /**
   * A custom sequence of frames.
   */
  frames?: boolean | number[];
}

export interface JSONAnimation {
  /**
   * The key that the animation will be associated with. i.e. sprite.animations.play(key)
   */
  key: string;
  /**
   * A frame based animation (as opposed to a bone based animation)
   */
  type: string;
  /**
   * An array of the AnimationFrame objects inside this Animation.
   */
  frames: JSONAnimationFrame[];
  /**
   * The frame rate of playback in frames per second (default 24 if duration is null)
   */
  frameRate: number;
  /**
   * How long the animation should play for in milliseconds. If not given its derived from frameRate.
   */
  duration: number;
  /**
   * Skip frames if the time lags, or always advanced anyway?
   */
  skipMissedFrames: boolean;
  /**
   * Delay before starting playback. Value given in milliseconds.
   */
  delay: number;
  /**
   * Number of times to repeat the animation (-1 for infinity)
   */
  repeat: number;
  /**
   * Delay before the animation repeats. Value given in milliseconds.
   */
  repeatDelay: number;
  /**
   * Should the animation yoyo? (reverse back down to the start) before repeating?
   */
  yoyo: boolean;
  /**
   * Should sprite.visible = true when the animation starts to play?
   */
  showOnStart: boolean;
  /**
   * Should sprite.visible = false when the animation finishes?
   */
  hideOnComplete: boolean;
}

export interface JSONAnimationFrame {
  /**
   * The key of the Texture this AnimationFrame uses.
   */
  key: string;
  /**
   * The key of the Frame within the Texture that this AnimationFrame uses.
   */
  frame: string | number;
  /**
   * Additional time (in ms) that this frame should appear for during playback.
   */
  duration: number;
}

export interface JSONAnimations {
  /**
   * An array of all Animations added to the Animation Manager.
   */
  anims: JSONAnimation[];
  /**
   * The global time scale of the Animation Manager.
   */
  globalTimeScale: number;
}

export interface PlayAnimationConfig {
  /**
   * The string-based key of the animation to play, or an Animation instance.
   */
  key: string | Animation;
  /**
   * The frame rate of playback in frames per second (default 24 if duration is null)
   */
  frameRate?: number;
  /**
   * How long the animation should play for in milliseconds. If not given its derived from frameRate.
   */
  duration?: number;
  /**
   * Delay before starting playback. Value given in milliseconds.
   */
  delay?: number;
  /**
   * Number of times to repeat the animation (-1 for infinity)
   */
  repeat?: number;
  /**
   * Delay before the animation repeats. Value given in milliseconds.
   */
  repeatDelay?: number;
  /**
   * Should the animation yoyo? (reverse back down to the start) before repeating?
   */
  yoyo?: boolean;
  /**
   * Should sprite.visible = true when the animation starts to play?
   */
  showOnStart?: boolean;
  /**
   * Should sprite.visible = false when the animation finishes?
   */
  hideOnComplete?: boolean;
  /**
   * The frame of the animation to start playback from.
   */
  startFrame?: number;
  /**
   * The time scale to be applied to playback of this animation.
   */
  timeScale?: number;
}
