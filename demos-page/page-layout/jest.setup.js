
require('./polyfills');
const { JSDOM } = require('jsdom');

const jsdom = new JSDOM('<!doctype html><html lang="en"><body></body></html>', {
    url: 'http://localhost/' }
);
const { window } = jsdom;

global.window = window;
global.document = window.document;
global.localStorage = window.localStorage;
global.Event = window.Event;
global.EventTarget = window.EventTarget;
global.CustomEvent = window.CustomEvent;
