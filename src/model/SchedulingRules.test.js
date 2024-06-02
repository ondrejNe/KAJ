
const { SchedulingRules, CalculationRule, CalculationNode } = require('./SchedulingRules');
const { describe, test } = require("@jest/globals");
const { expect} = require("expect");

describe('SchedulingRules', () => {
    test('should deserialize correctly from JSON', () => {
        const json = JSON.stringify({
            calculationRules: [
                {
                    calcRuleId: 1,
                    belongsToCalculation: 2,
                    calculationName: 'Calc 1',
                    vppMemberId: 'vpp1',
                    calcMode: 'mode1',
                    unaryModifierMode: 'modifier1',
                    unaryModifierValue: 10,
                    calcRuleValidStart: '2023-01-01T00:00:00Z',
                    calcRuleValidEnd: '2023-12-31T23:59:59Z'
                }
            ],
            calculationNodes: [
                {
                    calculationName: 'CalcNode 1',
                    isSchedulingNode: true,
                    isControllingNode: false,
                    scheduleSender: 'sender1',
                    scheduleReceiver: 'receiver1',
                    balanceGridEidSrc: 'eidSrc1',
                    balanceGridEidTarget: 'eidTarget1',
                    tsoEicSrc: 'eicSrc1',
                    tsoEicTarget: 'eicTarget1',
                    scheduleSenderEmail: 'sender1@example.com',
                    scheduleSenderEmailBackup: 'sender1backup@example.com',
                    businessType: 'type1',
                    timeSeriesId: 'ts1',
                    nodeValidStart: '2023-01-01T00:00:00Z',
                    nodeValidEnd: '2023-12-31T23:59:59Z'
                }
            ]
        });

        const schedulingRules = SchedulingRules.fromJSON(json);

        expect(schedulingRules).toBeInstanceOf(SchedulingRules);
        expect(schedulingRules.calculationRules).toHaveLength(1);
        expect(schedulingRules.calculationNodes).toHaveLength(1);

        const rule = schedulingRules.calculationRules[0];
        expect(rule).toBeInstanceOf(CalculationRule);
        expect(rule.calcRuleId).toBe(1);
        expect(rule.calculationName).toBe('Calc 1');

        const node = schedulingRules.calculationNodes[0];
        expect(node).toBeInstanceOf(CalculationNode);
        expect(node.calculationName).toBe('CalcNode 1');
        expect(node.scheduleSenderEmail).toBe('sender1@example.com');
    });
});

describe('CalculationRule', () => {
    test('should deserialize correctly from JSON', () => {
        const json = JSON.stringify({
            calcRuleId: 1,
            belongsToCalculation: 2,
            calculationName: 'Calc 1',
            vppMemberId: 'vpp1',
            calcMode: 'mode1',
            unaryModifierMode: 'modifier1',
            unaryModifierValue: 10,
            calcRuleValidStart: '2023-01-01T00:00:00Z',
            calcRuleValidEnd: '2023-12-31T23:59:59Z'
        });

        const rule = CalculationRule.fromJSON(json);

        expect(rule).toBeInstanceOf(CalculationRule);
        expect(rule.calcRuleId).toBe(1);
        expect(rule.calculationName).toBe('Calc 1');
    });
});

describe('CalculationNode', () => {
    test('should deserialize correctly from JSON', () => {
        const json = JSON.stringify({
            calculationName: 'CalcNode 1',
            isSchedulingNode: true,
            isControllingNode: false,
            scheduleSender: 'sender1',
            scheduleReceiver: 'receiver1',
            balanceGridEidSrc: 'eidSrc1',
            balanceGridEidTarget: 'eidTarget1',
            tsoEicSrc: 'eicSrc1',
            tsoEicTarget: 'eicTarget1',
            scheduleSenderEmail: 'sender1@example.com',
            scheduleSenderEmailBackup: 'sender1backup@example.com',
            businessType: 'type1',
            timeSeriesId: 'ts1',
            nodeValidStart: '2023-01-01T00:00:00Z',
            nodeValidEnd: '2023-12-31T23:59:59Z'
        });

        const node = CalculationNode.fromJSON(json);

        expect(node).toBeInstanceOf(CalculationNode);
        expect(node.calculationName).toBe('CalcNode 1');
        expect(node.scheduleSenderEmail).toBe('sender1@example.com');
    });
});
