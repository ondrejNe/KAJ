
const { TextEncoder, TextDecoder } = require('util');

// Ensure global TextEncoder and TextDecoder are available
if (typeof global.TextEncoder === 'undefined') {
    global.TextEncoder = TextEncoder;
}

if (typeof global.TextDecoder === 'undefined') {
    global.TextDecoder = TextDecoder;
}
