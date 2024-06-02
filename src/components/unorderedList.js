
export const createNodeListItem = (node) => {
    const li = document.createElement("li");
    li.textContent = node.calculationName + " : " + node.timeSeriesId;
    if (node.isSchedulingNode === "Y") {
        li.classList.add("scheduling-node");
    }
    return li;
};

export const createRuleListItem = (rule) => {
    const li = document.createElement("li");
    li.textContent = rule.calcRuleId + " - " + rule.calcMode + " " + rule.unaryModifierMode;
    return li;
};
