const Weighting = require("./Weighting");

/**
 * Handles deciding logic for mapping data into RandomTree
 * @param {*} criteria data for determining weighting and base required values
 *               maxDistance      {Number} Based on Long/Lat scale 1/60th is 1 mile
 *               weightDistance   {Number} Percentage of weight applied to Distance (0,1)
 *               desiredAge       {Number} Target
 *               desiredReplyTime {Number} Target patient reply time
 *               weightAge        {Number} Percentage of weight applied to Age (0,1)
 *               weightAccepted   {Number} Percentage of weight applied to AcceptedOffer (0,1)
 *               weightCanceled   {Number} Percentage of weight applied to CanceledOffer (0,1)
 *               weightReplyTime  {Number} Percentage of weight applied to ReplyTime (0,1)
 *               minActivity      {Number} Minimum value of total offers before patient has enough data
 */
module.exports = function Decision(criteria) {
    var criteria = criteria;
    var fuzz = 0;

    // make compares easier
    criteria.maxDistanceSquared = criteria.maxDistance ** 2;

    /**
     * Determines if patient has enough information to be reliable
     * @param {*} data input user data
     * @param {*} criteria data for determining weighting and base required values
     */
    function isNew(data, criteria) {
        return criteria.minActivity - (data.acceptedOffers + data.canceledOffers) > 15;
    }

    /**
     * Determines the weight
     * @param {String} module Module Name to be set [RandomForest|RandomTree|Decision|DataStore]
     * @param {*} obj Module Class or Function
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
     * For creating a little variation in the data
     * @returns {Float} range of [.03, -.03]
     */
    this.seed = function() {
        fuzz = Math.random() * 0.06 - 0.03; // 6 percent
    };

    /**
     * General testing mechanism for comparing two user objects when only a
     * positive, negative, or zero value is required
     * @param {*} comp user data
     * @param {*} data user data
     * @returns boolean
     */
    this.test = function(comp, data) {
        var weightComp = this.calculate(comp, data.location);
        var weightData = this.calculate(data, comp.location);

        return weightData - weightComp;
    };

    /**
     * Returns a fuzzy comparison value between {1,10}
     * @param {*} data user data
     * @param {*} pos desired location
     * @returns
     */
    this.fuzzy = function(data, pos) {
        // age, distance
        var totalWeight = this.calculate(data, pos);

        // between 1-10
        return (totalWeight + fuzz) * 9 + 1;
    };

    /**
     * Converts priority value {0,1} to {1,0,-1}, sorts highest priority to -1
     * @param {Number} priority between {1,0}
     * @returns {Number} returns 1,0,-1
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
     * Resets object to starting state
     */
    this.reset = function() {
        fuzz = 0;
    };
    /**
     * Returns internal variable data for inspection
     * @param {String} varName name of variable to retrieve [fuzz]
     */
    this.inspect = function(varName) {
        switch (varName) {
            case "fuzz":
                return fuzz;
        }
    };

    this.seed();
};
