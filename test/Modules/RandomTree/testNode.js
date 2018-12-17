const chai = require("chai");
const sinon = require("sinon");
const expect = chai.expect;

chai.use(require("sinon-chai"));

const ModuleClass = require("../../../src/Modules/RandomTree/Node");

describe("Node", function() {
    context("Initialization", function() {
        it("should export class", function() {
            expect(ModuleClass).to.be.a("function");
        });
        it("should expose member variable left", function() {
            let Module = new ModuleClass();
            expect(Module).to.have.haveOwnProperty("left");
            expect(Module.left).to.be.undefined;
        });
        it("should expose member variable right", function() {
            let Module = new ModuleClass();
            expect(Module).to.have.haveOwnProperty("right");
            expect(Module.right).to.be.undefined;
        });
        it("should expose member variable priority", function() {
            let Module = new ModuleClass();
            expect(Module).to.have.haveOwnProperty("priority");
            expect(Module.priority).to.be.undefined;
        });
        it("should expose member variable data", function() {
            let Module = new ModuleClass();
            expect(Module).to.have.haveOwnProperty("data");
        });
        it("should set data", function() {
            let Module = new ModuleClass("test data");
            expect(Module.data).to.equal("test data");
        });
    });
});
