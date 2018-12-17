const sinon = require("sinon");

module.exports = function RandomForestMock() {};

module.exports.prototype.grow = sinon.stub();
module.exports.prototype.insert = sinon.stub();
module.exports.prototype.find = sinon.stub();
module.exports.prototype.reset = sinon.stub();
