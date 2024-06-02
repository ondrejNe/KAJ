
const { SchedulingRules, CalculationRule, CalculationNode } = require('../model/SchedulingRules');
const { Storage } = require('./Storage'); // Adjust the path as necessary
const { describe, test, beforeEach } = require('@jest/globals');
const { expect } = require('expect');

describe('Storage', () => {
    const localStorageKey = 'calculationRuleStorageKey';
    let storage;

    beforeEach(() => {
        // Clear localStorage before each test
        window.localStorage.clear();
        // Initialize the Storage instance
        storage = new Storage(CalculationRule, localStorageKey);
    });

    test('should initialize with a null object if no data is in localStorage', () => {
        expect(storage.read()).toBeNull();
    });

    test('should save and read an object of the correct type', () => {
        const rule = new CalculationRule(1, 2, 'Sample Calculation');
        storage.save(rule);
        const loadedRule = storage.read();
        expect(loadedRule).toBeInstanceOf(CalculationRule);
        expect(loadedRule.calcRuleId).toBe(1);
        expect(loadedRule.belongsToCalculation).toBe(2);
        expect(loadedRule.calculationName).toBe('Sample Calculation');
    });

    test('should throw error when saving an object of the incorrect type', () => {
        const invalidObject = { some: 'object' }; // Not an instance of CalculationRule
        expect(() => storage.save(invalidObject)).toThrow(TypeError);
    });

    test('should clear the storage and set object to null', () => {
        const rule = new CalculationRule(1, 2, 'Sample Calculation');
        storage.save(rule);
        storage.clear();
        expect(storage.read()).toBeNull();
        expect(window.localStorage.getItem(localStorageKey)).toBeNull();
    });
});
