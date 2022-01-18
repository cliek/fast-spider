const { Task } = require('../../dist/index');

const task = new Task();

task.addTask('aa', function(params, cb){
    // 模拟创建100+页面的数据
    for (let index = 0; index < 10; index++) {
        if(index == 3) throw '测试错误';
        cb('bb',{page: index + 'page'})
    }
})

task.addTask('bb', function(params, cb){
    // 第二个模拟
    for (let index = 0; index < 3; index++) {
        cb('cc',{page: index + 'page'})
    }
})

task.addTask('cc', function(params, cb){
    cb('dd',{page: params.page + 'page'})
})

task.addTask('dd', function(params, cb){
    return {
        data: params
    }
})

module.exports = task;