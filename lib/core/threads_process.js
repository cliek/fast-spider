const assert = require('assert');
const { parentPort, workerData, MessagePort } = require('worker_threads');
const { task } = require('./testTask')

parentPort.postMessage("子进程发送的信息");
parentPort.once('message',(value)=>{
    console.log(task);
    assert(value.port instanceof MessagePort);
    value.port.onmessage = ((o)=>{
        console.log(o);
    })
    value.port.postMessage('工作线程正在发送此消息');
    value.port.close();
});
console.log(workerData)