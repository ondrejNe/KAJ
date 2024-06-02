export const syntaxHighlight = (json) => {
    // Escape special HTML characters
    json = json.replace(/([&<>"'`])/g, function (match) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            '`': '&#96;'
        }[match];
    });

    // Regex to match JSON components: strings, numbers, booleans, nulls
    json = json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(:\s*)?|true|false|null|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });

    // Regex to match brackets
    json = json.replace(/[{}\[\]]/g, function (match) {
        return '<span class="bracket">' + match + '</span>';
    });

    return json;
};
