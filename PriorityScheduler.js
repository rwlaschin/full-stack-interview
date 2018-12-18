const Processor = require("./src/Modules/Processor");
const RandomForest = require("./src/Modules/RandomForest");
const RandomTree = require("./src/Modules/RandomTree");
const Decision = require("./src/Modules/RandomTree/Decision");
const DataStore = require("./src/Modules/DataStore");

function PriorityScheduler() {}

/**
 *
 */
PriorityScheduler.prototype.get = async function(location, count) {
    try {
        return await Processor.retrieve(location, count);
    } catch (e) {
        throw e;
    }
};

/**
 *
 */
PriorityScheduler.prototype.load = async function() {
    try {
        await Processor.compute();
    } catch (e) {
        throw e;
    }
};

/**
 *
 */
PriorityScheduler.prototype.updateByName = async function(name) {
    try {
        return await DataStore.update("name", name);
    } catch (e) {
        throw e;
    }
};

/**
 *
 */
PriorityScheduler.prototype.updateById = async function(id) {
    try {
        return await DataStore.update("id", id);
    } catch (e) {
        throw e;
    }
};

module.exports = new PriorityScheduler();

Processor.set("RandomForest", RandomForest);
Processor.set("RandomTree", RandomTree);
Processor.set("Decision", Decision);
Processor.set("DataStore", DataStore);
