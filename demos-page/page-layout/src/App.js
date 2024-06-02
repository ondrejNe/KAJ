import {ModelController} from "./model/ModelController.js";
import {d3GraphDraw} from "./api/d3Graph.js";
import {d3TreeDraw} from "./api/d3Tree.js";
import {jsonSyntaxHighlight} from "./util/json.js";
import {createNodeListItem} from "./components/unorderedList.js";

// Data model of the Scheduling rules
const DataModel = new ModelController();

const App = {
    // A collection of DOM element references for manipulating the UI.
    $: {
        // Presentation (right side)
        fileShow: document.querySelector('[data-rule="file-show"]'),
        graphShow: document.querySelector('[data-rule="graph-show"]'),
        treeShow: document.querySelector('[data-rule="tree-show"]'),

        // Control (left side)
        // file io
        fileLoadBtn: document.querySelector('[data-rule="file-load-button"]'),
        fileSaveBtn: document.querySelector('[data-rule="file-save-button"]'),
        fileClearBtn: document.querySelector('[data-rule="file-clear-button"]'),
        // show UI
        fileShowBtn: document.querySelector('[data-rule="file-show-button"]'),
        graphShowBtn: document.querySelector('[data-rule="graph-show-button"]'),
        treeShowBtn: document.querySelector('[data-rule="tree-show-button"]'),
        // state filter
        dateFilter: document.querySelector('[data-rule="date-filter"]'),
        nodeFilter: document.querySelector('[data-rule="node-filter"]'),

        // Node list (left side)
        nodeListCounter: document.querySelector('[data-rule="node-list-counter"]'),
        nodeList: document.querySelector('[data-rule="node-list"]'),

        // Rule list (left side)
        ruleListCounter: document.querySelector('[data-rule="rule-list-counter"]'),
        ruleList: document.querySelector('[data-rule="rule-list"]'),
    },

    // The initialization method for setting up event listeners and initial rendering.
    init() {
        // Set the date filter to current date
        App.$.dateFilter.valueAsDate = new Date();
        
        // Render on save to local storage
        DataModel.srStorage.addEventListener("save", App.render);

        // Attach event listeners
        App.bindEventListeners();

        // Initial render
        App.render();
    },

    // Method to bind event listeners
    bindEventListeners() {
        // Event listeners for the changes on the data model
        App.$.fileLoadBtn.addEventListener('change', (e) =>
            DataModel.srLoadJSONFile(e, App.render)
        );
        App.$.fileSaveBtn.addEventListener('click', (e) =>
            DataModel.srSaveJSONFile(App.render)
        );
        App.$.fileClearBtn.addEventListener('click', (e) =>
            DataModel.srClear(App.render)
        );
        App.$.nodeFilter.addEventListener('input', (e) => {
            DataModel.srSetNodesFiltersFrom(e.target.value);
        });

        // Event listeners for the changes on the control UI
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
        App.$.nodeFilter.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                App.render();
            }
        });
    },

    // The main rendering method for updating the UI based on the current state
    render() {
        // Presentation (right side) UI updating
        if (App.$.fileShow.style.display !== 'none') {
            App.$.fileShow.parentElement.parentElement.style.overflowY = "scroll";
            App.$.fileShow.innerHTML = jsonSyntaxHighlight(DataModel.srGetJSON());
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

        // List enumeration (left side) UI updating
        App.$.nodeListCounter.textContent = "Nodes (" + DataModel.srGetNodesCount() + ")";
        App.$.nodeList.replaceChildren(...DataModel.srGetSortedNodes().map((node) =>
            createNodeListItem(node))
        );
        App.$.ruleListCounter.textContent = "Rules (" + DataModel.srGetRulesCount() + ")";
        // TODO: Rule list enumeration
    },
};

// Initialize the application
App.init();
