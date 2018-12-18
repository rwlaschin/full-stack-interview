const PrioritySchedule = require("../../PriorityScheduler");

var schema = {
    querystring: {
        location: { type: "string", pattern: "^(-?\\d+.?\\d*),(-?\\d+.?\\d*)$" },
        count: { type: "number", min: 10, max: 100 },
        format: { type: "string", pattern: "^(json|csv|html)$" }, // html is default
    },
    required: ["location"],
};

/**
 * Convert query string to location format
 * @param {String} input comma delimited string
 * @returns {*} long/lat object
 */
function queryToLocation(input) {
    if (!input || typeof input !== "string") {
        return;
    }

    var [lat, lon] = input.split(",").map(v => parseFloat(v));
    return {
        latitude: lat,
        longitude: lon,
    };
}

/**
 * Dumps out storage data for inspection
 */
module.exports = function Fetch(fastify, opts) {
    fastify.get("/fetch", { schema }, (req, res) => {
        let format = req.query.format || "html";
        PrioritySchedule.get(
            queryToLocation(req.query.location),
            req.query.count ? parseInt(req.query.count) : undefined,
        )
            .then(response => {
                let output;
                res.code(200);
                switch (format.toLowerCase()) {
                    case "json":
                        res.header("Content-type", "application/json");
                        output = response;
                        break;
                    case "csv":
                        res.header("Content-type", "text/csv");
                        var keys = Object.keys(response[0] || []);
                        output = [keys.join(",")]
                            .concat(response.map(item => keys.map(k => item[k]).join(",")))
                            .join("\n");
                        break;
                    case "html":
                    default:
                        res.header("Content-type", "text/html");
                        /*
                        {"id":"0e2fb5eb-2e16-4e68-8481-b2ec1edf329a","name":"Lacey Buckridge","location":{"latitude":"-81.1386","longitude":"108.1122"},"age":85,"acceptedOffers":82,"canceledOffers":22,"averageReplyTime":1509}
                        */
                        output = `<html>
                                <head>
                                    <style>
                                        tr:nth-child(even) {background: #CCC}
                                        tr:nth-child(odd) {background: #FFF}
                                    </style>
                                </head>
                                <body>
                                    <table width=90%>
                                        <tr>
                                            <th></th>
                                            <th>Name</th>
                                            <th>Age</th>
                                            <th>Response Time</th>
                                            <th>Location (${req.query.location})</th>
                                        </tr>
                                        ${response
                                            .map(
                                                (item, i) => `
                                                <tr>
                                                    <td>${i + 1}</td>
                                                    <td>${item.name}</td>
                                                    <td>${item.age}</td>
                                                    <td>${item.averageReplyTime}</td>
                                                    <td>${item.location.latitude},${item.location.longitude}</td>
                                                </tr>`,
                                            )
                                            .join("")}
                                    </table>
                                </body>
                            </html>
                            `;
                        break;
                }
                res.code(200);
                res.send(output);
            })
            .catch(err => {
                res.code(500);
                res.send(err);
            });
    });

    setTimeout(PrioritySchedule.load.bind(PrioritySchedule), 10);
};
