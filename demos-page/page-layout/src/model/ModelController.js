import {Storage} from "../api/Storage.js";
import {SchedulingRules} from "./SchedulingRules.js";
import {saveJSONFile} from "../api/file.js";

export class ModelController {
    // "Scheduling Rules" internally referred to as "sr"
    constructor() {
        this.srStorage = new Storage(SchedulingRules, "schedulingRules");
        
        this.sr = this.srStorage.read() ?? new SchedulingRules([], [])
        this.srRulesFilters = this.sr.calculationRules.map(rule => rule.calcRuleId);
        this.srNodesFilters = this.sr.calculationNodes.map(node => node.calculationName);
    }

    srLoadJSONFile(event, callback) {
        try {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        // const json = JSON.parse(e.target.result); // Read as text
                        this.srUpdateWithJSON(e.target.result);
                        if (callback) callback();
                    } catch (error) {
                        throw new Error("Error parsing JSON: " + error.message);
                    }
                };
                reader.readAsText(file); // Read file as text
            }
        } catch (error) {
            throw new Error("Error loading file: " + error.message);
        }
    }

    srUpdateWithJSON(json) {
        this.sr = SchedulingRules.fromJSON(json);
        this.srRulesFilters = this.sr.calculationRules.map(rule => rule.calcRuleId);
        this.srNodesFilters = this.sr.calculationNodes.map(node => node.calculationName);

        this.srStorage.save(this.sr);
    }
    
    srSaveJSONFile(callback) {
        const sr = this.srGet();
        saveJSONFile(sr);
        this.srStorage.save(sr);
        if (callback) callback();
    }

    srClear(callback) {
        this.sr = new SchedulingRules([], []);
        this.srNodesFilters = [];
        this.srRulesFilters = [];
        
        this.srStorage.clear();
        
        if (callback) callback();
    }

    srSetNodesFiltersFrom(text) {
        const filters = this.sr.calculationNodes
                .filter(node => node.calculationName.includes(text))
                .map(node => node.calculationName)

        this.srSetNodesFilters(filters)
    }

    srSetNodesFilters(calculationNames) {
        this.srNodesFilters = calculationNames;

        const filters = this.sr.calculationRules
                .filter(rule =>
                    calculationNames.includes(rule.calculationName) ||
                    calculationNames.includes(rule.belongsToCalculation)
                )
                .map(rule => rule.calcRuleId)

        this.srSetRulesFilters(filters);
    }

    srSetRulesFilters(calcRuleIds) {
        this.srRulesFilters = calcRuleIds;
    }

    srGet() {
        return new SchedulingRules(this.srGetRules(), this.srGetNodes());
    }

    srGetJSON() {
        const sr = new SchedulingRules(this.srGetRules(), this.srGetNodes());
        return JSON.stringify(sr, null, 4);
    }
    
    srGetGraph() {
        const nodeNames = new Set();
        const ruleIds = new Set();
        const links = []

        // Root nodes
        this.srGetNodes().forEach(node => {
            nodeNames.add(node.calculationName);
        });

        // Recursive child rules and nodes
        let changing = true;
        do {
            changing = false;
            this.sr.calculationRules
                .filter(rule =>
                    !ruleIds.has(rule.calcRuleId) &&
                    nodeNames.has(rule.belongsToCalculation) &&
                    rule.calculationName !== null
                )
                .forEach(rule => {
                    nodeNames.add(rule.calculationName);
                    ruleIds.add(rule.calcRuleId);
                    changing = true;
                    links.push({
                        source: rule.calculationName,
                        target: rule.belongsToCalculation,
                    });
                });
        } while (changing);

        // Create node objects
        const nodes = [...nodeNames].map(name =>
            ({id: name, name: name})
        );

        return {nodes, links};
    }
    
    srGetTree() {
        let graph = this.srGetGraph();

        // Create node objects
        const nodes = {};
        const nodeNames = graph.nodes.map(node => node.name)
        nodeNames.forEach(name => {
            nodes[name] = { name: name, children: [] };
        });

        // Populate children
        graph.links.forEach(link => {
            if (nodes[link.target]) {
                nodes[link.target].children.push(nodes[link.source]);
            }
        });

        // Find root nodes (nodes that are not a target of any link)
        const rootNodes = [...nodeNames].filter(name =>
            !graph.links.some(link => link.source === name)
        );

        // If there's only one root node, return it; otherwise, create a virtual root
        if (rootNodes.length === 1) {
            return nodes[rootNodes[0]];
        } else {
            return {
                name: "Root",
                children: rootNodes.map(name => nodes[name])
            };
        }
    }

    srGetNodes() {
        return this.sr.calculationNodes
            .filter(node => this.srNodesFilters.includes(node.calculationName));
    }
    
    srGetNodesCount() {
        return this.srGetNodes().length;
    }
    
    srGetSortedNodes() {
        console.log(this.srGetNodes());
        return this.srGetNodes().sort((a, b) => a.calculationName.localeCompare(b.calculationName));
    }

    srGetRules() {
        return this.sr.calculationRules
            .filter(rule => this.srRulesFilters.includes(rule.calcRuleId));
    }

    srGetRulesCount() {
        return this.srGetRules().length;
    }
}
