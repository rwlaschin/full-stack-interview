const distanceScale = 1000,
    distanceScaleSquared = distanceScale ** 2,
    distanceBaseRange = distanceScaleSquared >> 1;

const maxLatitude = 170,
    midLatitude = maxLatitude / 2;
const maxLongitude = 360,
    midLongitude = maxLongitude / 2;

/**
 * Utility library, handles all calculations for determing weights from user data
 * All functions return a number between 0->1
 */
module.exports = {
    /**
     * Calculates distance from target position, while accounting for wrap around
     * and returns a weighted value
     * Only uses squares to reduce math overhead
     * @param {*} data { location { latitude, longitude }}
     * @param {*} pos  { latitude, longitude }
     * @param {*} criteria { maxDistanceSquared }
     */
    Distance: function(data, pos, criteria) {
        let dx = Math.abs(data.location.latitude - pos.latitude),
            dy = Math.abs(data.location.longitude - pos.longitude);
        if (dx > midLatitude) {
            dx = maxLatitude - dx;
        }
        if (dy > midLongitude) {
            dy = maxLongitude - dy;
        }
        let distance = (dx * distanceScale) ** 2 + (dy * distanceScale) ** 2;
        let maxDistanceSquaredScaled = criteria.maxDistanceSquared * distanceScaleSquared;
        // number should be 1 when Distance is equal to maxDistance
        // Otherwise it should be smaller
        let weightDistance = distanceBaseRange / (distanceBaseRange + Math.max(0, distance - maxDistanceSquaredScaled));
        return weightDistance;
    },
    /**
     * Calculates Age weighting
     * @param {*} data { age }
     * @param {*} criteria  { desiredAge }
     */
    Age: function(data, criteria) {
        // number should be 1 when Age is equal to desiredAge
        // Otherwise it should be smaller
        let baseRange = 20;
        let weightAge = baseRange / (baseRange + Math.abs(criteria.desiredAge - data.age));
        return weightAge;
    },
    /**
     * Calculates Accepted offer weighting
     * @param {*} data {  acceptedOffers, canceledOffers }
     */
    AcceptedOffers: function(data) {
        // If the patient is active and reliable scale to 1
        let weightAccepted = Math.max(1, data.acceptedOffers) / Math.max(1, data.canceledOffers + data.acceptedOffers);
        return weightAccepted;
    },
    /**
     * Calculates Canceled offer weighting, scales to reduce the effect as canceled offers
     * grows larger than Accepted offer
     * @param {*} data { acceptedOffers, canceledOffers }
     */
    CanceledOffers: function(data) {
        // If the patient is unreliable scale the number to 0
        let baseRange = Math.min(1000, (data.canceledOffers + data.acceptedOffers) * 0.3);
        let weightCanceled =
            data.canceledOffers > data.acceptedOffers
                ? baseRange / (baseRange + data.canceledOffers - data.acceptedOffers)
                : 1;
        return weightCanceled;
    },
    /**
     * Calculates Reply Time weighting
     * @param {*} data { averageReplyTime }
     * @param {*} data { desiredReplyTime }
     */
    ReplyTime: function(data, criteria) {
        // The closer to desiredReply time the average reply time is the closer to 1
        let baseRange = 1350;
        let weightReplyTime = baseRange / (baseRange + Math.max(0, data.averageReplyTime - criteria.desiredReplyTime));
        return weightReplyTime;
    },
};
