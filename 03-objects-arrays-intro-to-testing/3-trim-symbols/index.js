/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size = string.length) {
    if (!size) {
        return '';
    }

    let cutString = '',
        currentLetter = '',
        currentSize = 0;

    for (const letter of string) {
        if (currentLetter !== letter) {
            currentLetter = letter;
            cutString += letter;
            currentSize = 1;
        } else if (currentSize < size) {
            cutString += letter;
            currentSize++;
        } else {
            continue;
        }
    }

    return cutString;
}
