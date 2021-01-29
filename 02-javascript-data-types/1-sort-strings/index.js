/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
    const sorted = [...arr];

    function compareString(str1, str2) {
        if (str1.localeCompare(str2, 'ru', {caseFirst: 'upper'}) >= 1) {
            return param == 'asc' ? 1 : -1;
        } else if (str1.localeCompare(str2, 'ru', {caseFirst: 'upper'}) <= -1){
            return param == 'asc' ? -1 : 1;
        }
        return 0;
    }

    return sorted.sort(compareString);
}
