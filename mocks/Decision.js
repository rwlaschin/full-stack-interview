const sinon = require("sinon");

module.exports = function DecisionMock() {};

module.exports.prototype.seed = sinon.stub();
module.exports.prototype.test = sinon.stub();
module.exports.prototype.fuzzy = sinon.stub();
module.exports.prototype.compare = sinon.stub();

/* istanbul ignore next */
module.exports.prototype.compare.callsFake(function(priority) {
    if (priority >= 7) {
        return 1;
    }
    if (priority < 4) {
        return -1;
    }
    return 0;
});
