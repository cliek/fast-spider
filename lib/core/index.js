const path = require('path');
const { startThreads } = require('./master');
const _pathJoin = Symbol('_pathJoin');

class Consumer {
    constructor(cfg) {
        this.config = Object.assign({
            ThreadsNum: 1,
            interval: 1000,
            taskPath: 'task/index',
            queuePath: '../queue',
            plugins: [],
            modules: [
                {
                    name: 'request',
                    path: 'superagent'
                },
                'cheerio'
            ],
            pipe: {
                enabled: true,
                type: 'json',
                dirPath: 'data',
                fileName: ''
            }
        }, cfg || {});
        this.config.taskPath = this[_pathJoin](this.config.taskPath);
        if(this.config.queuePath !== '../queue') this.config.queuePath = this[_pathJoin](this.config.queuePath);
    }

    [_pathJoin](_pathString){
        if(!_pathString || typeof _pathString !== 'string') throw 'params type must string';
        if(_pathString.indexOf('.js') == -1) _pathString = _pathString + '.js';
        return path.join(process.cwd(), _pathString);
    }

    start(firstTask){
        startThreads({ ...this.config, firstTask })
    }
}

module.exports = Consumer;