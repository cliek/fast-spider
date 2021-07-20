const childrenProcess = require('child_process');
const path = require('path');
const logs = require('./utils/logs');
const { addTask: ats, getTasks: gts } = require('./task');

exports.addTask = ats

exports.start = function() {
    if(Object.keys(gts).length) throw 'task is not empty!'
    const Master = childrenProcess.fork(path.resolve(__dirname, './core/cluster.js'));
    console.log(Master.pid + 'master process running！')
}