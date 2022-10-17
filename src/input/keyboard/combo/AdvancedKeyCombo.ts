import KeyCombo from "./KeyCombo";

/**
 * Used internally by the KeyCombo class.
 * Return `true` if it reached the end of the combo, `false` if not.
 * 
 * @param event - The native Keyboard Event.
 * @param combo - The KeyCombo object to advance.
 *
 * @return `true` if it reached the end of the combo, `false` if not.
 */
function AdvanceKeyCombo(event: KeyboardEvent, combo: KeyCombo) {
    combo.timeLastMatched = event.timeStamp;
    combo.index++;

    if (combo.index === combo.size) return true;
    else {
        combo.current = combo.keyCodes[combo.index];
        return false;
    }
};

export default AdvanceKeyCombo