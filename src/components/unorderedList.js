
export const createNodeListItem = (node) => {
    const li = document.createElement("li");
    li.textContent = node.calculationName;
    return li;
};

export const createRuleListItem = (rule) => {
    const li = document.createElement("li");
    li.textContent = rule.calcRuleId + " - " + rule.calcMode + " " + rule.unaryModifierMode;
    return li;
};
