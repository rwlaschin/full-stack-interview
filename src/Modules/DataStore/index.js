const _patientData = require("../../../sample-data/patients.json");

function DataStore() {}

DataStore.prototype.patientData = undefined;

DataStore.prototype.generate = function() {
    // after done call fixup
    this.fixUp();
};

DataStore.prototype.get = function() {
    return (
        this.patientData || _patientData ||
        /* istanbul ignore next */
        []
    );
};

DataStore.prototype.fixUp = function() {
    this.get().forEach(function(item) {
        item.location.latitude = parseFloat(item.location.latitude);
        item.location.longitude = parseFloat(item.location.longitude);
    });
};

DataStore.prototype.set = function(data) {
    this.patientData = data;
};

module.exports = new DataStore();
