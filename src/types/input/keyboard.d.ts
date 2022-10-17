import { Key } from "@phaser/input";

interface CursorKeys {
  /**
   * A Key object mapping to the UP arrow key.
   */
  up: Key;
  /**
   * A Key object mapping to the DOWN arrow key.
   */
  down: Key;
  /**
   * A Key object mapping to the LEFT arrow key.
   */
  left: Key;
  /**
   * A Key object mapping to the RIGHT arrow key.
   */
  right: Key;
  /**
   * A Key object mapping to the SPACE BAR key.
   */
  space: Key;
  /**
   * A Key object mapping to the SHIFT key.
   */
  shift: Key;
}

type KeyboardKeydownCallback = (event: KeyboardEvent) => void;

interface KeyComboConfig {
  /**
   * If they press the wrong key do we reset the combo?
   */
  resetOnWrongKey?: boolean;
  /**
   * The max delay in ms between each key press. Above this the combo is reset. 0 means disabled.
   */
  maxKeyDelay?: number;
  /**
   * If previously matched and they press the first key of the combo again, will it reset?
   */
  resetOnMatch?: boolean;
  /**
   * If the combo matches, will it delete itself?
   */
  deleteOnMatch?: boolean;
}
