
/**
 * Wrapper class for scheduling rules.
 */
export class SchedulingRules {
    constructor(rules, nodes) {
        this.calculationRules = rules;
        this.calculationNodes = nodes;
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new SchedulingRules(
            data.calculationRules.map(rule => CalculationRule.fromObject(rule)),
            data.calculationNodes.map(node => CalculationNode.fromObject(node))
        );
    }

    static fromObject(obj) {
        return new SchedulingRules(
            obj.calculationRules.map(rule => CalculationRule.fromObject(rule)),
            obj.calculationNodes.map(node => CalculationNode.fromObject(node))
        );
    }
}

/**
 * Relationship between nodes.
 */
export class CalculationRule {
    constructor(
        calcRuleId,
        belongsToCalculation,
        calculationName,
        vppMemberId,
        calcMode,
        unaryModifierMode,
        unaryModifierValue,
        calcRuleValidStart,
        calcRuleValidEnd,
    ) {
        this.calcRuleId = calcRuleId;
        this.belongsToCalculation = belongsToCalculation;
        this.calculationName = calculationName;
        this.vppMemberId = vppMemberId;
        this.calcMode = calcMode;
        this.unaryModifierMode = unaryModifierMode;
        this.unaryModifierValue = unaryModifierValue;
        this.calcRuleValidStart = calcRuleValidStart;
        this.calcRuleValidEnd = calcRuleValidEnd;
    }

    static fromJSON(json) {
        console.log(json);
        const data = JSON.parse(json);
        console.log(data);
        return new CalculationRule(
            data.calcRuleId,
            data.belongsToCalculation,
            data.calculationName,
            data.vppMemberId,
            data.calcMode,
            data.unaryModifierMode,
            data.unaryModifierValue,
            data.calcRuleValidStart,
            data.calcRuleValidEnd,
        );
    }

    static fromObject(obj) {
        return new CalculationRule(
            obj.calcRuleId,
            obj.belongsToCalculation,
            obj.calculationName,
            obj.vppMemberId,
            obj.calcMode,
            obj.unaryModifierMode,
            obj.unaryModifierValue,
            obj.calcRuleValidStart,
            obj.calcRuleValidEnd
        );
    }
}

/**
 * Foundational unit of the scheduling rules.
 */
export class CalculationNode {
    constructor(
        calculationName,
        isSchedulingNode,
        isControllingNode,
        scheduleSender,
        scheduleReceiver,
        balanceGridEidSrc,
        balanceGridEidTarget,
        tsoEicSrc,
        tsoEicTarget,
        scheduleSenderEmail,
        scheduleSenderEmailBackup,
        businessType,
        timeSeriesId,
        nodeValidStart,
        nodeValidEnd,
    ) {
        this.calculationName = calculationName;
        this.isSchedulingNode = isSchedulingNode;
        this.isControllingNode = isControllingNode;
        this.scheduleSender = scheduleSender;
        this.scheduleReceiver = scheduleReceiver;
        this.balanceGridEidSrc = balanceGridEidSrc;
        this.balanceGridEidTarget = balanceGridEidTarget;
        this.tsoEicSrc = tsoEicSrc;
        this.tsoEicTarget = tsoEicTarget;
        this.scheduleSenderEmail = scheduleSenderEmail;
        this.scheduleSenderEmailBackup = scheduleSenderEmailBackup;
        this.businessType = businessType;
        this.timeSeriesId = timeSeriesId;
        this.nodeValidStart = nodeValidStart;
        this.nodeValidEnd = nodeValidEnd;
    }

    static fromJSON(json) {
        const data = JSON.parse(json);
        return new CalculationNode(
            data.calculationName,
            data.isSchedulingNode,
            data.isControllingNode,
            data.scheduleSender,
            data.scheduleReceiver,
            data.balanceGridEidSrc,
            data.balanceGridEidTarget,
            data.tsoEicSrc,
            data.tsoEicTarget,
            data.scheduleSenderEmail,
            data.scheduleSenderEmailBackup,
            data.businessType,
            data.timeSeriesId,
            data.nodeValidStart,
            data.nodeValidEnd,
        );
    }

    static fromObject(obj) {
        return new CalculationNode(
            obj.calculationName,
            obj.isSchedulingNode,
            obj.isControllingNode,
            obj.scheduleSender,
            obj.scheduleReceiver,
            obj.balanceGridEidSrc,
            obj.balanceGridEidTarget,
            obj.tsoEicSrc,
            obj.tsoEicTarget,
            obj.scheduleSenderEmail,
            obj.scheduleSenderEmailBackup,
            obj.businessType,
            obj.timeSeriesId,
            obj.nodeValidStart,
            obj.nodeValidEnd
        );
    }
}
