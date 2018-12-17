require("../RandomTree");

const FastPriorityQueue = require("fastpriorityqueue");

/* istanbul ignore next */
function comparator(a, b) {
    return a.priority > b.priority;
}

/**
 *
 */
module.exports = function RandomForest() {
    var pResults = new FastPriorityQueue(comparator);
    this.trees = [];

    /**
     *
     */
    this.forEach = function(cb) {
        this.trees.some(cb, this.trees);
    };
    /**
     *
     */
    this.grow = function(tree) {
        this.trees.push(tree);
    };
    /**
     *
     */
    this.insert = function(data) {
        this.trees.forEach(tree => {
            tree.insert(data);
        });
    };
    /**
     *
     */
    this.find = function(data, count) {
        var limitedSet = [];
        pResults.trim();
        if (this.trees.length > 0) {
            var ltrees = this.trees.length,
                startPos = Math.round(Math.random() * 1019) % ltrees;
            for (var i = 0, pos = startPos; i < count << 1; i++, pos = ++pos % ltrees) {
                let root = this.trees[pos].findNode(data);
                if (!root) {
                    continue;
                }
                this.trees[pos].traverseInOrderAsNode(root).some(node => {
                    // patch priorities, since values are not calculated unless 'found'
                    if (!node.priority) {
                        node.priority = this.trees[pos].decision.fuzzy(node.data, data);
                    }
                    pResults.add(node);
                });
            }
        }
        while (!pResults.isEmpty()) {
            limitedSet.push(pResults.poll().data);
        }
        return limitedSet;
    };
    /**
     *
     */
    this.reset = function() {
        this.trees = [];
    };
};
