const _patientData = require("../../../sample-data/patients.json");

function DataStore() {}

DataStore.prototype.patientData = undefined;

/**
 * Creates and normalizes patient data
 */
DataStore.prototype.generate = function() {
    // after done call fixup
    this.fixUp();
};

/**
 * Returns raw patient data
 */
DataStore.prototype.get = function() {
    return (
        this.patientData ||
        _patientData ||
        /* istanbul ignore next */
        []
    );
};

/**
 * Normalizes user data
 */
DataStore.prototype.fixUp = function() {
    this.get().forEach(function(item) {
        item.location.latitude = parseFloat(item.location.latitude);
        item.location.longitude = parseFloat(item.location.longitude);
    });
};

/**
 * Updates patches partial data
 * @param {String} type [name|id] method for lookup
 * @param {*} value data to be updated
 */
DataStore.prototype.update = function(type, value) {
    switch (type) {
        case "name":
            /* TODO: Finish */ return;
        case "id":
            /* TODO: Finish */ return;
    }
};

/**
 * Changes patient data set (testing)
 * @param {*} data new data
 */
DataStore.prototype.set = function(data) {
    this.patientData = data;
};

module.exports = new DataStore();
