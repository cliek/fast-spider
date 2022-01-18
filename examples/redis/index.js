import { createClient } from "redis";

const client = createClient(6379,'127.0.0.1');
client.connect();
client.on("error", function(error) {
    console.error(error);
});

export default client;
