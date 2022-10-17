import AdvanceKeyCombo from './AdvancedKeyCombo';
import KeyCombo from './KeyCombo';

/**
 * Used internally by the KeyCombo class.
 *
 * @param event - The native Keyboard Event.
 * @param combo - The KeyCombo object to be processed.
 *
 * @return `true` if the combo was matched, otherwise `false`.
 */
function ProcessKeyCombo(event: KeyboardEvent, combo: KeyCombo) {
  if (combo.matched) return true;

  let comboMatched = false;
  let keyMatched = false;

  if (event.keyCode === combo.current) {
    //  Key was correct

    if (combo.index > 0 && combo.maxKeyDelay > 0) {
      //  We have to check to see if the delay between
      //  the new key and the old one was too long (if enabled)

      const timeLimit = combo.timeLastMatched + combo.maxKeyDelay;

      //  Check if they pressed it in time or not
      if (event.timeStamp <= timeLimit) {
        keyMatched = true;
        comboMatched = AdvanceKeyCombo(event, combo);
      }
    } else {
      keyMatched = true;

      //  We don't check the time for the first key pressed, so just advance it
      comboMatched = AdvanceKeyCombo(event, combo);
    }
  }

  if (!keyMatched && combo.resetOnWrongKey) {
    //  Wrong key was pressed
    combo.index = 0;
    combo.current = combo.keyCodes[0];
  }

  if (comboMatched) {
    combo.timeLastMatched = event.timeStamp;
    combo.matched = true;
    combo.timeMatched = event.timeStamp;
  }

  return comboMatched;
}
export default ProcessKeyCombo;