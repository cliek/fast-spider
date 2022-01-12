const { Task } = require('../../index');

Task.addTask('aa', function(){
    console.log('哈哈')
})

Task.addTask('bb', function(){
    console.log('bb')
})

Task.addTask('cc', function(){
    console.log('cc')
})

Task.addTask('dd', function(){
    console.log('dd')
})

exports.modules = Task;