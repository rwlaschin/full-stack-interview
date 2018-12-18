const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));
chai.use(require("chai-almost")(0.01));

const Module = require("../../../src/Modules/RandomTree/Weighting");

describe("Weighting", function() {
    context("Distance", function() {
        it("should not be invalid when data is zero", function() {
            var data = { location: { latitude: 0, longitude: 0 } },
                pos = { latitude: 0, longitude: 0 },
                criteria = { maxDistanceSquared: 0 };
            var res;
            expect(function() {
                res = Module.Distance(data, pos, criteria);
            }).to.not.throw();
            expect(res).to.not.be.NaN;
        });
        it("should return 1", function() {
            var data = { location: { latitude: 0, longitude: 0 } },
                pos = { latitude: 0.65, longitude: 0 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.almost.equal(1);
        });
        it("should return a number close to zero", function() {
            var data = { location: { latitude: 0, longitude: 0 } },
                pos = { latitude: 5, longitude: 5 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.be.almost.lessThan(0.01);
        });
        it("should return .5", function() {
            var data = { location: { latitude: 0, longitude: 0 } },
                pos = { latitude: 0.68, longitude: 0.67 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.be.almost(0.5);
        });
        it("should return wrap numbers when on max/min latitude", function() {
            var data = { location: { latitude: 85, longitude: 0 } },
                pos = { latitude: -84.31, longitude: 0.67 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.be.almost(0.5);
        });
        it("should return wrap numbers when on max/min longitude", function() {
            var data = { location: { latitude: 0, longitude: 180 } },
                pos = { latitude: 0.68, longitude: -179.32 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.be.almost(0.5);
        });
        it("should return 1 with matching lat/lon", function() {
            var data = { location: { latitude: 46.711, longitude: -63.115 } },
                pos = { latitude: 46.711, longitude: -63.115 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.be.almost(1);
        });
        it("should return a small number with far lat/lon", function() {
            var data = { location: { latitude: 80.5848, longitude: -148.3175 } },
                pos = { latitude: 46.711, longitude: -63.115 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.be.almost(0);
        });
        it("should return a small number with far lat/lon", function() {
            var data = { location: { latitude: -31.6647, longitude: -151.5717 } },
                pos = { latitude: 46.711, longitude: -63.115 },
                criteria = { maxDistanceSquared: 0.65 ** 2 };
            var res = Module.Distance(data, pos, criteria);
            expect(res).to.be.almost(0);
        });
    });
    context("Age", function() {
        it("should not be invalid when data is zero", function() {
            var data = { age: 0 },
                criteria = { desiredAge: 0 };
            var res;
            expect(function() {
                res = Module.Age(data, criteria);
            }).to.not.throw();
            expect(res).to.not.be.NaN;
        });
        it("should return 1", function() {
            var data = { age: 30 },
                criteria = { desiredAge: 30 };
            var res = Module.Age(data, criteria);
            expect(res).to.almost.equal(1);
        });
        it("should return .5", function() {
            var data = { age: 50 },
                criteria = { desiredAge: 30 };
            var res = Module.Age(data, criteria);
            expect(res).to.almost.equal(0.5);
        });
        it("should return .3", function() {
            var data = { age: 75 },
                criteria = { desiredAge: 30 };
            var res = Module.Age(data, criteria);
            expect(res).to.almost.equal(0.3);
        });
    });
    context("AcceptedOffers", function() {
        it("should not be invalid when data is zero", function() {
            var data = { acceptedOffers: 0, canceledOffers: 0 },
                criteria = {};
            var res;
            expect(function() {
                res = Module.AcceptedOffers(data, criteria);
            }).to.not.throw();
            expect(res).to.not.be.NaN;
        });
        it("should return 1", function() {
            var data = { acceptedOffers: 2000, canceledOffers: 20 },
                criteria = {};
            var res = Module.AcceptedOffers(data, criteria);
            expect(res).to.almost.equal(1);
        });
        it("should return .5", function() {
            var data = { acceptedOffers: 2000, canceledOffers: 2000 },
                criteria = {};
            var res = Module.AcceptedOffers(data, criteria);
            expect(res).to.almost.equal(0.5);
        });
        it("should return 0", function() {
            var data = { acceptedOffers: 20, canceledOffers: 2000 },
                criteria = {};
            var res = Module.AcceptedOffers(data, criteria);
            expect(res).to.almost.equal(0);
        });
    });
    context("CanceledOffers", function() {
        it("should not be invalid when data is zero", function() {
            var data = { acceptedOffers: 0, canceledOffers: 0 },
                criteria = {};
            var res;
            expect(function() {
                res = Module.CanceledOffers(data, criteria);
            }).to.not.throw();
            expect(res).to.not.be.NaN;
        });
        it("should return 1", function() {
            var data = { acceptedOffers: 2000, canceledOffers: 2010 },
                criteria = {};
            var res = Module.CanceledOffers(data, criteria);
            expect(res).to.almost.equal(1);
        });
        it("should return .5", function() {
            var data = { acceptedOffers: 100, canceledOffers: 190 },
                criteria = {};
            var res = Module.CanceledOffers(data, criteria);
            expect(res).to.almost.equal(0.5);
        });
        it("should be a very small number", function() {
            var data = { acceptedOffers: 0, canceledOffers: 100000 },
                criteria = {};
            var res = Module.CanceledOffers(data, criteria);
            expect(res).to.almost.be.lessThan(0.1);
        });
    });
    context("ReplyTime", function() {
        it("should not be invalid when data is zero", function() {
            var data = { averageReplyTime: 0 },
                criteria = { desiredReplyTime: 0 };
            var res;
            expect(function() {
                res = Module.ReplyTime(data, criteria);
            }).to.not.throw();
            expect(res).to.not.be.NaN;
        });
        it("should return 1", function() {
            var data = { averageReplyTime: 900 },
                criteria = { desiredReplyTime: 900 };
            var res = Module.ReplyTime(data, criteria);
            expect(res).to.be.almost(1);
        });
        it("should return .5", function() {
            var data = { averageReplyTime: 2200 },
                criteria = { desiredReplyTime: 900 };
            var res = Module.ReplyTime(data, criteria);
            expect(res).to.be.almost(0.5);
        });
        it("should be a very small number", function() {
            var data = { averageReplyTime: 134700 },
                criteria = { desiredReplyTime: 900 };
            var res = Module.ReplyTime(data, criteria);
            expect(res).to.be.almost(0);
        });
    });
});
