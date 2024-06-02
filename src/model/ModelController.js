
import {SchedulingRules} from "./SchedulingRules.js";
import {ModelState} from "./api/ModelState.js";

/** 
 * Mode controller.
 */
export class ModelController extends ModelState {
    constructor() {
        super();
    }

    /**
     * File show model state transformation.
     */
    srGetJSON() {
        return JSON.stringify(this.srGetSchedulingRules(), null, 4);
    }

    /**
     * Graph show model state transformation.
     */
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

    /**
     * Tree show model state transformation.
     */
    srGetTree() {
        let graph = this.srGetGraph();

        // Create node objects
        const nodes = {};
        const nodeNames = [];
        graph.nodes.forEach(node => {
            nodeNames.push(node.name);
            nodes[node.name] = {
                name: node.name,
                children: [],
            };
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
}
