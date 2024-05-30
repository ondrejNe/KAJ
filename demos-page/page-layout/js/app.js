import { RuleStore } from "./model/store.js";

const Rules = new RuleStore("rule-store");

const App = {
    // A collection of DOM element references and utility methods for manipulating the UI.
    $: {
        // Controls
        fileLoadBtn: document.querySelector('[data-rule="file-load-button"]'),
        fileSaveBtn: document.querySelector('[data-rule="file-save-button"]'),
        fileClearBtn: document.querySelector('[data-rule="file-clear-button"]'),
        fileShowBtn: document.querySelector('[data-rule="file-show-button"]'),
        ruleFilter: document.querySelector('[data-rule="rule-filter"]'),
        
        // Presentation
        fileShowCode: document.querySelector('[data-rule="file-show"] code'),
        ruleList: document.querySelector('[data-rule="rule-list"]'),
    },

    // The initialization method for setting up event listeners and initial rendering.
    init() {
        Rules.addEventListener("save", App.render);

        // Attach event listeners for file load and save
        App.bindEventListeners();

        // Initial render
        App.render();
    },

    // Method to bind event listeners
    bindEventListeners() {
        App.$.fileLoadBtn.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            if (file) {
                try {
                    const text = await file.text();
                    await Rules.loadJSONHandler(text);
                    App.render();
                } catch (error) {
                    App.$.fileShowCode.textContent = error.message;
                }
            }
        });
        App.$.fileSaveBtn.addEventListener('click', Rules.saveJSONHandler.bind(Rules));
        App.$.fileClearBtn.addEventListener('click', Rules.clearJSONHandler.bind(Rules));
        App.$.ruleFilter.addEventListener('input', function(e) {
            const filter = e.target.value;
            Rules.filter(filter);
            App.render();
        });
    },

    // The main rendering method for updating the UI based on the current state
    render() {
        App.$.fileShowCode.textContent = Rules.toJSON();
        Prism.highlightElement(App.$.fileShowCode);
        App.$.ruleList.replaceChildren(...Rules.all().map((rule) => App.createRuleItem(rule)));
    },

    createRuleItem(rule) {
        const li = document.createElement("li");
        li.textContent = rule.name;
        return li;
    },
};

App.init();
