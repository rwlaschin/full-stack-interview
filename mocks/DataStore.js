const sinon = require("sinon");

module.exports = function DataStoreMock() {};

module.exports.prototype.get = sinon.stub();
