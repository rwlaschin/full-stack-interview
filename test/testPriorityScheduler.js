const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));
chai.use(require("chai-as-promised"));

const Processor = require("../src/Modules/Processor");
const DataStore = require("../src/Modules/DataStore");
const Module = require("../PriorityScheduler");

describe("PrioritySchedule", function() {
    context("Get", function() {
        before(function() {
            Processor.retrieve = sinon.stub(Processor, "retrieve");
        });
        after(function() {
            Processor.retrieve.restore();
        });
        afterEach(function() {
            Processor.retrieve.resetHistory();
        });
        it("should eventually get list of users", function() {
            var data = [1, 2, 3];
            Processor.retrieve.resolves(data);

            var result = Module.get();
            return expect(result).to.eventually.become(data);
        });
        it("should eventually throw exception", function() {
            var err = new Error("Reject");
            Processor.retrieve.rejects(err);

            var result = Module.get();
            return expect(result).to.be.rejectedWith(err);
        });
    });
    context("Load", function() {
        before(function() {
            Processor.compute = sinon.stub(Processor, "compute");
        });
        after(function() {
            Processor.compute.restore();
        });
        afterEach(function() {
            Processor.compute.resetHistory();
        });
        it("should eventually finish execution", function() {
            Processor.compute.resolves();

            var result = Module.load();
            return expect(result).to.eventually.equal(undefined);
        });
        it("should eventually throw exception", function() {
            var err = new Error("Reject");
            Processor.compute.rejects(err);

            var result = Module.load();
            return expect(result).to.be.rejectedWith(err);
        });
    });
    context("Update By Name", function() {
        var name;
        before(function() {
            name = "Test User";
            DataStore.update = sinon.stub(DataStore, "update");
        });
        after(function() {
            DataStore.update.restore();
        });
        afterEach(function() {
            DataStore.update.resetHistory();
        });
        it("should eventually finish execution", function() {
            DataStore.update.resolves();

            var result = Module.updateByName(name);

            expect(DataStore.update).to.be.calledWith("name", name);
            return expect(result).to.eventually.equal(undefined);
        });
        it("should eventually throw exception", function() {
            var err = new Error("Reject");
            DataStore.update.rejects(err);

            var result = Module.updateByName(name);

            expect(DataStore.update).to.be.calledWith("name", name);
            return expect(result).to.be.rejectedWith(err);
        });
    });
    context("Update By Id", function() {
        var id;
        before(function() {
            id = "123456";
            DataStore.update = sinon.stub(DataStore, "update");
        });
        after(function() {
            DataStore.update.restore();
        });
        afterEach(function() {
            DataStore.update.resetHistory();
        });
        it("should eventually finish execution", function() {
            DataStore.update.resolves();

            var result = Module.updateById(id);

            expect(DataStore.update).to.be.calledWith("id", id);
            return expect(result).to.eventually.equal(undefined);
        });
        it("should eventually throw exception", function() {
            var err = new Error("Reject");
            DataStore.update.rejects(err);

            var result = Module.updateById(id);

            expect(DataStore.update).to.be.calledWith("id", id);
            return expect(result).to.be.rejectedWith(err);
        });
    });
});
