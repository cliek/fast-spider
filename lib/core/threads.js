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
            const { taskName, threadId, ...arg } = message.data
            const cb = (_taskName, _arg, _isWrite, _isDone) => {
                if(arguments.length === 0 || typeof _taskName === 'boolean'){
                    return parentPort.postMessage({
                        type: "done",
                        data: threadId
                    });
                }
                if(typeof _taskName === 'object') {
                    parentPort.postMessage({
                        type: "pipe",
                        data: _taskName
                    })
                }else{
                    parentPort.postMessage({
                        type: "add",
                        data: {
                            taskName: _taskName,
                            ..._arg
                        }
                    })
                }
                if(_isWrite) {
                    parentPort.postMessage({
                        type: "pipe",
                        data: _arg
                    })
                }
                // release process
                if((typeof _isDone === 'boolean' && _isDone === true) || _isDone === undefined){
                    parentPort.postMessage({
                        type: "done",
                        data: threadId
                    });
                }
            }
            if(tasks[taskName]){
                tasks[taskName]({ ...modules, plugins: plugins, params: arg }, cb);
            }else{
                console.error('task name "' + taskName + '" does not exist');
                parentPort.postMessage({
                    type: "exit"
                });
            }
            break;
        case "exit":
            process.exit();
        default:
            console.log(message);
            break;  
    }
}).ref();