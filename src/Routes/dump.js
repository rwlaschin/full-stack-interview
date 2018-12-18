const Processor = require("../Modules/Processor");
const DataStore = require("../Modules/DataStore");

var schema = {
    required: ["storage"],
    querystring: {
        storage: { type: "string", pattern: "^(patients|trees)$" },
    },
};

/**
 * Dumps out storage data for inspection
 */
module.exports = function Dump(fastify, opts) {
    fastify.get("/dump", { schema }, (req, res) => {
        switch (req.query.storage) {
            case "patients":
                var response = DataStore.get();
                res.header("Content-Type", "application/json");
                res.send(response);
                break;
            case "trees":
                var response = [];
                var RandomForest = Processor.get("RandomForest");
                RandomForest.forEach((tree, i) => {
                    response.push([i].concat(tree.traverseInOrder()));
                });
                res.header("Content-Type", "application/json");
                res.send(response);
                break;
        }
    });
};
