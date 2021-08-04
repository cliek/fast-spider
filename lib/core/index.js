const path = require('path');
const { logs } = require('../utils/logs');
const schedule = require('node-schedule');
const { startThreads } = require('./master');
const queuePath = '../queue';
const config = require(path.join(process.cwd(), 'config'));
const _pathJoin = Symbol('_pathJoin');

class Spider {
    constructor(cfg) {
        this.config = Object.assign({
            ThreadsNum: 1,
            interval: 1000,
            taskPath: 'task/index',
            queuePath: queuePath,
            schedule: false,
            plugins: [],
            modules: [],
            pipe: {
                enabled: true,
                type: 'json',
                dirPath: 'data',
                fileName: ''
            }
        }, cfg || config || {});
        this.config.modules.unshift(...[{name: 'request',path: 'superagent'},'cheerio']);
        this.config.taskPath = this[_pathJoin](this.config.taskPath);
        if(!this.config.queuePath && this.config.queuePath !== queuePath) this.config.queuePath = this[_pathJoin](this.config.queuePath);
    }

    [_pathJoin](_pathString){
        if(!_pathString || typeof _pathString !== 'string') throw 'params type must string';
        if(_pathString.indexOf('.js') == -1) _pathString = _pathString + '.js';
        return path.join(process.cwd(), _pathString);
    }

    start(firstTask){
        if(this.config.schedule){
            logs.info('It was a scheduled task that started after' + JSON.stringify(this.config.schedule));
            const Schedule = schedule.scheduleJob(this.config.schedule, (res)=> {
                startThreads({ ...this.config, firstTask });
            });
        }else{
            startThreads({ ...this.config, firstTask })
        }
    }
}

module.exports = Spider;