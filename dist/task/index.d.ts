export declare type TaskType = {
    [key: string]: Function;
};
declare class Tasks {
    task: TaskType;
    constructor();
    addTask(taskName: string, fn: Function): boolean | TaskType;
    removeTask(taskName: string): boolean;
    getTask(tn: string): Function;
    getTasks(): object;
}
export default Tasks;
//# sourceMappingURL=index.d.ts.map