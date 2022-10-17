import KeyCombo from './KeyCombo';

/**
 * Used internally by the KeyCombo class.
 *
 * @param combo - The KeyCombo to reset.
 * @return The KeyCombo.
 */
function ResetKeyCombo(combo: KeyCombo) {
  combo.current = combo.keyCodes[0];
  combo.index = 0;
  combo.timeLastMatched = 0;
  combo.matched = false;
  combo.timeMatched = 0;

  return combo;
}
export default ResetKeyCombo