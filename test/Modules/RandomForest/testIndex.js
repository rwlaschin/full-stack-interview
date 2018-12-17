const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));

const ModuleClass = require("../../../src/Modules/RandomForest");

describe("RandomForest", function() {
    var Module = new ModuleClass();
    before(function() {});
    afterEach(function() {});
    after(function() {});
    context("Initialization", function() {
        it("should export a function", function() {
            expect(ModuleClass).to.be.a("function");
        });
    });
    context("forEach", function() {
        before(function() {
            Module.trees = [1, 2, 3, 4];
        });
        afterEach(function() {
            Module.reset();
        });
        it("should iterate through array", function() {
            var count = 0;
            Module.forEach((item, cnt) => {
                count++;
                expect(item).to.equal(Module.trees[cnt]);
            });
            expect(count).to.equal(Module.trees.length);
        });
    });
    context("Grow", function() {
        afterEach(function() {
            Module.reset();
        });
        it("should add item to list", function() {
            Module.grow(1);
            expect(1).to.equal(Module.trees.length);
        });
    });
    context("Add", function() {
        var stub;
        before(function() {
            stub = sinon.stub();
            Module.trees = [{ insert: stub }, { insert: stub }, { insert: stub }, { insert: stub }];
        });
        afterEach(function() {
            stub.resetHistory();
        });
        it("should iterate through all trees with data", function() {
            Module.insert(2);
            expect(stub.callCount).to.equal(4);
            expect(stub.calledWith(2)).to.be.true;
        });
    });
    context("Find", function() {
        before(function() {
            Module.trees = [];
            Math.random = sinon.stub(Math, "random");
        });
        afterEach(function() {
            Math.random.resetHistory();
        });
        after(function() {
            Module.reset();
            Math.random.restore();
        });
        it("should return empty array with no data", function() {
            var ret = Module.find(1, 10);
            expect(ret).to.be.empty;
        });
        it("should not process if node is null", function() {
            var stub = sinon.stub();
            stub.returns(undefined);
            Math.random.returns(0.5);
            Module.trees = [{ findNode: stub }];
            var ret = Module.find(1, 1);
            expect(ret).to.be.empty;
        });
        it("should skip returned empty data from traverse", function() {
            var node = { priority: 1, data: "1" };
            var stub = sinon.stub();
            var tree = { findNode: stub, traverseInOrderAsNode: stub };

            Module.trees = [tree, tree];

            stub.withArgs(1)
                .onCall(0)
                .returns(node);
            stub.withArgs(node)
                .onCall(0)
                .returns([]);
            Math.random.returns(0);

            var ret = Module.find(1, 1);
            expect(ret).to.be.empty;
        });
        it("should add data for output", function() {
            var node = { priority: 8.1, data: "1" };
            var stub = sinon.stub();
            var tree = { findNode: stub, traverseInOrderAsNode: stub };

            Module.trees = [tree, tree];

            stub.withArgs(1)
                .onCall(0)
                .returns(node);
            stub.withArgs(node)
                .onCall(0)
                .returns([node]);
            Math.random.returns(0);

            var ret = Module.find(1, 1);
            expect(ret).to.eql(["1"]);
        });
        it("should update priority for output data", function() {
            var node = { data: "1" };
            var stub = sinon.stub();
            var tree = { findNode: stub, traverseInOrderAsNode: stub, decision: { fuzzy: stub } };

            Module.trees = [tree, tree];

            stub.withArgs(1)
                .onCall(0)
                .returns(node);
            stub.withArgs(node)
                .onCall(0)
                .returns([node]);
            stub.withArgs("1", 1)
                .onCall(0)
                .returns(10);
            Math.random.returns(0);

            var ret = Module.find(1, 1);
            expect(ret).to.eql(["1"]);
        });
    });
    context("Reset", function() {
        it("should reset trees variables", function() {
            Module.trees = [1, 2, 3];
            Module.reset();
            expect(Module.trees).to.be.empty;
        });
    });
});
