const Weighting = require("./Weighting");

module.exports = function Decision(criteria) {
    var criteria = criteria;
    var fuzz = 0;

    // make compares easier
    criteria.maxDistanceSquared = criteria.maxDistance ** 2;

    /**
     *
     */
    function isNew(data, criteria) {
        return criteria.minActivity - (data.acceptedOffers + data.canceledOffers) > 15;
    }
    /**
     *
     */
    this.calculate = function(data, pos) {
        // 50% of the time if we are new bump
        var override = isNew(data, criteria) && Math.random() >= 0.5;
        var sum =
            Weighting.Distance(data, pos, criteria) * criteria.weightDistance +
            Weighting.Age(data, criteria) * criteria.weightAge +
            (override ? 1 : Weighting.AcceptedOffers(data, criteria)) * criteria.weightAccepted +
            (override ? 1 : Weighting.CanceledOffers(data, criteria)) * criteria.weightCanceled +
            (override ? 1 : Weighting.ReplyTime(data, criteria)) * criteria.weightReplyTime;
        return sum;
    };
    /**
     *
     */
    this.seed = function() {
        fuzz = Math.random() * 0.06 - 0.03; // 6 percent
    };
    /**
     *
     */
    this.test = function(comp, data) {
        var weightComp = this.calculate(comp, data.location);
        var weightData = this.calculate(data, comp.location);

        return weightData - weightComp;
    };
    /**
     *
     */
    this.fuzzy = function(data, pos) {
        // age, distance
        var totalWeight = this.calculate(data, pos);

        // between 1-10
        return (totalWeight + fuzz) * 9 + 1;
    };
    /**
     *
     */
    this.compare = function(priority) {
        // 9/3 -> 3  (10,>=7),(<7,>=4,>4)
        if (priority >= 7) {
            return 1;
        }
        if (priority < 4) {
            return 0;
        }
        return -1;
    };

    // Debug/Utility functions

    /**
     *
     */
    this.reset = function() {
        fuzz = 0;
    };
    /**
     *
     */
    this.inspect = function(varName) {
        switch (varName) {
            case "fuzz":
                return fuzz;
        }
    };

    this.seed();
};
