type TaskType = {
    [key:string]: Function
}

class Tasks {
    
    public task: TaskType;

    constructor(){
        this.task = {}
    }

    addTask(taskName: string, fn: Function): boolean | Function{
        if(this.task.hasOwnProperty(taskName)) {
            console.error(taskName + " is already exists");
            return false;
        }
        this.task[taskName] = fn
        return true;
    }

    removeTask(taskName: string){
        return delete this.task[taskName]
    }

    getTasks(): object{
        return this.task;
    }
}

export default new Tasks();