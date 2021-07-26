const path = require('path');
const { startThreads } = require('./master');

class Consumer {

    constructor(cfg) {
        this.config = Object.assign({
            threadNum: 1,
            interval: 3000,
            taskPath: 'task/index',
            queuePath: '../queue'
        }, cfg || {});
        this.config.taskPath = this.pathJoin(this.config.taskPath);
        if(this.config.queuePath !== '../queue') this.config.queuePath = this.pathJoin(this.config.queuePath);

    }

    pathJoin(_pathString){
        if(!_pathString || typeof _pathString !== 'string') throw 'params type must string';
        if(_pathString.indexOf('.js') == -1) _pathString = _pathString + '.js';
        return path.join(process.cwd(), _pathString);
    }

    start(firstTask){
        startThreads({
            threadNum: this.config.taskPath,
            interval: this.config.interval,
            taskPath: this.config.taskPath, 
            queuePath: this.config.queuePath,
            firstTask
        })
    }
}

module.exports = Consumer;