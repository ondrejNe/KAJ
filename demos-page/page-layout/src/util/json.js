export const syntaxHighlight = (json) => {
    // Regex to match JSON components: strings, numbers, booleans, nulls
    json = json.replace(/("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(:\s*)?|true|false|null|-?\d+(\.\d+)?([eE][+\-]?\d+)?)/g, function (match) {
        let cls = 'token number';
        console.log(match);
        if (/^"/.test(match)) {
            if (/.*:/.test(match)) {
                cls = 'token property';
            } else {
                cls = 'token string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'token null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });

    // Regex to match brackets
    json = json.replace(/[{}\[\],:]/g, function (match) {
        return '<span class="token punctuation">' + match + '</span>';
    });

    return json;
};