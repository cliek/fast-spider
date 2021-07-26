const { Worker } = require('worker_threads');
const worker = new Worker("./threads.js");

worker.once("message", (message) => {
    console.log(message); // Prints 'Hello, world!'
});

worker.postMessage("Hello, world!");
