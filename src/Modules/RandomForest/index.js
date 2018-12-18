require("../RandomTree");

const FastPriorityQueue = require("fastpriorityqueue");

/* istanbul ignore next */
function comparator(a, b) {
    return a.priority > b.priority;
}

/**
 * Creates multiple sets of tiered data results for predictive matching
 */
module.exports = function RandomForest() {
    var pResults = new FastPriorityQueue(comparator);
    this.trees = [];

    /**
     * Utility function for looping through trees for running an operation across all objects
     * @param {Function} cb function (item,index), return true to stop looping
     */
    this.forEach = function(cb) {
        this.trees.some(cb, this.trees);
    };
    /**
     * Adds new data set
     * @param {RandomTree} module
     */
    this.grow = function(tree) {
        this.trees.push(tree);
    };

    /**
     * Insert data into all datasets
     * @param {*} data
     */
    this.insert = function(data) {
        this.trees.forEach(tree => {
            tree.insert(data);
        });
    };

    /**
     * Finds a set of possible matches
     * @param {*} data to be passed in as arguments to tree(s)
     * @param {Number} count minimum number of results
     * @returns {Array} results, in the form of the stored data
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
        // output is an array so convert from priority queue to array
        while (!pResults.isEmpty()) {
            limitedSet.push(pResults.poll().data);
        }
        return limitedSet;
    };

    /**
     * Sets class back to starting state
     */
    this.reset = function() {
        this.trees = [];
    };
};
