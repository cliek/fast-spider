const { parentPort, workerData } = require("worker_threads");
// When a message from the parent thread is received, send it back:
const Task = require(workerData.taskPath);
parentPort.once("message", (message) => {
	// parentPort.postMessage(message);
	const task = Task.getTasks();
	console.log(message);
	console.log(workerData);
	task['A']()
});
console.log('12354')