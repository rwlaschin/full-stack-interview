const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));
chai.use(require("chai-arrays"));

const Module = require("../../../src/Modules/DataStore");

describe("DataStore", function() {
    context("Generate", function() {
        before(function() {
            Module.fixUp = sinon.stub(Module, "fixUp");
        });
        after(function() {
            Module.fixUp.restore();
        });
        it("should generate and initialize data", function() {
            Module.generate();
            expect(Module.fixUp).to.be.called;
        });
    });
    context("Get", function() {
        afterEach(function() {
            Module.set();
        });
        it("should get updated object 1", function() {
            Module.patientData = 1;
            var ret = Module.get();
            expect(ret).to.equal(1);
        });
        it("should return array", function() {
            var ret = Module.get();
            expect(ret).to.be.array();
        });
    });
    context("Set", function() {
        afterEach(function() {
            Module.set();
        });
        it("should set data to 1", function() {
            Module.set(1);
            expect(Module.patientData).to.equal(1);
        });
        it("should clear data", function() {
            Module.set();
            expect(Module.patientData).to.be.undefined;
        });
    });
    context("Fix Up", function() {
        afterEach(function() {
            Module.set();
        });
        it("should patch data", function() {
            Module.patientData = [{ location: { latitude: "1.1", longitude: "2.2" } }];
            Module.fixUp();
            expect(Module.patientData).to.eql([{ location: { latitude: 1.1, longitude: 2.2 } }]);
        });
        it("should not error with empty array", function() {
            Module.patientData = [];
            expect(function() {
                Module.fixUp();
            }).to.not.throw();
        });
    });
    context("Update", function() {
        it("should update data using name");
        it("should update data using id");
    });
});
