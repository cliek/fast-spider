import { Task } from '../../dist/index'

Task.addTask('aa', function(params){
    console.log('哈哈')
    return {
        taskName: 'bb',
        params: "哈哈哈"
    }
})

Task.addTask('bb', function(params){
    return {
        taskName: 'cc',
        params: "bb" + params
    }
})

Task.addTask('cc', function(params){
    return {
        taskName: 'dd',
        params: "cc" + params
    }
})

Task.addTask('dd', function(){
    return {
        params: "dd" + params
    }
})

export default Task;