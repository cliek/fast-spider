const _task = Symbol('Task');

class Tasks {
    
    constructor(){
        this[_task] = {};
    }

    addTask(taskName, fn){
        if(!taskName.trim()) return console.error("taskName is dont't empty");
        if(this[_task][taskName]) return console.error(taskName + " is already exists");
        this[_task][taskName] = fn
        return true;
    }

    removeTask(taskName){
        if(!taskName.trim()) return console.error("taskName is dont't empty");
        return delete this[_task][taskName]
    }

    getTasks(){
        return this[_task];
    }
}

module.exports = Tasks;