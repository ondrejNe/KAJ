import {ModelController} from "./model/ModelController.js";
import {d3GraphDraw} from "./api/d3Graph.js";
import {d3TreeDraw} from "./api/d3Tree.js";

const DataModel = new ModelController();

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
        
        // Rule list
        ruleListCounter: document.querySelector('[data-rule="rule-list-counter"]'),
        ruleList: document.querySelector('[data-rule="rule-list"]'),
    },

    // The initialization method for setting up event listeners and initial rendering.
    init() {
        DataModel.srStorage.addEventListener("save", App.render);

        // Attach event listeners for file load and save
        App.bindEventListeners();

        // Initial render
        App.render();
    },

    // Method to bind event listeners
    bindEventListeners() {
        App.$.fileLoadBtn.addEventListener('change', (e) =>
            DataModel.srLoadJSONFile(e, App.render)
        );
        App.$.fileSaveBtn.addEventListener('click', (e) =>
            DataModel.srSaveJSONFile(App.render)
        );
        App.$.fileClearBtn.addEventListener('click', (e) =>
            DataModel.srClear(App.render)
        );
        App.$.ruleFilter.addEventListener('input', (e) => {
            DataModel.srSetNodesFiltersFrom(e.target.value);
        });
        App.$.ruleFilter.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                App.render();
            }
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
            App.$.fileShow.textContent = DataModel.srGetJSON();
            Prism.highlightElement(App.$.fileShow);
        }
        if (App.$.graphShow.style.display !== 'none') {
            App.$.graphShow.parentElement.style.overflow = "unset";
            const graph = DataModel.srGetGraph();
            d3GraphDraw(App.$.graphShow, graph.nodes, graph.links);
        }
        if (App.$.treeShow.style.display !== 'none') {
            App.$.treeShow.parentElement.style.overflow = "unset";
            d3TreeDraw(App.$.treeShow, DataModel.srGetTree());
        }

        App.$.ruleListCounter.textContent = 
            "Nodes (" + DataModel.srGetNodesCount() + ") " +
            "Rules (" + DataModel.srGetRulesCount() + ")";
        App.$.ruleList.replaceChildren(...DataModel.srGetSortedNodes().map((node) =>
            App.createListItem(node))
        );
    },

    createListItem(node) {
        const li = document.createElement("li");
        li.textContent = node.calculationName;
        return li;
    },
};

App.init();
