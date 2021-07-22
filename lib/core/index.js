const path = require('path');
const { Worker } = require('worker_threads');

class Consumer {

    constructor(options) {
        this.defaultOptions = Object.assign({
            taskDir: 'task',
            taskPath: 'index'
        }, options || {});
        this.taskPath = this.task(this.defaultOptions.taskPath, this.defaultOptions.taskDir);
    }
    task(_pathString, _taskDir){
        console.log(_pathString)
        if(!_pathString || typeof _pathString !== 'string') throw 'task params type must string';
        if(_pathString.indexOf('.js') == -1) _pathString = _pathString + '.js';
        return path.join(process.cwd(), path.join(_taskDir, _pathString));
    }

    start(){
        const worker = new Worker(path.resolve(__dirname, './threads.js'),{
            workerData: {
                taskPath: this.taskPath
            }
        });
        worker.postMessage('向子线程发送数据');
        worker.once("message", (message) => {
            console.log(message + '145'); // Prints 'Hello, world!'.
        });
    }
}

module.exports = Consumer;