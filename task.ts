import Task from './lib/task';

const task = new Task();
task.addTask('aa', function(params: any){
    console.log('哈哈')
    return {
        taskName: 'bb',
        params: "哈哈哈" + params
    }
})

task.addTask('bb', function(params: any){
    return {
        taskName: 'cc',
        params: "bb" + params
    }
})

task.addTask('cc', function(params: any){
    return {
        taskName: 'dd',
        params: "cc" + params
    }
})

task.addTask('dd', function(params: any){
    return {
        params: "dd" + params
    }
})

export default task;