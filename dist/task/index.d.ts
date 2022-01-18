export declare type TaskType = {
    [key: string]: Function;
};
declare class Tasks {
    _task: TaskType;
    constructor();
    addTask(taskName: string, fn: (params: object | undefined, cb: (nextTaskName: string, data: object) => void) => object | boolean): boolean | TaskType;
    removeTask(taskName: string): boolean;
    getTask(tn: string): Function;
    getTasks(): object;
}
export default Tasks;
//# sourceMappingURL=index.d.ts.map