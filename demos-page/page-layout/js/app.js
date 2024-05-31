import { RuleStore } from "./model/store.js";
import { drawGraph } from "./api/graph.js";
import { drawTree } from "./api/tree.js";

const Rules = new RuleStore("rule-store");

const App = {
    // A collection of DOM element references and utility methods for manipulating the UI.
    $: {
        // Controls
        fileLoadBtn: document.querySelector('[data-rule="file-load-button"]'),
        fileSaveBtn: document.querySelector('[data-rule="file-save-button"]'),
        fileClearBtn: document.querySelector('[data-rule="file-clear-button"]'),
        fileShowBtn: document.querySelector('[data-rule="file-show-button"]'),
        graphShowBtn: document.querySelector('[data-rule="graph-show-button"]'),
        treeShowBtn: document.querySelector('[data-rule="tree-show-button"]'),
        ruleFilter: document.querySelector('[data-rule="rule-filter"]'),
        
        // Presentation
        fileShow: document.querySelector('[data-rule="file-show"]'),
        graphShow: document.querySelector('[data-rule="graph-show"]'),
        treeShow: document.querySelector('[data-rule="tree-show"]'),
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
                    App.$.fileShow.textContent = error.message;
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
        App.$.fileShowBtn.addEventListener('click', (e) => {
            App.$.fileShow.style.display = '';
            App.$.graphShow.style.display = 'none';
            App.$.treeShow.style.display = 'none';
            App.render();
        });
        App.$.graphShowBtn.addEventListener('click', (e) => {
            App.$.fileShow.style.display = 'none';
            App.$.graphShow.style.display = '';
            App.$.treeShow.style.display = 'none';
            App.render();
        });
        App.$.treeShowBtn.addEventListener('click', (e) => {
            App.$.fileShow.style.display = 'none';
            App.$.graphShow.style.display = 'none';
            App.$.treeShow.style.display = '';
            App.render();
        });
    },

    // The main rendering method for updating the UI based on the current state
    render() {
        if (App.$.fileShow.style.display !== 'none') {
            App.$.fileShow.parentElement.parentElement.style.overflowY = "scroll";
            App.$.fileShow.textContent = Rules.toJSON();
            Prism.highlightElement(App.$.fileShow);
        }
        if (App.$.graphShow.style.display !== 'none') {
            App.$.graphShow.parentElement.style.overflow = "unset";
            // TODO: dummy data
            const nodes = [];
            nodes.push({
                id: "A node",
                name: "A node",
            });
            nodes.push({
                id: "B node",
                name: "B node",
            });
            nodes.push({
                id: "C node",
                name: "C node",
            });
            nodes.push({
                id: "D node",
                name: "D node",
            });
            const links = [];
            links.push({
                source: "A node",
                target: "B node"
            });
            links.push({
                source: "D node",
                target: "C node"
            });
            drawGraph(App.$.graphShow, nodes, links);
        }
        if (App.$.treeShow.style.display !== 'none') {
            App.$.treeShow.parentElement.style.overflow = "unset";
            // TODO: dummy data
            const data = {
                "name": "Root",
                "children": [
                    {
                        "name": "Child 1",
                        "children": [
                            { "name": "Child 1.1" },
                            { "name": "Child 1.2" }
                        ]
                    },
                    { "name": "Child 2" }
                ]
            };
            drawTree(App.$.treeShow, data);
        }

        App.$.ruleList.replaceChildren(...Rules.all().map((rule) => App.createRuleItem(rule)));
    },

    createRuleItem(rule) {
        const li = document.createElement("li");
        li.textContent = rule.name;
        return li;
    },
};

App.init();
