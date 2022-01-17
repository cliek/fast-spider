const { parentPort, workerData } = require('worker_threads');
const { join } = require('path');
const { taskPath } = workerData;
const Tasks = require(join(process.cwd(), taskPath));

parentPort.on('message', async(data) => {
    const { taskName, data:params, type } = data;
    if(type === 'exit') return process.exit();
    const tasks = Tasks.getTasks();
    if(tasks.hasOwnProperty(taskName)){
        try {
            const result = await tasks[taskName](params, (data)=>{
                parentPort.postMessage({
                    type: 'queue',
                    result: data
                });
            });
            // return the result to main thread.
            if(result){
                parentPort.postMessage({
                    taskName: taskName,
                    type: 'done',
                    result
                });
            }
        } catch (error) {
            parentPort.postMessage({
                type: 'error',
                result: error
            });
        }
    } else {
        console.error('no task exists: ' + taskName);
    }
});