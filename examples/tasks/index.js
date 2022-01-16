const { Task } = require('../../dist/index');

const task = new Task();

task.addTask('aa', function(params, cb){
    // 模拟创建100+页面的数据
    for (let index = 0; index < 10; index++) {
        if(index == 3) throw '测试错误';
        cb({
            nextName: 'bb',
            data: index + 'page'
        })
    }
    // return {aa:1}
})

task.addTask('bb', function(params, cb){
    // 第二个模拟
    for (let index = 0; index < 3; index++) {
        cb({
            nextName: 'cc',
            data: "bb" + index + params
        })
    }
    return {aa:1}
})

task.addTask('cc', function(params, cb){
    cb({
        nextName: 'dd',
        data: "cc" + params
    })
    return {aa:1}
})

task.addTask('dd', function(params, cb){
    return {
        data: "dd" + params
    }
})

module.exports = task;