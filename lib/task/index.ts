import { ResultType } from '../core/pool';

export type TaskType = {
    [key:string]: Function
}

class Tasks {
    
    public _task: TaskType;

    constructor(){
        this._task = {}
    }

    addTask(taskName: string, fn: (params: object|undefined, cb: (params: ResultType)=>void)=>object | boolean): boolean | TaskType {
        if(this._task.hasOwnProperty(taskName)) {
            console.error(taskName + " is already exists");
            return false;
        }
        this._task[taskName] = fn
        return this._task;
    }

    removeTask(taskName: string){
        return delete this._task[taskName]
    }

    getTask(tn: string): Function{
        return this._task[tn];
    }

    getTasks(): object{
        return this._task;
    }
}

export default Tasks;