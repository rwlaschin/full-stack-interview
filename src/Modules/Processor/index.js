let DataStore, RandomTree, Decision, RandomForest;

var defaultRandomForestCount = process.env.DEFAULT_RANDOM_FOREST_COUNT || 30;

/*
  {
    id: "541d25c9-9500-4265-8967-240f44ecf723",
    name: "Samir Pacocha",
    location: { latitude: "46.7110", longitude: "-63.1150" }, // Distance 
    age: 46, // 10%
    acceptedOffers: 49, // 30%
    canceledOffers: 92, // 30%
    averageReplyTime: 2598 // 20% 
  },
*/

function Processor() {}

/**
 *
 */
Processor.prototype.set = function(module, obj) {
    switch (module) {
        case "RandomForest":
            RandomForest = new obj();
            break;
        case "RandomTree":
            RandomTree = obj;
            break;
        case "Decision":
            Decision = obj;
            break;
        case "DataStore":
            DataStore = obj;
            break;
    }
};

/**
 *
 */
Processor.prototype.get = function(module) {
    switch (module) {
        case "RandomForest":
            return RandomForest;
    }
};

/**
 *
 */
Processor.prototype.retrieve = function(location, count = 10) {
    /* istanbul ignore next */
    if (!RandomForest) {
        throw new Error("RandomForest Module not registered");
    }
    let duplicates = {};
    let results = RandomForest.find(location, count);

    return results
        .filter(item => {
            if (item.id in duplicates) {
                return false;
            }
            duplicates[item.id] = true;
            return true;
        })
        .slice(0, count);
};

/**
 *
 */
Processor.prototype.compute = function(count = 10) {
    /* istanbul ignore next */
    if (!RandomForest) {
        throw new Error("RandomForest Module not registered");
    }
    if (!RandomTree) {
        throw new Error("RandomTree Module not registered");
    }
    if (!Decision) {
        throw new Error("Decision Module not registered");
    }
    if (!DataStore) {
        throw new Error("DataStore Module not registered");
    }

    RandomForest.reset();
    for (i = 0; i < count; i++) {
        var tree = new RandomTree(
            new Decision({
                maxDistance: 0.65 + (Math.random() * 0.1 - 0.05),
                weightDistance: 0.1,
                desiredAge: 30 + (Math.random() * 10 - 5),
                desiredReplyTime: 900 + (Math.random() * 300 - 150),
                weightAge: 0.1,
                weightAccepted: 0.3,
                weightCanceled: 0.3,
                weightReplyTime: 0.2,
                minActivity: 900 + (Math.random() * 300 - 150),
            }),
        );
        var patientData = DataStore.get() || [];
        patientData.forEach(item => {
            tree.insert(item);
        });
        RandomForest.grow(tree);
    }
};

module.exports = new Processor(defaultRandomForestCount);
