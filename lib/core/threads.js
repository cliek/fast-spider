const { parentPort, workerData } = require("worker_threads");
const { modulesMap } = require('./require');
// When a message from the parent thread is received, send it back:
const Task = require(workerData.taskPath);
const tasks = Task.getTasks();
const modules = modulesMap(workerData.modules);
const plugins = modulesMap(workerData.plugins);
parentPort.on("message", (message) => {
	switch(message.type){
        case "task":
            const { taskName, ...arg } = message.data
            tasks[taskName]({ ...modules, plugins: plugins, params: arg }, (_taskName, _arg) => {
                parentPort.postMessage({
                    type: "add",
                    data: {
                        taskName: _taskName,
                        ..._arg
                    }
                })
            });
            break;
        case "exit":
            process.exit();
        default:
            console.log(message);
            break;  
    }
}).ref();