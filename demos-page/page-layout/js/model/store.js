import { saveJSONFile } from "../api/file.js";
import { Rule } from './rule.js';

export const RuleStore = class extends EventTarget {

    // Constructor initializes the store with a key for localStorage
    constructor(localStorageKey) {
        super(); // Call the parent class's constructor
        this.localStorageKey = localStorageKey; // Store the localStorage key
        
        // Containers main data store
        this.rules = []
        this.rulesFiltered = []
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
        this.rulesFiltered = this.rules.map(rule => rule.name);
    }

    // Private method to save rules to localStorage and dispatch a 'save' event
    _save() {
        window.localStorage.setItem(this.localStorageKey, JSON.stringify(this.rules.map(rule => rule.toJSON())));
        this.dispatchEvent(new CustomEvent("save"));
    }

    // Event handler for loading JSON
    loadJSONHandler(file) {
        return new Promise((resolve, reject) => {
            try {
                const json = JSON.parse(file);
                this.updateWithJSON(json);
                resolve(json);
            } catch (error) {
                reject(new Error("Error parsing JSON: " + error.message));
            }
        });
    }

    // Event handler for saving JSON
    saveJSONHandler() {
        saveJSONFile(this.rules);
    }
    
    clearJSONHandler() {
        this.rules = [];
        this.rulesFiltered = [];
        this._save();
    }

    updateWithJSON(json) {
        // Update rules with the provided JSON data
        this.rules = Rule.fromArray(json);
        this.rulesFiltered = this.rules.map(rule => rule.name);
        this._save();
    }

    toJSON() {
        return JSON.stringify(this.rules.map(rule => rule.toJSON()), null, 4);
    }
    
    filter(text) {
        this.rulesFiltered = this.rules.map(rule => rule.name).filter(rule => rule.includes(text));
    }
    
    all() {
        return this.rules.filter(rule => this.rulesFiltered.includes(rule.name));
    }
};
