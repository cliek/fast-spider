const { parentPort, workerData } = require("worker_threads");
// When a message from the parent thread is received, send it back:
const Task = require(workerData.taskPath);
const tasks = Task.getTasks();
parentPort.on("message", (message) => {
	switch(message.type){
        case "task":
            const { taskName, ...arg } = message.data
            tasks[taskName](arg, (_taskName, _arg)=>{
                parentPort.send({
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
            break;
        default:
            console.log(message)
            break;  
    }
}).ref();