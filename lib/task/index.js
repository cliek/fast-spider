import logs from '../utils/logs';

const Task = {
    tasks: {},
    addTask(taskName, fn){
        if(!taskName.trim()) return logs.error("taskName is dont't empty");
        if(!this.tasks[taskName]) return logs.error( taskName + " is already exists");
        this.tasks[taskName] = fn
        return this;
    },
    removeTask(taskName) {
        if(!taskName.trim()) return logs.error("taskName is dont't empty");
        return delete this.tasks[taskName]
    }
}

// Task.prototype.comparse = function (nextData){
//     return this.tasks[]
// }

export default Task