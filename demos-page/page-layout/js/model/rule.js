export class Rule {
    constructor(id, name) {
        this.id = id;
        this.name = name;
    }

    // Optional: Method to convert the object to JSON
    toJSON() {
        return {
            id: this.id,
            name: this.name,
        };
    }

    // Static method to create a Rule instance from a plain object
    static fromObject(obj) {
        return new Rule(obj.id, obj.name);
    }

    // Static method to create an array of Rule instances from an array of plain objects
    static fromArray(arr) {
        return arr.map(item => Rule.fromObject(item));
    }
}
