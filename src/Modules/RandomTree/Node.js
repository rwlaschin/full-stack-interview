/**
 * Node object used in Trees
 */
module.exports = function Node(data) {
    this.left = undefined;
    this.right = undefined;
    this.priority = undefined; // weighted priority value, cached
    this.data = data;
};

module.exports.prototype.left = undefined;
module.exports.prototype.right = undefined;
module.exports.prototype.priority = undefined;
module.exports.prototype.data = undefined;
