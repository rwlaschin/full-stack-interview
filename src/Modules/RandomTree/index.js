const Node = require("./Node");

/**
 * RandomTree
 * @param {Decision} decision object
 */
module.exports = function RandomTree(decision) {
    this.decision = decision; // Decision class object
    var base;

    /**
     * Sets the root value or inspects, for testing
     * @param {Node} root fully created Node hierarchy
     * @returns {Node} current root node
     */
    this.root = function(root) {
        if (root) {
            base = root;
        }
        return base;
    };

    /**
     * Add data into the tree, calculates a weight based on existing data and places accordingly
     * @parameter {*} data
     */
    this.insert = function(data) {
        if (!base) {
            base = new Node(data);
            return;
        }
        this.decision.seed();
        var current = base,
            res,
            stack = [],
            height = 0;
        while (current) {
            var res = this.decision.test(current.data, data);
            var direction = "right";
            if (res < 0) {
                direction = "left";
            }
            if (!current[direction]) {
                height = direction === "left" ? -1 : 1;
                current[direction] = new Node(data);
                break;
            }
            stack.push(current);
            current = current[direction];
        }
        for (var i = 0; i < stack.length; i++) {
            stack[i].height += height;
        }
    };

    /**
     * Based on a criteria locates a close match
     * @param {*} criteria, should be compatible with Decision object
     * @returns {*} data
     */
    this.find = function(criteria) {
        var node = this.findNode(criteria);
        return node.data;
    };

    /**
     * Based on a criteria locates a close match
     * @param {*} criteria, should be compatible with Decision object
     * @returns {*} node
     */
    this.findNode = function(criteria) {
        this.decision.seed();
        if (!base) {
            return new Node();
        }
        var current = base;
        while (current) {
            var direction = "right";
            current.priority = this.decision.fuzzy(current.data, criteria);
            var weight = this.decision.compare(current.priority);
            if (weight === 0) {
                return current;
            }
            if (weight < 0) {
                direction = "left";
            }
            if (!current[direction]) {
                // I'm the only one left, pick me, or maybe return nothing??
                return current;
            }
            current = current[direction];
        }
    };

    /**
     * Walks tree in order
     * @param {Node} node, starting point or undefined for root
     * @returns {*} array of item data
     */
    this.traverseInOrder = function(node = base) {
        return this.traverseInOrderAsNode(node).map(item => item.data);
    };

    /**
     * Walks tree in order
     * @param {Node} node, starting point or undefined for root
     * @returns {*} array of nodes
     */
    this.traverseInOrderAsNode = function(node = base) {
        var results = [];
        var stack = [node];
        let current;
        while (stack.length > 0) {
            if (!(current = stack.shift())) continue;
            results.push(current);
            stack.push(current.left);
            stack.push(current.right);
        }
        return results;
    };
    /**
     * Sets object back to initial state, for debugging
     */
    this.reset = function() {
        base = undefined;
    };
};
