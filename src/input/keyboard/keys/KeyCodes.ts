/**
 * Keyboard Codes.
 */
export enum KeyCodes {
  /**
   * The BACKSPACE key.
   */
  BACKSPACE = 8,

  /**
   * The TAB key.
   */
  TAB,

  /**
   * The ENTER key.
   */
  ENTER = 13,

  /**
   * The SHIFT key.
   */
  SHIFT = 16,

  /**
   * The CTRL key.
   */
  CTRL,

  /**
   * The ALT key.
   */
  ALT,

  /**
   * The PAUSE key.
   */
  PAUSE,

  /**
   * The CAPS_LOCK key.
   */
  CAPS_LOCK,

  /**
   * The ESC key.
   */
  ESC = 27,

  /**
   * The SPACE key.
   */
  SPACE = 32,

  /**
   * The PAGE_UP key.
   */
  PAGE_UP,

  /**
   * The PAGE_DOWN key.
   */
  PAGE_DOWN,

  /**
   * The END key.
   */
  END,

  /**
   * The HOME key.
   */
  HOME,

  /**
   * The LEFT key.
   */
  LEFT,

  /**
   * The UP key.
   */
  UP,

  /**
   * The RIGHT key.
   */
  RIGHT,

  /**
   * The DOWN key.
   */
  DOWN,

  /**
   * The PRINT_SCREEN key.
   */
  PRINT_SCREEN = 42,

  /**
   * The INSERT key.
   */
  INSERT = 45,

  /**
   * The DELETE key.
   */
  DELETE,

  /**
   * The ZERO key.
   */
  ZERO = 48,

  /**
   * The ONE key.
   */
  ONE,

  /**
   * The TWO key.
   */
  TWO,

  /**
   * The THREE key.
   */
  THREE,

  /**
   * The FOUR key.
   */
  FOUR,

  /**
   * The FIVE key.
   */
  FIVE,

  /**
   * The SIX key.
   */
  SIX,

  /**
   * The SEVEN key.
   */
  SEVEN,

  /**
   * The EIGHT key.
   */
  EIGHT,

  /**
   * The NINE key.
   */
  NINE,

  /**
   * The NUMPAD_ZERO key.
   */
  NUMPAD_ZERO = 96,

  /**
   * The NUMPAD_ONE key.
   */
  NUMPAD_ONE,

  /**
   * The NUMPAD_TWO key.
   */
  NUMPAD_TWO,

  /**
   * The NUMPAD_THREE key.
   */
  NUMPAD_THREE,

  /**
   * The NUMPAD_FOUR key.
   */
  NUMPAD_FOUR,

  /**
   * The NUMPAD_FIVE key.
   */
  NUMPAD_FIVE,

  /**
   * The NUMPAD_SIX key.
   */
  NUMPAD_SIX,

  /**
   * The NUMPAD_SEVEN key.
   */
  NUMPAD_SEVEN,

  /**
   * The NUMPAD_EIGHT key.
   */
  NUMPAD_EIGHT,

  /**
   * The NUMPAD_NINE key.
   */
  NUMPAD_NINE,

  /**
   * The Numpad Addition (+) key.
   */
  NUMPAD_ADD = 105,

  /**
   * The Numpad Subtraction (-) key.
   */
  NUMPAD_SUBTRACT = 109,

  /**
   * The A key.
   */
  A = 65,

  /**
   * The B key.
   */
  B,

  /**
   * The C key.
   */
  C,

  /**
   * The D key.
   */
  D,

  /**
   * The E key.
   */
  E,

  /**
   * The F key.
   */
  F,

  /**
   * The G key.
   */
  G,

  /**
   * The H key.
   */
  H,

  /**
   * The I key.
   */
  I,

  /**
   * The J key.
   */
  J,

  /**
   * The K key.
   */
  K,

  /**
   * The L key.
   */
  L,

  /**
   * The M key.
   */
  M,

  /**
   * The N key.
   */
  N,

  /**
   * The O key.
   */
  O,

  /**
   * The P key.
   */
  P,

  /**
   * The Q key.
   */
  Q,

  /**
   * The R key.
   */
  R,

  /**
   * The S key.
   */
  S,

  /**
   * The T key.
   */
  T,

  /**
   * The U key.
   */
  U,

  /**
   * The V key.
   */
  V,

  /**
   * The W key.
   */
  W,

  /**
   * The X key.
   */
  X,

  /**
   * The Y key.
   */
  Y,

  /**
   * The Z key.
   */
  Z,

  /**
   * The F1 key.
   */
  F1 = 112,

  /**
   * The F2 key.
   */
  F2,

  /**
   * The F3 key.
   */
  F3,

  /**
   * The F4 key.
   */
  F4,

  /**
   * The F5 key.
   */
  F5,

  /**
   * The F6 key.
   */
  F6,

  /**
   * The F7 key.
   */
  F7,

  /**
   * The F8 key.
   */
  F8,

  /**
   * The F9 key.
   */
  F9,

  /**
   * The F10 key.
   */
  F10,

  /**
   * The F11 key.
   */
  F11,

  /**
   * The F12 key.
   */
  F12,

  /**
   * The SEMICOLON key.
   */
  SEMICOLON = 186,

  /**
   * The PLUS key.
   */
  PLUS,

  /**
   * The COMMA key.
   */
  COMMA,

  /**
   * The MINUS key.
   */
  MINUS,

  /**
   * The PERIOD key.
   */
  PERIOD,

  /**
   * The FORWARD_SLASH key.
   */
  FORWARD_SLASH,

  /**
   * The BACK_SLASH key.
   */
  BACK_SLASH = 220,

  /**
   * The QUOTES key.
   */
  QUOTES = 222,

  /**
   * The BACKTICK key.
   */
  BACKTICK = 192,

  /**
   * The OPEN_BRACKET key.
   */
  OPEN_BRACKET = 219,

  /**
   * The CLOSED_BRACKET key.
   */
  CLOSED_BRACKET = 221,

  /**
   * The SEMICOLON_FIREFOX key.
   */
  SEMICOLON_FIREFOX = 59,

  /**
   * The COLON key.
   */
  COLON = 58,

  /**
   * The COMMA_FIREFOX_WINDOWS key.
   */
  COMMA_FIREFOX_WINDOWS = 60,

  /**
   * The COMMA_FIREFOX key.
   */
  COMMA_FIREFOX = 62,

  /**
   * The BRACKET_RIGHT_FIREFOX key.
   */
  BRACKET_RIGHT_FIREFOX = 174,

  /**
   * The BRACKET_LEFT_FIREFOX key.
   */
  BRACKET_LEFT_FIREFOX = 175
}
