/**
 *
 */
module.exports = function Node(data) {
    this.left = undefined;
    this.right = undefined;
    this.height = 0;
    this.priority = undefined;
    this.data = data;
};

module.exports.prototype.left = undefined;
module.exports.prototype.right = undefined;
module.exports.prototype.priority = undefined;
module.exports.prototype.data = undefined;
module.exports.prototype.height = undefined;
