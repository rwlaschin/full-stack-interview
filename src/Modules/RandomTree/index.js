const Node = require("./Node");

module.exports = function RandomTree(decision) {
    // decision is an object with 3 functions
    // test (Node,Data) returns -1,1,0 (left, right, equal)
    // fuzzy (Node,Data) returns -1,1,0 (left, right, equal)
    // seed () generates seeds for change fuzzy logic
    // weight, return the previously calculated weight before clamping

    this.decision = decision;
    var base, weight;

    /**
     *
     */
    this.root = function(root) {
        if (root) {
            base = root;
        }
        return base;
    };
    /**
     *
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
     *
     */
    this.find = function(criteria) {
        var node = this.findNode(criteria);
        return node.data;
    };
    /**
     *
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
     * Balance the entire tree
     */
    this.balance = function() {
        // find branches that are not balanced and rebalance
        throw new Error("Not implemented yet");
    };
    /**
     * Balance a single node, this will balance the tree over time
     */
    this.balanceSingle = function() {
        function findLast(node, direction, parent) {
            while (node[direction]) {
                parent = node;
                node = node[direction];
            }
            parent[direction] = undefined;
            return node;
        }

        var current = base,
            stack = [],
            direction = 0;
        // find a node that is +2,+1
        // balance and correct count
        while (current) {
            direction = current.height.left - current.height.right;
            if (Math.abs(direction) > 1) {
                break;
            }
            stack.push(current);
            if (current.height.left > current.height.right) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        /*
                    8           7
                 4    9      4     8
               3   6       3   6      9
              1 2 5 7     1 2 5
*/

        /*
                    8         7      8       7   8
                 4    9      5      4 9     5      6
               3   7               3       4
              1   5               1       3
                                         1
              */

        function moveChildBranches(current, child, direction) {
            if (child[direction] === current) {
                // skip if the two nodes are the same
                child = child[direction];
            }
            while (current[direction]) {
                // find the last node in direction
                current = current[diretion];
            }
            // move
            current[direction] = child[direction];
        }

        if (current) {
            (direction = direction < 0 ? "left" : "right"), (counter = direction > 0 ? "left" : "right");
            var node = findLast(current[direction < 0 ? "left" : "right"], counter, current);
            moveChildBranches(node, current, direction);
            node[counter] = current; // root becomes child
            current[direction] = undefined; // clear the root leaves
            if (current == base) {
                // assign the new node to the parent
                base = node;
            } else {
                stack[stack.length - 1][counter] = node;
            }
        }

        // recalculate heights
    };
    /**
     *
     */
    this.traverseInOrder = function(node = base) {
        return this.traverseInOrderAsNode(node).map(item => item.data);
    };
    /**
     *
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
     *
     */
    this.reset = function() {
        base = undefined;
        weight = undefined;
    };
};
