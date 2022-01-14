const Task = require('./lib/task');
const task = new Task.default();
task.addTask('aa', function(params){
    console.log('哈哈')
    return {
        taskName: 'bb',
        params: "哈哈哈" + params
    }
})

task.addTask('bb', function(params){
    return {
        taskName: 'cc',
        params: "bb" + params
    }
})

task.addTask('cc', function(params){
    return {
        taskName: 'dd',
        params: "cc" + params
    }
})

task.addTask('dd', function(params){
    return {
        params: "dd" + params
    }
})

exports.modules = task;