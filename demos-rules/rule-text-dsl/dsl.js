class Expression {
    constructor() {
        if (new.target === Expression) {
            throw new TypeError("Cannot construct Expression instances directly");
        }
    }
}

class Position extends Expression {
    constructor(name) {
        super();
        this.name = name;
        this.expression = null;
    }
}

class Operation extends Expression {
    constructor(left, right, operationType) {
        super();
        this.left = left;
        this.right = right;
        this.operationType = operationType;
    }
}

document.getElementById('convertBtn').addEventListener('click', () => {
    const dslInput = document.getElementById('dslInput').value;
    const result = parseDSL(dslInput);
    document.getElementById('result').innerText = JSON.stringify(result, null, 2);
});

function parseDSL(dsl) {
    const positionRegex = /Position\((\w+)\)/g;
    const assignmentRegex = /^Position\((\w+)\)\s*=\s*(.*)$/;
    const operationRegex = /(.+)\s*([+-])\s*(.+)/;

    function createPosition(name) {
        return new Position(name);
    }

    function parseExpression(expression) {
        let match = positionRegex.exec(expression);
        if (match) {
            return createPosition(match[1]);
        }

        match = operationRegex.exec(expression);
        if (match) {
            const left = parseExpression(match[1].trim());
            const right = parseExpression(match[3].trim());
            const operationType = match[2] === '+' ? 'PLUS' : 'MINUS';
            return new Operation(left, right, operationType);
        }

        throw new Error("Invalid DSL expression");
    }

    const assignmentMatch = assignmentRegex.exec(dsl);
    if (assignmentMatch) {
        const positionName = assignmentMatch[1];
        const expression = parseExpression(assignmentMatch[2].trim());
        const position = createPosition(positionName);
        position.expression = expression;
        return position;
    }

    throw new Error("Invalid DSL format");
}
