import { createClient } from "redis";

const client = createClient({
    url: "redis://localhost:6379",
});

client.on("error", (err) => console.error("Redis Error:", err));

async function start() {
    await client.connect();
    console.log("Connected to Redis!");
}

start();

export default client;
