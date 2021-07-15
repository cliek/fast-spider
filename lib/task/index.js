const _task = Symbol('Task');
import logs from '../utils/logs';

class Tasks {
    
    constructor(){
        this[_task] = {};
    }

    addTask(taskName, fn){
        if(!taskName.trim()) return logs.error("taskName is dont't empty");
        if(this[_task][taskName]) return logs.error( taskName + " is already exists");
        this[_task][taskName] = fn
        return true;
    }

    removeTask(taskName){
        if(!taskName.trim()) return logs.error("taskName is dont't empty");
        return delete this[_task][taskName]
    }

    getTasks(){
        return this[_task];
    }
}

const T = new Tasks();
export const addTask = T.addTask.bind(T);
export const removeTask = T.addTask.bind(T);
export const getTasks = T.addTask.bind(T);
export default T;
