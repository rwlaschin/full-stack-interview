const sinon = require("sinon");

module.exports = function RandomTreeMock() {};

module.exports.prototype.insert = sinon.stub();
