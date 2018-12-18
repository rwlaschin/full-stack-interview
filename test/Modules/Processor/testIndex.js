const chai = require("chai");
// const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));

const Module = require("../../../src/Modules/Processor");

const Mocks = {
    RandomForest: require("../../../mocks/RandomForest"),
    RandomTree: require("../../../mocks/RandomTree"),
    Decision: require("../../../mocks/Decision"),
    DataStore: new (require("../../../mocks/DataStore"))(),
};

describe("Processor", function() {
    var location = { latitude: 0, longitude: 0 };
    before(function() {
        Module.set("RandomForest", Mocks.RandomForest);
        Module.set("RandomTree", Mocks.RandomTree);
        Module.set("Decision", Mocks.Decision);
        Module.set("DataStore", Mocks.DataStore);
    });
    afterEach(function() {
        Mocks.RandomForest.prototype.find.resetHistory();
        Mocks.RandomForest.prototype.grow.resetHistory();
        Mocks.RandomForest.prototype.insert.resetHistory();
        Mocks.DataStore.get.resetHistory();
    });
    context("Retrieve", function() {
        it("should return 10 results", function() {
            var data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => ({ id: val }));
            Mocks.RandomForest.prototype.find.withArgs(location, 10).returns(data);

            var res = Module.retrieve(location);
            expect(res).to.have.length(10);
            expect(Mocks.RandomForest.prototype.find).to.be.calledWith(location, 10);
        });
        it("should return 2 results", function() {
            var data = [1, 2].map(val => ({ id: val }));
            Mocks.RandomForest.prototype.find.withArgs(location, 2).returns(data);

            var res = Module.retrieve(location, 2);
            expect(res).to.have.length(2);
            expect(Mocks.RandomForest.prototype.find).to.be.calledWith(location, 2);
        });
        it("should remove duplicates", function() {
            Mocks.RandomForest.prototype.find.withArgs(location, 2).returns([{ id: 1 }, { id: 1 }]);

            var res = Module.retrieve(location, 2);
            expect(res).to.have.length(1);
            expect(Mocks.RandomForest.prototype.find).to.be.calledWith(location, 2);
        });
    });
    context("Get", function() {
        it("should return module", function() {
            var res = Module.get("RandomForest");
            expect(res).to.be.an("object");
        });
        it("should not return module", function() {
            var res = Module.get("NoModule");
            expect(res).to.be.undefined;
        });
    });
    context("Compute", function() {
        afterEach(function() {
            Module.set("RandomTree", Mocks.RandomTree);
            Module.set("Decision", Mocks.Decision);
            Module.set("DataStore", Mocks.DataStore);
        });
        it("should create new dataset", function() {
            Mocks.DataStore.get.returns([1, 2]);
            Module.compute(3);

            expect(Mocks.DataStore.get.callCount).to.equal(3);
            expect(Mocks.RandomForest.prototype.reset).to.be.calledOnce;
            expect(Mocks.RandomTree.prototype.insert.callCount).to.equal(6);
        });
        it("should throw error when RandomTree is undefined", function() {
            Module.set("RandomTree", undefined);

            expect(function() {
                Module.compute();
            }).to.throw();
        });
        it("should throw error when Decision is undefined", function() {
            Module.set("Decision", undefined);

            expect(function() {
                Module.compute();
            }).to.throw();
        });
        it("should throw error when patient data is missing", function() {
            Mocks.DataStore.get.returns(undefined);

            expect(function() {
                Module.compute();
            }).to.not.throw();
        });
        it("should not throw error when DataStore is undefined", function() {
            Module.set("DataStore", undefined);

            expect(function() {
                Module.compute();
            }).to.throw();
        });
    });
});
