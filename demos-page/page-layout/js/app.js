import { RuleStore } from "./model/store.js";
import { insertHTML, replaceHTML } from "./util/util.js"

const Rules = new RuleStore("rule-store");

const App = {
    // A collection of DOM element references and utility methods for manipulating the UI.
    $: {
        fileLoad: document.querySelector('[data-rule="file-load"]'),
        fileSave: document.querySelector('[data-rule="file-save"]'),
        fileDisplay: document.querySelector('[data-rule="file-display"]'),
        
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
        App.$.fileLoad.addEventListener('click', async () => {
            try {
                await Rules.loadJSONHandler();
                App.render();
            } catch (error) {
                App.$.fileDisplay.textContent = error.message;
            }
        });
        App.$.fileSave.addEventListener('click', Rules.saveJSONHandler.bind(Rules));
    },
    
    createRuleItem(rule) {
        const li = document.createElement("li");
        li.dataset.id = rule.id;
        insertHTML(
            li,
            `
			<div class="view">
				<label data-rule="rule-label"></label>
			</div>
		    `
        );
        li.querySelector('[data-rule="rule-label"]').textContent = rule.name;
        return li;
    },

    // The main rendering method for updating the UI based on the current state
    render() {
        App.$.fileDisplay.textContent = Rules.toJSON();
        App.$.ruleList.replaceChildren(...Rules.all().map((rule) => App.createRuleItem(rule)));
    },
};

App.init();
