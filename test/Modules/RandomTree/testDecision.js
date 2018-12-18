const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));
chai.use(require("chai-almost")(0.01));

const ModuleClass = require("../../../src/Modules/RandomTree/Decision");

describe("Decision", function() {
    var Module,
        criteria = getCriteria();
    before(function() {
        Math.random = sinon.stub(Math, "random");
        Math.random.callsFake(() => 0.5);
    });
    afterEach(function() {
        Math.random.resetHistory();
    });
    after(function() {
        Math.random.restore();
    });
    context("Calculate", function() {
        var pos, data;
        before(function() {
            Module = new ModuleClass(criteria);
        });
        it("should be less than .3", function() {
            pos = { latitude: 0, longitude: 0 };
            data = {
                location: { latitude: 20.2, longitude: -10.8 },
                age: 200,
                acceptedOffers: 1000,
                canceledOffers: 2000,
                averageReplyTime: 40000,
            };
            var ret = Module.calculate(data, pos);
            expect(ret).to.be.lessThan(0.3);
        });
        it("should be greater than .7", function() {
            pos = { latitude: 0, longitude: 0 };
            data = {
                location: { latitude: 0, longitude: 0 },
                age: 30,
                acceptedOffers: 1000,
                canceledOffers: 10,
                averageReplyTime: 1000,
            };
            var ret = Module.calculate(data, pos);
            expect(ret).to.be.greaterThan(0.7);
        });
        it("should use max value when overriding", function() {
            pos = { latitude: 0, longitude: 0 };
            data = {
                location: { latitude: 170, longitude: 84 },
                age: 100,
                acceptedOffers: 0,
                canceledOffers: 0,
                averageReplyTime: 4000,
            };
            Math.random.returns(1);
            var ret = Module.calculate(data, pos);
            expect(ret).to.be.almost.greaterThan(0.8);
        });
        it("should use calculated value when not overriding", function() {
            pos = { latitude: 0, longitude: 0 };
            data = {
                location: { latitude: 170, longitude: 84 },
                age: 100,
                acceptedOffers: 0,
                canceledOffers: 0,
                averageReplyTime: 4000,
            };
            Math.random.returns(0);
            var ret = Module.calculate(data, pos);
            expect(ret)
                .to.be.almost.greaterThan(0.65)
                .and.to.be.almost.lessThan(0.7);
        });
    });
    context("Seed", function() {
        it("should create a fuzz test value less than .03", function() {
            Math.random.returns(1);
            Module.seed();
            var fuzz = Module.inspect("fuzz");
            expect(fuzz).to.almost.equal(0.03);
        });

        it("should create a fuzz test value greater than -.03", function() {
            Math.random.returns(0);
            Module.seed();
            var fuzz = Module.inspect("fuzz");
            expect(fuzz).to.almost.equal(-0.03);
        });
    });
    context("Test", function() {
        before(function() {
            Module.calculate = sinon.stub(Module, "calculate");
        });
        afterEach(function() {
            Module.calculate.resetHistory();
        });
        after(function() {
            Module.calculate.restore();
        });
        it("should return b - a", function() {
            let data = { location: 1 },
                comp = { location: 2 };
            Module.calculate.withArgs(comp, data.location).returns(0.3);
            Module.calculate.withArgs(data, comp.location).returns(0.8);

            let ret = Module.test(comp, data);
            expect(ret).to.equal(0.8 - 0.3);
        });
    });
    context("Fuzzy", function() {
        before(function() {
            Module.reset();
            Module.calculate = sinon.stub(Module, "calculate");
        });
        afterEach(function() {
            Module.calculate.resetHistory();
        });
        after(function() {
            Module.calculate.restore();
        });
        it("should return 10", function() {
            Module.calculate.returns(1);
            var ret = Module.fuzzy();
            expect(ret).to.equal(10);
        });
        it("should return 1", function() {
            Module.calculate.returns(0);
            var ret = Module.fuzzy();
            expect(ret).to.equal(1);
        });
        it("should return a fuzzy value", function() {
            Math.random.returns(0.3);
            Module.calculate.returns(4.5);
            Module.seed();
            var fuzzy = Module.inspect("fuzz"),
                ret = Module.fuzzy();
            expect(fuzzy).to.almost.equal(0.3 * 0.06 - 0.03);
            expect(ret).to.equal((4.5 + fuzzy) * 9 + 1);
        });
    });
    context("Compare", function() {
        it("should return 1 when priority is greater than 7", function() {
            expect(Module.compare(7)).to.equal(1);
        });
        it("should return 0 when priority is less than than 4", function() {
            expect(Module.compare(3.9)).to.equal(0);
        });
        it("should return -1 when priority is 4", function() {
            expect(Module.compare(4)).to.equal(-1);
        });
        it("should return -1 when priority is 6.9", function() {
            expect(Module.compare(6.9)).to.equal(-1);
        });
    });
});

function getCriteria(options) {
    return Object.assign(
        {
            maxDistance: 0.65,
            weightDistance: 0.1,
            desiredAge: 30,
            desiredReplyTime: 900,
            weightAge: 0.1,
            weightAccepted: 0.3,
            weightCanceled: 0.3,
            weightReplyTime: 0.2,
            minActivity: 200,
        },
        options || {},
    );
}
