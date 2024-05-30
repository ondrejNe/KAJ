import { loadJSONFile, saveJSONFile } from "../api/file.js";
import { Rule } from './rule.js';

export const RuleStore = class extends EventTarget {

    // Constructor initializes the store with a key for localStorage
    constructor(localStorageKey) {
        super(); // Call the parent class's constructor
        this.localStorageKey = localStorageKey; // Store the localStorage key
        
        // Containers main data store
        this.rules = []
        // Load existing rules from localStorage
        this._readStorage();

        // Event listener to handle changes to localStorage from other windows/tabs
        window.addEventListener(
            "storage",
            () => {
                this._readStorage(); // Reload rules from localStorage
                this._save(); // Save the current state (triggers 'save' event)
            },
            false
        );
    }

    // Private method to read rules from localStorage
    _readStorage() {
        const data = JSON.parse(window.localStorage.getItem(this.localStorageKey) || "[]");
        this.rules = Rule.fromArray(data);
    }

    // Private method to save rules to localStorage and dispatch a 'save' event
    _save() {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.rules.map(rule => rule.toJSON())));
        this.dispatchEvent(new CustomEvent("save"));
    }

    // Public method to update rules with JSON data
    updateWithJSON(json) {
        // Update rules with the provided JSON data
        this.rules = Rule.fromArray(json);
        this._save();
    }

    // Event handler for loading JSON
    async loadJSONHandler() {
        try {
            const json = await loadJSONFile();
            this.updateWithJSON(json);
            return json;  // Resolve the promise with the loaded JSON data
        } catch (error) {
            console.error(error.message);
            throw error;  // Reject the promise with the error
        }
    }

    // Event handler for saving JSON
    saveJSONHandler() {
        saveJSONFile(this.rules);
    }

    toJSON() {
        return JSON.stringify(this.rules.map(rule => rule.toJSON()), null, 4);
    }

    // TODO: GETTER methods to access rule items in various ways
    all() {
        return this.rules
    }
    
    // TODO: MUTATE methods to modify the rules list
};
