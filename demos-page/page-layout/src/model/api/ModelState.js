import {SchedulingRules} from "../SchedulingRules.js";
import {saveJSONFile} from "../../api/file.js";
import {Storage} from "../../api/Storage.js";

export class ModelState {
    // "Scheduling Rules" internally referred to as "sr"
    constructor() {
        // Local storage
        this.srStorage = new Storage(SchedulingRules, "schedulingRules");

        // State variables
        this.sr = this.srStorage.read() ?? new SchedulingRules([], [])
        this.srRulesFilters = this.sr.calculationRules.map(rule => rule.calcRuleId);
        this.srNodesFilters = this.sr.calculationNodes.map(node => node.calculationName);
    }

    /**
     * IO operations
     */
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

    /**
     * IO operations
     */
    srSaveJSONFile(callback) {
        const sr = this.srGet();
        saveJSONFile(sr);
        this.srStorage.save(sr);
        if (callback) callback();
    }

    /**
     * State shuffling
     */
    srUpdateWithJSON(json) {
        // Total state update
        this.sr = SchedulingRules.fromJSON(json);
        this.srRulesFilters = this.sr.calculationRules.map(rule => rule.calcRuleId);
        this.srNodesFilters = this.sr.calculationNodes.map(node => node.calculationName);

        this.srStorage.save(this.sr);
    }

    /**
     * State shuffling
     */
    srClear(callback) {
        // Total state clear
        this.sr = new SchedulingRules([], []);
        this.srNodesFilters = [];
        this.srRulesFilters = [];

        this.srStorage.clear();

        if (callback) callback();
    }

    /**
     * State filter mask shuffling
     */
    srSetNodesFiltersFrom(text) {
        const filters = this.sr.calculationNodes
            .filter(node => node.calculationName.includes(text))
            .map(node => node.calculationName)

        this.srSetNodesFilters(filters)
    }

    /**
     * State filter mask shuffling
     */
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

    /**
     * State filter mask shuffling
     */
    srSetRulesFilters(calcRuleIds) {
        this.srRulesFilters = calcRuleIds;
    }

    // TODO: Quite a lot of unnecessary filtering, perhaps some cashing and 
    //  hashing for model state change signaling would be nice on large instances
    
    /**
     * State retrieval
     */
    srGet() {
        return new SchedulingRules(this.srGetRules(), this.srGetNodes());
    }

    /**
     * State retrieval
     */
    srGetNodes() {
        return this.sr.calculationNodes
            .filter(node => this.srNodesFilters.includes(node.calculationName));
    }

    /**
     * State retrieval
     */
    srGetNodesCount() {
        return this.srGetNodes().length;
    }

    /**
     * State retrieval
     */
    srGetSortedNodes() {
        return this.srGetNodes()
            .sort((a, b) => a.calculationName.localeCompare(b.calculationName));
    }

    /**
     * State retrieval
     */
    srGetRules() {
        return this.sr.calculationRules
            .filter(rule => this.srRulesFilters.includes(rule.calcRuleId));
    }

    /**
     * State retrieval
     */
    srGetRulesCount() {
        return this.srGetRules().length;
    }

    /**
     * State retrieval
     */
    srGetSortedRules() {
        return this.srGetRules()
            .sort((a, b) => a.calcRuleId.localeCompare(b.calcRuleId));
    }
}