export type TaskType = {
    [key:string]: Function
}

class Tasks {
    
    public task: TaskType;

    constructor(){
        this.task = {}
    }

    addTask(taskName: string, fn: Function): boolean | TaskType {
        if(this.task.hasOwnProperty(taskName)) {
            console.error(taskName + " is already exists");
            return false;
        }
        this.task[taskName] = fn
        return this.task;
    }

    removeTask(taskName: string){
        return delete this.task[taskName]
    }

    getTask(tn: string): Function{
        return this.task[tn];
    }

    getTasks(): object{
        return this.task;
    }
}

export default Tasks;