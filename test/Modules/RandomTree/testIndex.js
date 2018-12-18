const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));

const DecisionClass = require("../../../mocks/Decision");
const ModuleClass = require("../../../src/Modules/RandomTree");
const Node = require("../../../src/Modules/RandomTree/Node");

describe("RandomTree", function() {
    var Module,
        Decision = new DecisionClass();
    before(function() {
        Module = new ModuleClass(Decision);
    });
    afterEach(function() {
        DecisionClass.prototype.seed.resetHistory();
        DecisionClass.prototype.test.resetHistory();
        DecisionClass.prototype.fuzzy.resetHistory();
        DecisionClass.prototype.compare.resetHistory();
        Module.reset();
    });
    context("Traverse In Order", function() {
        it("should return empty when initialized", function() {
            var results = Module.traverseInOrder();
            expect(results).to.be.empty;
        });
        it("should return [1]", function() {
            Module.root(new Node(1));
            var results = Module.traverseInOrder();
            expect(results).to.eql([1]);
        });
        it("should return [1,2,3] when adding all to right", function() {
            var base = new Node(1);
            base.right = new Node(2);
            base.right.right = new Node(3);
            Module.root(base);

            var results = Module.traverseInOrder();
            expect(results).to.eql([1, 2, 3]);
        });
        it("should return [1,2,3] when adding mixed left/right", function() {
            var base = new Node(1);
            base.left = new Node(2);
            base.right = new Node(3);
            Module.root(base);

            var results = Module.traverseInOrder();
            expect(results).to.eql([1, 2, 3]);
        });
        it("should return [4,2,6,1,3,5,7]", function() {
            var base = new Node(4);
            base.left = new Node(2);
            base.left.left = new Node(1);
            base.left.right = new Node(3);
            base.right = new Node(6);
            base.right.left = new Node(5);
            base.right.right = new Node(7);
            Module.root(base);

            var results = Module.traverseInOrder();
            expect(results).to.eql([4, 2, 6, 1, 3, 5, 7]);
        });
        it("should traverse starting a node 6 and return [6,5,7]", function() {
            var base = new Node(4);
            base.left = new Node(2);
            base.left.left = new Node(1);
            base.left.right = new Node(3);
            base.right = new Node(6);
            base.right.left = new Node(5);
            base.right.right = new Node(7);
            Module.root(base);

            var results = Module.traverseInOrder(base.right);
            expect(results).to.eql([6, 5, 7]);
        });
    });
    context("Insert", function() {
        it("should create a new node when empty", function() {
            Module.insert(1);
            const root = Module.root();
            expect(root).to.be.an("object");
            expect(root.data).to.equal(1);
            expect(root.left).to.be.undefined;
            expect(root.right).to.be.undefined;
        });
        it("should add a new node on the left", function() {
            DecisionClass.prototype.test.callsFake((a, b) => b - a);
            Module.root(new Node(2));

            Module.insert(1);
            const root = Module.root();
            expect(root.left).to.be.an("object");
            expect(root.left.data).to.equal(1);
            expect(root.right).to.be.undefined;
        });
        it("should add a new node on the right", function() {
            DecisionClass.prototype.test.callsFake((a, b) => b - a);
            Module.root(new Node(2));

            Module.insert(3);
            const root = Module.root();
            expect(root.right).to.be.an("object");
            expect(root.right.data).to.equal(3);
            expect(root.left).to.be.undefined;
        });
        it("should add a new node at end of right", function() {
            DecisionClass.prototype.test.callsFake((a, b) => b - a);
            var base = new Node(3);
            base.right = new Node(4);
            Module.root(base);

            Module.insert(5);
            const root = Module.root();
            expect(root.right.right).to.be.an("object");
            expect(root.right.right.data).to.equal(5);
        });
        it("should add a new node at end of left", function() {
            DecisionClass.prototype.test.callsFake((a, b) => b - a);
            var base = new Node(3);
            base.left = new Node(2);
            Module.root(base);

            Module.insert(1);
            const root = Module.root();
            expect(root.left.left).to.be.an("object");
            expect(root.left.left.data).to.equal(1);
        });
    });
    context("Find", function() {
        before(function() {
            Module.findNode = sinon.stub(Module, "findNode");
        });
        afterEach(function() {
            Module.findNode.resetHistory();
        });
        after(function() {
            Module.findNode.restore();
        });
        it("should return undefined", function() {
            Module.findNode.returns(new Node());
            Module.reset();
            var ret = Module.find(1);
            expect(ret).to.be.undefined;
        });
        it("should return 1", function() {
            Module.findNode.returns(new Node(1));
            Module.reset();
            var ret = Module.find(1);
            expect(ret).to.equal(1);
        });
    });
    context("Find Node", function() {
        beforeEach(function() {
            var base = new Node(1);
            base.left = new Node(2);
            base.right = new Node(3);
            Module.root(base);
        });
        it("should return undefined", function() {
            Module.reset();
            var ret = Module.findNode(1);
            expect(ret.data).to.be.undefined;
        });
        it("should return 1", function() {
            DecisionClass.prototype.compare
                .onCall(0)
                .returns(0)
                .onCall(1)
                .throws("Unexpected call");
            var ret;
            expect(function() {
                ret = Module.findNode(2);
            }).to.not.throw("Unexpected call");
            expect(ret.data).to.equal(1);
        });
        it("should return 2", function() {
            DecisionClass.prototype.compare
                .onCall(0)
                .returns(-1)
                .onCall(1)
                .returns(0)
                .onCall(2)
                .throws("Unexpected call");
            var ret;
            expect(function() {
                ret = Module.findNode(2);
            }).to.not.throw("Unexpected call");
            expect(ret.data).to.equal(2);
        });
        it("should return 3", function() {
            DecisionClass.prototype.compare
                .onCall(0)
                .returns(1)
                .onCall(1)
                .returns(0)
                .onCall(2)
                .throws("Unexpected call");
            var ret;
            expect(function() {
                ret = Module.findNode(3);
            }).to.not.throw("Unexpected call");
            expect(ret.data).to.equal(3);
        });
        it("should return 3 after hitting end", function() {
            DecisionClass.prototype.compare
                .onCall(0)
                .returns(1)
                .onCall(1)
                .returns(1)
                .onCall(2)
                .throws("Unexpected call");
            var ret;
            expect(function() {
                ret = Module.findNode(3);
            }).to.not.throw("Unexpected call");
            expect(ret.data).to.equal(3);
        });
        it("should return 2 after hitting end", function() {
            DecisionClass.prototype.compare
                .onCall(0)
                .returns(-1)
                .onCall(1)
                .returns(-1)
                .onCall(2)
                .throws("Unexpected call");
            var ret;
            expect(function() {
                ret = Module.findNode(2);
            }).to.not.throw("Unexpected call");
            expect(ret.data).to.equal(2);
        });
    });
});
