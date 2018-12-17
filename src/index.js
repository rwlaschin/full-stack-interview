const fastify = require("fastify")();
const port = process.env.PORT || 8080;

fastify.register(require("fastify-cors"), {
    origin: true,
    methods: "GET",
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
    credentials: true,
});

fastify.register(require("./Routes"));

fastify.listen(port, err => {
    if (err) throw err;
    const port = fastify.server.address().port;
    console.log(`server listening on ${port}`);
});
