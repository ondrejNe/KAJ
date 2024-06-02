/**
 * Highlights JSON syntax for display in HTML by wrapping different JSON components
 * with appropriate CSS classes for styling. The function converts JSON strings,
 * numbers, booleans, nulls, and punctuation into HTML spans with corresponding classes.
 *
 * @param {string} json - The JSON string to be syntax highlighted.
 * @returns {string} - The JSON string with HTML spans added for syntax highlighting.
 *
 * The function performs the following tasks:
 * 1. Matches JSON components including strings, numbers, booleans, and null values
 *    using a regular expression, and wraps them in HTML span elements with CSS classes:
 *    - Strings (keys or values) are wrapped in `<span class="token string">`.
 *    - Keys are wrapped in `<span class="token property">`.
 *    - Numbers are wrapped in `<span class="token number">`.
 *    - Booleans are wrapped in `<span class="token boolean">`.
 *    - Null values are wrapped in `<span class="token null">`.
 * 2. Matches JSON punctuation characters (brackets, commas, colons) and wraps them in
 *    `<span class="token punctuation">`.
 *
 * Example:
 * const jsonString = '{"key": "value", "number": 123, "boolean": true, "nullValue": null}';
 * const highlightedJson = jsonSyntaxHighlight(jsonString);
 * console.log(highlightedJson);
 * // Output will be the JSON string with HTML spans wrapping each component for styling.
 */
export const jsonSyntaxHighlight = (json) => {
    // Regex to match JSON components: strings, numbers, booleans, nulls
    json = json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(:\s*)?|true|false|null|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'token number';
        if (/^"/.test(match)) {
            if (/.*:/.test(match)) {
                cls = 'token property';
            } else {
                cls = 'token string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'token boolean';
        } else if (/null/.test(match)) {
            cls = 'token null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });

    // Regex to match brackets, commas, and colons
    json = json.replace(/[{}\[\],:]/g, function (match) {
        return '<span class="token punctuation">' + match + '</span>';
    });

    return json;
};
